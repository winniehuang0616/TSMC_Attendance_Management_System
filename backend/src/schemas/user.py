# schemas/user.py

from pydantic import BaseModel
from typing import Optional, Dict
from enum import Enum

class RoleEnum(str, Enum):
    employee = "employee"
    manager  = "manager"

class UserInfoResponse(BaseModel):
    userId: str
    userName: str
    email: Optional[str]
    phone: Optional[str]
    role: RoleEnum
    used_leave: Dict[str, int]

class EmployeeInfoResponse(BaseModel):
    id: str
    name: str
