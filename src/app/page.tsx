import { PayslipGenerator } from '@/components/PayslipGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">St.Madonna's Matric Hr Sec School</h1>
                <p className="text-sm text-gray-600">Payslip Management System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Kalugumalai, Tamil Nadu</p>
              <p className="text-xs text-gray-400">Automated Payroll Solution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <PayslipGenerator />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 St.Madonna's Matric Hr Sec School. All rights reserved.</p>
            <p className="mt-1">Powered by Next.js & Google Sheets API</p>
          </div>
        </div>
      </div>
    </div>
  );
}