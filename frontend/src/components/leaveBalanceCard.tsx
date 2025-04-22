import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
        "flex w-full max-w-[150px] h-[120px] flex-col rounded-2xl justify-center shadow-md",
        className,
      )}
    >
      <CardContent className="flex flex-col justify-center p-4">
        <CardTitle>
          {type}&nbsp;<span className="font-medium text-gray">| total</span>
        </CardTitle>
       
        <div className="mb-1 mt-1 text-2xl font-bold text-pink">
          {used} <span className="text-black">/ {total}</span>
        </div>
        <p className="text-darkBlue text-xs">{remainingText}</p>
      </CardContent>
    </Card>
  );
}
