'use client';

import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Employee, PayslipData } from '@/types/employee';
import { EmployeeList } from './EmployeeList';
import { PayslipPreview } from './PayslipPreview';

interface PayslipGeneratorProps {
  className?: string;
}

export const PayslipGenerator: React.FC<PayslipGeneratorProps> = ({ className }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [payslips, setPayslips] = useState<PayslipData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [workingDays, setWorkingDays] = useState(30);
  const [actualWorkingDays, setActualWorkingDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewEmployee, setPreviewEmployee] = useState<PayslipData | null>(null);
  const [sheetInfo, setSheetInfo] = useState<string>('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  useEffect(() => {
    // Auto-load employees on component mount
    fetchEmployees();
  }, []); 

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch employees');
      }

      setEmployees(data.data);
      setSheetInfo(data.spreadsheetId || '');
      setSuccess(`Successfully loaded ${data.count} employees from Google Sheet`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePayslips = async () => {
    if (selectedEmployees.length === 0) {
      setError('Please select at least one employee');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payslips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month: months[selectedMonth],
          year: selectedYear,
          workingDays,
          actualWorkingDays,
          employeeIds: selectedEmployees,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate payslips');
      }

      setPayslips(data.data);
      setSuccess(`Successfully generated ${data.count} payslips`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslipPDF = async (employee: Employee) => {
    try {
      const response = await fetch('/api/payslips/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          month: months[selectedMonth],
          year: selectedYear,
          workingDays,
          actualWorkingDays,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const htmlContent = await response.text();
      
      // Create a new window with the payslip content
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Trigger print dialog
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  };

  const previewPayslip = (payslip: PayslipData) => {
    setPreviewEmployee(payslip);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Employee Payslip Generator
                </h1>
                <p className="text-blue-100 mt-1">
                  Generate professional payslips with Google Sheets integration
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <p className="text-white text-sm font-medium">Current Month</p>
                <p className="text-white text-lg font-bold">{months[selectedMonth]} {selectedYear}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Payroll Configuration</h3>
                </div>
                
                <div className="space-y-4">
                  {sheetInfo && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                        <div className="text-sm">
                          <div className="font-semibold text-green-800">Google Sheet Connected</div>
                          <div className="text-xs text-green-600 font-mono">
                            ID: ...{sheetInfo.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={fetchEmployees}
                      disabled={loading}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Loading...' : 'Refresh Data'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                                          <label className="block text-sm font-medium text-black mb-1">
                      Month
                    </label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {months.map((month, index) => (
                          <option key={month} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                                          <label className="block text-sm font-medium text-black mb-1">
                      Year
                    </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                                          <label className="block text-sm font-medium text-black mb-1">
                      Working Days
                    </label>
                      <input
                        type="number"
                        value={workingDays}
                        onChange={(e) => setWorkingDays(parseInt(e.target.value))}
                        min="1"
                        max="31"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                                          <label className="block text-sm font-medium text-black mb-1">
                      Actual Days
                    </label>
                      <input
                        type="number"
                        value={actualWorkingDays}
                        onChange={(e) => setActualWorkingDays(parseInt(e.target.value))}
                        min="0"
                        max={workingDays}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={generatePayslips}
                    disabled={loading || selectedEmployees.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Generate Payslips
                  </button>
                </div>
              </div>
            </div>

            {/* Employee List */}
            <div className="lg:col-span-2">
              <EmployeeList
                employees={employees}
                selectedEmployees={selectedEmployees}
                onSelectionChange={setSelectedEmployees}
                payslips={payslips}
                onPreview={previewPayslip}
                onDownloadPDF={downloadPayslipPDF}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payslip Preview Modal */}
      {previewEmployee && (
        <PayslipPreview
          payslip={previewEmployee}
          onClose={() => setPreviewEmployee(null)}
          onDownload={() => downloadPayslipPDF(previewEmployee.employee)}
        />
      )}
    </div>
  );
};
