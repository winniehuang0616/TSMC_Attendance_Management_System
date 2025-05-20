
import mysql.connector
import traceback
from config import DB_CONFIG
from logging.config import setup_logger

logger = setup_logger("db_connection")

def get_db_connection():
    """
    取得 MySQL 連線與 cursor。
    若失敗，會根據不同的例外類別記錄詳細錯誤，並再拋出原始例外。
    """
    try:
        logger.info(
            f"Connecting to DB at {DB_CONFIG['host']}:{DB_CONFIG['port']} "
            f"with user={DB_CONFIG['user']} db={DB_CONFIG['db']}"
        )
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['db'],
            connect_timeout=10
        )
        cursor = conn.cursor(dictionary=True)
        logger.info("資料庫連線成功")
        return conn, cursor

    except mysql.connector.InterfaceError as e:
        logger.error(
            f"[InterfaceError] 無法連線到 MySQL 伺服器 "
            f"(errno={e.errno}, sqlstate={e.sqlstate}): {e.msg}"
        )
        logger.debug(traceback.format_exc())
        raise e

    except mysql.connector.ProgrammingError as e:
        logger.error(
            f"[ProgrammingError] 連線設定或查詢錯誤 "
            f"(errno={e.errno}, sqlstate={e.sqlstate}): {e.msg}"
        )
        logger.debug(traceback.format_exc())
        raise e

    except mysql.connector.DatabaseError as e:
        logger.error(
            f"[DatabaseError] 資料庫錯誤 "
            f"(errno={e.errno}, sqlstate={e.sqlstate}): {e.msg}"
        )
        logger.debug(traceback.format_exc())
        raise e

    except mysql.connector.Error as e:
        logger.error(
            f"[MySQLError] MySQL Connector 通用例外 "
            f"(errno={getattr(e, 'errno', None)}, sqlstate={getattr(e, 'sqlstate', None)}): {e}"
        )
        logger.debug(traceback.format_exc())
        raise e

    except Exception as e:
        logger.error(f"[UnknownError] 取得 DB 連線時發生未預期錯誤: {e}")
        logger.debug(traceback.format_exc())
        raise e
