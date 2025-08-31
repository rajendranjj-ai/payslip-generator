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
        const payslipData = PayslipCalculator.calculatePayslip(
          employee,
          month,
          year,
          workingDays,
          actualWorkingDays
        );

        // Validate the payslip data
        if (isNaN(payslipData.grossEarnings) || isNaN(payslipData.netSalary) || isNaN(payslipData.totalDeductions)) {
          throw new Error(`Invalid calculations for employee ${employee.name}`);
        }

        payslipDataArray.push(payslipData);
      } catch (error) {
        console.error(`Failed to generate payslip for employee ${employee.name}:`, error);
        failedEmployees.push(employee.name);
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
