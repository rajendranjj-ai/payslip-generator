import { PayslipData } from '@/types/employee';
import { PayslipCalculator } from './payslipCalculations';

export class PayslipPDFGenerator {
  static generatePayslipHTML(payslipData: PayslipData): string {
    try {
      const { employee, month, year, workingDays, actualWorkingDays, grossEarnings, totalDeductions, netSalary, generatedDate } = payslipData;
      
      // Validate essential data
      if (!employee || !employee.name) {
        throw new Error('Invalid employee data provided to PDF generator');
      }
      
      // Safe conversion with fallbacks
      const safeNetSalary = Number(netSalary) || 0;
      const netSalaryInWords = PayslipCalculator.numberToWords(safeNetSalary);
      
      // Safe string conversions
      const safeName = String(employee.name || 'Unknown Employee');
      const safeDesignation = String(employee.designation || 'Not specified');
      const safeMonth = String(month || 'Unknown');
      const safeYear = String(year || new Date().getFullYear());

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
          }
          .payslip-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
            padding: 0;
          }
          .header {
            text-align: center;
            padding: 20px;
            border-bottom: 2px solid #000;
            background-color: #f8f9fa;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .company-address {
            font-size: 14px;
            margin-bottom: 15px;
          }
          .payslip-title {
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
          }
          .employee-info {
            display: flex;
            padding: 15px;
            border-bottom: 1px solid #000;
          }
          .employee-left, .employee-right {
            flex: 1;
          }
          .info-row {
            margin-bottom: 8px;
          }
          .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
          }
          .salary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0;
          }
          .salary-table th, .salary-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .salary-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: center;
          }
          .earnings-section, .deductions-section {
            width: 50%;
            vertical-align: top;
          }
          .amount {
            text-align: right;
            font-weight: bold;
          }
          .total-row {
            font-weight: bold;
            background-color: #e9ecef;
          }
          .net-salary {
            background-color: #d4edda;
            font-weight: bold;
            font-size: 14px;
          }
          .amount-in-words {
            padding: 15px;
            border-top: 1px solid #000;
            font-weight: bold;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            border-top: 1px solid #000;
          }
          .signature-section {
            text-align: center;
            margin-top: 30px;
          }
          .signature-line {
            border-top: 1px solid #000;
            width: 200px;
            margin: 0 auto;
            padding-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="payslip-container">
          <div class="header">
            <div class="company-name">${process.env.NEXT_PUBLIC_COMPANY_NAME || 'Company Name'}</div>
            <div class="company-address">${process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Company Address'}</div>
            <div class="payslip-title">SALARY SLIP</div>
          </div>

          <div class="employee-info">
            <div class="employee-left">
              <div class="info-row">
                <span class="label">Employee Name:</span> ${employee.name}
              </div>
              <div class="info-row">
                <span class="label">Designation:</span> ${employee.designation}
              </div>
              <div class="info-row">
                <span class="label">Date of Joining:</span> ${employee.dateOfJoining}
              </div>
              <div class="info-row">
                <span class="label">ESI Amount:</span> ₹${(employee.esi || 0).toLocaleString('en-IN')}
              </div>
              <div class="info-row">
                <span class="label">PF Amount:</span> ₹${(employee.providentFund || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div class="employee-right">
              <div class="info-row">
                <span class="label">Pay Period:</span> ${month} ${year}
              </div>
              <div class="info-row">
                <span class="label">Working Days:</span> ${workingDays}
              </div>
              <div class="info-row">
                <span class="label">Actual Working Days:</span> ${actualWorkingDays}
              </div>
              <div class="info-row">
                <span class="label">Generated Date:</span> ${generatedDate}
              </div>
              <div class="info-row">
                <span class="label">Account No:</span> ${employee.accountNumber}
              </div>
            </div>
          </div>

          <table class="salary-table">
            <tr>
              <th style="width: 50%;">EARNINGS</th>
              <th style="width: 25%;">AMOUNT (₹)</th>
              <th style="width: 50%;">DEDUCTIONS</th>
              <th style="width: 25%;">AMOUNT (₹)</th>
            </tr>
            <tr>
              <td>Basic Salary</td>
              <td class="amount">${employee.basicSalary.toLocaleString('en-IN')}</td>
              <td>Provident Fund</td>
              <td class="amount">${(employee.providentFund || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>ESI</td>
              <td class="amount">${(employee.esi || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>Other Deductions</td>
              <td class="amount">${(employee.otherDeductions || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr class="total-row">
              <td><strong>GROSS EARNINGS</strong></td>
              <td class="amount"><strong>₹${grossEarnings.toLocaleString('en-IN')}</strong></td>
              <td><strong>TOTAL DEDUCTIONS</strong></td>
              <td class="amount"><strong>₹${totalDeductions.toLocaleString('en-IN')}</strong></td>
            </tr>
            <tr class="net-salary">
              <td colspan="3"><strong>NET SALARY</strong></td>
              <td class="amount"><strong>₹${netSalary.toLocaleString('en-IN')}</strong></td>
            </tr>
          </table>

          <div class="amount-in-words">
            <strong>Net Salary in Words:</strong> ₹${netSalaryInWords}
          </div>

          <div class="footer">
            <div>
              <div><strong>Bank Details:</strong></div>
              ${employee.bankName ? `<div>Bank: ${employee.bankName}</div>` : '<div>Bank: Not provided</div>'}
              ${employee.accountNumber ? `<div>Account: ${employee.accountNumber}</div>` : '<div>Account: Not provided</div>'}
              ${employee.ifscCode ? `<div>IFSC: ${employee.ifscCode}</div>` : '<div>IFSC: Not provided</div>'}
            </div>
            <div class="signature-section">
              <div>Authorized Signatory</div>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    } catch (error) {
      console.error('Error generating payslip HTML:', error);
      // Return a safe error template
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Error</title></head>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h2>Error Generating Payslip</h2>
          <p>There was an error generating the payslip. Please check the employee data and try again.</p>
          <p style="color: red; font-size: 12px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        </body>
        </html>
      `;
    }
  }

  static generateBulkPayslipHTML(payslipDataArray: PayslipData[]): string {
    try {
      if (!payslipDataArray || payslipDataArray.length === 0) {
        return '';
      }

      const payslipContents = payslipDataArray.map((payslipData, index) => {
        try {
          const { employee, month, year, workingDays, actualWorkingDays, grossEarnings, totalDeductions, netSalary, generatedDate } = payslipData;
          
          // Validate individual payslip data
          if (!employee || !employee.name) {
            console.error(`Invalid employee data at index ${index}:`, payslipData);
            return `<div>Error: Invalid employee data for payslip ${index + 1}</div>`;
          }
          
          // Safe conversions
          const safeNetSalary = Number(netSalary) || 0;
          const netSalaryInWords = PayslipCalculator.numberToWords(safeNetSalary);
          const safeName = String(employee.name || 'Unknown Employee');
          const safeDesignation = String(employee.designation || 'Not specified');
      
      // Add page break class for all payslips except the first one
      const pageBreakClass = index > 0 ? ' page-break' : '';

      return `
        <div class="payslip-container${pageBreakClass}">
          <div class="header">
            <div class="company-name">${process.env.NEXT_PUBLIC_COMPANY_NAME || 'Company Name'}</div>
            <div class="company-address">${process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Company Address'}</div>
            <div class="payslip-title">SALARY SLIP</div>
          </div>

          <div class="employee-info">
            <div class="employee-left">
              <div class="info-row">
                <span class="label">Employee Name:</span> ${employee.name}
              </div>
              <div class="info-row">
                <span class="label">Designation:</span> ${employee.designation}
              </div>
              <div class="info-row">
                <span class="label">Date of Joining:</span> ${employee.dateOfJoining}
              </div>
              <div class="info-row">
                <span class="label">ESI Amount:</span> ₹${(employee.esi || 0).toLocaleString('en-IN')}
              </div>
              <div class="info-row">
                <span class="label">PF Amount:</span> ₹${(employee.providentFund || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div class="employee-right">
              <div class="info-row">
                <span class="label">Pay Period:</span> ${month} ${year}
              </div>
              <div class="info-row">
                <span class="label">Working Days:</span> ${workingDays}
              </div>
              <div class="info-row">
                <span class="label">Actual Working Days:</span> ${actualWorkingDays}
              </div>
              <div class="info-row">
                <span class="label">Generated Date:</span> ${generatedDate}
              </div>
              <div class="info-row">
                <span class="label">Account No:</span> ${employee.accountNumber}
              </div>
            </div>
          </div>

          <table class="salary-table">
            <tr>
              <th style="width: 50%;">EARNINGS</th>
              <th style="width: 25%;">AMOUNT (₹)</th>
              <th style="width: 50%;">DEDUCTIONS</th>
              <th style="width: 25%;">AMOUNT (₹)</th>
            </tr>
            <tr>
              <td>Basic Salary</td>
              <td class="amount">${employee.basicSalary.toLocaleString('en-IN')}</td>
              <td>Provident Fund</td>
              <td class="amount">${(employee.providentFund || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>ESI</td>
              <td class="amount">${(employee.esi || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td>Other Deductions</td>
              <td class="amount">${(employee.otherDeductions || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr class="total-row">
              <td><strong>GROSS EARNINGS</strong></td>
              <td class="amount"><strong>₹${grossEarnings.toLocaleString('en-IN')}</strong></td>
              <td><strong>TOTAL DEDUCTIONS</strong></td>
              <td class="amount"><strong>₹${totalDeductions.toLocaleString('en-IN')}</strong></td>
            </tr>
            <tr class="net-salary">
              <td colspan="3"><strong>NET SALARY</strong></td>
              <td class="amount"><strong>₹${netSalary.toLocaleString('en-IN')}</strong></td>
            </tr>
          </table>

          <div class="amount-in-words">
            <strong>Net Salary in Words:</strong> ₹${netSalaryInWords}
          </div>

          <div class="footer">
            <div>
              <div><strong>Bank Details:</strong></div>
              ${employee.bankName ? `<div>Bank: ${employee.bankName}</div>` : '<div>Bank: Not provided</div>'}
              ${employee.accountNumber ? `<div>Account: ${employee.accountNumber}</div>` : '<div>Account: Not provided</div>'}
              ${employee.ifscCode ? `<div>IFSC: ${employee.ifscCode}</div>` : '<div>IFSC: Not provided</div>'}
            </div>
            <div class="signature-section">
              <div>Authorized Signatory</div>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      `;
        } catch (error) {
          console.error(`Error in individual payslip ${index + 1}:`, error);
          return `<div style="border: 2px solid red; padding: 20px; margin: 20px; text-align: center;">
            <h3>Error in Payslip ${index + 1}</h3>
            <p>Employee: ${payslipData.employee?.name || 'Unknown'}</p>
            <p style="color: red;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>`;
        }
      }).join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Payslips - ${payslipDataArray[0]?.month || 'Unknown'} ${payslipDataArray[0]?.year || 'Unknown'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
          }
          .payslip-container {
            max-width: 800px;
            margin: 0 auto 40px auto;
            border: 2px solid #000;
            padding: 0;
          }
          .payslip-container.page-break {
            page-break-before: always;
            margin-top: 0;
          }
          .header {
            text-align: center;
            padding: 20px;
            border-bottom: 2px solid #000;
            background-color: #f8f9fa;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .company-address {
            font-size: 14px;
            margin-bottom: 15px;
          }
          .payslip-title {
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
          }
          .employee-info {
            display: flex;
            padding: 15px;
            border-bottom: 1px solid #000;
          }
          .employee-left, .employee-right {
            flex: 1;
          }
          .info-row {
            margin-bottom: 8px;
          }
          .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
          }
          .salary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0;
          }
          .salary-table th, .salary-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          .salary-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: center;
          }
          .earnings-section, .deductions-section {
            width: 50%;
            vertical-align: top;
          }
          .amount {
            text-align: right;
            font-weight: bold;
          }
          .total-row {
            font-weight: bold;
            background-color: #e9ecef;
          }
          .net-salary {
            background-color: #d4edda;
            font-weight: bold;
            font-size: 14px;
          }
          .amount-in-words {
            padding: 15px;
            border-top: 1px solid #000;
            font-weight: bold;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            border-top: 1px solid #000;
          }
          .signature-section {
            text-align: center;
            margin-top: 30px;
          }
          .signature-line {
            border-top: 1px solid #000;
            width: 200px;
            margin: 0 auto;
            padding-top: 5px;
          }
          
          /* Print-specific styles */
          @media print {
            body {
              padding: 0;
            }
            .payslip-container {
              margin-bottom: 0;
              page-break-after: always;
            }
            .payslip-container:last-child {
              page-break-after: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${payslipContents}
      </body>
      </html>
    `;
    } catch (error) {
      console.error('Error generating bulk payslip HTML:', error);
      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Error</title></head>
        <body style="font-family: Arial; padding: 20px; text-align: center;">
          <h2>Error Generating Bulk Payslips</h2>
          <p>There was an error generating the payslips. Please check the data and try again.</p>
          <p style="color: red; font-size: 12px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        </body>
        </html>
      `;
    }
  }

  static async generatePDFBuffer(payslipData: PayslipData): Promise<Buffer> {
    const html = this.generatePayslipHTML(payslipData);
    
    // This would typically use puppeteer or similar for server-side PDF generation
    // For now, return the HTML as a buffer for client-side conversion
    return Buffer.from(html, 'utf-8');
  }
}
