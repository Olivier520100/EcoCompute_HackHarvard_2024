import requests
import json

url = "https://windeurope-installations.herokuapp.com/graphql?ref=main-wind-farms"

headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.8',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHBpcnkiOiIyMDI0LTEwLTEyVDEwOjMwOjQyKzAwOjAwIiwidXNlcl9jYXRlZ29yeV9hY3JvbnltIjoiIiwiZW1haWwiOiIifQ.HkPxQ41hkIz5jea09KJ2mmScIFAPqDQg2esCNCjmt1U',
    'Connection': 'keep-alive',
    'Content-Length': '186',
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

# data = {
#     "query": """
#     query {
#         dailyPrices(filter: { dateLteq: "2024-04-01T04:00:00.000Z", dateGt: "2020-03-01T05:00:00.000Z" }) {
#             priceEuroPerMwh
#             countryName
#             date
#         }
#         dailyGenerations(filter: { dateLteq: "2024-04-01T04:00:00.000Z", dateGt: "2020-03-01T05:00:00.000Z" }) {
#             generation
#             countryName
#             date
#         }
#     }
#     """
# }

# Making the POST request
response = requests.post(url, headers=headers)

# Checking the response status
if response.status_code == 200:
    # Parse response to JSON
    response_data = response.json()
    
    # Save the response data to a file
    with open('europe_windfarms.json', 'w') as json_file:
        json.dump(response_data, json_file, indent=4)
    
    print("Success: Data saved to 'europe_windfarms.json'")
else:
    print("Failed with status code:", response.status_code)