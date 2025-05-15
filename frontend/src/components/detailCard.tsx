import { useState } from "react";

import axios from "axios";
import { Trash2, Eye, PencilLine } from "lucide-react";

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
import { API_ENDPOINTS } from "@/config/api";
import type { LeaveRecord } from "@/models/leave";

const leaveTypeLabel: Record<string, string> = {
  annual: "特休",
  sick: "病假",
  personal: "事假",
  official: "公假",
};

interface DetailCardProps {
  detailData: LeaveRecord;
  onDeleted: () => void;
}

export function DetailCard({ detailData, onDeleted }: DetailCardProps) {
  const [checked, setChecked] = useState<true | false | null>(null);
  const [description, setDescription] = useState(detailData.description || "");
  const [open, setOpen] = useState(false);
  const [checkedError, setCheckedError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const handleDelete = async () => {
    try {
      if (detailData.startDate > new Date()) {
        await axios.delete(API_ENDPOINTS.LEAVES(detailData.id));
        onDeleted();
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
    } catch (error) {
      console.error("刪除請假單失敗：", error);
      toast({
        title: "撤回失敗",
        description: `撤回請假單時發生錯誤`,
      });
    }
  };

  const handleSubmit = () => {
    // 錯誤呈現紅色字
    let hasError = false;

    if (checked === null) {
      setCheckedError(true);
      hasError = true;
    } else {
      setCheckedError(false);
    }

    if (!description.trim()) {
      setDescriptionError(true);
      hasError = true;
    } else {
      setDescriptionError(false);
    }

    if (hasError) return;
    //

    const payload = {
      reviewerId: sessionStorage.getItem("userId"),
      status: checked ? "approved" : "rejected",
      comment: description.trim(),
    };

    // 透過 API 更新假單
    axios
      .put(API_ENDPOINTS.LEAVE_REVIEW(detailData.id), payload)
      .then(() => {
        setOpen(false);
        onDeleted();
        toast({
          title: "已簽核假單",
          description: "系統將寄信通知申請者",
        });
      })
      .catch((error) => {
        toast({
          title: "送出簽核結果失敗",
          description: "請稍後再試。",
          variant: "destructive",
        });
        console.error("簽核失敗：", error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full p-1 transition hover:cursor-pointer hover:bg-purple"
        >
          {detailData.status === "rejected" ? (
            <Eye size={24} strokeWidth={2} color="#FF4170" />
          ) : detailData.status === "approved" ? (
            <Trash2 size={24} strokeWidth={2} />
          ) : (
            <PencilLine size={24} strokeWidth={2} color="blue" />
          )}
        </div>
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
              defaultValue={leaveTypeLabel[detailData.type]}
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
                detailData.startTime +
                ":00:00"
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
                detailData.endTime +
                ":00:00"
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
              defaultValue={detailData.attachment}
              className="h-[30px]"
              disabled
            />
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="result"
              className={`w-1/4 font-semibold ${checkedError ? "text-pink" : ""}`}
            >
              核准結果
            </Label>
            <div className="flex h-[30px] gap-4">
              <div className="flex items-center gap-1">
                {detailData.status === "pending" ? (
                  <Checkbox
                    checked={checked == true}
                    onCheckedChange={() => {
                      setChecked(checked === true ? false : true);
                    }}
                    id="approve"
                  />
                ) : (
                  <Checkbox
                    checked={detailData.status === "approved"}
                    disabled
                    id="approve"
                  />
                )}

                <Label
                  htmlFor="approve"
                  className={
                    detailData.status === "approved" ? "font-semibold" : ""
                  }
                >
                  通過
                </Label>
              </div>
              <div className="flex items-center gap-1">
                {detailData.status === "pending" ? (
                  <Checkbox
                    checked={checked == false}
                    onCheckedChange={() => {
                      setChecked(checked === false ? true : false);
                    }}
                    id="reject"
                  />
                ) : (
                  <Checkbox
                    checked={detailData.status === "rejected"}
                    disabled
                    id="reject"
                  />
                )}
                <Label
                  htmlFor="reject"
                  className={
                    detailData.status === "rejected" ? "font-semibold" : ""
                  }
                >
                  未通過
                </Label>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="description"
              className={`w-1/3 font-semibold ${descriptionError ? "text-pink" : ""}`}
            >
              核准理由
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-[30px] border-zinc-400 font-semibold"
              disabled={detailData.status != "pending"}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-start">
          {detailData.status === "approved" && (
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
          {detailData.status === "pending" && (
            <Button
              type="button"
              className="bg-blue hover:bg-blue/90"
              onClick={handleSubmit}
            >
              送出
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
