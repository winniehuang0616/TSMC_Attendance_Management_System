# routers/user.py

from fastapi import APIRouter, HTTPException
from schemas.user import UserInfoResponse
from services.user_service import UserService
from repositories.leave_repository import get_employee_balance

router = APIRouter(prefix="/api/user", tags=["User"])

@router.get("/userinfo/{employeeId}", response_model=UserInfoResponse)
def get_userinfo(employeeId: str):
    """
    取得員工基本資訊與剩餘假期
    """
    try:
        user = UserService.get_userinfo(employeeId)
        print(user)
        balance = get_employee_balance(employeeId)
    except HTTPException:
        # Service 已拋出 404 或其他 HTTPException
        raise
    # 將 dict 轉成 Pydantic model
    return UserInfoResponse(
        userId     = user["employee_id"],
        email        = user.get("email"),
        phone        = user.get("phone"),
        role         = user["role"],
        remain_leave = balance["remain_leave"]
    )

@router.get("/department/list/{employeeId}")
def get_user_department_employees(employeeId: str):
    """
    取得該部門所有員工資料，並回傳 list[dict]。
    """
    try:
        employees = UserService.get_user_department_employees(employeeId)
        return employees
    except HTTPException:
        # Service 已拋出 404 或其他 HTTPException
        raise

@router.get("/department/attendance/{employeeId}")
def get_user_attendance_record(employeeId: str):
    """
    取得該員工的考勤紀錄，並回傳 list[dict]。
    """
    try:
        attendance = UserService.get_user_attendance_record(employeeId)
        return attendance
    except HTTPException:
        # Service 已拋出 404 或其他 HTTPException
        raise
