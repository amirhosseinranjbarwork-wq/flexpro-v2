import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import type { PrintData } from '../types';

// تابع escape برای جلوگیری از XSS
const escapeHtml = (text: unknown): string => {
  if (text == null || text === undefined) return '';
  const str = String(text);
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  return str.replace(/[&<>"'`=/]/g, (m) => map[m]);
};

const allowedTags = new Set([
  'div', 'p', 'span', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'br', 'hr', 'section', 'article', 'header', 'footer', 'main', 'nav'
]);

const allowedAttrs = new Set([
  'class', 'id', 'title', 'dir', 'lang', 'aria-label', 'role', 'colspan', 'rowspan', 'data-label', 'style'
]);

const unsafeProtocols = ['javascript:', 'data:', 'vbscript:'];

const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';

  // Use DOMPurify for comprehensive sanitization
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['div', 'p', 'span', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li',
                   'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                   'br', 'hr', 'section', 'article', 'header', 'footer', 'main', 'nav'],
    ALLOWED_ATTR: ['class', 'id', 'title', 'dir', 'lang', 'aria-label', 'role', 'colspan', 'rowspan', 'data-label', 'style'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup']
  });
};

// Get print styles for the print window
const getPrintStyles = (): string => {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
      direction: rtl;
      text-align: right;
      line-height: 1.6;
      color: #000;
      background: #fff;
      padding: 20mm;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-bottom: 0.5em;
      font-weight: 700;
    }
    
    h1 { font-size: 24pt; }
    h2 { font-size: 18pt; }
    h3 { font-size: 14pt; }
    h4 { font-size: 12pt; }
    
    p {
      margin-bottom: 0.5em;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    
    th, td {
      border: 1px solid #333;
      padding: 8px 12px;
      text-align: right;
    }
    
    th {
      background: #f5f5f5;
      font-weight: 700;
    }
    
    tr:nth-child(even) {
      background: #fafafa;
    }
    
    ul, ol {
      margin: 0.5em 0;
      padding-right: 2em;
    }
    
    li {
      margin-bottom: 0.25em;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    .no-break {
      page-break-inside: avoid;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      @page {
        margin: 15mm;
        size: A4;
      }
    }
  `;
};

// Legacy sanitization function (kept for compatibility but not used)
const _legacySanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const stack: Element[] = Array.from(doc.body.children);

  while (stack.length) {
    const el = stack.pop() as Element;
    const tag = el.tagName.toLowerCase();

    if (!allowedTags.has(tag)) {
      while (el.firstChild) {
        el.parentNode?.insertBefore(el.firstChild, el);
      }
      el.remove();
      continue;
    }

    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value || '';

      if (!allowedAttrs.has(name)) {
        el.removeAttribute(attr.name);
        return;
      }

      if (name === 'style' && /expression|url\s*\(/i.test(value)) {
        el.removeAttribute(attr.name);
        return;
      }

      if ((name === 'href' || name === 'src') && unsafeProtocols.some((p) => value.trim().toLowerCase().startsWith(p))) {
        el.removeAttribute(attr.name);
      }
    });

    stack.push(...Array.from(el.children));
  }

  return doc.body.innerHTML;
};

interface PrintModalProps {
  data: PrintData | null;
  onClose: () => void;
  onDownload: () => void;
  onPrint?: () => void;
}

const PrintModal: React.FC<PrintModalProps> = ({ data, onClose, onDownload, onPrint }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // اسکرول به بالا وقتی مودال باز میشه
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [data]);

  if (!data) return null;

  const handleBrowserPrint = () => {
    const printContent = document.getElementById('print-content-area');
    if (!printContent) return;
    
    // Sanitize content قبل از استفاده
    const sanitizedContent = sanitizeHTML(printContent.innerHTML);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // استفاده از textContent برای امنیت بیشتر
    const title = escapeHtml(`FlexPro - ${data.title || 'چاپ'}`);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'none';">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;900&display=swap" rel="stylesheet">
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${sanitizedContent}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)]/95 backdrop-blur-md flex flex-col animate-fade-in">
      {/* هدر */}
      <div className="h-16 glass-panel border-b border-[var(--glass-border)] flex justify-between items-center px-6 shrink-0 rounded-none">
        <h3 className="text-[var(--text-primary)] font-bold flex items-center gap-2 text-lg">
          <span>🖨️</span> پیش‌نمایش: {data.title}
        </h3>
        <div className="flex gap-3">
          <button 
            onClick={onDownload} 
            className="btn-glass bg-[var(--accent-tertiary)] hover:bg-[var(--accent-tertiary)]/90 text-white text-sm border border-[var(--accent-tertiary)]/30 shadow-lg"
            aria-label="دانلود PDF"
            type="button"
          >
            📥 دانلود PDF
          </button>
          <button 
            onClick={onPrint || handleBrowserPrint}
            className="btn-glass bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white text-sm border border-[var(--accent-color)]/30 shadow-lg"
            aria-label="پرینت مرورگر"
            type="button"
          >
            🖨️ پرینت مرورگر
          </button>
          <button 
            onClick={onClose} 
            className="btn-glass bg-[var(--text-primary)]/10 hover:bg-[var(--text-primary)]/20 text-[var(--text-primary)] text-sm"
            aria-label="بستن"
            type="button"
          >
            ✕ بستن
          </button>
        </div>
      </div>

      {/* ناحیه پیش‌نمایش */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto p-8 flex justify-center bg-[var(--bg-secondary)]/50"
      >
        <div 
          id="print-content-area"
          className="bg-white text-black shadow-2xl mx-auto print-content"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            padding: '0',
            boxSizing: 'border-box',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(data.html) }}
        />
      </div>

      {/* راهنمای پایین صفحه */}
      <div className="h-12 glass-panel border-t border-[var(--glass-border)] flex items-center justify-center px-6 text-xs text-[var(--text-secondary)] rounded-none">
        <span>💡 برای بهترین کیفیت از دکمه «دانلود PDF» استفاده کنید</span>
      </div>
    </div>
  );
};

export default PrintModal;
