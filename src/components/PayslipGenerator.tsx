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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
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

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);
    setSuccess(null);

    const generatedPayslips: PayslipData[] = [];
    const totalEmployees = selectedEmployees.length;

    try {
      let successCount = 0;
      let failedEmployees: string[] = [];
      let processedCount = 0;

      for (let i = 0; i < selectedEmployees.length; i++) {
        const employeeId = selectedEmployees[i];
        const employee = employees.find(emp => emp.employeeId === employeeId);
        const employeeName = employee?.name || employeeId;
        
        // Update progress to show we're starting this employee
        const startProgress = Math.round((processedCount / totalEmployees) * 90); // Reserve 10% for final validation
        setGenerationProgress(startProgress);

        try {
          // Generate payslip for individual employee
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
              employeeIds: [employeeId], // Single employee
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || `Failed to generate payslip for employee ${employeeName}`);
          }

          // Validate the response data more thoroughly
          if (data.success && data.data && data.data.length > 0) {
            // Additional validation: check if payslip data is complete
            const payslipData = data.data[0];
            if (payslipData && payslipData.employee && payslipData.netSalary !== undefined) {
              generatedPayslips.push(...data.data);
              successCount++;
              console.log(`✅ Successfully generated payslip for ${employeeName} (Net: ₹${payslipData.netSalary})`);
            } else {
              throw new Error(`Incomplete payslip data for ${employeeName}`);
            }
            
            // Check if there were any failed employees in the API response
            if (data.failedEmployees && data.failedEmployees.length > 0) {
              failedEmployees.push(...data.failedEmployees);
              console.warn(`⚠️ API reported failures for: ${data.failedEmployees.join(', ')}`);
            }
          } else {
            throw new Error(`Invalid response format or no payslip data returned for ${employeeName}`);
          }
        } catch (empError) {
          console.error(`❌ Failed to generate payslip for ${employeeName}:`, empError);
          failedEmployees.push(employeeName);
          // Continue with next employee instead of stopping
        }

        // Update progress based on completed processing (success or failure)
        processedCount++;
        const completedProgress = Math.round((processedCount / totalEmployees) * 90);
        setGenerationProgress(completedProgress);

        // Small delay to show progress visually and prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Final validation and progress completion
      setGenerationProgress(95);
      
      // Validate that all generated payslips are actually usable
      const validPayslips = generatedPayslips.filter(payslip => 
        payslip && payslip.employee && payslip.employee.name && 
        payslip.netSalary !== undefined && !isNaN(payslip.netSalary)
      );
      
      if (validPayslips.length !== generatedPayslips.length) {
        console.warn(`⚠️ Found ${generatedPayslips.length - validPayslips.length} invalid payslips, filtering them out`);
      }

      setPayslips(validPayslips);
      setGenerationProgress(100);
      
      // Show appropriate success/error message with accurate counts
      const totalSelected = selectedEmployees.length;
      const actualSuccessCount = validPayslips.length; // Use validated payslips count
      const failedCount = failedEmployees.length;
      
      if (failedCount === 0 && actualSuccessCount === totalSelected) {
        setSuccess(`✅ Successfully generated all ${actualSuccessCount} payslips!`);
        console.log(`🎉 Perfect! All ${actualSuccessCount} payslips generated successfully.`);
      } else if (actualSuccessCount > 0) {
        // Show detailed success/failure breakdown
        const shortFailedList = failedEmployees.slice(0, 3).join(', ');
        const moreFailures = failedCount > 3 ? ` and ${failedCount - 3} others` : '';
        
        if (actualSuccessCount >= totalSelected * 0.8) { // 80% or more success
          setSuccess(
            `✅ Generated ${actualSuccessCount}/${totalSelected} payslips successfully. ` +
            `⚠️ Failed for ${failedCount} employees: ${shortFailedList}${moreFailures}. ` +
            `Check browser console for detailed error information.`
          );
        } else { // Less than 80% success - treat as error
          setError(
            `⚠️ Only generated ${actualSuccessCount}/${totalSelected} payslips successfully. ` +
            `❌ Failed for ${failedCount} employees: ${shortFailedList}${moreFailures}. ` +
            `Check browser console and Google Sheets data for errors.`
          );
        }
        
        // Log detailed failure information to console for debugging
        console.group('📊 Payslip Generation Summary');
        console.log(`Total selected: ${totalSelected}`);
        console.log(`✅ Success: ${actualSuccessCount} (${Math.round(actualSuccessCount/totalSelected*100)}%)`);
        console.log(`❌ Failed: ${failedCount} (${Math.round(failedCount/totalSelected*100)}%)`);
        console.groupCollapsed('❌ Failed Employees Details');
        failedEmployees.forEach((failure: string, index: number) => {
          console.error(`${index + 1}. ${failure}`);
        });
        console.groupEnd();
        console.log('💡 Suggestion: Check Google Sheets for missing or invalid data (Basic Salary, ESI, PF values)');
        console.groupEnd();
      } else {
        // Complete failure
        const shortFailedList = failedEmployees.slice(0, 5).join(', ');
        const moreFailures = failedCount > 5 ? ` and ${failedCount - 5} others` : '';
        
        setError(
          `❌ Failed to generate payslips for all ${failedCount} employees: ${shortFailedList}${moreFailures}. ` +
          `Check browser console and Google Sheets data for critical errors.`
        );
        
        // Set progress to show failure state
        setGenerationProgress(0);
        
        // Log all failures for debugging
        console.group('💥 Complete Payslip Generation Failure');
        console.error(`All ${failedCount} employees failed to generate payslips`);
        console.groupCollapsed('❌ All Failed Employees');
        failedEmployees.forEach((failure: string, index: number) => {
          console.error(`${index + 1}. ${failure}`);
        });
        console.groupEnd();
        console.error('🚨 CRITICAL: Check Google Sheets connection and data integrity');
        console.groupEnd();
      }
    } catch (err) {
      console.error('💥 Critical error in payslip generation process:', err);
      setError(`Critical error: ${err instanceof Error ? err.message : 'Unknown error occurred during payslip generation'}`);
      setGenerationProgress(0); // Reset progress on critical error
    } finally {
      setIsGenerating(false);
      // Don't reset progress to 0 if generation was successful - let user see the final state
      if (error) {
        setGenerationProgress(0);
      }
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

  const downloadAllPayslips = async () => {
    // Get employees who have payslips generated
    const employeesWithPayslips = employees.filter(emp => 
      selectedEmployees.includes(emp.employeeId) && 
      payslips.some(payslip => payslip.employee.employeeId === emp.employeeId)
    );

    if (employeesWithPayslips.length === 0) {
      setError('No payslips available to download. Please generate payslips first.');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);
    setSuccess(null);

    try {
      setDownloadProgress(10);
      console.log(`🚀 Starting bulk PDF generation for ${employeesWithPayslips.length} payslips`);

      // Get employee IDs for bulk generation
      const employeeIds = employeesWithPayslips.map(emp => emp.employeeId);
      
      setDownloadProgress(20);
      console.log(`📋 Employee IDs prepared: ${employeeIds.join(', ')}`);
      
      // Generate bulk PDF using the new API endpoint
      const response = await fetch('/api/payslips/bulk-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeIds,
          month: months[selectedMonth],
          year: selectedYear,
          workingDays,
          actualWorkingDays,
        }),
      });

      setDownloadProgress(60);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Bulk PDF API error:', errorData);
        throw new Error(errorData.error || 'Failed to generate bulk payslips');
      }

      const htmlContent = await response.text();
      const generatedCount = parseInt(response.headers.get('X-Generated-Count') || '0');
      const failedCount = parseInt(response.headers.get('X-Failed-Count') || '0');
      
      console.log(`📊 PDF Generation Results: ${generatedCount} successful, ${failedCount} failed`);
      
      // Validate that we actually got HTML content
      if (!htmlContent || htmlContent.length < 100 || !htmlContent.includes('<!DOCTYPE html>')) {
        throw new Error('Invalid or empty HTML content received from server');
      }
      
      setDownloadProgress(80);

      // Create a new window with all payslips in a single document
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your popup blocker settings or allow popups for this site.');
      }

      // Wait a moment for window to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        setDownloadProgress(95);
        
        // Trigger print dialog once content is loaded
        printWindow.onload = () => {
          console.log('🖨️ Print dialog opening...');
          setTimeout(() => {
            printWindow.print();
          }, 500); // Small delay to ensure content is fully rendered
        };
        
        // Fallback in case onload doesn't fire
        setTimeout(() => {
          if (printWindow && !printWindow.closed) {
            printWindow.print();
          }
        }, 2000);
        
      } catch (printError) {
        console.error('❌ Error writing to print window:', printError);
        printWindow.close();
        throw new Error('Failed to prepare print window. Please try again.');
      }

      setDownloadProgress(100);
      
      // Show success message with accurate counts
      const totalRequested = employeesWithPayslips.length;
      
      if (failedCount === 0 && generatedCount === totalRequested) {
        setSuccess(`✅ Successfully generated single PDF with all ${generatedCount} payslips!`);
        console.log(`🎉 Perfect! All ${generatedCount} payslips included in PDF.`);
      } else if (generatedCount > 0) {
        if (generatedCount >= totalRequested * 0.8) { // 80% or more success
          setSuccess(`✅ Generated PDF with ${generatedCount}/${totalRequested} payslips. ⚠️ ${failedCount} employees failed to process.`);
        } else {
          setError(`⚠️ Generated PDF with only ${generatedCount}/${totalRequested} payslips. ❌ ${failedCount} employees failed to process.`);
        }
        console.warn(`📊 Partial success: ${generatedCount}/${totalRequested} payslips (${Math.round(generatedCount/totalRequested*100)}% success rate)`);
      } else {
        setError(`❌ Failed to generate PDF. All ${failedCount} employees failed to process.`);
        setDownloadProgress(0); // Show failure state
        console.error(`💥 Complete failure: No payslips could be generated`);
      }

      // Brief delay to show completion state
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (err) {
      console.error('💥 Bulk payslip download error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during bulk PDF generation';
      setError(`❌ Bulk PDF generation failed: ${errorMessage}`);
      setDownloadProgress(0); // Reset progress on error
    } finally {
      setIsDownloading(false);
      // Don't reset progress to 0 if download was successful - let user see the final state
      if (error || downloadProgress === 0) {
        setDownloadProgress(0);
      }
      // Keep progress visible for successful downloads
    }
  };

  const previewPayslip = (payslip: PayslipData) => {
    setPreviewEmployee(payslip);
  };

  return (
    <div className={`app-container ${className}`}>
      <div className="main-card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <FileText className="h-6 w-6" style={{ color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  Employee Payslip Generator
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem', margin: 0 }}>
                  Generate professional payslips with Google Sheets integration
                </p>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500', margin: 0 }}>Current Month</p>
              <p style={{ color: 'white', fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>{months[selectedMonth]} {selectedYear}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {error && (
            <div className="error-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#059669' }} />
              <span>{success}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Payroll Configuration Section */}
            <div className="config-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#dbeafe', padding: '0.5rem', borderRadius: '8px' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#2563eb' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Payroll Configuration</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {/* Connection Status & Refresh */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sheetInfo && (
                    <div className="status-connected" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ background: '#10b981', width: '0.5rem', height: '0.5rem', borderRadius: '50%' }}></div>
                      <div style={{ fontSize: '0.875rem' }}>
                        <div style={{ fontWeight: '600', color: '#065f46' }}>Google Sheet Connected</div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', fontFamily: 'monospace' }}>
                          ID: ...{sheetInfo.slice(-8)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={fetchEmployees}
                    disabled={loading}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm font-medium"
                  >
                    {loading ? 'Loading...' : 'Refresh Data'}
                  </button>
                </div>

                {/* Month & Year Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Month</label>
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
                      <label className="block text-sm font-medium text-black mb-1">Year</label>
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
                </div>

                {/* Working Days */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Working Days</label>
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
                      <label className="block text-sm font-medium text-black mb-1">Actual Days</label>
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
                </div>

                {/* Enhanced Progress Bar for Generation */}
                {(isGenerating || (!isGenerating && generationProgress > 0 && generationProgress <= 100)) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: isGenerating ? '#374151' : (generationProgress === 100 ? '#059669' : '#d97706')
                      }}>
                        {isGenerating ? 'Generating Payslips...' : 
                         generationProgress === 100 ? '✅ Generation Complete' :
                         generationProgress > 0 ? '⚠️ Generation Incomplete' : 'Generation Failed'}
                      </span>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: isGenerating ? '#2563eb' : 
                               generationProgress === 100 ? '#059669' : 
                               generationProgress > 0 ? '#d97706' : '#dc2626'
                      }}>
                        {generationProgress}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                      <div
                        style={{
                          width: `${generationProgress}%`,
                          height: '100%',
                          background: isGenerating ? 
                            'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)' :
                            generationProgress === 100 ?
                            'linear-gradient(90deg, #059669 0%, #10b981 100%)' :
                            generationProgress > 0 ?
                            'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)' :
                            'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
                          borderRadius: '5px',
                          transition: 'all 0.3s ease-in-out',
                          boxShadow: isGenerating ? '0 2px 4px 0 rgba(37, 99, 235, 0.3)' : 
                                     generationProgress === 100 ? '0 2px 4px 0 rgba(5, 150, 105, 0.3)' :
                                     '0 2px 4px 0 rgba(217, 119, 6, 0.3)'
                        }}
                      />
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      marginTop: '0.375rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {isGenerating ? 
                        `Processing ${Math.ceil((generationProgress / 100) * selectedEmployees.length)} of ${selectedEmployees.length} employees` :
                        generationProgress === 100 ?
                        `✅ All ${selectedEmployees.length} employees processed` :
                        generationProgress > 0 ?
                        `⚠️ ${Math.ceil((generationProgress / 100) * selectedEmployees.length)} of ${selectedEmployees.length} employees processed` :
                        `❌ Generation failed - check console for details`
                      }
                    </div>
                  </div>
                )}

                {/* Enhanced Progress Bar for Download */}
                {(isDownloading || (!isDownloading && downloadProgress > 0 && downloadProgress <= 100)) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: isDownloading ? '#374151' : (downloadProgress === 100 ? '#059669' : '#d97706')
                      }}>
                        {isDownloading ? 'Generating PDF...' : 
                         downloadProgress === 100 ? '✅ PDF Generated' :
                         downloadProgress > 0 ? '⚠️ PDF Generation Incomplete' : 'PDF Generation Failed'}
                      </span>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: isDownloading ? '#10b981' : 
                               downloadProgress === 100 ? '#059669' : 
                               downloadProgress > 0 ? '#d97706' : '#dc2626'
                      }}>
                        {downloadProgress}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}>
                      <div
                        style={{
                          width: `${downloadProgress}%`,
                          height: '100%',
                          background: isDownloading ? 
                            'linear-gradient(90deg, #10b981 0%, #34d399 100%)' :
                            downloadProgress === 100 ?
                            'linear-gradient(90deg, #059669 0%, #10b981 100%)' :
                            downloadProgress > 0 ?
                            'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)' :
                            'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
                          borderRadius: '5px',
                          transition: 'all 0.3s ease-in-out',
                          boxShadow: isDownloading ? '0 2px 4px 0 rgba(16, 185, 129, 0.3)' : 
                                     downloadProgress === 100 ? '0 2px 4px 0 rgba(5, 150, 105, 0.3)' :
                                     '0 2px 4px 0 rgba(217, 119, 6, 0.3)'
                        }}
                      />
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      marginTop: '0.375rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {isDownloading ? 
                        `Generating single PDF with ${employees.filter(emp => 
                          selectedEmployees.includes(emp.employeeId) && 
                          payslips.some(payslip => payslip.employee.employeeId === emp.employeeId)
                        ).length} payslips` :
                        downloadProgress === 100 ?
                        `✅ PDF ready for download/printing` :
                        downloadProgress > 0 ?
                        `⚠️ PDF generation partially complete` :
                        `❌ PDF generation failed - check console for details`
                      }
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Generate Button */}
                  <button
                    onClick={generatePayslips}
                    disabled={loading || isGenerating || isDownloading || selectedEmployees.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Generating... ({generationProgress}%)
                      </>
                    ) : loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    {isGenerating ? `Generating Payslips` : 'Generate Payslips'}
                  </button>

                  {/* Download All Button */}
                  <button
                    onClick={downloadAllPayslips}
                    disabled={
                      loading || 
                      isGenerating || 
                      isDownloading || 
                      selectedEmployees.length === 0 || 
                      !payslips.some(payslip => selectedEmployees.includes(payslip.employee.employeeId))
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Generating PDF... ({downloadProgress}%)
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        Download All as Single PDF
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Employees Section */}
            <div>
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
