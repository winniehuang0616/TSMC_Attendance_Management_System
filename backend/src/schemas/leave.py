# schemas/leave.py

from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime

class LeaveStatus(str, Enum):
    pending  = "pending"
    approved = "approved"
    rejected = "rejected"

class LeaveInfo(BaseModel):
    leaveId: str
    employeeId: str
    status: LeaveStatus
    leaveType: str
    startDate: datetime
    endDate: datetime
    reason: Optional[str] = None
    attachedFileBase64: Optional[str] = None
    agentId: Optional[str] = None
    reviewerId: Optional[str] = None
    comment: Optional[str] = None
    createDate: datetime

class LeaveCreateRequest(BaseModel):
    leaveType: str
    startDate: datetime
    endDate: datetime
    reason: Optional[str] = None
    attachedFileBase64: Optional[str] = None
    agentId: Optional[str] = None
    createDate: Optional[datetime] = None

class LeaveUpdateRequest(BaseModel):
    leaveType: str
    startDate: datetime
    endDate: datetime
    reason: Optional[str] = None
    attachmentBase64: Optional[str] = None # 統一改為 attachmentBase64
    agentId: Optional[str] = None

class ReviewRequest(BaseModel):
    status: LeaveStatus
    comment: Optional[str] = None
    reviewerId: str
