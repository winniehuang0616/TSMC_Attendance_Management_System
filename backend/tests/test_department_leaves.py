# test_department_leaves.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("Testing app routes:", app.routes)

for route in app.routes:
    print(route.path)


def test_valid_manager():
    response = client.get("/leaves/manager/EMP001/department-leaves")
    assert response.status_code == 200

# def test_empty_department():
#     response = client.get("/leaves/manager/M54321/department-leaves")
#     assert response.status_code == 200
#     assert response.json() == []

def test_invalid_manager_id():
    response = client.get("/leaves/manager/INVALID_ID/department-leaves")
    assert response.status_code < 500

def test_non_manager_id():
    response = client.get("/leaves/manager/EMP002/department-leaves")
    assert response.status_code < 500

