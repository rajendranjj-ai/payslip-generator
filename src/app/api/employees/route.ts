import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'Sheet1!A2:Z';
    const spreadsheetId = process.env.DEFAULT_SPREADSHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'No default spreadsheet ID configured. Please set DEFAULT_SPREADSHEET_ID in environment variables.' },
        { status: 400 }
      );
    }

    // Validate sheet access first
    const hasAccess = await googleSheetsService.validateSheetAccess();
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unable to access the configured Google Sheet. Please check permissions and API access.' },
        { status: 403 }
      );
    }

    const employees = await googleSheetsService.getEmployees(undefined, range);
    
    return NextResponse.json({
      success: true,
      data: employees,
      count: employees.length,
      spreadsheetId: spreadsheetId.substring(0, 10) + '...' // Partial ID for reference
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch employees from Google Sheets', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
