'use client';

import React from 'react';
import { Users, Eye, Download, CheckCircle2 } from 'lucide-react';
import { Employee, PayslipData } from '@/types/employee';

interface EmployeeListProps {
  employees: Employee[];
  selectedEmployees: string[];
  onSelectionChange: (employeeIds: string[]) => void;
  payslips: PayslipData[];
  onPreview: (payslip: PayslipData) => void;
  onDownloadPDF: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  selectedEmployees,
  onSelectionChange,
  payslips,
  onPreview,
  onDownloadPDF,
}) => {
  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(employees.map(emp => emp.employeeId));
    }
  };

  const handleEmployeeToggle = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      onSelectionChange(selectedEmployees.filter(id => id !== employeeId));
    } else {
      onSelectionChange([...selectedEmployees, employeeId]);
    }
  };

  const getPayslipForEmployee = (employeeId: string): PayslipData | undefined => {
    return payslips.find(p => p.employee.employeeId === employeeId);
  };

  if (employees.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 text-center border border-gray-200">
        <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Employees Found</h3>
        <p className="text-gray-600">
          Click "Refresh Data" to load employee information from Google Sheets.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-black flex items-center gap-2">
          <Users className="h-5 w-5" />
          Employees ({employees.length})
        </h3>
        <button
          onClick={handleSelectAll}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="bg-white rounded-md border border-gray-200">
        <div className="max-h-96 overflow-y-auto">
          {employees.map((employee) => {
            const isSelected = selectedEmployees.includes(employee.employeeId);
            const payslip = getPayslipForEmployee(employee.employeeId);
            const hasPayslip = !!payslip;

            return (
              <div
                key={employee.employeeId}
                className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleEmployeeToggle(employee.employeeId)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-black">{employee.name}</h4>
                        {hasPayslip && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-sm text-black">
                        {employee.employeeId} • {employee.designation} • {employee.department}
                      </div>
                      <div className="text-xs text-black">
                        Basic: ₹{employee.basicSalary.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasPayslip && payslip && (
                      <>
                        <button
                          onClick={() => onPreview(payslip)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          title="Preview Payslip"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDownloadPDF(employee)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {hasPayslip && payslip && (
                      <div className="text-xs text-green-600 font-medium">
                        Net: ₹{payslip.netSalary.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEmployees.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm text-black">
            <strong>{selectedEmployees.length}</strong> employee{selectedEmployees.length !== 1 ? 's' : ''} selected
            {payslips.length > 0 && (
              <span className="ml-2">
                • <strong>{payslips.length}</strong> payslip{payslips.length !== 1 ? 's' : ''} generated
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
