import { Employee, PayslipData } from '@/types/employee';
import { format } from 'date-fns';

export class PayslipCalculator {
  static calculatePayslip(
    employee: Employee, 
    month: string, 
    year: number, 
    workingDays: number = 30, 
    actualWorkingDays: number = 30
  ): PayslipData {
    // Calculate pro-rated salary based on actual working days
    const salaryRatio = actualWorkingDays / workingDays;

    // Earnings - handle missing fields gracefully
    const basicSalary = employee.basicSalary * salaryRatio;
    // Remove: HRA from earnings
    
    const grossEarnings = basicSalary;

    // Deductions - handle missing fields gracefully
    const providentFund = (employee.providentFund || 0) * salaryRatio;
    // Remove: Professional Tax and Income Tax
    const esi = (employee.esi || 0) * salaryRatio; // Add ESI
    const otherDeductions = (employee.otherDeductions || 0) * salaryRatio;

    const totalDeductions = providentFund + esi + otherDeductions;

    // Net Salary
    const netSalary = grossEarnings - totalDeductions;

      return {
    employee: {
      ...employee,
      basicSalary: Math.round(basicSalary),
      providentFund: Math.round(providentFund),
      esi: Math.round(esi),
      otherDeductions: Math.round(otherDeductions),
    },
      month,
      year,
      workingDays,
      actualWorkingDays,
      grossEarnings: Math.round(grossEarnings),
      totalDeductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary),
      generatedDate: format(new Date(), 'dd/MM/yyyy'),
    };
  }

  static numberToWords(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    let result = '';

    // Handle crores
    if (num >= 10000000) {
      const crores = Math.floor(num / 10000000);
      result += this.convertHundreds(crores) + ' Crore ';
      num %= 10000000;
    }

    // Handle lakhs
    if (num >= 100000) {
      const lakhs = Math.floor(num / 100000);
      result += this.convertHundreds(lakhs) + ' Lakh ';
      num %= 100000;
    }

    // Handle thousands
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      result += this.convertHundreds(thousands) + ' Thousand ';
      num %= 1000;
    }

    // Handle hundreds
    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      result += ones[hundreds] + ' Hundred ';
      num %= 100;
    }

    // Handle tens and ones
    if (num >= 20) {
      const tensPlace = Math.floor(num / 10);
      result += tens[tensPlace] + ' ';
      num %= 10;
    } else if (num >= 10) {
      result += teens[num - 10] + ' ';
      num = 0;
    }

    if (num > 0) {
      result += ones[num] + ' ';
    }

    return result.trim() + ' Only';
  }

  private static convertHundreds(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    let result = '';

    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      result += ones[hundreds] + ' Hundred ';
      num %= 100;
    }

    if (num >= 20) {
      const tensPlace = Math.floor(num / 10);
      result += tens[tensPlace] + ' ';
      num %= 10;
    } else if (num >= 10) {
      result += teens[num - 10] + ' ';
      num = 0;
    }

    if (num > 0) {
      result += ones[num] + ' ';
    }

    return result.trim();
  }
}
