import { useState } from "react";

import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Detail } from "@/models/detail";

const detailData: Detail = {
  id: 1,
  name: "111-王小明",
  type: "病假",
  startDate: new Date("2025-04-01"),
  endDate: new Date("2025-4-3"),
  startTime: "09:00",
  endTime: "17:00",
  agent: "111-王小明",
  reason: "感冒看醫生",
  file: "file1.txt",
  result: true,
  description: "請在家好好休息",
  status: 0,
};

export function DetailCard() {
  const [formData, setFormData] = useState({
    name: detailData.name,
    type: detailData.type,
    startDate: detailData.startDate,
    endDate: detailData.endDate,
    startTime: detailData.startTime,
    endTime: detailData.endTime,
    agent: detailData.agent,
    reason: detailData.reason,
    file: detailData.file,
    result: detailData.result,
    description: detailData.description,
  });

  const handleSave = () => {
    console.log(formData);
    toast({ title: "儲存成功", description: "已儲存這筆資料內容。" });
  };

  const handleDelete = () => {
    console.log(detailData.id);
    toast({
      title: "刪除成功",
      description: `已刪除 id 為 ${detailData.id} 的資料。`,
    });
    // 關閉 Dialog：需透過 state 或 context 控制 Dialog 的開關，這邊先略過
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">icon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <h2 className="text-lg font-bold text-darkBlue">申請資料</h2>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-1/5">
              申請人
            </Label>
            <Input
              id="name"
              defaultValue={detailData.name}
              className="h-[30px]"
              disabled
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="type"
              className={`w-1/5 ${detailData.status == 0 ? "font-semibold" : ""}`}
            >
              假別
            </Label>
            <Input
              id="type"
              defaultValue={detailData.type}
              className="h-[30px]"
              disabled={detailData.status !== 0}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="startTime"
              className={`w-1/5 ${detailData.status == 0 ? "font-semibold" : ""}`}
            >
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
              disabled={detailData.status !== 0}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="endTime"
              className={`w-1/5 ${detailData.status == 0 ? "font-semibold" : ""}`}
            >
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
              disabled={detailData.status !== 0}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="agent"
              className={`w-1/5 ${detailData.status == 0 ? "font-semibold" : ""}`}
            >
              代理人
            </Label>
            <Input
              id="agent"
              defaultValue={detailData.agent}
              className="h-[30px]"
              disabled={detailData.status !== 0}
              onChange={(e) =>
                setFormData({ ...formData, agent: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="reason"
              className={`w-1/5 ${detailData.status == 0 ? "font-semibold" : ""}`}
            >
              請假原因
            </Label>
            <Input
              id="reason"
              defaultValue={detailData.reason}
              className="h-[30px]"
              disabled={detailData.status !== 0}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="reason"
              className={`w-1/5 ${detailData.status == 0 ? "font-semibold" : ""}`}
            >
              附件
            </Label>
            <Input
              id="file"
              defaultValue={detailData.file}
              className="h-[30px]"
              disabled={detailData.status !== 0}
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter className="flex justify-start gap-2">
          <Button type="button" onClick={handleSave}>
            儲存
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            刪除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
