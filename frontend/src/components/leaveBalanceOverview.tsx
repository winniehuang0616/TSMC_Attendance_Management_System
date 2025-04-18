import { LeaveBalanceCard } from "@/components/leaveBalanceCard"

type LeaveType = {
  type: string
  used: number
  total: number
  remainingText: string
}

const leaveData: LeaveType[] = [
  { type: "病假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "事假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "公假", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
  { type: "特休", used: 2, total: 30, remainingText: "剩餘 28 天 10 小時" },
]

export function LeaveBalanceOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {leaveData.map((leave, idx) => (
        <LeaveBalanceCard key={idx} {...leave} />
      ))}
    </div>
  )
}
