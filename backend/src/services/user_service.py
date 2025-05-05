# services/user_service.py

from fastapi import HTTPException
from repositories.employee_repository import get_employee_by_id, get_employee_id_under_manager
from repositories.leave_repository    import get_used_leaves, get_leaves_by_employee, get_attendance_by_employee

class UserService:
    @staticmethod
    def get_used_hours(employeeId: str) -> dict:
        """
        回傳四價別已使用天數
        """
        used_data = get_used_leaves(employeeId)            
        used = used_data["used_hours"]                  

        result = {}        
        for leave_type_name in ["annual", "sick", "personal", "official"]:
            result[leave_type_name] = float(used.get(leave_type_name, 0))
        return result
    
    @staticmethod
    def get_userinfo(employeeId: str) -> dict:
        # 撈員工基本資料
        user = get_employee_by_id(employeeId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        remain = UserService.get_used_hours(employeeId)
        
        # 撈請假紀錄
        leaves = get_leaves_by_employee(employeeId)     # list[dict]
        # 組成回傳格式
        user["remain_leave"] = remain
        user["leaves"]       = leaves
        return user

    @staticmethod
    def get_user_department_employees(employeeId: str) -> list[dict]:
        """
        取得該部門所有員工資料，並回傳 list[dict]。
        """
        user = get_employee_by_id(employeeId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        department = user['department_id']
        role = user['role']
        if role != "manager":
            raise HTTPException(status_code=403, detail="Permission denied")
        if not department:
            raise HTTPException(status_code=400, detail="Department not found")
        # 撈該部門所有員工資料
        employees = get_employee_id_under_manager(employeeId)
        return employees
    
    @staticmethod
    def get_user_attendance_record(employeeId: str) -> list[dict]:
        """
        取得該員工的考勤紀錄，並回傳 list[dict]。
        """

        user = get_employee_by_id(employeeId)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        role = user['role']
        if role != "manager":
            raise HTTPException(status_code=403, detail="Permission denied")
        # 撈該員工考勤紀錄
        attendance = get_attendance_by_employee(employeeId)
        return attendance

    @staticmethod
    def get_department_employees_details(employeeId: str):
        # 檢查employeeId是否為manager
        requester = get_employee_by_id(employeeId)
        if requester is None:
            raise HTTPException(status_code=404, detail="Employee not found")
        elif requester['role'] != "manager":
            raise HTTPException(status_code = 403, detail = "only managers can perform this action")
        #取得該部門所有員工ID except 主管
        employee_ids = get_employee_id_under_manager(employeeId)
        
        #組成回傳資料(用ID查&拼資料)
        employees_info = []
        for id in employee_ids:
            emp_info = get_employee_by_id(id)
            leave_info = UserService.get_used_hours(id)
            employee_detail = {
                "employee_id": id,
                "name": emp_info['name'],
                "phone": emp_info['phone'],
                "email": emp_info['email'],
                "remain_leave": leave_info
            }
            employees_info.append(employee_detail)

        return employees_info


                 
            
