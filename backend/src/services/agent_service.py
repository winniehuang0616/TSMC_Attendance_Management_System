from sqlalchemy.orm import Session
from repositories.employee_repository import fetch_agents_by_employee_id

def get_department_agents(employee_id: str):
    return fetch_agents_by_employee_id(employee_id)
