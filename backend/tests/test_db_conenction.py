import pytest
from db.mongo_client import db

# Test MongoDB connection
@pytest.mark.asyncio
async def test_mongo_ping():
    result = await db.command("ping")
    assert result["ok"] == 1.0