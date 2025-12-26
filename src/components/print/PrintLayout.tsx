import React from 'react';
import type { User } from '../../types';

interface PrintLayoutProps {
  user: User;
  title: string;
  date?: string;
  children: React.ReactNode;
  type: 'workout' | 'diet' | 'supplements' | 'all';
}

// Global print styles - will be injected into print window
export const getPrintStyles = (): string => `
  /* Premium Magazine-Quality Print Styles */

  /* Page Setup */
  @page {
    size: A4;
    margin: 15mm 15mm 20mm 15mm; /* Standard A4 margins */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Force Backgrounds */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Typography */
  body {
    font-family: 'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;
    font-size: 11pt;
    line-height: 1.4;
    color: #1f2937;
    background: white !important;
    margin: 0;
    padding: 0;
  }

  /* High Contrast Text */
  h1, h2, h3, h4, h5, h6 {
    color: #111827 !important;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 0.5em;
  }

  h1 { font-size: 24pt; }
  h2 { font-size: 18pt; }
  h3 { font-size: 14pt; }
  h4 { font-size: 12pt; }

  p, span, div {
    color: #374151 !important;
  }

  /* Header */
  .print-header {
    position: relative;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    padding: 12pt 20pt;
    margin: -15mm -15mm 20pt -15mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 60pt;
    box-sizing: border-box;
  }

  .header-logo {
    font-size: 20pt;
    font-weight: 900;
    text-shadow: 1pt 1pt 2pt rgba(0,0,0,0.3);
  }

  .header-client-info {
    text-align: left;
    font-size: 10pt;
  }

  .client-name {
    font-size: 14pt;
    font-weight: 700;
    margin-bottom: 2pt;
  }

  .client-date {
    opacity: 0.9;
  }

  /* Watermark */
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 120pt;
    color: rgba(59, 130, 246, 0.05);
    font-weight: 900;
    pointer-events: none;
    z-index: -1;
    user-select: none;
  }

  /* Footer */
  .print-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-top: 1pt solid #cbd5e1;
    padding: 8pt 20pt;
    font-size: 9pt;
    color: #64748b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 -15mm -20mm -15mm;
  }

  .page-info {
    font-weight: 600;
  }

  .coach-info {
    text-align: left;
    opacity: 0.8;
  }

  /* Content Container */
  .print-content {
    max-width: 100%;
    margin: 0 auto;
    background: white;
  }

  /* Section Spacing */
  .print-section {
    margin-bottom: 24pt;
    page-break-inside: avoid;
  }

  .section-break {
    page-break-before: always;
    margin-top: 48pt;
  }

  /* Workout Tables - Modern Grid Style */
  .workout-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 10pt;
    background: white;
    border: 1pt solid #e2e8f0;
    border-radius: 6pt;
    overflow: hidden;
    page-break-inside: avoid;
  }

  .workout-table thead {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
  }

  .workout-table th {
    padding: 8pt 12pt;
    text-align: right;
    font-weight: 700;
    border-bottom: 1pt solid #475569;
    font-size: 10pt;
  }

  .workout-table td {
    padding: 8pt 12pt;
    border-bottom: 1pt solid #f1f5f9;
    font-size: 10pt;
  }

  .workout-table tbody tr:nth-child(even) {
    background: #f8fafc;
  }

  .workout-table tbody tr:nth-child(odd) {
    background: white;
  }

  .workout-table tbody tr:hover {
    background: #e2e8f0;
  }

  /* Exercise Cards */
  .exercise-card {
    background: white;
    border: 1pt solid #e2e8f0;
    border-radius: 8pt;
    padding: 12pt;
    margin: 8pt 0;
    page-break-inside: avoid;
    break-inside: avoid;
    box-shadow: 0 2pt 4pt rgba(0,0,0,0.1);
  }

  .exercise-name {
    font-weight: 700;
    font-size: 12pt;
    color: #1e293b;
    margin-bottom: 4pt;
  }

  .exercise-details {
    color: #64748b;
    font-size: 10pt;
  }

  /* Diet Recipe Cards */
  .meal-card {
    background: white;
    border: 1pt solid #e2e8f0;
    border-radius: 12pt;
    padding: 16pt;
    margin: 12pt 0;
    page-break-inside: avoid;
    break-inside: avoid;
    position: relative;
    overflow: hidden;
  }

  .meal-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4pt;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  }

  .meal-name {
    font-weight: 700;
    font-size: 14pt;
    color: #065f46;
    margin-bottom: 8pt;
  }

  .meal-description {
    color: #374151;
    font-size: 10pt;
    line-height: 1.5;
  }

  /* Supplement Cards */
  .supplement-card {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 1pt solid #f59e0b;
    border-radius: 8pt;
    padding: 12pt;
    margin: 8pt 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .supplement-name {
    font-weight: 700;
    font-size: 12pt;
    color: #92400e;
    margin-bottom: 4pt;
  }

  .supplement-details {
    color: #78350f;
    font-size: 10pt;
  }

  /* Page Breaks */
  .page-break {
    page-break-before: always;
  }

  .no-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Hide elements for print */
  @media print {
    .no-print {
      display: none !important;
    }
  }

  /* Utility Classes */
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-left { text-align: left; }
  .font-bold { font-weight: 700; }
  .mb-4 { margin-bottom: 16pt; }
  .mt-6 { margin-top: 24pt; }
`;

const PrintLayout: React.FC<PrintLayoutProps> = ({
  user,
  title,
  date = new Date().toLocaleDateString('fa-IR'),
  children,
  type: _type
}) => {
  return (
    <div className="print-content">
      {/* Header */}
      <div className="print-header">
        <div className="header-logo">
          FLEXPRO
        </div>
        <div className="header-client-info">
          <div className="client-name">{user.name}</div>
          <div className="client-date">{date}</div>
        </div>
      </div>

      {/* Watermark */}
      <div className="watermark">
        FLEXPRO
      </div>

      {/* Main Title */}
      <div className="text-center mb-4" style={{ marginTop: '24pt', marginBottom: '16pt' }}>
        <h1 style={{ fontSize: '24pt', marginBottom: '8pt', color: '#1f2937' }}>
          {title}
        </h1>
        <p style={{ fontSize: '12pt', color: '#6b7280' }}>
          برنامه اختصاصی {user.name}
        </p>
      </div>

      {/* Content */}
      {children}

      {/* Footer */}
      <div className="print-footer">
        <div className="page-info">
          صفحه <span className="page-number"></span>
        </div>
        <div className="coach-info">
          FlexPro - مربی شخصی حرفه‌ای
        </div>
      </div>
    </div>
  );
};

export default PrintLayout;






