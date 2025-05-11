import { useState, useEffect } from "react";

import { ApplyForm } from "../components/applyForm";

import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { useAuth } from "@/context/authContext";
import type { LeaveCard } from "@/models/card";

function ApplyPage() {
  const { userId } = useAuth(); // 從 AuthContext 獲取 userId 作為 employeeId
  const [leaveData, setLeaveData] = useState<LeaveCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/api/leaves/${userId}/leaveCount`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leave data");
        }

        const data = await response.json();

        // 從 API 回應轉換為 LeaveCard 格式
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
        // 加載失敗時使用默認數據
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

  // 格式化剩餘時間為 "剩餘 X 天 Y 小時" 格式
  const formatRemainingTime = (remainingHours: number) => {
    if (remainingHours < 0) remainingHours = 0;

    const days = Math.floor(remainingHours / 24);
    const hours = remainingHours % 24;

    return `剩餘 ${days} 天 ${hours} 小時`;
  };

  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue">請假申請表單</h1>
      <main className="flex items-start gap-4">
        <ApplyForm />
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 text-center">載入中...</div>
          ) : (
            leaveData.map((leave, idx) => (
              <LeaveBalanceCard key={idx} {...leave} />
            ))
          )}
        </div>
      </main>
    </main>
  );
}

export default ApplyPage;
