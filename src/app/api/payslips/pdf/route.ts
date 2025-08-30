import { NextRequest, NextResponse } from 'next/server';
import { PayslipPDFGenerator } from '@/lib/pdfGenerator';
import { googleSheetsService } from '@/lib/googleSheets';
import { PayslipCalculator } from '@/lib/payslipCalculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      employeeId, 
      month, 
      year, 
      workingDays = 30, 
      actualWorkingDays = 30 
    } = body;

    if (!employeeId || !month || !year) {
      return NextResponse.json(
        { error: 'Employee ID, month, and year are required' },
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

    // Fetch employees from Google Sheets
    const employees = await googleSheetsService.getEmployees();
    const employee = employees.find(emp => emp.employeeId === employeeId);

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Generate payslip data
    const payslipData = PayslipCalculator.calculatePayslip(
      employee,
      month,
      year,
      workingDays,
      actualWorkingDays
    );

    // Generate HTML for PDF
    const htmlContent = PayslipPDFGenerator.generatePayslipHTML(payslipData);

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="payslip-${employee.employeeId}-${month}-${year}.html"`
      }
    });
  } catch (error) {
    console.error('Error generating payslip PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate payslip PDF' },
      { status: 500 }
    );
  }
}
