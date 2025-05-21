import logging
import uuid
from datetime import datetime
from repositories.db_connection import get_db_connection
from typing import List, Dict


logger = logging.getLogger(__name__)

# leave_type 與資料庫對應
TYPE_MAP = {'annual': 2, 'sick': 1, 'personal': 0, 'official': 3}
REVERSE_TYPE_MAP = {v: k for k, v in TYPE_MAP.items()}
# 狀態映射
STATUS_MAP = {0: 'pending', 1: 'approved', 2: 'rejected'}
REVERSE_STATUS_MAP = {v: k for k, v in STATUS_MAP.items()}


def get_allocated_leaves(employee_id):
    conn, cursor = get_db_connection()
    try:
        # 讀取當年價別總時數
        year = str(datetime.now().year)
        sql = "SELECT leave_type, allocated_hours FROM leave_balance WHERE employee_id = %s AND year = %s"
        cursor.execute(sql, (employee_id, year))
        rows = cursor.fetchall()
        print("[DEBUG] get_allocated_leaves rows:", rows)  # ⭐ 加這行 debug

        allocated = {k: 0 for k in TYPE_MAP}
        for row in rows:
            leave_type_id = row['leave_type']
            hrs = row['allocated_hours']
            leave_type_name = REVERSE_TYPE_MAP.get(leave_type_id)
            if leave_type_name:
                allocated[leave_type_name] = hrs
        return {
            "employee_id": employee_id,
            "allocated_hours": allocated
        }
    finally:
        cursor.close()
        conn.close()

def get_used_leaves(employee_id):
    conn, cursor = get_db_connection()
    try:
        
        current_year = str(datetime.now().year)
        sql = """
            SELECT leave_type, SUM(TIMESTAMPDIFF(HOUR, start_time, end_time)) AS used_hours
            FROM leave_info
            WHERE employee_id = %s
            AND YEAR(start_time) = %s
            AND status in (1, 2)
            GROUP BY leave_type
        """
        cursor.execute(sql, (employee_id, current_year))
        rows = cursor.fetchall()
        used = {name: 0 for name in TYPE_MAP}
        print("[DEBUG] get_used_leaves rows:", rows)  # ⭐ 加這行 debug

        for row in rows:
            leave_type_id = row['leave_type']
            hrs = row['used_hours']
            leave_type_name = REVERSE_TYPE_MAP.get(leave_type_id)
            if leave_type_name:
                used[leave_type_name] = float(hrs or 0)

        return {
            "employee_id": employee_id,
            "used_hours": used
        }

    finally:
        cursor.close()
        conn.close()


def get_leaves_by_employee(employee_id: str) -> list[dict]:
    """
    讀取該員工全部請假紀錄，並直接回傳符合 LeaveInfo schema 的 list[dict]：
    startDate/endDate 都保留 datetime 型別，讓 Pydantic 自動處理。
    """
    conn, cursor = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        sql = """
            SELECT
                li.leave_id, li.employee_id, e.name as employee_name, li.status,
                li.leave_type, li.start_time, li.end_time,
                li.reason, li.attachment_base64,
                a.name AS agent_name, r.name AS reviewer_name,
                li.comment, li.create_time, li.agent_id, li.reviewer_id
            FROM leave_info li
            LEFT JOIN employee_info a ON li.agent_id = a.employee_id
            LEFT JOIN employee_info r ON li.reviewer_id = r.employee_id
            LEFT JOIN employee_info e ON li.employee_id = e.employee_id
            WHERE li.employee_id = %s
        """
        cursor.execute(sql, (employee_id,))
        print(employee_id)
        rows = cursor.fetchall()  # list of dicts

        results: list[dict] = []
        for row in rows:
            results.append({
                "leaveId":              row["leave_id"],
                "employeeId":           row["employee_id"],
                "employeeName":         row["employee_name"],
                "status":               STATUS_MAP.get(row["status"], "pending"),
                "leaveType":            REVERSE_TYPE_MAP.get(row["leave_type"], ""),
                # 直接傳 datetime，Pydantic 會自動轉 ISO 格式字串
                "startDate":            row["start_time"],
                "endDate":              row["end_time"],
                "reason":               row["reason"],
                "attachedFileBase64":   row["attachment_base64"],
                "agentId":              row["agent_id"],
                "agentName":            row["agent_name"],
                "reviewerId":           row["reviewer_id"],
                "reviewerName":         row["reviewer_name"],
                "comment":              row["comment"],
                "createDate":           row["create_time"],
            })
        return results

    finally:
        cursor.close()
        conn.close()

