export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  designation?: string;
  department?: string;
  email?: string;
  phone?: string;
  dateOfJoining?: string;
  basicSalary: number;
  hra?: number;
  da?: number;
  conveyanceAllowance?: number;
  medicalAllowance?: number;
  specialAllowance?: number;
  providentFund?: number;
  professionalTax?: number;
  incomeTax?: number;
  otherDeductions?: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface PayslipData {
  employee: Employee;
  month: string;
  year: number;
  workingDays: number;
  actualWorkingDays: number;
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
  generatedDate: string;
}

export interface MonthlyPayroll {
  month: string;
  year: number;
  employees: Employee[];
}
