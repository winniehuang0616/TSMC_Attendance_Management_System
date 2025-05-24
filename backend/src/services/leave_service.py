# services/leave_service.py

from fastapi import HTTPException
from repositories.leave_repository import (
    get_leaves_by_employee,
    create_leave_form,
    update_leave_form,
    delete_leave_form,
    get_leaves_by_employee_ids,
    get_allocated_leaves,
    get_used_leaves,
    get_leave_by_leaveid
)
from schemas.leave import LeaveCreateRequest, LeaveUpdateRequest, ReviewRequest
from services.notification_service import NotificationService
from repositories.employee_repository import get_employee_id_under_manager, get_employee_by_id, get_all_magnager_ids
from typing import List, Dict, Optional

TYPE_MAP = {'annual': 2, 'sick': 1, 'personal': 0, 'official': 3}
REVERSE_TYPE_MAP = {v: k for k, v in TYPE_MAP.items()}

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

        used_leaves = get_used_leaves(employeeId)
        allocated_leaves = get_allocated_leaves(employeeId)
        quota = float(allocated_leaves['allocated_hours'][data["leaveType"]] - used_leaves['used_hours'][data['leaveType']])

        start_time = req.startDate.timestamp()
        end_time = req.endDate.timestamp()
        duration = (end_time - start_time) / 3600 # convert seconds to hours

        if quota <= 0:
            raise HTTPException(status_code=400, detail="Leave quota exceeded")
        elif quota < duration:
            raise HTTPException(status_code=400, detail="Leave duration exceeds quota")
        
        return create_leave_form(data)  
    
    @staticmethod
    def update_leave(leaveId: str, req: LeaveUpdateRequest) -> None:
        data = {
            "leaveType":        req.leaveType,
            "startDate":        req.startDate.strftime("%Y-%m-%d-%H-%M"),
            "endDate":          req.endDate.strftime("%Y-%m-%d-%H-%M"),
            "reason":           req.reason,
            "attachmentBase64": req.attachmentBase64, # 統一改為 attachmentBase64
            "agentId":          req.agentId
        }

        employeeId = get_leave_by_leaveid(leaveId)["employeeId"]

        used_leaves = get_used_leaves(employeeId)
        allocated_leaves = get_allocated_leaves(employeeId)
        quota = float(allocated_leaves['allocated_hours'][data["leaveType"]] - used_leaves['used_hours'][data['leaveType']])

        start_time = req.startDate.timestamp()
        end_time = req.endDate.timestamp()
        duration = (end_time - start_time) / 3600 # convert seconds to hours

        if quota <= 0:
            raise HTTPException(status_code=400, detail="Leave quota exceeded")
        elif quota < duration:
            raise HTTPException(status_code=400, detail="Leave duration exceeds quota")

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
        獲取指定主管同部門所有員工 & 其他部門主管假單資料。
        Args:
            manager_id: 提出請求的主管的 employee_id。
        Returns:
            一個包含假單資訊字典的列表。
        """
        ## 取得同部門員工資料
        employee_ids = get_employee_id_under_manager(manager_id)
        if not employee_ids:
            return [] # 如果沒有其他同事，返回空列表
        leaves_employee = get_leaves_by_employee_ids(employee_ids)
        return leaves_employee
  
    @staticmethod
    def get_used_and_allocated_leaves (employeeId: str) -> Dict[str, Optional[int]]:
        """
        獲取指定員工的已使用和分配的假期數量。
        Args:
            employeeId: 員工的 ID。
        Returns:
            包含已使用和分配假期數量的字典。
        """
        used_leaves = get_used_leaves(employeeId)
        allocated_leaves = get_allocated_leaves(employeeId)

        return {
            "usedLeaves": used_leaves,
            "allocatedLeaves": allocated_leaves
        }