def get_leave_by_leaveid(leave_id: str) -> dict:
    """
    讀取該 leave_id 的請假紀錄，並直接回傳符合 LeaveInfo schema 的 dict。
    """
    conn, cursor = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        sql = """
            SELECT
                li.leave_id, li.employee_id, e.name as employee_name, li.status,
                li.leave_type, li.start_time, li.end_time,
                li.reason, li.attachment_base64,
                a.name AS agent_name, r.name AS reviewer_name,
                li.comment, li.create_time, li.agent_id, li.reviewer_id
            FROM leave_info li
            LEFT JOIN employee_info a ON li.agent_id = a.employee_id
            LEFT JOIN employee_info r ON li.reviewer_id = r.employee_id
            LEFT JOIN employee_info e ON li.employee_id = e.employee_id
            WHERE li.leave_id = %s
        """
        cursor.execute(sql, (leave_id,))
        row = cursor.fetchone()  # dict

        if not row:
            return None

        return {
            "leaveId":              row["leave_id"],
            "employeeId":           row["employee_id"],
            "employeeName":         row["employee_name"],
            "status":               STATUS_MAP.get(row["status"], "pending"),
            "leaveType":            REVERSE_TYPE_MAP.get(row["leave_type"], ""),
            # 直接傳 datetime，Pydantic 會自動轉 ISO 格式字串
            "startDate":            row["start_time"],
            "endDate":              row["end_time"],
            "reason":               row["reason"],
            "attachedFileBase64":   row["attachment_base64"],
            "agentId":              row["agent_id"],
            "agentName":            row["agent_name"],
            "reviewerId":           row["reviewer_id"],
            "reviewerName":         row["reviewer_name"],
            "comment":              row["comment"],
            "createDate":           row["create_time"],
        }

    finally:
        cursor.close()
        conn.close()

def get_attendance_by_employee(employee_id: str) -> list[dict]:
    conn, cursor = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        sql = """
            SELECT
                li.leave_id, li.employee_id, li.status,
                li.leave_type, li.start_time, li.end_time,
                li.reason, li.attachment_base64,
                a.name AS agent_name, r.name AS reviewer_name,
                li.comment, li.create_time, li.agent_id, li.reviewer_id
            FROM leave_info li
            LEFT JOIN employee_info a ON li.agent_id = a.employee_id
            LEFT JOIN employee_info r ON li.reviewer_id = r.employee_id
            WHERE li.employee_id = %s
        """
        cursor.execute(sql, (employee_id,))
        print(employee_id)
        rows = cursor.fetchall()  # list of dicts

        results: list[dict] = []
        for row in rows:
            results.append({
                "leaveType":            REVERSE_TYPE_MAP.get(row["leave_type"], ""),
                "startDate":            row["start_time"],
                "endDate":              row["end_time"],
                "agentId":              row["agent_id"],
            })
        return results

    finally:
        cursor.close()
        conn.close()    

