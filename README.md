# Payslip Generator

A modern Next.js application for generating employee payslips using Google Sheets as the data source. This application provides a clean, user-friendly interface for HR teams to generate and download payslips for all employees in bulk.

## Features

- 📊 **Google Sheets Integration**: Directly connect to Google Sheets for employee data
- 📄 **Bulk Payslip Generation**: Generate payslips for multiple employees simultaneously
- 👀 **Preview Mode**: Preview payslips before downloading
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 💾 **PDF Export**: Download payslips as PDF files
- 🔧 **Configurable**: Customize working days, company information, and more
- 📈 **Real-time Calculations**: Automatic salary calculations with Indian currency formatting

## Screenshots

The application includes:
- Clean dashboard with employee selection
- Month/year picker for payroll periods
- Real-time payslip preview
- PDF generation and download functionality

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google Cloud Project with Sheets API enabled
- A Google Sheet with employee data

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd payslip-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
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

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Google Cloud Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Sheets API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Download the JSON key file

4. **Share Google Sheet**
   - Open your Google Sheet
   - Click "Share" and add the service account email
   - Give "Viewer" permissions

### Google Sheet Format

Your Google Sheet should have the following columns (Row 1 should contain headers):

| Column | Header | Type | Description |
|--------|--------|------|-------------|
| A | Name | Text | Employee full name |
| B | Employee ID | Text | Unique employee identifier |
| C | Designation | Text | Job title |
| D | Department | Text | Department name |
| E | Email | Email | Employee email |
| F | Phone | Text | Contact number |
| G | Date of Joining | Date | Joining date (DD/MM/YYYY) |
| H | Basic Salary | Number | Monthly basic salary |
| I | HRA | Number | House Rent Allowance |
| J | DA | Number | Dearness Allowance |
| K | Conveyance Allowance | Number | Transport allowance |
| L | Medical Allowance | Number | Medical benefits |
| M | Special Allowance | Number | Other allowances |
| N | Provident Fund | Number | PF deduction |
| O | Professional Tax | Number | Professional tax |
| P | Income Tax | Number | Income tax deduction |
| Q | Other Deductions | Number | Other deductions |
| R | Bank Name | Text | Employee's bank |
| S | Account Number | Text | Bank account number |
| T | IFSC Code | Text | Bank IFSC code |

## Usage

1. **Connect to Google Sheet**
   - Enter your Google Sheet ID in the configuration panel
   - The app will automatically load employee data

2. **Configure Payroll Period**
   - Select the month and year
   - Set working days and actual working days

3. **Select Employees**
   - Choose individual employees or select all
   - View employee details and salary information

4. **Generate Payslips**
   - Click "Generate Payslips" to create payslips for selected employees
   - Preview individual payslips before downloading

5. **Download PDFs**
   - Use the download button to get PDF versions
   - Print directly from the preview window

## API Endpoints

- `GET /api/employees` - Fetch employees from Google Sheet
- `POST /api/payslips/generate` - Generate payslips for multiple employees
- `GET /api/payslips/generate` - Get single employee payslip
- `POST /api/payslips/pdf` - Generate PDF for specific employee

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: Google Sheets API
- **PDF Generation**: HTML to PDF conversion
- **Deployment**: Vercel (recommended)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/payslip-generator/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## Roadmap

- [ ] Email integration for sending payslips
- [ ] Multiple company support
- [ ] Advanced salary calculations
- [ ] Attendance integration
- [ ] Payroll history and reporting
- [ ] Multi-language support