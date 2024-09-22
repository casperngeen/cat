import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_cat(breed=None):
    base = "https://api.thecatapi.com/v1/images/search"
    headers = {
        "x-api-key": os.getenv("CAT_API_KEY")
    }
    if not breed:
        response = requests.get(base, headers=headers)
    else:
        if len(breed) > 4:
            breed = breed[:4]
        breed_url = base + f"?has_breeds=1&breed_ids={breed}"
        response = requests.get(breed_url, headers=headers)
    
    # what will happen if the breed doesnt exist
    if response.status_code == 200:
        data = response.json()
        url = data[0]['url']
        return url
    else:
        try:
            error_message = response.json()
            return f"Error Code: {response.status_code}\n, Detailed error: {error_message}"
        except ValueError:
            return f"Error Code: {response.status_code}"