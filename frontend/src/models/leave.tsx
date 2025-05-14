import type { LeaveStatus } from "@/models/enum/leaveStatus";

import type { Agent } from "./detail";
import type { TableType } from "./enum/tableType";

export type LeaveRecord = {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
  agent: string;
  reason: string;
  attachment: string;
  description?: string;
  status: LeaveStatus;
};

export type Filter = {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: LeaveStatus;
};

export type Props = {
  type: TableType;
  employeeData?: Agent[];
};
