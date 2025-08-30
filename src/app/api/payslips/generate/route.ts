import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';
import { PayslipCalculator } from '@/lib/payslipCalculations';
// import { PayslipPDFGenerator } from '@/lib/pdfGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      month, 
      year, 
      workingDays = 30, 
      actualWorkingDays = 30,
      employeeIds = [] // Optional: generate for specific employees only
    } = body;

    if (!month || !year) {
      return NextResponse.json(
        { error: 'Month and year are required' },
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
    
    if (employees.length === 0) {
      return NextResponse.json(
        { error: 'No employees found in the spreadsheet' },
        { status: 404 }
      );
    }

    // Filter employees if specific IDs are provided
    const targetEmployees = employeeIds.length > 0 
      ? employees.filter(emp => employeeIds.includes(emp.employeeId))
      : employees;

    if (targetEmployees.length === 0) {
      return NextResponse.json(
        { error: 'No matching employees found' },
        { status: 404 }
      );
    }

    // Generate payslips with individual error handling
    const payslips = [];
    const failedEmployees = [];

    for (const employee of targetEmployees) {
      try {
        const payslip = PayslipCalculator.calculatePayslip(
          employee,
          month,
          year,
          workingDays,
          actualWorkingDays
        );
        
        // Validate the payslip data
        if (isNaN(payslip.grossEarnings) || isNaN(payslip.netSalary) || isNaN(payslip.totalDeductions)) {
          throw new Error(`Invalid calculations for employee ${employee.name}`);
        }
        
        payslips.push(payslip);
      } catch (error) {
        console.error(`Failed to generate payslip for employee ${employee.name}:`, error);
        failedEmployees.push(employee.name);
      }
    }

    // Return results even if some failed
    if (payslips.length === 0) {
      return NextResponse.json({
        success: false,
        error: `Failed to generate payslips for all employees: ${failedEmployees.join(', ')}`,
        failedEmployees
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: payslips,
      count: payslips.length,
      failedEmployees: failedEmployees.length > 0 ? failedEmployees : undefined,
      summary: {
        totalGrossEarnings: payslips.reduce((sum, p) => sum + p.grossEarnings, 0),
        totalDeductions: payslips.reduce((sum, p) => sum + p.totalDeductions, 0),
        totalNetSalary: payslips.reduce((sum, p) => sum + p.netSalary, 0),
      }
    });
  } catch (error) {
    console.error('Error generating payslips:', error);
    return NextResponse.json(
      { error: 'Failed to generate payslips' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const employeeId = searchParams.get('employeeId');
    const workingDays = parseInt(searchParams.get('workingDays') || '30');
    const actualWorkingDays = parseInt(searchParams.get('actualWorkingDays') || '30');

    if (!month || !year || !employeeId) {
      return NextResponse.json(
        { error: 'Month, year, and employee ID are required' },
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

    // Generate single payslip
    const payslip = PayslipCalculator.calculatePayslip(
      employee,
      month,
      parseInt(year),
      workingDays,
      actualWorkingDays
    );

    return NextResponse.json({
      success: true,
      data: payslip
    });
  } catch (error) {
    console.error('Error fetching payslip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payslip' },
      { status: 500 }
    );
  }
}
