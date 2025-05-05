import { LeaveRecordTable } from "@/components/leaveRecordTable";
import { TableType } from "@/models/enum/tableType";

function ApprovalPage() {
  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue"> 待審核假單 </h1>
      <LeaveRecordTable type={TableType.approval} />
    </main>
  );
}

export default ApprovalPage;
