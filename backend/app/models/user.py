from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class User(BaseModel):
    id: str = Field(..., alias="_id") # Use _id for MongoDB compatibility if needed
    email: str
    name: str
    profile_picture_url: Optional[str] = None
    is_approved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Example for database model if using a non-Pydantic ORM
# class DBUser(User):
#     class Config:
#         arbitrary_types_allowed = True
