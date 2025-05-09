import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format, setHours } from "date-fns";
import { CalendarIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { PencilLine } from "lucide-react";
import { z } from "zod";

import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Agent } from "@/models/detail";
import type { LeaveRecord } from "@/models/leave";

// 透過 api 取得代理人清單
const agentData: Agent[] = [
  { id: 1, name: "111-王小明" },
  { id: 2, name: "112-陳美惠" },
  { id: 3, name: "EMP003" },
];

interface EditCardProps {
  detailData: LeaveRecord;
  onDeleted: () => void;
}

const leaveTypeLabel: Record<string, string> = {
  annual: "特休",
  sick: "病假",
  personal: "事假",
  official: "公假",
};

const FormSchema = z.object({
  start: z.date(),
  end: z.date(),
  startHour: z.number().min(1),
  endHour: z.number().min(1),
  type: z.string().min(1),
  agent: z.string().min(1),
  reason: z.string().trim().min(1),
  file: z.any().optional(),
});

export function EditCard({ detailData, onDeleted }: EditCardProps) {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof detailData.attachment === "string" && detailData.attachment !== "--"
      ? detailData.attachment
      : null,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      start: detailData.startDate,
      end: detailData.endDate,
      startHour: detailData.startTime,
      endHour: detailData.endTime,
      type: detailData.type,
      agent: detailData.agent,
      reason: detailData.reason,
      file: detailData.attachment,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.start > data.end) {
      toast({
        title: "時間錯誤",
        description: "結束時間必須在開始時間之後",
      });
      return;
    }
    const leaveId = detailData.id;
    // 調整時間，並且將其轉換為 UTC
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    const localOffset = startDate.getTimezoneOffset();
    startDate.setMinutes(startDate.getMinutes() - localOffset);
    endDate.setMinutes(endDate.getMinutes() - localOffset);
    const utcStartDate = startDate.toISOString();
    const utcEndDate = endDate.toISOString();
    // 將檔案轉換為 base64
    let attachment = "";
    if (data.file) {
      attachment = await fileToBase64(data.file);
    }

    const payload = {
      leaveType: data.type,
      startDate: utcStartDate,
      endDate: utcEndDate,
      reason: data.reason,
      attachmentBase64: attachment,
      agentId: data.agent,
    };
    axios
      .put(`http://localhost:8000/api/leaves/${leaveId}`, payload)
      .then((response) => {
        toast({
          title: "請假表單內容已更新",
          description: "請假資料更新成功！",
        });
        console.log("更新成功:", response);
        onDeleted();
      })
      .catch((error) => {
        toast({
          title: "更新失敗",
          description: "更新請假資料時出現錯誤。",
        });
        console.error("更新失敗:", error);
      });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/leaves/${detailData.id}`);
      onDeleted();
      toast({
        title: "撤回假單",
        description: `已向主管發送撤回信件`,
      });
    } catch (error) {
      console.error("刪除請假單失敗：", error);
      toast({
        title: "撤回失敗",
        description: `撤回請假單時發生錯誤`,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex h-9 w-9 items-center justify-center rounded-full p-1 transition hover:cursor-pointer hover:bg-purple">
          <PencilLine size={24} strokeWidth={2} color="blue" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <div className="rounded-md bg-white">
          <h2 className="mb-2 text-lg font-bold text-darkBlue">申請資料</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 開始與結束時間 */}
              <div className="flex flex-col gap-4 sm:flex-row">
                {["start", "end"].map((fieldKey) => {
                  const hourKey = (fieldKey + "Hour") as
                    | "startHour"
                    | "endHour";

                  return (
                    <div key={fieldKey} className="flex flex-col items-end">
                      <FormField
                        control={form.control}
                        name={fieldKey as "start" | "end"}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="absolute mt-[10px]">
                              {fieldKey === "start" ? "開始時間" : "結束時間"}
                            </FormLabel>
                            <div className="flex items-end gap-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "z-20 w-[120px] pl-3 text-left font-normal",
                                        !field.value &&
                                          "text-muted-foreground text-gray",
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "yyyy/MM/dd")
                                      ) : (
                                        <span>
                                          {format(
                                            fieldKey === "start"
                                              ? detailData.startDate
                                              : detailData.endDate,
                                            "yyyy/MM/dd",
                                          )}
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                      if (date) field.onChange(date);
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormField
                                control={form.control}
                                name={hourKey}
                                render={({ field: hourField }) => (
                                  <FormItem>
                                    <FormLabel>小時</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={23}
                                        className="w-[60px]"
                                        {...hourField}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value);
                                          hourField.onChange(val);
                                          const base =
                                            form.getValues(
                                              fieldKey as "start" | "end",
                                            ) ?? new Date();
                                          if (!isNaN(val)) {
                                            form.setValue(
                                              fieldKey as "start" | "end",
                                              setHours(base, val),
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage className="hidden" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormMessage className="hidden" />
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 假別與代理人 */}
              <div className="flex flex-col gap-4 sm:flex-row">
                {["type", "agent"].map((fieldKey) => (
                  <FormField
                    key={fieldKey}
                    control={form.control}
                    name={fieldKey as "type" | "agent"}
                    render={({ field }) => (
                      <FormItem className="w-[188px]">
                        <FormLabel>
                          {fieldKey === "type" ? "假別" : "代理人"}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue {...field} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fieldKey === "type" ? (
                              <>
                                {Object.entries(leaveTypeLabel).map(
                                  ([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  ),
                                )}
                              </>
                            ) : (
                              <>
                                {agentData.map((person) => (
                                  <SelectItem
                                    key={person.id}
                                    value={person.name}
                                  >
                                    {person.name}
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="hidden" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* 請假原因 */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>請假原因</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="hidden" />
                  </FormItem>
                )}
              />

              {/* 附件上傳 */}
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      附件（可上傳 .jpg/.png/.pdf）
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer items-center rounded-md bg-white px-2 py-1 hover:bg-zinc-100"
                      >
                        <UploadCloudIcon className="h-5 w-5 text-zinc-600" />
                      </div>
                      <XIcon
                        className="h-4 w-4 cursor-pointer text-zinc-500 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation(); // 防止觸發 file input
                          field.onChange(undefined);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                          setPreviewUrl(null);
                        }}
                      />
                    </FormLabel>
                    <FormControl>
                      <div>
                        {/* 縮圖顯示 */}
                        {previewUrl && (
                          <div className="mt-2">
                            <img
                              src={previewUrl}
                              alt="附件預覽"
                              className="max-h-[100px] rounded-md shadow"
                            />
                          </div>
                        )}

                        {/* 隱藏的 file input */}
                        <input
                          ref={fileInputRef}
                          id="file-upload"
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              setPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="hidden" />
                  </FormItem>
                )}
              />

              <DialogFooter className="sm:justify-start">
                <div className="flex gap-4">
                  <DialogClose asChild>
                    <Button type="submit">更新</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      撤回
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
