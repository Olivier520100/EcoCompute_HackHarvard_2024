import os
import pandas as pd
import json

df = pd.DataFrame()

# Loop through ./Data directory for all the json files
for filename in os.listdir("./Data"):
    # Check if the file is a JSON file
    if filename.endswith(".json"):
        # Open the file
        with open(f"./Data/{filename}", "r") as file:
            # Read the file
            data = json.load(file)
           
        df_generations = pd.DataFrame(data["dailyGenerations"])
        df_prices = pd.DataFrame(data["dailyPrices"])

        if "date" not in df_generations.columns or "date" not in df_prices.columns:
            print(f"{filename} does not contain 'date' column")
            continue

        df_generations_cleaned = df_generations.dropna(subset=['date'])
        df_prices_cleaned = df_prices.dropna(subset=['date'])

        df_generations_grouped = df_generations_cleaned.groupby('date')
        df_prices_grouped = df_prices_cleaned.groupby('date')

        df_generations_sums = df_generations_grouped.agg({
                                'generation': 'sum',  # Sum the generation values
                                'countryName': 'first'  # Take the first country name to avoid concatenation
                                }).reset_index()
        df_prices_means = df_prices_grouped.agg({
                                'priceEuroPerMwh': 'mean',  # Sum the generation values
                                'countryName': 'first'  # Take the first country name to avoid concatenation
                                }).reset_index()
        
        merged_df = pd.merge(df_generations_sums, df_prices_means, on='date', how='inner')
        merged_df = merged_df.drop(columns=['countryName_y'])
        merged_df = merged_df.rename(columns={'countryName_x': 'countryName'})

        df = pd.concat([df, merged_df], ignore_index=True)

    else:
        # Print that the file is not a JSON file
        print(f"{filename} is not a JSON file")

df["date"] = pd.to_datetime(df["date"]).dt.date

df.to_csv("wind_europe_data.csv", index=False)