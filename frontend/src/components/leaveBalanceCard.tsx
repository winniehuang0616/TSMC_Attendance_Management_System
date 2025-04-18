import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type LeaveBalanceCardProps = {
  type: string
  used: number
  total: number
  remainingText: string
  className?: string
}

export function LeaveBalanceCard({
  type,
  used,
  total,
  remainingText,
  className,
}: LeaveBalanceCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-[200px] aspect-square p-4 shadow-md rounded-2xl text-center flex flex-col justify-center",
        className
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-0">
        <p className="text-sm text-gray-500">{type} | <span className="font-light">total</span></p>
        <div className="text-2xl font-bold text-red-500 mt-1 mb-2">
          {used} <span className="text-gray-700">/ {total}</span>
        </div>
        <p className="text-xs text-gray-400">{remainingText}</p>
      </CardContent>
    </Card>
  )
}
