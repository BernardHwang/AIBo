from shared.db.mongo_client import db
from bson.objectid import ObjectId
from login_service.models import UserCreate

users = db["users"]

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }

async def create_user(user: UserCreate) -> str:
    result = await users.insert_one(user.dict())
    return str(result.inserted_id)

async def get_user_by_id(user_id: str) -> dict | None:
    user = await users.find_one({"_id": ObjectId(user_id)})
    return user_helper(user) if user else None

async def get_user_by_email(email: str) -> dict | None:
    user = await users.find_one({"email": email})
    return user_helper(user) if user else None
