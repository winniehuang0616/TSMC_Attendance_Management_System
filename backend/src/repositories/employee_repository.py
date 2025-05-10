import logging # 引入 logging 模組
from repositories.db_connection import get_db_connection

# 設置日誌記錄
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_employee_by_id(employee_id):
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
             logger.info(f"成功獲取員工資料：{employee_id}")
             return employee
        else:
            logger.info(f"找不到員工：{employee_id}")
            return None
    except Exception as e:
        logger.error(f"獲取員工 {employee_id} 資料時發生錯誤: {e}")
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def authenticate_employee(employee_id, password):
    """
    Quick login check: returns True if employee with matching password exists.
    """
    conn, cursor = get_db_connection()
    try:
        sql = "SELECT 1 FROM employee_info WHERE employee_id = %s AND password = %s LIMIT 1"
        cursor.execute(sql, (employee_id, password))
        row = cursor.fetchone()
        return row is not None
    finally:
        cursor.close()
        conn.close()

def get_employee_id_under_manager(employee_id):
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
            return []
        department = row['department_id']
        # 查詢同部門所有員工
        sql2 = "SELECT employee_id FROM employee_info WHERE department_id = %s"
        cursor.execute(sql2, (department,))
        rows = cursor.fetchall()
        # 排除自己
        return [r['employee_id'] for r in rows if r['employee_id'] != employee_id]
    finally:
        cursor.close()
        conn.close()


def get_all_magnager_ids(employee_id):
    """
    return list of manager IDs
    """
    conn, cursor = get_db_connection()
    try:
        sql = "SELECT employee_id FROM employee_info WHERE role = 'manager'"
        cursor.execute(sql)
        rows = cursor.fetchall()
        # 排除自己
        return [r['employee_id'] for r in rows if r['employee_id'] != employee_id]
    finally:
        cursor.close()
        conn.close()

# 查詢代理人可選名單
def fetch_agents_by_employee_id(employee_id):
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
        return [{'id': r['employee_id'], 'name': r['name']} for r in rows]
    finally:
        cursor.close()
        conn.close()
