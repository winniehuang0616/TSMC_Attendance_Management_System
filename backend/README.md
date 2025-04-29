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
