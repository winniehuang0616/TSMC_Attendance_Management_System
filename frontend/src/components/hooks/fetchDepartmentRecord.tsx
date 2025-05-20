import { useEffect, useState } from "react";

import axios from "axios";

import type { RawLeaveRecord } from "./fetchLeaveRecord";
import { API_BASE_URL } from "@/config/api";
export function useDepartmentRecords(userId: string | null) {
  const [records, setRecords] = useState([]);

  const fetchDepartmentRecords = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/leaves/manager/${userId}/department-leaves`,
      );

      // 格式轉換
      const formatted = response.data.map((r: RawLeaveRecord) => ({
        id: r.leaveId,
        employeeId: r.employeeId,
        name: r.employeeName,
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
    fetchDepartmentRecords();
  }, [userId]);

  return { records, fetchDepartmentRecords };
}
