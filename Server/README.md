# How to setup with venv & pip
1. `python -m venv venv`
2. `source ./venv/bin/activate` (Linux) or `./venv\Scripts\activate` (Windows)
3. `pip install -r requirements.txt`

After installing new dependencies, run `pip freeze > requirements.txt` to update the requirements file.

# How to run the server
1. `uvicorn main:app --reload`