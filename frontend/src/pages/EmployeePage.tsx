import { useEffect, useState } from "react";

import { LeaveBalanceCard } from "@/components/leaveBalanceCard";
import { LeaveRecordTable } from "@/components/leaveRecordTable";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/authContext";
import type { LeaveCard } from "@/models/card";
import type { EmployeeApiData } from "@/models/employeeApi";
import { TableType } from "@/models/enum/tableType";

function EmployeePage() {
  const { userId } = useAuth();
  const [employeeData, setEmployeeData] = useState<EmployeeApiData[]>([]);
  const [name, setName] = useState<string>("");
  const [leaveCards, setLeaveCards] = useState<LeaveCard[]>([]);

  // 取得 API 資料
  useEffect(() => {
    fetch(`http://localhost:8000/api/user/department/employeesInfo/${userId}`)
      .then((res) => res.json())
      .then((data: EmployeeApiData[]) => {
        setEmployeeData(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    if (!name) return;

    fetch(`http://localhost:8000/api/leaves/${name}/leaveCount`)
      .then((res) => res.json())
      .then((data) => {
        const used = data.usedLeaves.used_hours;
        const total = data.allocatedLeaves.allocated_hours;

        const cards: LeaveCard[] = [
          {
            type: "特休",
            used: used.annual,
            total: total.annual,
            remainingText: `剩餘 ${(total.annual - used.annual) / 8} 天`,
          },
          {
            type: "病假",
            used: used.sick,
            total: total.sick,
            remainingText: `剩餘 ${(total.sick - used.sick) / 8} 天`,
          },
          {
            type: "事假",
            used: used.personal,
            total: total.personal,
            remainingText: `剩餘 ${(total.personal - used.personal) / 8} 天`,
          },
          {
            type: "公假",
            used: used.official,
            total: total.official,
            remainingText: `剩餘 ${(total.official - used.official) / 8} 天`,
          },
        ];
        setLeaveCards(cards);
      })
      .catch((err) => console.error("Leave count error:", err));
  }, [name]);

  const selectedEmployee = employeeData.find((e) => e.userId === name);

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
              <SelectValue placeholder="選擇員工" />
            </SelectTrigger>
            <SelectContent>
              {employeeData.map((person) => (
                <SelectItem key={person.userId} value={person.userId}>
                  {person.userId}
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

      {selectedEmployee && (
        <div className="flex gap-4">
          {leaveCards.map((leave, idx) => (
            <LeaveBalanceCard key={idx} {...leave} />
          ))}
        </div>
      )}

      <h1 className="mb-1 mt-14 text-[1.35rem] font-bold text-blue">
        {" "}
        請假記錄查詢{" "}
      </h1>
      <LeaveRecordTable
        type={TableType.manager}
        employeeData={employeeData.map((e) => ({
          id: parseInt(e.userId.replace(/\D/g, ""), 10), // Convert userId to a numeric id
          name: e.name,
        }))}
      />
    </div>
  );
}

export default EmployeePage;
