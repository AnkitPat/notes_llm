import os
from pymongo import MongoClient
from dotenv import load_dotenv
import pathlib

# Load .env
env_path = pathlib.Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

MONGODB_URI = os.getenv("MONGODB_URI")
print(f"Connecting to: {MONGODB_URI}")

# Test connection, allowing invalid certs to debug
client = MongoClient(MONGODB_URI, tlsAllowInvalidCertificates=True)

try:
    client.admin.command('ping')
    print("Successfully connected (with insecure SSL)!")
except Exception as e:
    print(f"Connection failed: {e}")
