# conftest.py
# import sys
# import os
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))
import pytest
from repositories.db_connection import get_db_connection
from fastapi.testclient import TestClient
from main import app  # 依實際 main app 檔案命名
from dotenv import load_dotenv


load_dotenv()

@pytest.fixture
def db():
    conn, cursor = get_db_connection()
    yield conn, cursor
    cursor.close()
    conn.close()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c