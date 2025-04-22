import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Detail } from "@/models/detail";

const detailData: Detail = {
  id: 1,
  name: "111-王小明",
  type: "病假",
  startDate: new Date("2025-04-23"),
  endDate: new Date("2025-04-30"),
  startTime: "09:00",
  endTime: "17:00",
  agent: "111-王小明",
  reason: "感冒看醫生",
  file: "file1.txt",
  result: true,
  description: "在家好好休息",
  status: true,
};

export function DetailCard() {
  const handleDelete = () => {
    console.log(detailData.id);
    if (detailData.startDate > new Date()) {
      toast({
        title: "撤回假單",
        description: `已向主管發送撤回信件`,
      });
    } else {
      toast({
        title: "撤回失敗",
        description: `假單已過期，無法撤回`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">icon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <h2 className="text-lg font-bold text-darkBlue">申請結果</h2>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-1/3">
              申請人
            </Label>
            <Input
              id="name"
              defaultValue={detailData.name}
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="type" className="w-1/3">
              假別
            </Label>
            <Input
              id="type"
              defaultValue={detailData.type}
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="startTime" className="w-1/3">
              開始時間
            </Label>
            <Input
              id="startTime"
              defaultValue={
                detailData.startDate.toLocaleDateString() +
                " " +
                detailData.startTime
              }
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="endTime" className="w-1/3">
              結束時間
            </Label>
            <Input
              id="endTime"
              defaultValue={
                detailData.endDate.toLocaleDateString() +
                " " +
                detailData.endTime
              }
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="agent" className="w-1/3">
              代理人
            </Label>
            <Input
              id="agent"
              defaultValue={detailData.agent}
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="reason" className="w-1/3">
              請假原因
            </Label>
            <Input
              id="reason"
              defaultValue={detailData.reason}
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="file" className="w-1/3">
              附件
            </Label>
            <Input
              id="file"
              defaultValue={detailData.file}
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="result" className="w-1/4 font-semibold">
              核准結果
            </Label>
            <div className="flex h-[30px] gap-4">
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={detailData.status === true}
                  disabled
                  id="approve"
                />
                <Label
                  htmlFor="approve"
                  className={detailData.status === true ? "font-semibold" : ""}
                >
                  通過
                </Label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={detailData.status === false}
                  disabled
                  id="reject"
                />
                <Label
                  htmlFor="reject"
                  className={detailData.status === false ? "font-semibold" : ""}
                >
                  未通過
                </Label>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="description" className="w-1/3 font-semibold">
              核准理由
            </Label>
            <Input
              id="description"
              defaultValue={detailData.description}
              className="h-[30px] border-zinc-400 font-semibold"
              disabled
            />
          </div>
        </div>
        <DialogFooter className="flex justify-start">
          {detailData.status === true && (
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                刪除
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
