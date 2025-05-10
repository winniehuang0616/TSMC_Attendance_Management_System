import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, setHours } from "date-fns";
import { CalendarIcon, UploadCloudIcon } from "lucide-react";
import { z } from "zod";

import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { useAuth } from "@/context/authContext";
import { cn } from "@/lib/utils";
import type { Agent } from "@/models/detail";

// 在文件頂部新增假別對應表
const LEAVE_TYPE_MAP: Record<string, string> = {
  特休: "annual",
  病假: "sick",
  事假: "personal",
  公假: "official",
};

// 透過 api 取得代理人
interface AgentResponse {
  id: string;
  name: string;
}

const FormSchema = z.object({
  start: z.date(),
  end: z.date({ required_error: "請選擇結束日期" }),
  startHour: z.string().min(1, "請輸入幾點"),
  endHour: z.string().min(1, "請輸入幾點"),
  type: z.string().min(1, "請選擇假別"),
  agent: z.string().min(1, "請輸入代理人"),
  reason: z.string().min(1, "請輸入原因"),
  file: z.any().optional(),
});

export function ApplyForm() {
  const { toast } = useToast();
  const { userId } = useAuth(); // 從 AuthContext 獲取 employeeId
  const [agentData, setAgentData] = useState<AgentResponse[]>([]);

  // Add this useEffect to fetch agent data
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/agent/${userId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setAgentData(data);
        } else {
          throw new Error("Failed to fetch agent data");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "載入代理人失敗",
          description: "請重新整理頁面",
        });
      }
    };

    if (userId) {
      fetchAgentData();
    }
  }, [userId, toast]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      start: undefined,
      end: undefined,
      startHour: "",
      endHour: "",
      type: "",
      agent: "",
      reason: "",
      file: undefined,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  function resetForm() {
    form.reset({
      start: undefined,
      end: undefined,
      type: "",
      agent: "",
      reason: "",
      file: undefined,
    });
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // 將檔案轉換為 base64
      let attachedFileBase64 = ""; // 更改變數名稱從 attachedFileUrl 為 attachedFileBase64
      let attachedFileName = "";
      let attachedFileType = "";

      if (data.file) {
        attachedFileName = data.file.name;
        attachedFileType = data.file.type;
        const reader = new FileReader();
        attachedFileBase64 = await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(",")[1]); // 只取 base64 內容部分
          };
          reader.readAsDataURL(data.file);
        });
      }

      // 日期格式轉換函數 - 修改為 ISO 格式
      const formatDateTime = (date: Date, hour: string) => {
        const newDate = new Date(date);
        newDate.setHours(parseInt(hour, 10), 0, 0);
        return newDate.toISOString();
      };

      // 準備請求體
      const requestBody = {
        leaveType: LEAVE_TYPE_MAP[data.type] || data.type, // 使用對應表轉換假別
        startDate: formatDateTime(data.start, data.startHour),
        endDate: formatDateTime(data.end, data.endHour),
        reason: data.reason,
        attachedFileBase64: attachedFileBase64, // 更改變數名稱
        agentId: data.agent.split("-")[0], // 只取員工編號部分
        createDate: new Date().toISOString(), // 使用 ISO 格式
      };

      // 發送請求
      const response = await fetch(
        `http://127.0.0.1:8000/api/leaves/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        toast({
          title: "請假表單已送出",
          description: "主管將會收到您的請假申請",
        });
        resetForm();
      } else {
        throw new Error("請求失敗");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "送出失敗",
        description: "請稍後再試",
      });
    }
  }

  return (
    <div className="rounded-md bg-white p-6 shadow-element">
      <h2 className="mb-2 text-lg font-bold text-darkBlue">申請表單</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 開始與結束時間 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {["start", "end"].map((fieldKey) => {
              const hourKey = (fieldKey + "Hour") as "startHour" | "endHour";

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
                                    "w-[120px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "yyyy/MM/dd")
                                  ) : (
                                    <span>選擇日期</span>
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
                                    placeholder="時"
                                    {...hourField}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      hourField.onChange(e.target.value);
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`選擇${fieldKey === "type" ? "假別" : "代理人"}`}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fieldKey === "type" ? (
                          <>
                            <SelectItem value="事假">事假</SelectItem>
                            <SelectItem value="病假">病假</SelectItem>
                            <SelectItem value="公假">公假</SelectItem>
                            <SelectItem value="特休">特休</SelectItem>
                          </>
                        ) : (
                          <>
                            {agentData.map((person) => (
                              <SelectItem
                                key={person.id}
                                value={`${person.id}-${person.name}`}
                              >
                                {`${person.id}-${person.name}`}
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
                <FormLabel>請輸入請假原因</FormLabel>
                <FormControl>
                  <Input placeholder="輸入請假原因" {...field} />
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
                <FormLabel>附件（可上傳 .jpg/.png/.pdf）</FormLabel>
                <FormControl>
                  <div>
                    <label
                      htmlFor="file-upload"
                      className="flex h-10 w-full cursor-pointer items-center rounded-md border border-zinc-200 bg-white px-3"
                    >
                      <UploadCloudIcon className="mr-2 h-6 w-6" />
                      <p className="text-sm">{fileName || "點此上傳檔案"}</p>
                    </label>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setFileName(file.name);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="hidden" />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">送出</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setFileName("");
              }}
            >
              取消
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
