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

  // Payslip preview component ready

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderBottom: '2px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}
        >
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: '#111827',
            margin: 0 
          }}>
            📄 Payslip Preview
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                color: '#374151',
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>

        {/* Payslip Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            border: '3px solid #000', 
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {/* Company Header */}
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem', 
              borderBottom: '2px solid #000', 
              backgroundColor: '#f8f9fa' 
            }}>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#000',
                margin: '0 0 0.5rem 0'
              }}>
                {process.env.NEXT_PUBLIC_COMPANY_NAME || 'St.Madonna\'s Matric Hr Sec School'}
              </h1>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#000',
                margin: '0 0 1rem 0'
              }}>
                {process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Sattur - Sivakasi - Kalugumalai Rd, Kalugumalai, Tamil Nadu 628552'}
              </p>
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold',
                color: '#000',
                textDecoration: 'underline',
                margin: 0
              }}>
                SALARY SLIP
              </h2>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#000',
                margin: '0.5rem 0 0 0'
              }}>
                For the month of {month} {year}
              </p>
            </div>

            {/* Employee Information Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px', 
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    width: '25%'
                  }}>
                    Employee Name
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', width: '25%' }}>
                    {employee.name}
                  </td>
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px', 
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    width: '25%'
                  }}>
                    Designation
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', width: '25%' }}>
                    {employee.designation || 'Not specified'}
                  </td>
                </tr>
                <tr>
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px', 
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa'
                  }}>
                    ESI Amount
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>
                    ₹{(employee.esi || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px', 
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa'
                  }}>
                    Pay Period
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>
                    {month} {year}
                  </td>
                </tr>
                <tr>
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px', 
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa'
                  }}>
                    PF Amount
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>
                    ₹{(employee.providentFund || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ 
                    border: '1px solid #000', 
                    padding: '8px', 
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa'
                  }}>
                    Working Days
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>
                    {workingDays} / {actualWorkingDays} (Actual)
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Salary Details Table */}
            <div style={{ padding: '1rem 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #000' }}>
                <thead>
                  <tr style={{ backgroundColor: '#e9ecef' }}>
                    <th style={{ 
                      border: '1px solid #000', 
                      padding: '12px', 
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      EARNINGS
                    </th>
                    <th style={{ 
                      border: '1px solid #000', 
                      padding: '12px', 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      AMOUNT (₹)
                    </th>
                    <th style={{ 
                      border: '1px solid #000', 
                      padding: '12px', 
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      DEDUCTIONS
                    </th>
                    <th style={{ 
                      border: '1px solid #000', 
                      padding: '12px', 
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      AMOUNT (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '10px', fontSize: '0.875rem' }}>
                      Basic Salary
                    </td>
                    <td style={{ 
                      border: '1px solid #000', 
                      padding: '10px', 
                      textAlign: 'right', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {employee.basicSalary.toLocaleString('en-IN')}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '10px', fontSize: '0.875rem' }}>
                      Provident Fund
                    </td>
                    <td style={{ 
                      border: '1px solid #000', 
                      padding: '10px', 
                      textAlign: 'right', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {(employee.providentFund || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '10px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '10px', fontSize: '0.875rem' }}>
                      ESI
                    </td>
                    <td style={{ 
                      border: '1px solid #000', 
                      padding: '10px', 
                      textAlign: 'right', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {(employee.esi || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '10px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '10px' }}></td>
                    <td style={{ border: '1px solid #000', padding: '10px', fontSize: '0.875rem' }}>
                      Other Deductions
                    </td>
                    <td style={{ 
                      border: '1px solid #000', 
                      padding: '10px', 
                      textAlign: 'right', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {(employee.otherDeductions || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <td style={{ 
                      border: '2px solid #000', 
                      padding: '12px', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      GROSS EARNINGS
                    </td>
                    <td style={{ 
                      border: '2px solid #000', 
                      padding: '12px', 
                      textAlign: 'right', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {grossEarnings.toLocaleString('en-IN')}
                    </td>
                    <td style={{ 
                      border: '2px solid #000', 
                      padding: '12px', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      TOTAL DEDUCTIONS
                    </td>
                    <td style={{ 
                      border: '2px solid #000', 
                      padding: '12px', 
                      textAlign: 'right', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {totalDeductions.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Salary Box */}
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#e3f2fd', 
              borderTop: '3px solid #000',
              border: '2px solid #000',
              margin: '1rem 0'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fff',
                border: '1px solid #000',
                borderRadius: '4px'
              }}>
                <span style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold', 
                  color: '#000' 
                }}>
                  NET SALARY
                </span>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#2e7d32',
                  border: '2px solid #2e7d32',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px'
                }}>
                  ₹{netSalary.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#000',
                fontWeight: '500',
                padding: '0.5rem',
                backgroundColor: '#fff',
                border: '1px solid #000',
                borderRadius: '4px'
              }}>
                <strong>Amount in words:</strong> {netSalaryInWords}
              </div>
            </div>

            {/* Bank Details Box */}
            {(employee.bankName || employee.accountNumber || employee.ifscCode) && (
              <div style={{ 
                padding: '1rem', 
                borderTop: '2px solid #000', 
                backgroundColor: '#f8f9fa',
                border: '1px solid #000',
                margin: '1rem 0'
              }}>
                <h3 style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '1rem', 
                  color: '#000',
                  fontSize: '1rem',
                  textAlign: 'center',
                  textDecoration: 'underline'
                }}>
                  BANK DETAILS
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ 
                        border: '1px solid #000', 
                        padding: '8px', 
                        fontWeight: 'bold',
                        backgroundColor: '#e9ecef',
                        width: '33.33%'
                      }}>
                        Bank Name
                      </td>
                      <td style={{ 
                        border: '1px solid #000', 
                        padding: '8px',
                        width: '66.67%'
                      }}>
                        {employee.bankName || 'Not specified'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ 
                        border: '1px solid #000', 
                        padding: '8px', 
                        fontWeight: 'bold',
                        backgroundColor: '#e9ecef'
                      }}>
                        Account Number
                      </td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>
                        {employee.accountNumber || 'Not specified'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ 
                        border: '1px solid #000', 
                        padding: '8px', 
                        fontWeight: 'bold',
                        backgroundColor: '#e9ecef'
                      }}>
                        IFSC Code
                      </td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>
                        {employee.ifscCode || 'Not specified'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem', 
              borderTop: '2px solid #000',
              backgroundColor: '#f8f9fa',
              fontSize: '0.75rem',
              color: '#666'
            }}>
              <p style={{ margin: 0 }}>This is a system generated payslip</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};