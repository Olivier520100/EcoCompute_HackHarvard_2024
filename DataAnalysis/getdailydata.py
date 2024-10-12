import requests
import json

# URL for the GraphQL endpoint
url = "https://windeurope-installations.herokuapp.com/graphql?ref=daily-data"

# Headers for the POST request
headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHBpcnkiOiIyMDI0LTEwLTEyVDA1OjUxOjM3KzAwOjAwIiwidXNlcl9jYXRlZ29yeV9hY3JvbnltIjoiT1BFTiIsImVtYWlsIjoib2xpdmllcjUyMDEwMEBnbWFpbC5jb20ifQ.51QWV_NjOpi7iKKAge9OS2GUZRYmrK7aY1LZEFKtJiQ',
    'Connection': 'keep-alive',
    'Content-Length': '299',
    'Content-Type': 'application/json',
    'Host': 'windeurope-installations.herokuapp.com',
    'Origin': 'https://windeurope.org',
    'Referer': 'https://windeurope.org/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
    'X-CSRF-Token': 'undefined',
    'X-Forwarded-Host': 'windeurope.org',
    'X-Requested-With': 'XMLHttpRequest'
}

# Data for the POST request (GraphQL query)
data = {
    "query": """
    query {
        dailyPrices(filter: { dateLteq: "2024-04-01T04:00:00.000Z", dateGt: "2020-03-01T05:00:00.000Z" }) {
            priceEuroPerMwh
            countryName
            date
        }
        dailyGenerations(filter: { dateLteq: "2024-04-01T04:00:00.000Z", dateGt: "2020-03-01T05:00:00.000Z" }) {
            generation
            countryName
            date
        }
    }
    """
}

# Making the POST request
response = requests.post(url, headers=headers, json=data)

# Checking the response status
if response.status_code == 200:
    # Parse response to JSON
    response_data = response.json()
    
    # Save the response data to a file
    with open('wind_europe_data.json', 'w') as json_file:
        json.dump(response_data, json_file, indent=4)
    
    print("Success: Data saved to 'wind_europe_data.json'")
else:
    print("Failed with status code:", response.status_code)
