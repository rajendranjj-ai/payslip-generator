import { PayslipGenerator } from '@/components/PayslipGenerator';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)' 
    }}>
      {/* Header */}
      <div className="app-header">
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.5rem', 
              borderRadius: '8px' 
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'white' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: 'white',
                margin: 0
              }}>
                St.Madonna's Matric Hr Sec School
              </h1>
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'rgba(255,255,255,0.8)',
                margin: 0
              }}>
                Payslip Management System
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'rgba(255,255,255,0.8)',
              margin: 0
            }}>
              Kalugumalai, Tamil Nadu
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'rgba(255,255,255,0.6)',
              margin: 0
            }}>
              Automated Payroll Solution
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem 0' }}>
        <PayslipGenerator />
      </div>

      {/* Footer */}
      <div style={{ 
        background: '#f8fafc', 
        borderTop: '1px solid #e2e8f0', 
        marginTop: '3rem',
        padding: '1.5rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          textAlign: 'center',
          padding: '0 1rem'
        }}>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            margin: 0
          }}>
            © 2024 St.Madonna's Matric Hr Sec School. All rights reserved.
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            margin: '0.25rem 0 0 0'
          }}>
            Powered by Next.js & Google Sheets API
          </p>
        </div>
      </div>
    </div>
  );
}