export type Detail = {
  id: number;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  agent: string;
  reason: string;
  file: string;
  result: boolean;
  description: string;
  status: number;
};

export type Agent = {
  id: number;
  name: string;
};
