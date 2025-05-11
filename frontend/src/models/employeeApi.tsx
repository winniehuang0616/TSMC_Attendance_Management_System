export interface UsedLeave {
    annual: number;
    sick: number;
    personal: number;
    official: number;
  }
  
  export interface EmployeeApiData {
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    used_leave: UsedLeave;
  }
  