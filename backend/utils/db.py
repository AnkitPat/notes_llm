import motor.motor_asyncio
import os
from dotenv import load_dotenv
import pathlib

# Load .env from backend folder explicitly
env_path = pathlib.Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable not set in backend/.env")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client["notes_llm"]
