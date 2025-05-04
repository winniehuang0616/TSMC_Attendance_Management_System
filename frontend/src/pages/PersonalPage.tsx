import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { LeaveRecordTable } from "@/components/leaveRecordTable";
import type { LeaveCard } from "@/models/card";
import { TableType } from "@/models/enum/tableType";

// 透過 api 取得使用者各種假期的使用情況，計算剩餘時間
const leaveData: LeaveCard[] = [
  { type: "病假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "事假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "公假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "特休", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
];

function PersonalPage() {
  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue">
        {" "}
        剩餘假期天數查詢{" "}
      </h1>
      <div className="flex gap-4">
        {leaveData.map((leave, idx) => (
          <LeaveBalanceCard key={idx} {...leave} />
        ))}
      </div>
      <h1 className="mb-1 mt-14 text-[1.35rem] font-bold text-blue">
        {" "}
        請假記錄查詢{" "}
      </h1>
      <LeaveRecordTable type={TableType.personal} />
    </main>
  );
}

export default PersonalPage;
