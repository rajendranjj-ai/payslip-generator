import { google } from 'googleapis';
import { Employee } from '@/types/employee';

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export class GoogleSheetsService {
  private auth: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private sheets: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor() {
    // Initialize with service account or OAuth credentials
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // For production, use service account credentials
      // For development, you can use OAuth or service account
      if (process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
        this.auth = new google.auth.GoogleAuth({
          credentials: {
            type: 'service_account',
            project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
            private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
            private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
          },
          scopes: SCOPES,
        });
      }
      
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error('Error initializing Google Sheets auth:', error);
      throw error;
    }
  }

  async getEmployees(spreadsheetId?: string, range: string = 'Sheet1!A2:Z'): Promise<Employee[]> {
    try {
      const sheetId = spreadsheetId || process.env.DEFAULT_SPREADSHEET_ID;
      if (!sheetId) {
        throw new Error('No spreadsheet ID provided');
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      // First, let's get the headers to understand the sheet structure
      const headerResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1:Z1',
      });
      
      const headers = headerResponse.data.values?.[0] || [];
      console.log('Sheet headers found:', headers);

      return rows.map((row: any[], index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // Helper function to safely parse numbers
        const parseNumber = (value: string | undefined) => {
          const num = parseFloat(value || '0');
          return isNaN(num) ? 0 : num;
        };

        // Helper function to get value by header name or column index
        const getValue = (headerName: string, fallbackIndex: number) => {
          const headerIndex = headers.findIndex((h: string) => 
            h && h.toLowerCase().includes(headerName.toLowerCase())
          );
          return row[headerIndex !== -1 ? headerIndex : fallbackIndex] || '';
        };

        return {
          id: (index + 1).toString(),
          name: getValue('name', 0) || `Employee ${index + 1}`,
          employeeId: getValue('id', 1) || getValue('employee', 1) || `EMP${String(index + 1).padStart(3, '0')}`,
          designation: getValue('designation', 2) || getValue('title', 2),
          department: getValue('department', 3) || getValue('dept', 3),
          email: getValue('email', 4),
          phone: getValue('phone', 5) || getValue('mobile', 5),
          dateOfJoining: getValue('joining', 6) || getValue('date', 6),
          basicSalary: parseNumber(getValue('basic', 7) || getValue('salary', 7) || row[7]),
          hra: parseNumber(getValue('hra', 8) || getValue('house', 8)),
          da: parseNumber(getValue('da', 9) || getValue('dearness', 9)),
          conveyanceAllowance: parseNumber(getValue('conveyance', 10) || getValue('transport', 10)),
          medicalAllowance: parseNumber(getValue('medical', 11) || getValue('health', 11)),
          specialAllowance: parseNumber(getValue('special', 12) || getValue('other', 12)),
          providentFund: parseNumber(getValue('pf', 13) || getValue('provident', 13)),
          professionalTax: parseNumber(getValue('pt', 14) || getValue('professional', 14)),
          incomeTax: parseNumber(getValue('tax', 15) || getValue('income', 15)),
          otherDeductions: parseNumber(getValue('deduction', 16) || getValue('other', 16)),
          bankName: getValue('bank', 17),
          accountNumber: getValue('account', 18) || getValue('number', 18),
          ifscCode: getValue('ifsc', 19) || getValue('code', 19),
        };
      });
    } catch (error) {
      console.error('Error fetching employees from Google Sheets:', error);
      throw error;
    }
  }

  async validateSheetAccess(spreadsheetId?: string): Promise<boolean> {
    try {
      const sheetId = spreadsheetId || process.env.DEFAULT_SPREADSHEET_ID;
      if (!sheetId) {
        throw new Error('No spreadsheet ID provided');
      }
      
      await this.sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      });
      return true;
    } catch (error) {
      console.error('Error validating sheet access:', error);
      return false;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
