import { useState } from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import type { Props } from "@/models/leave";

import { DetailCard } from "./detailCard";
import { EditCard } from "./editCard";

const statusColor: Record<LeaveStatus, string> = {
  [LeaveStatus.Pending]: "font-semibold text-black",
  [LeaveStatus.Approved]: "font-semibold text-blue",
  [LeaveStatus.Rejected]: "font-semibold text-pink",
};

const statusLabel: Record<LeaveStatus, string> = {
  [LeaveStatus.Pending]: "審核中",
  [LeaveStatus.Approved]: "已核准",
  [LeaveStatus.Rejected]: "已退回",
};

export function LeaveRecordTable({ records, onSearch }: Props) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState<string>("");
  const [status, setStatus] = useState<LeaveStatus | "">("");

  const handleSearch = () => {
    onSearch({
      startDate: startDate?.toISOString().split("T")[0],
      endDate: endDate?.toISOString().split("T")[0],
      type: leaveType || undefined,
      status: status || undefined,
    });
  };
  return (
    <div className="max-h-[300px] space-y-4 rounded-md bg-white p-6 shadow-element">
      <h2 className="mb-[-10px] text-lg font-bold text-darkBlue">
        請假記錄查詢
      </h2>
      <div className="flex items-center gap-2">
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
              <SelectItem value={LeaveStatus.Pending}>審核中</SelectItem>
              <SelectItem value={LeaveStatus.Approved}>已核准</SelectItem>
              <SelectItem value={LeaveStatus.Rejected}>已退回</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSearch}
          className="mt-7 h-[30px] w-[50px] bg-blue text-white hover:bg-blue/90"
        >
          查詢
        </Button>
      </div>

      <div className="max-h-[150px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>假別</TableHead>
              <TableHead>開始</TableHead>
              <TableHead>結束</TableHead>
              <TableHead>代理人</TableHead>
              <TableHead>原因</TableHead>
              <TableHead>附件</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>動作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.start}</TableCell>
                <TableCell>{record.end}</TableCell>
                <TableCell>{record.agent}</TableCell>
                <TableCell>{record.reason}</TableCell>
                <TableCell>{record.attachment || "--"}</TableCell>
                <TableCell className={statusColor[record.status]}>
                  {statusLabel[record.status]}
                </TableCell>
                <TableCell>
                  {statusLabel[record.status] === "審核中" ? (
                    <EditCard />
                  ) : (
                    <DetailCard />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export * from "./leaveRecordTable";
