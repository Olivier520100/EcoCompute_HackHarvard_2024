import openmeteo_requests
import numpy as np
from datetime import datetime, timedelta
import argparse
import pandas as pd


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

def get_wind_speed(lat, lon):
    new_columns = {
        "lat": [],
        "lon": [],
        "date": [],
        "wind_speed_120m": []
    }

    openmeteo = openmeteo_requests.Client()

    # Get the current time and add one hour for the future hour forecast
    now = datetime.now()
    next_hour = now + timedelta(hours=1)
    formatted_date = next_hour.strftime("%Y-%m-%d")

    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": formatted_date,
        "end_date": formatted_date,
        "hourly": ["wind_speed_120m"]
    }

    try:
        url = "https://api.open-meteo.com/v1/forecast"
        responses = openmeteo.weather_api(url=url, params=params)
        response = responses[0]

        if response:
            hourly = response.Hourly()
            wind_speeds = hourly.Variables(0).ValuesAsNumpy()[0]

            now = datetime.now()
            formatted_date = now.strftime("%Y-%m-%d")

            new_columns["lat"].append(lat)
            new_columns["lon"].append(lon)
            new_columns["date"].append(formatted_date)
            new_columns["wind_speed_120m"].append(wind_speeds)
            print(f"Data for coordinates ({lat}, {lon}) fetched successfully")
            return new_columns
        else:
            print(f"No data for coordinates ({lat}, {lon})")
            return None
    except Exception as e:
        print(f"Error fetching data for ({lat}, {lon}): {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Get mean wind speed over Germany")
    parser.add_argument("--points", type=int, default=416, help="Number of points to sample")
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
