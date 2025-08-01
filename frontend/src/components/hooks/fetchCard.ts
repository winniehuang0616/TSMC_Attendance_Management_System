// hook/useLeaveSummary.ts
import { useEffect, useState } from "react";

import { API_ENDPOINTS } from "@/config/api";

export interface LeaveCard {
  type: string;
  used: number;
  total: number;
  remainingText: string;
}

interface LeaveSummaryResponse {
  usedLeaves: {
    used_hours: {
      annual: number;
      sick: number;
      personal: number;
      official: number;
    };
  };
  allocatedLeaves: {
    allocated_hours: {
      annual: number;
      sick: number;
      personal: number;
      official: number;
    };
  };
}

export const useLeaveSummary = (userId: string | null) => {
  const [leaveData, setLeaveData] = useState<LeaveCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatRemainingTime = (remainingHours: number) => {
    if (remainingHours < 0) remainingHours = 0;

    const days = Math.floor(remainingHours / 8);
    const hours = remainingHours % 8;

    return `剩餘 ${days} 天 ${hours} 小時`;
  };

  const fetchLeaveSummary = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.LEAVES_COUNT(userId));
      if (!response.ok) throw new Error("Failed to fetch leave data");

      const data: LeaveSummaryResponse = await response.json();

      const summary: LeaveCard[] = [
        {
          type: "特休",
          used: Number(data.usedLeaves.used_hours.annual.toFixed(1)),
          total: Number(data.allocatedLeaves.allocated_hours.annual.toFixed(1)),
          remainingText: formatRemainingTime(
            data.allocatedLeaves.allocated_hours.annual -
              data.usedLeaves.used_hours.annual,
          ),
        },
        {
          type: "病假",
          used: Number(data.usedLeaves.used_hours.sick.toFixed(1)),
          total: Number(data.allocatedLeaves.allocated_hours.sick.toFixed(1)),
          remainingText: formatRemainingTime(
            data.allocatedLeaves.allocated_hours.sick -
              data.usedLeaves.used_hours.sick,
          ),
        },
        {
          type: "事假",
          used: Number(data.usedLeaves.used_hours.personal.toFixed(1)),
          total: Number(
            data.allocatedLeaves.allocated_hours.personal.toFixed(1),
          ),
          remainingText: formatRemainingTime(
            data.allocatedLeaves.allocated_hours.personal -
              data.usedLeaves.used_hours.personal,
          ),
        },
        {
          type: "公假",
          used: Number(data.usedLeaves.used_hours.official.toFixed(1)),
          total: Number(
            data.allocatedLeaves.allocated_hours.official.toFixed(1),
          ),
          remainingText: formatRemainingTime(
            data.allocatedLeaves.allocated_hours.official -
              data.usedLeaves.used_hours.official,
          ),
        },
      ];
      console.log(summary)
      setLeaveData(summary);
    } catch (error) {
      console.error("Error fetching leave summary:", error);
      setLeaveData([
        { type: "病假", used: 0, total: 0, remainingText: "資料載入失敗" },
        { type: "事假", used: 0, total: 0, remainingText: "資料載入失敗" },
        { type: "公假", used: 0, total: 0, remainingText: "資料載入失敗" },
        { type: "特休", used: 0, total: 0, remainingText: "資料載入失敗" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLeaveSummary();
    }
  }, [userId]);

  return { leaveData, isLoading, fetchLeaveSummary };
};