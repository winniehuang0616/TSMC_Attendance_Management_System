export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * API 端點定義
 * 集中管理所有 API 路徑，避免在代碼中硬編碼 URL
 */
export const API_ENDPOINTS = {
  // 認證相關
  LOGIN: `${API_BASE_URL}/api/login`,

  // 用戶相關
  USER_INFO: (userId: string) => `${API_BASE_URL}/api/user/userinfo/${userId}`,
  USER_AGENT: (userId: string | null) =>
    userId
      ? `${API_BASE_URL}/api/user/agent/${userId}`
      : `${API_BASE_URL}/api/user/agent`,
  DEPARTMENT_EMPLOYEES: (userId: string | null) =>
    userId
      ? `${API_BASE_URL}/api/user/department/employeesInfo/${userId}`
      : `${API_BASE_URL}/api/user/department/employeesInfo`,

  // 請假相關
  LEAVES: (userId: string | null) =>
    userId
      ? `${API_BASE_URL}/api/leaves/${userId}`
      : `${API_BASE_URL}/api/leaves`,
  LEAVE_DETAIL: (leaveId: string) => `${API_BASE_URL}/api/leaves/${leaveId}`,
  LEAVES_COUNT: (userId: string | null) =>
    userId
      ? `${API_BASE_URL}/api/leaves/${userId}/leaveCount`
      : `${API_BASE_URL}/api/leaves/leaveCount`,
  DEPARTMENT_LEAVES: (managerId: string) =>
    `${API_BASE_URL}/api/leaves/manager/${managerId}/department-leaves`,
  LEAVE_REVIEW: (leaveId: string) =>
    `${API_BASE_URL}/api/leaves/${leaveId}/review`,

  // 通知相關
  NOTIFICATIONS: (userId: string) =>
    `${API_BASE_URL}/api/notifications/${userId}`,
  MARK_NOTIFICATION_READ: (notificationId: string) =>
    `${API_BASE_URL}/api/notifications/${notificationId}/read`,
};
