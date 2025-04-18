import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Props } from "@/models/leave"
import { LeaveStatus } from "@/models/enum/leaveStatus"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useState } from "react"

const statusColor: Record<LeaveStatus, string> = {
    [LeaveStatus.Pending]: "bg-yellow-100 text-yellow-800",
    [LeaveStatus.Approved]: "bg-green-100 text-green-800",
    [LeaveStatus.Rejected]: "bg-red-100 text-red-800",
}

const statusLabel: Record<LeaveStatus, string> = {
    [LeaveStatus.Pending]: "審核中",
    [LeaveStatus.Approved]: "已核准",
    [LeaveStatus.Rejected]: "已退回",
}

export function LeaveRecordTable({ records, onSearch }: Props) {
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [leaveType, setLeaveType] = useState<string>("")
    const [status, setStatus] = useState<LeaveStatus | "">("")

    const handleSearch = () => {
        onSearch({
        startDate: startDate?.toISOString().split("T")[0],
        endDate: endDate?.toISOString().split("T")[0],
        type: leaveType || undefined,
        status: status || undefined,
        })
    }
    return (
        <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                {startDate ? format(startDate, "yyyy-MM-dd") : "開始日期"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
            </PopoverContent>
            </Popover>

            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                {endDate ? format(endDate, "yyyy-MM-dd") : "結束日期"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
            </PopoverContent>
            </Popover>

            <Select onValueChange={setLeaveType} value={leaveType}>
            <SelectTrigger>
                <SelectValue placeholder="假別" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="病假">病假</SelectItem>
                <SelectItem value="事假">事假</SelectItem>
                <SelectItem value="特休">特休</SelectItem>
                <SelectItem value="公假">公假</SelectItem>
            </SelectContent>
            </Select>

            <Select onValueChange={value => setStatus(value as LeaveStatus)} value={status}>
            <SelectTrigger>
                <SelectValue placeholder="狀態" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={LeaveStatus.Pending}>審核中</SelectItem>
                <SelectItem value={LeaveStatus.Approved}>已核准</SelectItem>
                <SelectItem value={LeaveStatus.Rejected}>已退回</SelectItem>
            </SelectContent>
            </Select>

            <Button onClick={handleSearch}>查詢</Button>
            </div>
            
        <div className="h-min border rounded-xl overflow-hidden">
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
                <TableCell>
                <Badge className={statusColor[record.status]}>{statusLabel[record.status]}</Badge>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
        </div>
    )
}
export * from "./leaveRecordTable"