import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type LeaveBalanceCardProps = {
  type: string;
  used: number;
  total: number;
  remainingText: string;
  className?: string;
};

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
        "flex aspect-square w-full max-w-[200px] flex-col justify-center rounded-2xl p-4 text-center shadow-md",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-0">
        <p className="text-gray-500 text-sm">
          {type} | <span className="font-light">total</span>
        </p>
        <div className="mb-2 mt-1 text-2xl font-bold text-red-500">
          {used} <span className="text-gray-700">/ {total}</span>
        </div>
        <p className="text-gray-400 text-xs">{remainingText}</p>
      </CardContent>
    </Card>
  );
}
