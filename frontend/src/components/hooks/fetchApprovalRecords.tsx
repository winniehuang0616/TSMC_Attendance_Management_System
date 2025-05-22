import { useEffect, useState } from "react";

import axios from "axios";

import { API_BASE_URL } from "@/config/api";

import type { RawLeaveRecord } from "./fetchLeaveRecord";

export function useApprovalRecords(userId: string | null) {
  const [records, setRecords] = useState([]);

  const fetchApprovalRecords = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/leaves/manager/${userId}/department-leaves`,
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
        agentId: r.agentId,
        agentName: r.agentName,
        reason: r.reason,
        attachment: r.attachedFileBase64
          ? `data:image/jpeg;base64,${r.attachedFileBase64}`
          : undefined,
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
