# services/leave_service.py

from fastapi import HTTPException
from repositories.leave_repository import (
    get_leaves_by_employee,
    create_leave_form,
    update_leave_form,
    delete_leave_form
)
from schemas.leave import LeaveCreateRequest, LeaveUpdateRequest, ReviewRequest
from services.notification_service import NotificationService
from repositories.employee_repository import get_employee_by_id

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
        success, reviewer_id, employee_id = delete_leave_form(leaveId)
        if not success:
            raise HTTPException(status_code=404, detail="Leave not found or cannot delete")
        reviewer = get_employee_by_id(reviewer_id)
        to_addr = reviewer.get("email") if reviewer else None
        if to_addr:
            subject = f"{employee_id} deleted his/her leave"
            body    = f"{employee_id} deleted his/her leave"
            NotificationService.send_email(to_addr, subject, body)
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
  
