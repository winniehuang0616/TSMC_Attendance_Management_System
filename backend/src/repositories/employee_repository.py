from repositories.db_connection import get_db_connection
from logging.config import setup_logger

logger = setup_logger("employee_repository")

def get_employee_by_id(employee_id):
    logger.info('[get_employee_by_id] 執行開始')
    """
    根據 employee_id 獲取員工資料（包含密碼）。
    """
    conn = None
    cursor = None
    try:
        conn, cursor = get_db_connection()
        sql = "SELECT employee_id, password, name, hire_date, email, phone, department_id, role FROM employee_info WHERE employee_id = %s"
        cursor.execute(sql, (employee_id,))
        employee = cursor.fetchone()
        if employee: 
             logger.info(f"[get_employee_by_id] 成功 : 獲取員工 {employee_id} 的資料")
             return employee
        else:
            logger.error(f"[get_employee_by_id] 發生錯誤: 找不到員工")
            return None
    except Exception as e:
        logger.error(f'[get_employee_by_id] 發生錯誤: {e}')
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def authenticate_employee(employee_id, password):
    logger.info('[authenticate_employee] 執行開始')
    """
    Quick login check: returns True if employee with matching password exists.
    """
    conn, cursor = get_db_connection()
    try:
        sql = "SELECT 1 FROM employee_info WHERE employee_id = %s AND password = %s LIMIT 1"
        cursor.execute(sql, (employee_id, password))
        row = cursor.fetchone()
        logger.info(f"[authenticate_employee] 成功: 員工 {employee_id} 已登入系統")
        return row is not None
    except Exception as e:
        logger.error(f"[authenticate_employee] 發生錯誤 : {e}")
    finally:
        cursor.close()
        conn.close()

def get_employee_id_under_manager(employee_id):
    logger.info('[get_employee_id_under_manager] 執行開始')
    """
    Return list of employee IDs in the same department as the given employee (excluding self).
    """
    conn, cursor = get_db_connection()
    try:
        # 先取得該員工的部門
        sql = "SELECT department_id FROM employee_info WHERE employee_id = %s"
        cursor.execute(sql, (employee_id,))
        row = cursor.fetchone()
        if not row:
            logger.error(f"[get_employee_id_under_manager] 發生錯誤 : 找不到主管 {employee_id} 所屬部門")
            return []
        department = row['department_id']
        # 查詢同部門所有員工
        sql2 = "SELECT employee_id FROM employee_info WHERE department_id = %s"
        cursor.execute(sql2, (department,))
        rows = cursor.fetchall()
        logger.info(f"[get_employee_id_under_manager] 成功 : 獲取主管 {employee_id} 所屬部門 {department} 下的員工資料")
        # 排除自己
        return [r['employee_id'] for r in rows if r['employee_id'] != employee_id]
    except Exception as e:
        logger.error(f"[get_employee_id_under_manager] 發生錯誤 : {e}")
    finally:
        cursor.close()
        conn.close()


def get_all_magnager_ids(employee_id):
    logger.info('[get_all_magnager_ids] 執行開始')
    """
    return list of manager IDs
    """
    conn, cursor = get_db_connection()
    try:
        sql = "SELECT employee_id FROM employee_info WHERE role = 'manager'"
        cursor.execute(sql)
        rows = cursor.fetchall()
        logger.info(f"[get_all_magnager_ids] 成功 : 獲取主管清單")
        # 排除自己
        return [r['employee_id'] for r in rows if r['employee_id'] != employee_id]
    except Exception as e:
        logger.error(f"[get_all_magnager_ids] 發生錯誤 : {e}")
    finally:
        cursor.close()
        conn.close()

# 查詢代理人可選名單
def fetch_agents_by_employee_id(employee_id):
    logger.info('[fetch_agents_by_employee_id] 執行開始')
    """
    回傳與指定員工在同一部門的其他員工（身分為 'employee'）。
    """
    conn, cursor = get_db_connection()
    try:
        # 取得該員工的部門
        sql = "SELECT department_id FROM employee_info WHERE employee_id = %s"
        cursor.execute(sql, (employee_id,))
        row = cursor.fetchone()
        if not row:
            logger.error(f"[fetch_agents_by_employee_id] 發生錯誤 : 找不到員工 {employee_id} 所屬部門")
            return []
        department = row['department_id']

        # 查詢同部門員工（排除自己），且限定 role = 'employee'
        sql2 = """
            SELECT employee_id, name 
            FROM employee_info 
            WHERE department_id = %s 
              AND employee_id != %s 
              AND role = 'employee'
        """
        cursor.execute(sql2, (department, employee_id))
        rows = cursor.fetchall()
        logger.info(f"[fetch_agents_by_employee_id] 成功 : 獲取員工 {employee_id} 的代理人清單")
        return [{'id': r['employee_id'], 'name': r['name']} for r in rows]
    except Exception as e:
        logger.error(f"[fetch_agents_by_employee_id] 發生錯誤 : {e}")
    finally:
        cursor.close()
        conn.close()
