import { LeaveStatus } from "@/models/enum/leaveStatus"

export type LeaveRecord = {
  id: string
  type: string
  start: string
  end: string
  agent: string
  reason: string
  attachment: string
  status: LeaveStatus
}

export type Filter = {
    startDate?: string
    endDate?: string
    type?: string
    status?: LeaveStatus
}
  
export type Props = {
    records: LeaveRecord[]
    onSearch: (filter: Filter) => void
}
