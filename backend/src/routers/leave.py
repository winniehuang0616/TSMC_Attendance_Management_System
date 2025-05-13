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

@router.get("/manager/{manager_id}/department-leaves", response_model=List[LeaveInfo])
def read_manager_department_leaves(manager_id: str):
    """
    獲取主管所在部門所有員工 & 其他部門主管 請假紀錄列表。
    此端點 *假設* 提供的 manager_id 是有效的，且代表一位主管。
    """
    # 你可以在這裡加入非常基礎的 manager_id 格式檢查 (如果需要)
    # 例如： if not manager_id.startswith('M'): raise HTTPException(...)

    # 調用 Service 層的方法，傳入從路徑中獲取的 manager_id
    try:
        leaves = LeaveService.get_department_colleague_leaves(manager_id=manager_id)
        # Service 返回的 list[dict] 會由 FastAPI 自動根據 response_model=List[LeaveInfo] 驗證和轉換
        return leaves
    except HTTPException as http_exc:
        # 如果 Service 層拋出 HTTPException (例如 manager_id 不存在), 直接重新拋出
        raise http_exc
    except Exception as e:
        # 處理其他潛在的服務層錯誤
        print(f"Error processing request for manager {manager_id}: {e}") # Log the error
        raise HTTPException(status_code=500, detail="Internal server error processing request.")
    
@router.get("/{employeeId}/leaveCount")
def get_leave_count(employeeId: str):
    """
    獲取指定員工的請假次數
    回傳兩個dict: allocatedLeaves 和 usedLeave
    """
    leave_count = LeaveService.get_used_and_allocated_leaves(employeeId)
    return leave_count
