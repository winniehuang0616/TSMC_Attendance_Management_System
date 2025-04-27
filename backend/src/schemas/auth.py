from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum as PyEnum
from enum import Enum

class RoleEnum(str, Enum):
    employee = "employee"
    manager  = "manager"
    
class RegisterRequest(BaseModel):
    employeeId: str
    password: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: RoleEnum = Field(default=RoleEnum.employee)

class LoginRequest(BaseModel):
    employeeId: str
    password: str

class LoginResponse(BaseModel):
    message: str = "Login successful"