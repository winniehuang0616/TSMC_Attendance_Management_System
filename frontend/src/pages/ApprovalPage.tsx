import { LeaveRecordTable } from "@/components/leaveRecordTable";
import { LeaveStatus } from "@/models/enum/leaveStatus";
import { TableType } from "@/models/enum/tableType";
import type { LeaveRecord } from "@/models/leave";

// 透過 api 取得使用者的請假紀錄
const records: LeaveRecord[] = [
  {
    id: "1",
    name: "王大明",
    type: "病假",
    startDate: new Date("2025-04-01"),
    startTime: 9,
    endDate: new Date("2025-04-02"),
    endTime: 17,
    agent: "112-陳美惠",
    reason: "感冒ㄚㄚㄚㄚㄚㄚ ㄚㄚㄚㄚㄚㄚ ",
    attachment: "病假單.pdf",
    status: LeaveStatus.Pending,
  },
  {
    id: "2",
    name: "王中明",
    type: "事假",
    startDate: new Date("2025-04-10"),
    startTime: 9,
    endDate: new Date("2025-04-11"),
    endTime: 17,
    agent: "111-王小明",
    reason: "家中有事",
    attachment: "",
    status: LeaveStatus.Pending,
  },
  {
    id: "3",
    name: "林小明",
    type: "公假",
    startDate: new Date("2025-04-20"),
    startTime: 9,
    endDate: new Date("2025-04-21"),
    endTime: 17,
    agent: "113-黃玲玲",
    reason: "心情不好",
    attachment: "",
    status: LeaveStatus.Pending,
  },
  {
    id: "4",
    name: "林小明",
    type: "公假",
    startDate: new Date("2025-04-20"),
    startTime: 9,
    endDate: new Date("2025-04-21"),
    endTime: 17,
    agent: "113-黃玲玲",
    reason: "心情不好",
    attachment: "",
    status: LeaveStatus.Pending,
  },
  {
    id: "5",
    name: "林小明",
    type: "公假",
    startDate: new Date("2025-04-20"),
    startTime: 9,
    endDate: new Date("2025-04-21"),
    endTime: 17,
    agent: "113-黃玲玲",
    reason: "心情不好",
    attachment: "",
    status: LeaveStatus.Pending,
  },
  {
    id: "6",
    name: "林小明",
    type: "公假",
    startDate: new Date("2025-04-20"),
    startTime: 9,
    endDate: new Date("2025-04-21"),
    endTime: 17,
    agent: "113-黃玲玲",
    reason: "心情不好",
    attachment: "",
    status: LeaveStatus.Pending,
  },
];

function ApprovalPage() {
  return (
    <main>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue"> 待審核假單 </h1>
      <LeaveRecordTable records={records} type={TableType.approval} />
    </main>
  );
}

export default ApprovalPage;
