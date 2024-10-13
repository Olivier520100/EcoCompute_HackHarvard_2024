import openmeteo_requests

import requests_cache
import pandas as pd
from retry_requests import retry
import numpy as np
import argparse

def generate_germany_coordinates(num_points):
    # Germany's approximate latitude and longitude boundaries
    min_lat, max_lat = 47.27, 55.06   # Latitude range
    min_lon, max_lon = 5.87, 15.04    # Longitude range

    latitudes = np.linspace(min_lat, max_lat, int(np.sqrt(num_points)))
    longitudes = np.linspace(min_lon, max_lon, int(np.sqrt(num_points)))

    coordinates = []
    for lat in latitudes:
        for lon in longitudes:
            coordinates.append((lat, lon))

    # Limit to the specified number of points
    return coordinates[:num_points]


def get_wind_speed(lat: float, lon: float)-> pd.DataFrame:
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)

    # Make sure all required weather variables are listed here
    # The order of variables in hourly or daily is important to assign them correctly below
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "wind_speed_120m",
        "start_date": "2020-10-11",
        "end_date": "2024-10-11",
        "models": "icon_seamless"
    }
    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]
    print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
    print(f"Elevation {response.Elevation()} m asl")
    print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
    print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

    # Current values. The order of variables needs to be the same as requested.
    current = response.Current()
    current_ = current.Variables(0).Value()

    print(f"Current time {current.Time()}")
    print(f"Current  {current_}")

    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    hourly_wind_speed_120m = hourly.Variables(0).ValuesAsNumpy()

    hourly_data = {"date": pd.date_range(
        start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
        end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
        freq = pd.Timedelta(seconds = hourly.Interval()),
        inclusive = "left"
    )}
    hourly_data["wind_speed"] = hourly_wind_speed_120m

    # hourly_dataframe = pd.DataFrame(data = hourly_data)
    # print(hourly_dataframe)
    return hourly_data

def main():
    parser = argparse.ArgumentParser(description="Get mean wind speed over Germany")
    parser.add_argument("--points", type=int, default=416, help="Number of coordinate points to sample")
    args = parser.parse_args()

    coordinates = generate_germany_coordinates(args.points)
    wind_speeds = []

    for lat, lon in coordinates:
        wind_speed = get_wind_speed(lat, lon)
        if wind_speed is not None:
            wind_speeds.append(wind_speed)
    
    if wind_speeds:
        mean_wind_speed = np.mean([np.mean(wind_speed["wind_speed_120m"]) for wind_speed in wind_speeds])

        df = pd.DataFrame()
        df["date"] = wind_speeds[0]["date"]
        df["wind_speed"] = mean_wind_speed

        df.to_csv("wind_speed_data.csv", mode="a", header=False, index=False)
        print(f"Mean wind speed at 120m over Germany: {mean_wind_speed:.3f} m/s")
    else:
        print("No wind speed data collected.")

if __name__ == "__main__":
    main()
