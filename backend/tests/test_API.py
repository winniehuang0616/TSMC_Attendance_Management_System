# conftest.py
# import sys
# import os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))
from fastapi.testclient import TestClient
from main import app  # 匯入你的 FastAPI app

# client = TestClient(app)

# POST /api/login
def test_login_success(client):
    res = client.post("/api/login", json={"employeeId": "EMP001", "password": "pwd123"})
    assert res.status_code == 200
    assert res.json()["message"] == "Login successful"

def test_login_fail_wrong_password(client):
    res = client.post("/api/login", json={"employeeId": "EMP001", "password": "wrongpass"})
    assert res.status_code == 401

# def test_login_fail_user_not_found(client):
#     res = client.post("/api/login", json={"employeeId": "EMP999", "password": "123456"})
#     assert res.status_code == 404


# GET /api/user/userinfo/{employeeId}
def test_get_userinfo_success(client):
    res = client.get("/api/user/userinfo/EMP001")
    assert res.status_code == 200
    assert "role" in res.json()

def test_get_userinfo_not_found(client):
    res = client.get("/api/user/userinfo/EMP999")
    assert res.status_code == 404


# GET /api/user/department/list/{employeeId}
def test_get_department_list(client):
    res = client.get("/api/user/department/list/EMP001")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


# GET /api/user/department/attendance/{employeeId}
def test_get_attendance(client):
    res = client.get("/api/user/department/attendance/EMP001")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


# GET /api/user/agent/{employee_id}
def test_get_useragent_list(client):
    res = client.get("/api/useragent/EMP001")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


# GET /api/user/department/employeesInfo/{employeeId}
def test_get_department_employees_info(client):
    res = client.get("/api/user/department/list/EMP001")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

