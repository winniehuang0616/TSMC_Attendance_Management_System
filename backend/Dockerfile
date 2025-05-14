# 使用 Python 官方映像檔
FROM python:3.11-slim

# 設定工作目錄
WORKDIR /app

# 複製 requirements.txt 並安裝依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製 src 資料夾到容器
COPY src ./src

# 切換到 src 目錄執行應用程式
WORKDIR /app/src

# 預設使用 Uvicorn 啟動 FastAPI 應用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

