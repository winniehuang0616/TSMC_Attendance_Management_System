# TSMC_Attendance_Management_System_backend
### Dev_process

#### 1. Clone the Repository
```bash
git clone https://github.com/winniehuang0616/TSMC_Attendance_Management_System.git
cd TSMC_Attendance_Management_System
git checkout -b {branch_name}
````

#### 2. Set up .env
`cp env.example src/.env` <br>
Note: This file is used to configure database access, JWT keys, and other environment variables.
#### 3. Create and Activate a Virtual Environment
- venv
- conda
#### 4. Install dependencies
`pip install -r requirements.txt`
#### 5. Make sure to push on the correct branch
`git push origin {branch_name}`

#### Run
```bash
cd src
python -m uvicorn main:app --reload
```

### API
#### Spec
https://docs.google.com/document/d/10eDYDAqADlW-cB73Pd6kmNkwoJHZ300uVCMQTq4qh74/edit?tab=t.0#heading=h.knhhsrmzd3mx
### DB - mysql
#### Spec
https://hackmd.io/ntbtCmr8RVSqbkwsbqMvoA

#### Initialization
```bash
cd scripts
bash init_db.sh
```

#### Connection
VM IP：34.81.245.163
port: 3306
1. download mysql-client
2.  `mysql -h 34.81.245.163 -P 3306 -u backend_user -p`
3. password: StrongPassword123!

### Add Prometheus Monitoring (for `/metrics` endpoint)

To enable Prometheus metrics export at `/metrics`, follow these steps:

1. Install the package (already included in `requirements.txt`):

2. In `main.py`, **add the following lines at the bottom (after routers are registered)**:

```python
from prometheus_fastapi_instrumentator import Instrumentator

instrumentator = Instrumentator().instrument(app)
instrumentator.expose(app, endpoint="/metrics")
```
3. Start the server:
```
python -m uvicorn main:app --reload
```
4. Visit http://localhost:8000/metrics to confirm Prometheus metrics are being served.

test
