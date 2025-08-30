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

      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            fontSize: '14px'
          }}>
            <thead style={{ 
              background: '#f9fafb', 
              borderBottom: '2px solid #e5e7eb',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
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
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      background: isSelected ? '#eff6ff' : 'white',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelected ? '#eff6ff' : 'white';
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleEmployeeToggle(employee.employeeId);
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#2563eb'
                        }}
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
                            style={{
                              padding: '6px',
                              color: '#2563eb',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#dbeafe';
                              e.currentTarget.style.color = '#1d4ed8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#2563eb';
                            }}
                            title="Preview Payslip"
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownloadPDF(employee);
                            }}
                            style={{
                              padding: '6px',
                              color: '#059669',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#d1fae5';
                              e.currentTarget.style.color = '#047857';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#059669';
                            }}
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
