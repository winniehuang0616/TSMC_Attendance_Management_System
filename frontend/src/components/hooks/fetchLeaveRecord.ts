import { useState, useEffect } from "react";

import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { API_ENDPOINTS } from "@/config/api";
import type { LeaveStatus } from "@/models/enum/leaveStatus";
import type { LeaveRecord } from "@/models/leave";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface RawLeaveRecord {
  leaveId: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  agentId: string;
  agentName: string;
  reason?: string;
  attachedFileBase64?: string;
  comment?: string;
  status: LeaveStatus;
}

export const useLeaveRecords = (employeeId: string | null) => {
  const [records, setRecords] = useState<LeaveRecord[]>([]);

  const fetchLeaveRecords = () => {
    if (!employeeId) return;

    axios
      .get(API_ENDPOINTS.LEAVES(employeeId))
      .then((res) => {
        const data = res.data.map(
          (item: RawLeaveRecord): LeaveRecord => ({
            id: item.leaveId,
            employeeId: item.employeeId,
            name: item.employeeName,
            type: item.leaveType,
            startDate: new Date(item.startDate),
            startTime: dayjs.utc(item.startDate).tz("Asia/Taipei").hour(),
            endDate: new Date(item.endDate),
            endTime: dayjs.utc(item.endDate).tz("Asia/Taipei").hour(),
            agentId: item.agentId,
            agentName: item.agentName,
            reason: item.reason ?? "",
            attachment: item.attachedFileBase64
              ? `data:image/jpeg;base64,${item.attachedFileBase64}`
              : undefined,
            description: item.comment ?? "",
            status: item.status,
          }),
        );
        // 從開始時間新到舊排序
        data.sort(
          (a: LeaveRecord, b: LeaveRecord) =>
            b.startDate.getTime() - a.startDate.getTime(),
        );
        setRecords(data);
      })
      .catch((err) => {
        console.error("取得請假紀錄失敗：", err);
      });
  };

  useEffect(() => {
    fetchLeaveRecords();
  }, [employeeId]);

  return { records, fetchLeaveRecords };
};
