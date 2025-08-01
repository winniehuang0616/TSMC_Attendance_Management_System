import { useLeaveSummary } from "@/components/hooks/fetchCard";
import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { LeaveRecordTable } from "@/components/leaveRecordTable";
import { useAuth } from "@/context/authContext";
import { TableType } from "@/models/enum/tableType";

function PersonalPage() {
  const { userId } = useAuth();
  const { leaveData, fetchLeaveSummary } = useLeaveSummary(userId);

  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue">
        剩餘假期天數查詢{" "}
        <span className="ml-1 text-[0.9rem] font-semibold">
          <span className="text-blue">( 已使用</span>
          <span> </span>
          <span className="text-black">/ 總小時數 )</span>
        </span>
      </h1>
      <div className="flex gap-4">
        {leaveData.map((leave, idx) => (
          <LeaveBalanceCard key={idx} {...leave} />
        ))}
      </div>
      <h1 className="mb-1 mt-14 text-[1.35rem] font-bold text-blue">
        請假記錄查詢
      </h1>
      <LeaveRecordTable
        type={TableType.personal}
        onSubmit={fetchLeaveSummary}
      />
    </main>
  );
}

export default PersonalPage;