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
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="card-title">
          <Users className="h-5 w-5" />
          Employees ({employees.length})
        </h3>
        <button
          onClick={handleSelectAll}
          className="btn-small btn-view"
        >
          {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: '50px',
                  minWidth: '50px'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === employees.length && employees.length > 0}
                    onChange={handleSelectAll}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#2563eb'
                    }}
                  />
                </th>
                                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px 16px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: '200px'
                      }}>
                        Name
                      </th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px 16px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: '130px'
                      }}>
                        Designation
                      </th>
                      <th style={{ 
                        textAlign: 'right', 
                        padding: '12px 16px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: '120px'
                      }}>
                        Basic Salary
                      </th>
                      <th style={{ 
                        textAlign: 'right', 
                        padding: '12px 16px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: '100px'
                      }}>
                        PF
                      </th>
                      <th style={{ 
                        textAlign: 'right', 
                        padding: '12px 16px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: '100px'
                      }}>
                        ESI
                      </th>
                      <th style={{ 
                        textAlign: 'right', 
                        padding: '12px 16px', 
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: '120px'
                      }}>
                        Net Salary
                      </th>
                <th style={{ 
                  textAlign: 'center', 
                  padding: '12px 16px', 
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: '100px',
                  minWidth: '100px'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => {
                // Create a unique identifier to prevent duplicate employee ID issues
                const uniqueId = `${employee.id}-${employee.employeeId}`;
                const isSelected = selectedEmployees.includes(employee.employeeId);
                const payslip = getPayslipForEmployee(employee.employeeId);
                const hasPayslip = !!payslip;

                return (
                  <tr
                    key={uniqueId}
                    className={`table-row ${isSelected ? 'selected' : ''}`}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleEmployeeToggle(employee.employeeId);
                        }}
                        className="checkbox-field"
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '500', color: '#111827' }}>
                          {employee.name}
                        </span>
                        {hasPayslip && (
                          <CheckCircle2 
                            style={{ 
                              width: '16px', 
                              height: '16px', 
                              color: '#10b981',
                              flexShrink: 0
                            }} 
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      fontSize: '13px',
                      color: '#374151'
                    }}>
                      {employee.designation || 'N/A'}
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      fontSize: '13px',
                      color: '#374151',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      ₹{employee.basicSalary.toLocaleString('en-IN')}
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      fontSize: '13px',
                      color: '#374151',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      ₹{(employee.providentFund || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      fontSize: '13px',
                      color: '#374151',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      ₹{(employee.esi || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ 
                      padding: '12px 16px', 
                      fontSize: '13px',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      {hasPayslip && payslip ? (
                        <span style={{ color: '#10b981' }}>
                          ₹{payslip.netSalary.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {hasPayslip && payslip && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreview(payslip);
                            }}
                            className="btn-icon btn-icon-view"
                            title="Preview Payslip"
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadPDF(employee);
                            }}
                            className="btn-icon btn-icon-download"
                            title="Download PDF"
                          >
                            <Download style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
