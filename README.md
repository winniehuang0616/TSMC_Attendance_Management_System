# TSMC 請假管理系統

一個基於 React + FastAPI 的現代化請假管理系統，部署於 Google Kubernetes Engine (GKE)。

## 📋 系統功能

- **員工功能**
  - 申請請假（病假、事假、特休、公假）
  - 查看請假記錄和剩餘假期
  - 編輯/撤回待審核的請假申請
  - 上傳附件（支援圖片格式）

- **主管功能**
  - 審核部門員工請假申請
  - 查看部門員工請假總覽
  - 管理員工假期資訊

- **系統特色**
  - 自動計算工作時段內的請假時數
  - 電子郵件通知功能
  - RESTful API 設計
  - Prometheus 監控整合

## 🏗️ 系統架構

```
TSMC 請假管理系統/
├── frontend/              # React 前端應用
│   ├── src/
│   │   ├── components/    # React 元件
│   │   ├── pages/         # 頁面元件
│   │   ├── context/       # React Context
│   │   └── config/        # 配置檔案
│   ├── k8s/              # 前端 Kubernetes 配置
│   └── dockerfile        # 前端 Docker 映像檔
├── backend/              # FastAPI 後端 API
│   ├── src/
│   │   ├── routers/      # API 路由
│   │   ├── services/     # 業務邏輯
│   │   ├── repositories/ # 資料存取層
│   │   └── schemas/      # Pydantic 模型
│   ├── k8s/              # 後端 Kubernetes 配置
│   ├── db/               # 資料庫結構
│   └── tests/            # 測試檔案
└── build/                # CI/CD 配置
```

## 🛠️ 技術堆疊

### 前端
- **React 18** - 使用者介面框架
- **TypeScript** - 型別安全的 JavaScript
- **Tailwind CSS** - 實用優先的 CSS 框架
- **React Hook Form** - 表單管理
- **React Router** - 路由管理
- **Axios** - HTTP 客戶端
- **Shadcn/ui** - UI 元件庫

### 後端
- **FastAPI** - 現代化 Python Web 框架
- **Python 3.11** - 程式語言
- **Pydantic** - 資料驗證和序列化
- **MySQL** - 關聯式資料庫
- **SQLAlchemy** - ORM（部分功能）
- **Uvicorn** - ASGI 伺服器

### 基礎設施
- **Google Kubernetes Engine (GKE)** - 容器協調平台
- **Docker** - 容器化技術
- **Google Container Registry** - 映像倉庫
- **GitHub Actions** - CI/CD 流水線
- **Nginx** - 反向代理伺服器

## 🚀 快速開始

### 環境需求

- **本地開發**
  - Node.js 18+
  - Python 3.11+
  - MySQL 8.0+
  - Docker & Docker Compose

- **生產部署**
  - Google Cloud Platform 帳戶
  - 已啟用 GKE API
  - Google Cloud SDK
  - kubectl

### 本地開發設置

#### 1. 克隆專案

```bash
git clone <repository-url>
cd TSMC_Attendance_Management_System
```

#### 2. 後端設置

```bash
# 進入後端目錄
cd backend

# 建立虛擬環境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows

# 安裝依賴
pip install -r requirements.txt

# 設置環境變數
cp env.example src/.env
# 編輯 src/.env 檔案，設置資料庫連線資訊

# 初始化資料庫
cd scripts
bash init_db.sh

# 啟動後端服務
cd ../src
python -m uvicorn main:app --reload
```

後端服務將在 http://localhost:8000 啟動
- API 文件：http://localhost:8000/docs
- Metrics 端點：http://localhost:8000/metrics

#### 3. 前端設置

```bash
# 開啟新終端，進入前端目錄
cd frontend

# 安裝依賴
yarn install

# 啟動開發伺服器
yarn dev
```

前端應用將在 http://localhost:5173 啟動

### 資料庫連線

- **主機**: 34.81.245.163
- **埠號**: 3306
- **用戶**: backend_user
- **密碼**: StrongPassword123!
- **資料庫**: leave_management

連線範例：
```bash
mysql -h 34.81.245.163 -P 3306 -u backend_user -p
```

## 🌐 生產部署

### 前置作業

```bash
# 設置 GCP 專案
gcloud config set project tsmc-459812

# 連接到 GKE 集群
gcloud container clusters get-credentials tsmc --zone asia-east1-b
```

### 自動化部署（推薦）

專案配置了 GitHub Actions 自動化部署流水線：

1. **推送到 `production` 分支觸發部署**
2. **自動執行**：
   - 程式碼檢查（ESLint、Prettier）
   - 後端測試
   - Docker 映像建置與推送
   - Kubernetes 資源部署
   - 建立部署標籤

