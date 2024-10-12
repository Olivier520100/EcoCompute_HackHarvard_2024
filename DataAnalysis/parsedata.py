import requests
import json

# Parse response to JSON
response_data = json.load(open("wind_europe_data.json"))
country_names = {entry['countryName'] for entry in response_data['data']['dailyPrices']}

#Loop through every country and save data to a file
for country in country_names:
    filtered_data = {
        "dailyPrices": [entry for entry in response_data['data']['dailyPrices'] if entry['countryName'] == country],
        "dailyGenerations": [entry for entry in response_data['data']['dailyGenerations'] if entry['countryName'] == country]
    }
    with open(f'{country}_wind_data.json', 'w') as json_file:
        json.dump(filtered_data, json_file, indent=4)
    print("Success: Filtered data saved to 'country_wind_data.json'")
    
    
# Olivier's model
# Filter to keep only entries for Germany
#filtered_data = {
#    "dailyPrices": [entry for entry in response_data['data']['dailyPrices'] if entry['countryName'] == "Germany"],
#    "dailyGenerations": [entry for entry in response_data['data']['dailyGenerations'] if entry['countryName'] == "Germany"]
#}

# Save the filtered data to a file
#with open('germany_wind_data.json', 'w') as json_file:
#    json.dump(filtered_data, json_file, indent=4)

#print("Success: Filtered data saved to 'germany_wind_data.json'")
