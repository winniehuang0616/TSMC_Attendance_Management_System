import { useState } from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { useApprovalRecords } from "@/components/hooks/fetchApprovalRecords";
import { useDepartmentRecords } from "@/components/hooks/fetchDepartmentRecord";
import { useLeaveRecords } from "@/components/hooks/fetchLeaveRecord";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaveStatus } from "@/models/enum/leaveStatus";
import { TableType } from "@/models/enum/tableType";
import type { Props } from "@/models/leave";
import type { LeaveRecord } from "@/models/leave";

import { DetailCard } from "./detailCard";
import { EditCard } from "./editCard";

const statusColor: Record<string, string> = {
  pending: "font-semibold text-blue",
  approved: "font-semibold text-black",
  rejected: "font-semibold text-pink",
};

const statusLabel: Record<string, string> = {
  pending: "審核中",
  approved: "已核准",
  rejected: "已退回",
};

const leaveTypeLabel: Record<string, string> = {
  annual: "特休",
  sick: "病假",
  personal: "事假",
  official: "公假",
};

export function LeaveRecordTable({ type, employeeData }: Props) {
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState<string>("");
  const [status, setStatus] = useState<LeaveStatus | "">("");
  const [filteredRecords, setFilteredRecords] = useState<LeaveRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // HERE ! 取得請假紀錄 ( 要根據 TableType 打不同的 api )
  const userId = sessionStorage.getItem("userId");

  const { records, fetchLeaveRecords: refetchNormalRecords } =
    useLeaveRecords(userId);

  const { records: approvalRecords, fetchApprovalRecords } =
    useApprovalRecords(userId);

  const { records: departmentRecords, fetchDepartmentRecords } =
    useDepartmentRecords(userId);

  const isApproval = type === TableType.approval;
  const isManager = type === TableType.manager;
  const currentRecords = isApproval
    ? approvalRecords
    : isManager
      ? departmentRecords
      : records;
  const refetch = isApproval
    ? fetchApprovalRecords
    : isManager
      ? fetchDepartmentRecords
      : refetchNormalRecords;

  const handleSearch = () => {
    const filtered = currentRecords.filter((record) => {
      const isNameMatch = !name || record.employeeId === name;
      const isStartDateMatch = !startDate || record.startDate >= startDate;
      const isEndDateMatch = !endDate || record.endDate <= endDate;
      const isTypeMatch =
        !leaveType || leaveTypeLabel[record.type] === leaveType;
      const isStatusMatch = !status || record.status === status;

      return (
        isNameMatch &&
        isStartDateMatch &&
        isEndDateMatch &&
        isTypeMatch &&
        isStatusMatch
      );
    });

    setFilteredRecords(filtered);
    setHasSearched(true);
  };

  const handleClear = () => {
    setName("");
    setStartDate(undefined);
    setEndDate(undefined);
    setLeaveType("");
    setStatus("");
    setFilteredRecords([]);
    setHasSearched(false);
  };

  return (
    <div
      className={`${type == TableType.approval ? "max-h-[500px]" : "max-h-[320px]"} space-y-4 rounded-md bg-white p-6 shadow-element`}
    >
      <h2 className="mb-[-10px] text-lg font-bold text-darkBlue">
        {type == TableType.approval ? "待審核清單" : "請假記錄查詢"}
      </h2>
      {type != TableType.approval && (
        <div className="flex items-center gap-2">
          {type == TableType.manager && (
            <div className="flex flex-col">
              <p className="ml-2 font-medium">員工</p>
              <Select onValueChange={setName} value={name}>
                <SelectTrigger className="w-[115px] px-3 font-light">
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
          )}

          <div className="flex flex-col">
            <p className="ml-2 font-medium">開始時間</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[124px] justify-start gap-2 px-3 font-light"
                >
                  {startDate && format(startDate, "yyyy-MM-dd")}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col">
            <p className="ml-2 font-medium">結束時間</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[124px] justify-start gap-2 px-3 font-light"
                >
                  {endDate && format(endDate, "yyyy-MM-dd")}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col">
            <p className="ml-2 font-medium">假別</p>
            <Select onValueChange={setLeaveType} value={leaveType}>
              <SelectTrigger className="w-[75px] px-3 font-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="病假">病假</SelectItem>
                <SelectItem value="事假">事假</SelectItem>
                <SelectItem value="特休">特休</SelectItem>
                <SelectItem value="公假">公假</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <p className="ml-2 font-medium">狀態</p>
            <Select
              onValueChange={(value) => setStatus(value as LeaveStatus)}
              value={status}
            >
              <SelectTrigger className="w-[87px] px-3 font-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LeaveStatus.pending}>審核中</SelectItem>
                <SelectItem value={LeaveStatus.approved}>已核准</SelectItem>
                <SelectItem value={LeaveStatus.rejected}>已退回</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSearch}
            className="mt-7 h-[30px] w-[50px] bg-blue text-white hover:bg-blue/90"
          >
            查詢
          </Button>
          <Button
            onClick={handleClear}
            className="mt-7 h-[30px] w-[50px] bg-slate-300 text-black hover:bg-slate-300/90"
          >
            清除
          </Button>
        </div>
      )}

      <div
        className={`${type == TableType.approval ? "max-h-[250px]" : "max-h-[160px]"} overflow-auto`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {type == TableType.approval && <TableHead>姓名</TableHead>}
              <TableHead>假別</TableHead>
              <TableHead>開始</TableHead>
              <TableHead>結束</TableHead>
              <TableHead>代理人</TableHead>
              <TableHead>原因</TableHead>
              <TableHead>附件</TableHead>
              <TableHead>狀態</TableHead>
              {type != TableType.manager && <TableHead>動作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasSearched && filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={type !== TableType.manager ? 9 : 8}
                  className="text-gray-500 text-center"
                >
                  查無符合條件的請假紀錄
                </TableCell>
              </TableRow>
            ) : (
              (hasSearched ? filteredRecords : currentRecords).map((record) => (
                <TableRow
                  key={record.id}
                  className={`${type != TableType.personal && "h-[40px]"}`}
                >
                  {type == TableType.approval && (
                    <TableCell>{record.name}</TableCell>
                  )}
                  <TableCell>{leaveTypeLabel[record.type]}</TableCell>
                  <TableCell>
                    {format(record.startDate, "yyyy/MM/dd")}
                  </TableCell>
                  <TableCell>{format(record.endDate, "yyyy/MM/dd")}</TableCell>
                  <TableCell>{record.agent}</TableCell>
                  <TableCell>{record.reason}</TableCell>
                  <TableCell>{record.attachment || "--"}</TableCell>
                  <TableCell className={statusColor[record.status]}>
                    {statusLabel[record.status]}
                  </TableCell>

                  {type != TableType.manager && (
                    <TableCell>
                      {statusLabel[record.status] === "審核中" &&
                      type == TableType.personal ? (
                        <EditCard detailData={record} onDeleted={refetch} />
                      ) : (
                        // HERE ! 根據 TableType 傳入不同資料和 refetch function
                        <DetailCard detailData={record} onDeleted={refetch} />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export * from "./leaveRecordTable";
