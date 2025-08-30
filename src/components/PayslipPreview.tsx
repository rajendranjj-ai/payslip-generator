'use client';

import React from 'react';
import { X, Download } from 'lucide-react';
import { PayslipData } from '@/types/employee';
import { PayslipCalculator } from '@/lib/payslipCalculations';

interface PayslipPreviewProps {
  payslip: PayslipData;
  onClose: () => void;
  onDownload: () => void;
}

export const PayslipPreview: React.FC<PayslipPreviewProps> = ({
  payslip,
  onClose,
  onDownload,
}) => {
  const { employee, month, year, workingDays, actualWorkingDays, grossEarnings, totalDeductions, netSalary, generatedDate } = payslip;
  const netSalaryInWords = PayslipCalculator.numberToWords(netSalary);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Payslip Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-black hover:text-black hover:bg-gray-100 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Payslip Content */}
        <div className="p-6">
          <div className="border-2 border-gray-800 bg-white">
            {/* Company Header */}
            <div className="text-center p-6 border-b-2 border-gray-800 bg-gray-50">
              <h1 className="text-2xl font-bold mb-2">
                {process.env.NEXT_PUBLIC_COMPANY_NAME || 'Your Company Name'}
              </h1>
              <p className="text-sm mb-4">
                {process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Your Company Address'}
              </p>
              <h2 className="text-lg font-bold underline">SALARY SLIP</h2>
            </div>

            {/* Employee Information */}
            <div className="flex p-4 border-b border-gray-800">
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Employee Name:</span>
                  {employee.name}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Employee ID:</span>
                  {employee.employeeId}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Designation:</span>
                  {employee.designation || 'Not specified'}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Department:</span>
                  {employee.department || 'Not specified'}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Date of Joining:</span>
                  {employee.dateOfJoining || 'Not specified'}
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Pay Period:</span>
                  {month} {year}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Working Days:</span>
                  {workingDays}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Actual Working Days:</span>
                  {actualWorkingDays}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Generated Date:</span>
                  {generatedDate}
                </div>
                <div className="mb-2">
                  <span className="font-semibold inline-block w-36">Account No:</span>
                  {employee.accountNumber || 'Not provided'}
                </div>
              </div>
            </div>

            {/* Salary Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-800 p-3 text-center font-bold">EARNINGS</th>
                  <th className="border border-gray-800 p-3 text-center font-bold w-24">AMOUNT (₹)</th>
                  <th className="border border-gray-800 p-3 text-center font-bold">DEDUCTIONS</th>
                  <th className="border border-gray-800 p-3 text-center font-bold w-24">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-2">Basic Salary</td>
                  <td className="border border-gray-800 p-2 text-right font-semibold">
                    {employee.basicSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-gray-800 p-2">Provident Fund</td>
                  <td className="border border-gray-800 p-2 text-right font-semibold">
                    {(employee.providentFund || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-2">House Rent Allowance</td>
                  <td className="border border-gray-800 p-2 text-right font-semibold">
                    {(employee.hra || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="border border-gray-800 p-2">Income Tax</td>
                  <td className="border border-gray-800 p-2 text-right font-semibold">
                    {(employee.incomeTax || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 p-2"></td>
                  <td className="border border-gray-800 p-2"></td>
                  <td className="border border-gray-800 p-2">Other Deductions</td>
                  <td className="border border-gray-800 p-2 text-right font-semibold">
                    {(employee.otherDeductions || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-800 p-2 font-bold">GROSS EARNINGS</td>
                  <td className="border border-gray-800 p-2 text-right font-bold">
                    ₹{grossEarnings.toLocaleString('en-IN')}
                  </td>
                  <td className="border border-gray-800 p-2 font-bold">TOTAL DEDUCTIONS</td>
                  <td className="border border-gray-800 p-2 text-right font-bold">
                    ₹{totalDeductions.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-gray-800 p-2 font-bold" colSpan={3}>NET SALARY</td>
                  <td className="border border-gray-800 p-2 text-right font-bold text-green-700">
                    ₹{netSalary.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Amount in Words */}
            <div className="p-4 border-b border-gray-800 font-semibold">
              <strong>Net Salary in Words:</strong> ₹{netSalaryInWords}
            </div>

            {/* Footer */}
            <div className="flex justify-between p-4">
              <div>
                <div className="font-semibold mb-2">Bank Details:</div>
                <div className="text-sm">
                  <div>Bank: {employee.bankName || 'Not provided'}</div>
                  <div>Account: {employee.accountNumber || 'Not provided'}</div>
                  <div>IFSC: {employee.ifscCode || 'Not provided'}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-8">Authorized Signatory</div>
                <div className="border-t border-gray-800 w-48 pt-1">
                  <div className="text-xs text-black">Signature</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
