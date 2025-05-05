# services/leave_service.py

from fastapi import HTTPException
from repositories.leave_repository import (
    get_leaves_by_employee,
    create_leave_form,
    update_leave_form,
    delete_leave_form,
    get_leaves_by_employee_ids
)
from schemas.leave import LeaveCreateRequest, LeaveUpdateRequest, ReviewRequest
from services.notification_service import NotificationService
from repositories.employee_repository import get_employee_id_under_manager, get_employee_by_id
from typing import List, Dict, Optional


class LeaveService:
    @staticmethod
    def list_leaves(employeeId: str) -> list[dict]:
        return get_leaves_by_employee(employeeId)

    @staticmethod
    def create_leave(employeeId: str, req: LeaveCreateRequest) -> str:
        data = {
            "employeeId":        employeeId,
            "leaveType":         req.leaveType,
            "startDate":         req.startDate.strftime("%Y-%m-%d-%H-%M"),
            "endDate":           req.endDate.strftime("%Y-%m-%d-%H-%M"),
            "createDate":        (req.createDate or req.startDate).strftime("%Y-%m-%d-%H-%M"),
            "reason":            req.reason,
            "attachmentBase64":  req.attachedFileBase64,
            "agentId":           req.agentId
        }
        # leave_id = create_leave_form(data)   # 回傳 leaveId
        # leave = get_leaves_by_employee(leave_id)
        return create_leave_form(data) 
    
    @staticmethod
    def update_leave(leaveId: str, req: LeaveUpdateRequest) -> None:
        data = {
            "leaveType":        req.leaveType,
            "startDate":        req.startDate.strftime("%Y-%m-%d-%H-%M"),
            "endDate":          req.endDate.strftime("%Y-%m-%d-%H-%M"),
            "reason":           req.reason,
            "attachmentBase64": req.attachedFileBase64,
            "agentId":          req.agentId
        }
        success = update_leave_form(leaveId, data)
        if not success:
            raise HTTPException(status_code=400, detail="Cannot update leave")

    @staticmethod
    def delete_leave(leaveId: str) -> None:
        success = delete_leave_form(leaveId)
        if not success:
            raise HTTPException(status_code=404, detail="Leave not found or cannot delete")
        return success

    @staticmethod
    def review_leave(leaveId: str, req: ReviewRequest) -> None:
        from repositories.leave_repository import review_leave_form
        if req.status == "rejected" and not req.comment:
            raise HTTPException(status_code=400, detail="Comment is required for rejection")
        success = review_leave_form(leaveId, {
            "status":   req.status.value, 
            "comment":  req.comment, 
            "reviewerId": req.reviewerId
        })
        if not success:
            raise HTTPException(status_code=404, detail="Leave not found")
        # 取申請人的 email
        emp = get_employee_by_id(success["employee_id"])
        to_addr = emp.get("email") if emp else None
        if to_addr:
            subject = f"Your leave request has been {req.status.value}"
            body    = req.comment or (
                f"Your leave request was {req.status.value} by {req.reviewerId}."
            )
            NotificationService.send_email(to_addr, subject, body)

        # 回傳更新結果給 Controller（或直接回傳 updated）
        return success
    
    @staticmethod
    def get_department_colleague_leaves(manager_id: str) -> List[Dict]:
        """
        獲取指定主管同部門內，所有其他員工的請假紀錄。
        Args:
            manager_id: 提出請求的主管的 employee_id。
        Returns:
            一個包含假單資訊字典的列表。
        """
        # 1. 獲取主管所在的部門 (雖然 get_employee_id_under_manager 內部會做，但這裡先獲取以供日誌或檢查)
        manager_info = get_employee_by_id(manager_id)
        if not manager_info or 'department_id' not in manager_info:
             # 或者記錄日誌並返回空列表
            raise HTTPException(status_code=404, detail=f"Manager with ID {manager_id} not found or has no department.")

        manager_department_id = manager_info['department_id']
        print(f"主管 {manager_id} 的部門是 {manager_department_id}") # Debug log

        # 2. 使用現有函數獲取同部門其他員工的 ID 列表
        # 注意：此函數名稱可能具誤導性，但其功能是獲取同部門非自己的員工ID
        colleague_ids = get_employee_id_under_manager(manager_id)

        if not colleague_ids:
            print(f"主管 {manager_id} (部門 {manager_department_id}) 沒有其他同部門員工。") # Debug log
            return [] # 如果沒有其他同事，返回空列表

        print(f"找到主管 {manager_id} 的同部門同事 ID: {colleague_ids}") # Debug log

        # 3. 使用新增的 repository 函數批量獲取這些同事的假單
        leaves = get_leaves_by_employee_ids(colleague_ids)

        return leaves
  
