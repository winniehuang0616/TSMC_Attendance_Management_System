import mysql.connector
import logging
from config import DB_CONFIG

logger = logging.getLogger(__name__)

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['db']
        )
        cursor = conn.cursor()
        return conn, cursor
    except mysql.connector.Error as e:
        logger.error(f"資料庫連線失敗: {e}")
        raise
