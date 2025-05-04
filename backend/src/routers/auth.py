# routers/auth.py

from fastapi import APIRouter, HTTPException
from schemas.auth import RegisterRequest, LoginRequest, LoginResponse
from schemas.user import UserInfoResponse
from services.auth_service import AuthService

router = APIRouter(prefix="/api", tags=["Auth"])

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    """
    快速登入，僅驗證是否能成功登入
    """
    emp = AuthService.login(req)  # 失敗時會拋 HTTPException(401/404)
    return {
        "message": "Login successful",
        "employeeId": emp["employee_id"],
        "name": emp["name"],
        "role": emp["role"],
        }
