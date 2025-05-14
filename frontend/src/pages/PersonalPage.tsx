import { useState, useEffect } from "react";

import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { LeaveRecordTable } from "@/components/leaveRecordTable";
import { useAuth } from "@/context/authContext";
import type { LeaveCard } from "@/models/card";
import { TableType } from "@/models/enum/tableType";
import { API_ENDPOINTS } from "@/config/api";
function PersonalPage() {
  const { userId } = useAuth();
  const [leaveData, setLeaveData] = useState<LeaveCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          API_ENDPOINTS.LEAVES_COUNT(userId),
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leave data");
        }

        const data = await response.json();

        const formattedData: LeaveCard[] = [
          {
            type: "特休",
            used: Number(data.usedLeaves.used_hours.annual.toFixed(1)),
            total: Number(
              data.allocatedLeaves.allocated_hours.annual.toFixed(1),
            ),
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

        setLeaveData(formattedData);
      } catch (error) {
        console.error("Error fetching leave data:", error);
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

    if (userId) {
      fetchLeaveData();
    }
  }, [userId]);

  const formatRemainingTime = (remainingHours: number) => {
    if (remainingHours < 0) remainingHours = 0;

    const days = Math.floor(remainingHours / 24);
    const hours = remainingHours % 24;

    return `剩餘 ${days} 天 ${hours} 小時`;
  };

  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue">
        剩餘假期天數查詢
      </h1>
      <div className="flex gap-4">
        {isLoading ? (
          <div>載入中...</div>
        ) : (
          leaveData.map((leave, idx) => (
            <LeaveBalanceCard key={idx} {...leave} />
          ))
        )}
      </div>
      <h1 className="mb-1 mt-14 text-[1.35rem] font-bold text-blue">
        請假記錄查詢
      </h1>
      <LeaveRecordTable type={TableType.personal} />
    </main>
  );
}

export default PersonalPage;
