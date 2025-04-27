# services/auth_service.py

from fastapi import HTTPException
from schemas.auth import RegisterRequest, LoginRequest
from repositories.employee_repository import (
    get_employee_by_id,
    authenticate_employee
)

class AuthService:

    @staticmethod
    def login(payload: LoginRequest) -> dict:
        if not authenticate_employee(payload.employeeId, payload.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user = get_employee_by_id(payload.employeeId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
