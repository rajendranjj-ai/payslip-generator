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

        // Direct column mapping based on known Google Sheet structure

        // ALWAYS generate unique employee ID based on name + row index
        // This prevents duplicate IDs when Google Sheet has job titles instead of unique IDs
        const rawName = row[0];
        const name = (rawName && typeof rawName === 'string') ? rawName.trim() : 'Unknown';
        
        let namePrefix = 'UNK'; // Default prefix
        try {
          if (name && name !== 'Unknown') {
            const cleanName = String(name).replace(/[^a-zA-Z]/g, '');
            namePrefix = cleanName.length >= 3 ? cleanName.substring(0, 3).toUpperCase() : 
                        cleanName.length > 0 ? cleanName.toUpperCase().padEnd(3, 'X') : 'UNK';
          }
        } catch (error) {
          console.error(`Error processing name for row ${index + 1}:`, error);
          namePrefix = 'ERR';
        }
        
        const uniqueEmployeeId = `${namePrefix}${String(index + 1).padStart(3, '0')}`;
        
        // Use explicit column indices based on the known header structure with safe access
        // Headers: Name(0), Designation(1), Email(2), Phone(3), Date(4), Basic(5), ESI(6), PF(7), Bank(8), Account(9), IFSC(10)
        const esiValue = (row && row[6] !== undefined) ? String(row[6]).trim() : '0';
        const pfValue = (row && row[7] !== undefined) ? String(row[7]).trim() : '0';

        return {
          id: (index + 1).toString(),
          name: row[0] || `Employee ${index + 1}`,
          employeeId: uniqueEmployeeId,
          designation: row[1] || 'N/A',
          department: 'N/A', // Not in current sheet structure
          email: row[2] || '',
          phone: row[3] || '',
          dateOfJoining: row[4] || '',
          basicSalary: parseNumber(row[5]),
          hra: 0, // Not in current sheet structure
          da: 0, // Not in current sheet structure
          conveyanceAllowance: 0, // Not in current sheet structure
          medicalAllowance: 0, // Not in current sheet structure
          specialAllowance: 0, // Not in current sheet structure
          providentFund: parseNumber(pfValue),
          professionalTax: 0, // Not in current sheet structure
          incomeTax: 0, // Not in current sheet structure
          esi: parseNumber(esiValue),
          otherDeductions: 0, // Not in current sheet structure
          bankName: row[8] || '',
          accountNumber: row[9] || '',
          ifscCode: row[10] || '',
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
