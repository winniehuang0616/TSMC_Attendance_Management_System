# routers/leave.py

from fastapi import APIRouter, HTTPException
from typing import List
from schemas.leave import LeaveInfo, LeaveCreateRequest, LeaveUpdateRequest, ReviewRequest
from services.leave_service import LeaveService

router = APIRouter(prefix="/api/leaves", tags=["Leave"])

@router.get("/{employeeId}", response_model=List[LeaveInfo])
def read_leaves(employeeId: str):
    """
    列出某員工所有請假資料
    """
    leaves = LeaveService.list_leaves(employeeId)
    return leaves

@router.post("/{employeeId}", response_model=LeaveInfo)
def create_leave(employeeId: str, req: LeaveCreateRequest):
    """
    建立新的請假單，並回傳該筆詳細資料
    """
    return LeaveService.create_leave(employeeId, req)
    # 如果服務層只回傳 leaveId，你可以在此向服務再請求詳細資料：
    # full = LeaveService.create_leave(leave_id, req)  
    # return full
    # LeaveService.list_leaves(leave_id)

@router.put("/{leaveId}")
def update_leave(leaveId: str, req: LeaveUpdateRequest):
    """
    更新 pending 狀態的請假單，回傳更新後的資料
    """
    updated = LeaveService.update_leave(leaveId, req)
    return updated

@router.delete("/{leaveId}", status_code=204)
def delete_leave(leaveId: str):
    """
    刪除尚未開始或 pending 的請假單
    """
    deleted = LeaveService.delete_leave(leaveId)
    return deleted

@router.put("/{leaveId}/review")
def review_leave(leaveId: str, req: ReviewRequest):
    """
    主管審核請假單，回傳審核後的資料
    """
    reviewed = LeaveService.review_leave(leaveId, req)
    return reviewed
