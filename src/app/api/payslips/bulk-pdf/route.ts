import { NextRequest, NextResponse } from 'next/server';
import { PayslipPDFGenerator } from '@/lib/pdfGenerator';
import { googleSheetsService } from '@/lib/googleSheets';
import { PayslipCalculator } from '@/lib/payslipCalculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      employeeIds, 
      month, 
      year, 
      workingDays = 30, 
      actualWorkingDays = 30 
    } = body;

    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0 || !month || !year) {
      return NextResponse.json(
        { error: 'Employee IDs array, month, and year are required' },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.DEFAULT_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'No default spreadsheet configured' },
        { status: 400 }
      );
    }

    // Fetch all employees from Google Sheets
    const allEmployees = await googleSheetsService.getEmployees();
    
    // Filter employees based on provided employee IDs
    const selectedEmployees = allEmployees.filter(emp => employeeIds.includes(emp.employeeId));

    if (selectedEmployees.length === 0) {
      return NextResponse.json(
        { error: 'No matching employees found for the provided IDs' },
        { status: 404 }
      );
    }

    // Generate payslip data for all selected employees
    const payslipDataArray = [];
    const failedEmployees = [];

    for (const employee of selectedEmployees) {
      try {
        // Pre-validate employee data
        const validationErrors = [];
        
        if (!employee.name || employee.name.trim() === '') {
          validationErrors.push('Missing employee name');
        }
        
        if (!employee.basicSalary || isNaN(employee.basicSalary) || employee.basicSalary <= 0) {
          validationErrors.push(`Invalid basic salary: ${employee.basicSalary}`);
        }
        
        if (workingDays <= 0 || isNaN(workingDays)) {
          validationErrors.push(`Invalid working days: ${workingDays}`);
        }
        
        if (actualWorkingDays <= 0 || isNaN(actualWorkingDays)) {
          validationErrors.push(`Invalid actual working days: ${actualWorkingDays}`);
        }

        if (validationErrors.length > 0) {
          throw new Error(`Employee ${employee.name || 'Unknown'} validation failed: ${validationErrors.join(', ')}`);
        }

        const payslipData = PayslipCalculator.calculatePayslip(
          employee,
          month,
          year,
          workingDays,
          actualWorkingDays
        );

        // Validate the calculated payslip data with detailed error reporting
        if (isNaN(payslipData.grossEarnings)) {
          throw new Error(`Invalid gross earnings calculation for ${employee.name}: ${payslipData.grossEarnings} (Basic: ${employee.basicSalary})`);
        }
        
        if (isNaN(payslipData.netSalary)) {
          throw new Error(`Invalid net salary calculation for ${employee.name}: ${payslipData.netSalary} (Gross: ${payslipData.grossEarnings}, Deductions: ${payslipData.totalDeductions})`);
        }
        
        if (isNaN(payslipData.totalDeductions)) {
          throw new Error(`Invalid total deductions calculation for ${employee.name}: ${payslipData.totalDeductions} (PF: ${employee.providentFund}, ESI: ${employee.esi})`);
        }

        // Additional sanity checks
        if (payslipData.netSalary < 0) {
          console.warn(`Warning: Negative net salary for ${employee.name}: ${payslipData.netSalary}`);
        }

        payslipDataArray.push(payslipData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to generate payslip for employee ${employee.name}:`, errorMessage);
        console.error('Employee data:', JSON.stringify({
          name: employee.name,
          employeeId: employee.employeeId,
          basicSalary: employee.basicSalary,
          providentFund: employee.providentFund,
          esi: employee.esi,
          otherDeductions: employee.otherDeductions
        }, null, 2));
        failedEmployees.push(`${employee.name} (${errorMessage})`);
      }
    }

    if (payslipDataArray.length === 0) {
      return NextResponse.json({
        error: `Failed to generate payslips for all selected employees: ${failedEmployees.join(', ')}`,
        failedEmployees
      }, { status: 400 });
    }

    // Generate bulk HTML content for all payslips
    const htmlContent = PayslipPDFGenerator.generateBulkPayslipHTML(payslipDataArray);

    // Create a filename with employee count and date range
    const filename = `payslips-${payslipDataArray.length}-employees-${month}-${year}.html`;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${filename}"`,
        'X-Generated-Count': payslipDataArray.length.toString(),
        'X-Failed-Count': failedEmployees.length.toString()
      }
    });

  } catch (error) {
    console.error('Error generating bulk payslip PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate bulk payslip PDF' },
      { status: 500 }
    );
  }
}
