import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { LeaveRecordTable } from "@/components/leaveRecordTable";
import type { LeaveCard } from "@/models/card";
import { LeaveStatus } from "@/models/enum/leaveStatus";
import { TableType } from "@/models/enum/tableType";
import type { Filter, LeaveRecord } from "@/models/leave";

// 透過 api 取得使用者各種假期的使用情況，計算剩餘時間
const leaveData: LeaveCard[] = [
  { type: "病假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "事假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "公假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "特休", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
];

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
    description: "放心去處理吧",
    status: LeaveStatus.Approved,
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
    description: "活動已取消",
    status: LeaveStatus.Rejected,
  },
];

function PersonalPage() {
  const handleSearch = (filter: Filter) => {
    // 根據篩選條件做篩選
    console.log("搜尋條件", filter);
  };

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
      <LeaveRecordTable
        records={records}
        onSearch={handleSearch}
        type={TableType.personal}
      />
    </main>
  );
}

export default PersonalPage;
