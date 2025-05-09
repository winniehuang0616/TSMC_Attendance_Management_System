import { useState } from "react";

import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { LeaveRecordTable } from "@/components/leaveRecordTable";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { LeaveCard } from "@/models/card";
import type { Employee } from "@/models/detail";
import { TableType } from "@/models/enum/tableType";

// 透過 api 取得主管部門下的員工名單
const employeeData: Employee[] = [
  {
    id: 1,
    name: "111-王小明",
    phone: "0912345678",
    email: "winniebear1213@gmail.com",
  },
  {
    id: 2,
    name: "112-陳美惠",
    phone: "0900000000",
    email: "winniebear1213@gmail.com",
  },
  {
    id: 3,
    name: "113-黃玲玲",
    phone: "0987654321",
    email: "winniebear1213@gmail.com",
  },
];

// 透過 api 取得使用者各種假期的使用情況，計算剩餘時間
const leaveData: LeaveCard[] = [
  { type: "病假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "事假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "公假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "特休", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
];

function EmployeePage() {
  const [name, setName] = useState<string>("");
  const selectedEmployee = employeeData.find((person) => person.name === name);

  return (
    <div>
      <h1 className="mb-1 text-[1.35rem] font-bold text-blue">
        {" "}
        剩餘假期天數查詢{" "}
      </h1>
      <div className="flex gap-4 py-2">
        <div className="flex items-center gap-2 pl-2">
          <p className="font-medium">員工</p>
          <Select onValueChange={setName} value={name}>
            <SelectTrigger className="w-[115px] bg-transparent px-2 font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {employeeData?.map((person) => (
                <SelectItem key={person.id} value={person.name}>
                  {person.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedEmployee && (
          <>
            <div className="flex items-center gap-2">
              <p className="font-medium">手機</p>
              <p className="font-semibold">{selectedEmployee.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">信箱</p>
              <p className="font-semibold">{selectedEmployee.email}</p>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-4">
        {leaveData.map((leave, idx) => (
          <LeaveBalanceCard key={idx} {...leave} />
        ))}
      </div>
      <h1 className="mb-1 mt-14 text-[1.35rem] font-bold text-blue">
        {" "}
        請假記錄查詢{" "}
      </h1>
      <LeaveRecordTable type={TableType.manager} employeeData={employeeData} />
    </div>
  );
}

export default EmployeePage;
