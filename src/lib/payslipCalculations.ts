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
    // Input validation and sanitization
    const safeBasicSalary = Number(employee.basicSalary) || 0;
    const safeWorkingDays = Math.max(Number(workingDays) || 1, 1); // Prevent division by zero
    const safeActualWorkingDays = Math.max(Number(actualWorkingDays) || 1, 0);
    const safePF = Number(employee.providentFund) || 0;
    const safeESI = Number(employee.esi) || 0;
    const safeOtherDeductions = Number(employee.otherDeductions) || 0;

    // Working days are for display only - salary calculation is not pro-rated
    // Salary components remain fixed regardless of working days changes
    
    // Earnings - use full salary amounts (no pro-rating)
    const basicSalary = safeBasicSalary;
    
    const grossEarnings = basicSalary;

    // Deductions - use full deduction amounts (no pro-rating)
    const providentFund = safePF;
    const esi = safeESI;
    const otherDeductions = safeOtherDeductions;

    const totalDeductions = providentFund + esi + otherDeductions;

    // Net Salary
    const netSalary = grossEarnings - totalDeductions;

    // Final validation
    if (!isFinite(grossEarnings) || !isFinite(totalDeductions) || !isFinite(netSalary)) {
      throw new Error(`Invalid calculation results: Gross=${grossEarnings}, Deductions=${totalDeductions}, Net=${netSalary}`);
    }

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
    // Input validation to prevent crashes
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      console.error('Invalid number passed to numberToWords:', num);
      return 'Invalid Amount';
    }

    // Handle negative numbers
    if (num < 0) {
      return 'Negative ' + PayslipCalculator.numberToWords(Math.abs(num));
    }

    // Round to avoid floating point precision issues
    num = Math.round(Math.abs(num));

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    // Handle very large numbers to prevent crashes
    if (num >= 1000000000000) {
      return 'Amount Too Large';
    }

    let result = '';

    try {
      // Handle crores
      if (num >= 10000000) {
        const crores = Math.floor(num / 10000000);
        result += PayslipCalculator.convertHundreds(crores) + ' Crore ';
        num %= 10000000;
      }

      // Handle lakhs
      if (num >= 100000) {
        const lakhs = Math.floor(num / 100000);
        result += PayslipCalculator.convertHundreds(lakhs) + ' Lakh ';
        num %= 100000;
      }

      // Handle thousands
      if (num >= 1000) {
        const thousands = Math.floor(num / 1000);
        result += PayslipCalculator.convertHundreds(thousands) + ' Thousand ';
        num %= 1000;
      }

      // Handle hundreds
      if (num >= 100) {
        const hundreds = Math.floor(num / 100);
        if (hundreds < ones.length) {
          result += ones[hundreds] + ' Hundred ';
        }
        num %= 100;
      }

      // Handle tens and ones
      if (num >= 20) {
        const tensPlace = Math.floor(num / 10);
        if (tensPlace < tens.length) {
          result += tens[tensPlace] + ' ';
        }
        num %= 10;
      } else if (num >= 10) {
        const teensIndex = num - 10;
        if (teensIndex >= 0 && teensIndex < teens.length) {
          result += teens[teensIndex] + ' ';
        }
        num = 0;
      }

      if (num > 0 && num < ones.length) {
        result += ones[num] + ' ';
      }

      return result.trim() + ' Only';
    } catch (error) {
      console.error('Error in numberToWords conversion:', error);
      return 'Conversion Error';
    }
  }

  private static convertHundreds(num: number): string {
    // Input validation
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num) || num < 0) {
      console.error('Invalid number passed to convertHundreds:', num);
      return '';
    }

    // Round and ensure within bounds
    num = Math.round(num);
    if (num > 999) {
      num = 999; // Cap at maximum for hundreds conversion
    }

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    let result = '';

    try {
      if (num >= 100) {
        const hundreds = Math.floor(num / 100);
        if (hundreds > 0 && hundreds < ones.length) {
          result += ones[hundreds] + ' Hundred ';
        }
        num %= 100;
      }

      if (num >= 20) {
        const tensPlace = Math.floor(num / 10);
        if (tensPlace < tens.length) {
          result += tens[tensPlace] + ' ';
        }
        num %= 10;
      } else if (num >= 10) {
        const teensIndex = num - 10;
        if (teensIndex >= 0 && teensIndex < teens.length) {
          result += teens[teensIndex] + ' ';
        }
        num = 0;
      }

      if (num > 0 && num < ones.length) {
        result += ones[num] + ' ';
      }

      return result.trim();
    } catch (error) {
      console.error('Error in convertHundreds:', error);
      return '';
    }
  }
}
