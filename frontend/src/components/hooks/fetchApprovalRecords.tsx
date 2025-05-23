import { useEffect, useState } from "react";

import axios from "axios";

import type { RawLeaveRecord } from "./fetchLeaveRecord";

export function useApprovalRecords(userId: string | null) {
  const [records, setRecords] = useState([]);

  const fetchApprovalRecords = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/api/leaves/manager/${userId}/department-leaves`,
      );
      const pendingRecords = response.data.filter(
        (r: { status: string }) => r.status === "pending",
      );
      // 格式轉換
      const formatted = pendingRecords.map((r: RawLeaveRecord) => ({
        id: r.leaveId,
        employeeId: r.employeeId,
        name: r.employeeName, // TODO: 需要從其他地方獲取員工姓名
        type: r.leaveType,
        startDate: new Date(r.startDate),
        endDate: new Date(r.endDate),
        agent: r.agentId,
        reason: r.reason,
        attachment: r.attachedFileBase64,
        status: r.status,
      }));
      setRecords(formatted);
    } catch (error) {
      console.error("Failed to fetch approval records:", error);
    }
  };

  useEffect(() => {
    fetchApprovalRecords();
  }, [userId]);

  return { records, fetchApprovalRecords };
}
