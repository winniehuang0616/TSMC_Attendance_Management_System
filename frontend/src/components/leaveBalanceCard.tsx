import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LeaveCard } from "@/models/card";

export function LeaveBalanceCard({
  type,
  used,
  total,
  remainingText,
}: LeaveCard) {
  return (
    <Card
      className={cn(
        "flex h-[120px] max-w-[150px] flex-col justify-center rounded-2xl shadow-md",
      )}
    >
      <CardContent className="flex flex-col justify-center p-4">
        <CardTitle>
          {type}&nbsp;<span className="font-medium text-gray">| total</span>
        </CardTitle>

        <div className="mb-1 mt-1 text-2xl font-bold text-pink">
          {used} <span className="text-black">/ {total}</span>
        </div>
        <p className="text-xs text-darkBlue">{remainingText}</p>
      </CardContent>
    </Card>
  );
}
