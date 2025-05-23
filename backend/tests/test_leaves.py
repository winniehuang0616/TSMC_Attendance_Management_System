# test_department_leaves.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("Testing app routes:", app.routes)

for route in app.routes:
    print(route.path)

temp_leaveId = None

def test_read_leaves():
    response = client.get("/api/leaves/EMP001")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_create_leave():
    response = client.post("/api/leaves/EMP001", json={
        "leaveType": "sick",
        "startDate": "2025-05-23T10:28:08.456Z",
        "endDate": "2025-05-23T12:28:08.456Z",
        "reason": "string",
        "attachedFileBase64": "string",
        "agentId": "EMP002",
        "createDate": "2025-05-23T10:28:08.456Z"
    })
    assert response.status_code == 200
    data = response.json()
    #assert leaveId is string
    assert "leaveId" in data
    assert isinstance(data["leaveId"], str)
    global temp_leaveId
    temp_leaveId = data["leaveId"]

def test_update_leave():
    response = client.put(f"/api/leaves/{temp_leaveId}", json={
        "leaveType": "sick",
        "startDate": "2025-05-23T10:28:08.456Z",
        "endDate": "2025-05-23T11:28:08.456Z",
        "reason": "string",
        "attachedFileBase64": "string",
        "agentId": "EMP002",
    })
    assert response.status_code == 200

#def test_review_leave():
#    response = client.put(f"/api/leaves/{temp_leaveId}/review", json={
#        "status": "approved",
#        "comment": "string",
#        "reviewerId": "EMP004"
#})
#    assert response.status_code == 200

def test_delete_leave():
    response = client.delete(f"/api/leaves/{temp_leaveId}")
    assert response.status_code == 204