def create_leave_form(data):
    conn, cursor = get_db_connection()
    # 使用 dictionary=True 才能用 row["欄位名"] 取值
    cursor = conn.cursor(dictionary=True)
    try:
        # 1) 插入
        lid = uuid.uuid4().hex
        lt = TYPE_MAP[data['leaveType']]
        st = datetime.strptime(data['startDate'], "%Y-%m-%d-%H-%M")
        et = datetime.strptime(data['endDate'], "%Y-%m-%d-%H-%M")
        ct = datetime.strptime(data['createDate'], "%Y-%m-%d-%H-%M")
        sql_insert = """
            INSERT INTO leave_info
                (leave_id, employee_id, status, start_time, end_time, create_time,
                 leave_type, reason, attachment_base64, agent_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            lid, data['employeeId'], 0, st, et, ct,
            lt, data.get('reason'), data.get("attachmentBase64"), data.get('agentId')
        )
        cursor.execute(sql_insert, params)
        conn.commit()

        # 2) 讀回剛剛那一筆
        sql_select = """
            SELECT
                li.leave_id, li.employee_id, li.status,
                ei.name AS employeeName,
                li.leave_type, li.start_time, li.end_time,
                li.reason, li.attachment_base64,
                li.agent_id, li.reviewer_id, li.comment, li.create_time
            FROM leave_info li
            JOIN employee_info ei ON li.employee_id = ei.employee_id
            WHERE li.leave_id = %s
        """
        cursor.execute(sql_select, (lid,))
        row = cursor.fetchone()
        if not row:
            raise RuntimeError(f"Inserted leave {lid} not found")

        # 3) 組成 dict 回傳
        return {
            "leaveId":            row["leave_id"],
            "employeeId":         row["employee_id"],
            "employeeName":       row["employeeName"],
            "status":             STATUS_MAP.get(row["status"], "pending"),
            "leaveType":          REVERSE_TYPE_MAP.get(row["leave_type"], ""),
            "startDate":          row["start_time"],
            "endDate":            row["end_time"],
            "reason":             row["reason"],
            "attachedFileBase64": row["attachment_base64"],
            "agentId":            row["agent_id"],
            "reviewerId":         row["reviewer_id"],
            "comment":            row["comment"],
            "createDate":         row["create_time"],
        }

    except Exception as e:
        conn.rollback()
        logger.error(f"create_leave_form error: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def update_leave_form(leave_id, data):
    conn, cursor = get_db_connection()
    try:
        # 只有 pending 狀態才能編輯
        cursor.execute(
            "SELECT status FROM leave_info WHERE leave_id = %s", (leave_id,)
        )
        row = cursor.fetchone()
        if not row:
            return False
        status = row['status']
        if status != 0:
            raise ValueError("Only pending leave can be updated")
        lt = TYPE_MAP[data['leaveType']]
        new_st = datetime.strptime(data['startDate'], "%Y-%m-%d-%H-%M")
        new_et = datetime.strptime(data['endDate'], "%Y-%m-%d-%H-%M")
        print("new_st:", data["attachmentBase64"])
        sql = (
            "UPDATE leave_info SET leave_type = %s, start_time = %s, end_time = %s, "
            "reason = %s, attachment_base64 = %s, agent_id = %s WHERE leave_id = %s"
        )
        params = (
            lt, new_st, new_et, data['reason'], data["attachmentBase64"], data['agentId'], leave_id
        )
        rows = cursor.execute(sql, params)
        conn.commit()
        return True
    except:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def review_leave_form(leave_id, data):
    conn, cursor = get_db_connection()
    try:
        # 只有 pending 狀態才能編輯
        cursor.execute(
            "SELECT status, employee_id FROM leave_info WHERE leave_id = %s", (leave_id,)
        )
        row = cursor.fetchone()
        if not row:
            return False
        status = row['status']
        employee_id = row['employee_id']
        if status != 0:
            raise ValueError("Only pending leave can be reviewed")
        sql = (
            "UPDATE leave_info SET status = %s, reviewer_id = %s, comment = %s "
            "WHERE leave_id = %s"
        )
        params = (
            REVERSE_STATUS_MAP[data['status']], data['reviewerId'], data['comment'], leave_id
        )
        rows = cursor.execute(sql, params)
        conn.commit()
        return {status: True, "leave_id": leave_id, "employee_id": employee_id}
    except:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def delete_leave_form(leave_id):
    conn, cursor = get_db_connection()
    try:
        cursor.execute(
            "SELECT status, start_time, reviewer_id, employee_id FROM leave_info WHERE leave_id = %s", (leave_id,)
        )
        row = cursor.fetchone()
        if not row:
            return False
        status = row['status']
        st = row['start_time']
        reviewer_id = row['reviewer_id']
        employee_id = row['employee_id']
        now = datetime.now()
        # Pending 或 審核後開始時間前 均可刪除 (st 不用 [0] 我直接改了)
        if status != 0 and now >= st:
            raise ValueError("Cannot delete leave after start time")
        row = cursor.execute(
            "DELETE FROM leave_info WHERE leave_id = %s", (leave_id,)
        )
        conn.commit()
        return True, reviewer_id, employee_id
    except:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def get_leaves_by_employee_ids(employee_ids: List[str]) -> list[dict]:
    """
    讀取多個員工 ID 的全部請假紀錄，並回傳符合 LeaveInfo schema 的 list[dict]。
    """
    if not employee_ids: # 如果 ID 列表為空，直接返回空列表，避免無效查詢
        logger.info("傳入的 employee_ids 列表為空，無需查詢假單。")
        return []

    conn, cursor = get_db_connection()
    # 確保使用字典游標以方便按欄位名稱取值
    cursor = conn.cursor(dictionary=True)
    results: list[dict] = []
    try:
        # 使用 %s 產生對應數量的佔位符
        placeholders = ', '.join(['%s'] * len(employee_ids))
        sql = f"""
            SELECT
                li.leave_id, li.employee_id, e.name as employee_name, li.status,
                li.leave_type, li.start_time, li.end_time,
                li.reason, li.attachment_base64,
                a.name AS agent_name,       -- 獲取代理人姓名
                r.name AS reviewer_name,    -- 獲取審核人姓名
                li.comment, li.create_time, li.agent_id, li.reviewer_id
            FROM leave_info li
            LEFT JOIN employee_info a ON li.agent_id = a.employee_id       -- JOIN 代理人
            LEFT JOIN employee_info r ON li.reviewer_id = r.employee_id    -- JOIN 審核人
            LEFT JOIN employee_info e ON li.employee_id = e.employee_id    -- JOIN 員工
            WHERE li.employee_id IN ({placeholders})
            ORDER BY li.employee_id, li.start_time DESC -- 可選：按員工和開始時間排序
        """
        # 將 employee_ids 列表轉換為元組傳遞給 execute
        cursor.execute(sql, tuple(employee_ids))
        rows = cursor.fetchall() # list of dicts

        for row in rows:
            # 轉換為前端期望的格式 (與 get_leaves_by_employee 邏輯保持一致)
            results.append({
                "leaveId":              row["leave_id"],
                "employeeId":           row["employee_id"],
                "employeeName":         row["employee_name"],
                "status":               STATUS_MAP.get(row["status"], "pending"), # 使用映射轉換狀態
                "leaveType":            REVERSE_TYPE_MAP.get(row["leave_type"], ""), # 使用映射轉換類型
                "startDate":            row["start_time"], # 直接傳遞 datetime 物件
                "endDate":              row["end_time"],   # 直接傳遞 datetime 物件
                "reason":               row["reason"],
                "attachedFileBase64":   row["attachment_base64"],
                "agentId":              row["agent_id"],
                "agentName":            row.get("agent_name"), # 使用 .get 以防 agent_id 為 NULL
                "reviewerId":           row["reviewer_id"],
                "reviewerName":         row.get("reviewer_name"), # 使用 .get 以防 reviewer_id 為 NULL
                "comment":              row["comment"],
                "createDate":           row["create_time"], # 直接傳遞 datetime 物件
            })
        logger.info(f"成功查詢員工 {employee_ids} 的 {len(results)} 筆假單記錄。")
        return results

    except Exception as e:
        logger.error(f"查詢員工列表 {employee_ids} 的假單時發生錯誤: {e}")
        # 根據需要決定是拋出異常還是返回空列表
        # raise e
        return [] # 發生錯誤時返回空列表可能更安全
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()