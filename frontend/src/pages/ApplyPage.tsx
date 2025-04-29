import { ApplyForm } from "../components/applyForm";

import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import type { LeaveCard } from "@/models/card";

// 透過 api 取得使用者各種假期的使用情況，計算剩餘時間
const leaveData: LeaveCard[] = [
  { type: "病假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "事假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "公假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "特休", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
];

function ApplyPage() {
  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue">
        {" "}
        請假申請表單{" "}
      </h1>
      <main className="flex items-start gap-4">
        <ApplyForm />
        <div className="grid grid-cols-2 gap-4">
          {leaveData.map((leave, idx) => (
            <LeaveBalanceCard key={idx} {...leave} />
          ))}
        </div>
      </main>
    </main>
  );
}

export default ApplyPage;
