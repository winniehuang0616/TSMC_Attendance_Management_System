## 目錄結構

```
/
├── frontend/           # React前端應用
│   ├── k8s/            # 前端Kubernetes配置
├── backend/            # Python FastAPI後端
│   ├── k8s/            # 後端Kubernetes配置
```

## 系統要求

- Google Cloud Platform帳戶
- 已啟用GKE API
- 已安裝Google Cloud SDK
- Docker
- Kubectl

## 部署流程

### 1. 設置環境

```bash
# 設置GCP項目
gcloud config set project tsmc-459812

# 連接到GKE集群
gcloud container clusters get-credentials tsmc --zone asia-east1-a
```

### 2. 構建與推送Docker映像

#### 後端

```bash
# 進入後端目錄
cd backend

# 構建Docker映像
docker build -t gcr.io/tsmc-459812/tsmc-backend .

# 推送到Google Container Registry
docker push gcr.io/tsmc-459812/tsmc-backend
```

#### 前端

```bash
# 進入前端目錄
cd frontend

# 構建Docker映像
docker build -t gcr.io/tsmc-459812/tsmc-frontend .

# 推送到Google Container Registry
docker push gcr.io/tsmc-459812/tsmc-frontend
```

### 3. 設置密鑰

```bash
# 後端數據庫密鑰
kubectl create secret generic backend-secret \
  --from-literal=DB_HOST=34.81.245.163 \
  --from-literal=DB_PORT=3306 \
  --from-literal=DB_USER=backend_user \
  --from-literal=DB_PASSWORD=StrongPassword123! \
  --from-literal=DB_NAME=leave_management

# MySQL密鑰
kubectl create secret generic mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=your-root-password
```

### 4. 部署應用

#### 後端部署

```bash
# 部署MySQL (如果使用內部MySQL)
kubectl apply -f backend/k8s/mysql/mysql-pvc.yaml
kubectl apply -f backend/k8s/mysql/mysql-deployment.yaml
kubectl apply -f backend/k8s/mysql/mysql-service.yaml

# 部署後端API
kubectl apply -f backend/k8s/backend/backend-deployment.yaml
kubectl apply -f backend/k8s/backend/backend-service.yaml
kubectl apply -f backend/k8s/backend/backend-hpa.yaml
```

#### 前端部署

```bash
# 部署前端應用
kubectl apply -f frontend/k8s/frontend-deployment.yaml
kubectl apply -f frontend/k8s/frontend-service.yaml
kubectl apply -f frontend/k8s/frontend-hpa.yaml

# 部署Ingress配置路由
kubectl apply -f frontend/k8s/ingress.yaml
```

## 常用kubectl命令

### 檢查資源狀態

```bash
# 獲取所有Pod
kubectl get pods --all-namespaces

# 獲取所有部署
kubectl get deployments

# 獲取所有服務
kubectl get services

# 獲取入口配置
kubectl get ingress
```

### 詳細信息查看

```bash
# 查看Pod詳細信息
kubectl describe pod <pod-name>

# 查看部署詳細信息
kubectl describe deployment <deployment-name>

# 查看服務詳細信息
kubectl describe service <service-name>
```

### 日誌查看

```bash
# 查看Pod日誌
kubectl logs <pod-name>

# 實時跟踪日誌
kubectl logs -f <pod-name>
```

### 進入容器

```bash
# 進入Pod內的容器
kubectl exec -it <pod-name> -- /bin/bash
```

### 擴展應用

```bash
# 手動擴展Pod數量
kubectl scale deployment <deployment-name> --replicas=<number>

# 檢查HPA狀態
kubectl get hpa
```

### 更新應用

```bash
# 更新映像版本
kubectl set image deployment/<deployment-name> <container-name>=<new-image>

# 檢查更新狀態
kubectl rollout status deployment/<deployment-name>

# 回滾更新
kubectl rollout undo deployment/<deployment-name>
```

## 系統監控

### 監控資源使用

```bash
# 查看Node資源使用
kubectl top nodes

# 查看Pod資源使用
kubectl top pods
```

### 監控事件

```bash
# 查看集群事件
kubectl get events

# 按時間排序顯示事件
kubectl get events --sort-by='.metadata.creationTimestamp'
```

## 故障排除

### 常見問題

1. **Pod啟動失敗**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **服務不可訪問**
   ```bash
   kubectl get svc
   kubectl describe svc <service-name>
   ```

3. **數據庫連接問題**
   ```bash
   # 檢查密鑰
   kubectl get secrets
   
   # 檢查配置
   kubectl describe deployment backend
   ```

4. **擴展問題**
   ```bash
   kubectl describe hpa
   ```

## 應用訪問

部署完成後，系統可通過以下方式訪問：

```bash
# 獲取Ingress IP
kubectl get ingress tsmc-ingress

# 訪問URL
http://<ingress-ip>/
```

前端會自動將API請求路由到後端服務(/api路徑)。

