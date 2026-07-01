import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://msaaabb_db_user:GcYg66mH0ffpchgT@cluster0.bqlehwr.mongodb.net/?appName=Cluster0")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client["notes_llm"]