### 手動部署

#### 1. 建置並推送 Docker 映像

```bash
# 後端映像
cd backend
docker build -t gcr.io/tsmc-459812/tsmc-backend:latest .
docker push gcr.io/tsmc-459812/tsmc-backend:latest

# 前端映像
cd ../frontend
docker build --network=host -t gcr.io/tsmc-459812/tsmc-frontend:latest .
docker push gcr.io/tsmc-459812/tsmc-frontend:latest
```

#### 2. 設置 Kubernetes 密鑰

```bash
# 後端資料庫密鑰
kubectl create secret generic backend-secret \
  --from-literal=DB_HOST=34.81.245.163 \
  --from-literal=DB_PORT=3306 \
  --from-literal=DB_USER=backend_user \
  --from-literal=DB_PASSWORD=StrongPassword123! \
  --from-literal=DB_NAME=leave_management

# MySQL 密鑰（如果使用內部 MySQL）
kubectl create secret generic mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=your-root-password
```

#### 3. 部署應用程式

```bash
# 部署後端
kubectl apply -f backend/k8s/backend/
kubectl apply -f backend/k8s/mysql/  # 可選：如果使用內部 MySQL

# 部署前端
kubectl apply -f frontend/k8s/

# 檢查部署狀態
kubectl get pods
kubectl get services
kubectl get ingress
```

## 🔧 常用指令

### 開發指令

```bash
# 前端
yarn dev          # 啟動開發伺服器
yarn build        # 建置生產版本
yarn lint         # 程式碼檢查
yarn format       # 程式碼格式化

# 後端
python -m uvicorn main:app --reload  # 啟動開發伺服器
pytest -s backend/tests/             # 執行測試
```

### Kubernetes 管理

```bash
# 查看資源狀態
kubectl get pods --all-namespaces
kubectl get deployments
kubectl get services
kubectl get ingress

# 查看日誌
kubectl logs -f <pod-name>
kubectl logs -f deployment/<deployment-name>

# 擴展應用
kubectl scale deployment <deployment-name> --replicas=<number>

# 更新應用
kubectl set image deployment/<deployment-name> <container-name>=<new-image>
kubectl rollout status deployment/<deployment-name>
kubectl rollout undo deployment/<deployment-name>  # 回滾

# 進入容器
kubectl exec -it <pod-name> -- /bin/bash
```

### 監控與除錯

```bash
# 查看資源使用情況
kubectl top nodes
kubectl top pods

# 查看事件
kubectl get events --sort-by='.metadata.creationTimestamp'

# 查看詳細資訊
kubectl describe pod <pod-name>
kubectl describe deployment <deployment-name>
kubectl describe service <service-name>
```

## 🧪 測試

### 後端測試

```bash
cd backend
# 執行所有測試
PYTHONPATH=backend/src pytest -s backend/tests/

# 執行特定測試檔案
pytest -s backend/tests/test_API.py
pytest -s backend/tests/test_leaves.py
```

### 測試涵蓋範圍

- API 端點測試
- 登入/登出功能
- 請假申請流程
- 部門管理功能

## 📊 監控與可觀測性

### Prometheus Metrics

系統整合了 Prometheus 指標收集：

- **端點**: `/metrics`
- **指標類型**: HTTP 請求、回應時間、錯誤率
- **使用**: FastAPI Instrumentator

### 健康檢查

- **根端點**: `/` - 基本健康檢查
- **Ping 端點**: `/api/ping` - API 健康檢查

## 🔐 安全考量

- **認證**: 基於 Session 的認證
- **授權**: 角色基礎存取控制（員工/主管）
- **密鑰管理**: Kubernetes Secrets
- **資料驗證**: Pydantic 模型驗證
- **CORS**: 適當的跨域資源共享設定

## 📁 資料庫結構

### 主要資料表

- **employee_info**: 員工基本資訊
- **leave_info**: 請假記錄
- **leave_balance**: 假期餘額
- **leave_type**: 假別類型
- **department**: 部門資訊

### 假別代碼

| 代碼 | 類型 | 說明 |
|------|------|------|
| 0    | personal | 事假 |
| 1    | sick | 病假 |
| 2    | annual | 特休 |
| 3    | official | 公假 |

## 🚨 故障排除

### 常見問題

**Pod 啟動失敗**
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

**服務無法存取**
```bash
kubectl get svc
kubectl describe svc <service-name>
kubectl get ingress
```

**資料庫連線問題**
```bash
kubectl get secrets
kubectl describe deployment backend
```

