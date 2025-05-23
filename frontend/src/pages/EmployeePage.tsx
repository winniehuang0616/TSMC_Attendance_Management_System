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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatRemainingTime = (remainingHours: number) => {
    if (remainingHours < 0) remainingHours = 0;
    const days = Math.floor(remainingHours / 24);
    const hours = remainingHours % 24;
    return `剩餘 ${days} 天 ${hours} 小時`;
  };

  // 取得 API 資料
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8000/api/user/department/employeesInfo/${userId}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // 確保 data 是陣列
        setEmployeeData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("無法載入員工資料");
        setEmployeeData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchEmployeeData();
    }
  }, [userId]);

  useEffect(() => {
    if (!name) return;

    const fetchLeaveCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/leaves/${name}/leaveCount`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const used = data.usedLeaves.used_hours;
        const total = data.allocatedLeaves.allocated_hours;

        const cards: LeaveCard[] = [
          {
            type: "特休",
            used: used.annual,
            total: total.annual,
            remainingText: formatRemainingTime(total.annual - used.annual),
          },
          {
            type: "病假",
            used: used.sick,
            total: total.sick,
            remainingText: formatRemainingTime(total.sick - used.sick),
          },
          {
            type: "事假",
            used: used.personal,
            total: total.personal,
            remainingText: formatRemainingTime(total.personal - used.personal),
          },
          {
            type: "公假",
            used: used.official,
            total: total.official,
            remainingText: formatRemainingTime(total.official - used.official),
          },
        ];
        setLeaveCards(cards);
      } catch (err) {
        console.error("Leave count error:", err);
        setLeaveCards([]);
      }
    };

    fetchLeaveCount();
  }, [name]);

  const selectedEmployee = Array.isArray(employeeData)
    ? employeeData.find((e) => e.userId === name)
    : null;

  if (isLoading) {
    return <div className="p-4">載入中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

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
          id: parseInt(e.userId.replace(/\D/g, ""), 10),
          name: e.userId,
        }))}
      />
    </div>
  );
}

export default EmployeePage;
