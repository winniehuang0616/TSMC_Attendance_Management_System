import { ApplyForm } from "../components/applyForm";

import { useLeaveSummary } from "@/components/hooks/fetchCard";
import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { useAuth } from "@/context/authContext";

function ApplyPage() {
  const { userId } = useAuth();
  const { leaveData, fetchLeaveSummary } = useLeaveSummary(userId);

  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue">請假申請表單</h1>
      <main className="flex items-start gap-4">
        <ApplyForm onSuccess={fetchLeaveSummary} />
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
