# Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```bash
# Google Sheets API Configuration
GOOGLE_SHEETS_PROJECT_ID=your_project_id
GOOGLE_SHEETS_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_CLIENT_ID=your_client_id

# Default Google Sheet ID (optional)
DEFAULT_SPREADSHEET_ID=your_google_sheet_id

# Application Settings
NEXT_PUBLIC_APP_NAME="Payslip Generator"
NEXT_PUBLIC_COMPANY_NAME="Your Company Name"
NEXT_PUBLIC_COMPANY_ADDRESS="Your Company Address"
```

## Google Sheets Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a service account
5. Generate a JSON key for the service account
6. Share your Google Sheet with the service account email
7. Copy the credentials to your `.env.local` file

## Google Sheet Format

Your Google Sheet should have the following columns (starting from column A):

| Column | Field | Type |
|--------|-------|------|
| A | Name | Text |
| B | Employee ID | Text |
| C | Designation | Text |
| D | Department | Text |
| E | Email | Email |
| F | Phone | Text |
| G | Date of Joining | Date |
| H | Basic Salary | Number |
| I | HRA | Number |
| J | DA | Number |
| K | Conveyance Allowance | Number |
| L | Medical Allowance | Number |
| M | Special Allowance | Number |
| N | Provident Fund | Number |
| O | Professional Tax | Number |
| P | Income Tax | Number |
| Q | Other Deductions | Number |
| R | Bank Name | Text |
| S | Account Number | Text |
| T | IFSC Code | Text |
