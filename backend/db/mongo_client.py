# shared/db/mongo_client.py
from motor.motor_asyncio import AsyncIOMotorClient
from shared.config import MONGO_URI, MONGO_DB_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]
