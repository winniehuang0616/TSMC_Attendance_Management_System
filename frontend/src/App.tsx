import { LeaveRecordTable } from "@/components/leaveRecordTable";
import { Toaster } from "@/components/ui/toaster";
import { LeaveStatus } from "@/models/enum/leaveStatus";
import type { Filter, LeaveRecord } from "@/models/leave";

const records: LeaveRecord[] = [
  {
    id: "1",
    type: "病假",
    start: "2025-04-01",
    end: "2025-04-02",
    agent: "110-小明",
    reason: "感冒ㄚㄚㄚㄚㄚㄚ ㄚㄚㄚㄚㄚㄚ ",
    attachment: "病假單.pdf",
    status: LeaveStatus.Pending,
  },
  {
    id: "2",
    type: "事假",
    start: "2025-04-10",
    end: "2025-04-10",
    agent: "111-小美",
    reason: "家中有事",
    attachment: "",
    status: LeaveStatus.Approved,
  },
  {
    id: "3",
    type: "公假",
    start: "2025-04-10",
    end: "2025-04-10",
    agent: "112-小王",
    reason: "心情不好",
    attachment: "",
    status: LeaveStatus.Rejected,
  },
];

function App() {
  const handleSearch = (filter: Filter) => {
    console.log("搜尋條件", filter);
  };
  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="fixed left-0 right-0 z-10 h-[11%] bg-white shadow-header" />
        <div className="flex flex-1">
          <div className="w-[18%] bg-white shadow-sidebar" />
          <div className="flex flex-1 overflow-hidden bg-background pb-12 pl-20 pt-32">
            <LeaveRecordTable records={records} onSearch={handleSearch} />
            <Toaster />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
