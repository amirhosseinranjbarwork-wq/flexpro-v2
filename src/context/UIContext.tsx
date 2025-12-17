/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { TabKey, PrintType, PrintData } from '../types/index';

interface UIContextType {
  theme: 'light' | 'dark';
  currentTab: TabKey;
  printData: PrintData | null;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setCurrentTab: (tab: TabKey) => void;
  handlePrintPreview: (type: PrintType, user?: import('../types/index').User, html?: string) => void;
  closePrintModal: () => void;
  downloadPDF: () => Promise<void>;
  setSidebarOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentTab, setCurrentTab] = useState<TabKey>('users');
  const [printData, setPrintData] = useState<PrintData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pdfLibsLoaded = useRef(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('flexTheme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleThemeFn = useCallback(() => {
    const t: 'light' | 'dark' = theme === 'dark' ? 'light' : 'dark';
    setTheme(t);
    localStorage.setItem('flexTheme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, [theme]);

  const handlePrintPreview = useCallback((type: PrintType, user?: import('../types/index').User, html?: string) => {
    if (html) {
      setPrintData({ html });
    } else {
      setPrintData({ html: '<div style="padding: 20px;">محتوایی برای چاپ یافت نشد</div>' });
    }
  }, []);

  const closePrintModal = useCallback(() => {
    setPrintData(null);
  }, []);

  const downloadPDF = useCallback(async (): Promise<void> => {
    const element = document.getElementById('print-content-area');
    if (!element) {
      toast.error('محتوایی برای چاپ یافت نشد');
      return;
    }

    try {
      toast.loading('در حال بارگذاری کتابخانه‌ها...', { id: 'pdf' });

      // Lazy load html2canvas and jsPDF only when needed
      if (!pdfLibsLoaded.current) {
        const [html2canvasModule, jsPDFModule] = await Promise.all([
          import('html2canvas'),
          import('jspdf')
        ]);
        // Store references globally for this session
        window.html2canvas = html2canvasModule.default;
        window.jsPDF = jsPDFModule.default;
        pdfLibsLoaded.current = true;
      }

      const html2canvas = window.html2canvas;
      const jsPDF = window.jsPDF;

      toast.loading('در حال ساخت PDF...', { id: 'pdf' });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 0;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = (pdfWidth - margin * 2) / imgWidth;

      let yPosition = 0;
      let pageCount = 0;
      const pageHeightPx = pdfHeight / ratio;

      while (yPosition < imgHeight) {
        if (pageCount > 0) {
          pdf.addPage();
        }

        const sourceY = yPosition;
        const sourceHeight = Math.min(pageHeightPx, imgHeight - yPosition);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        ctx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);

        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        const pageScaledHeight = sourceHeight * ratio;

        pdf.addImage(pageImgData, 'PNG', margin, 0, pdfWidth - margin * 2, pageScaledHeight);

        yPosition += pageHeightPx;
        pageCount++;
      }

      const fileName = `Vo2max_${new Date().toLocaleDateString('fa-IR')}.pdf`;
      pdf.save(fileName);
      toast.success(`PDF با ${pageCount} صفحه ذخیره شد`, { id: 'pdf' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطای ناشناخته';
      toast.error('خطا در ساخت PDF: ' + errorMessage, { id: 'pdf' });
      console.error(err);
    }
  }, []);

  return (
    <UIContext.Provider
      value={{
        theme,
        currentTab,
        printData,
        sidebarOpen,
        toggleTheme: toggleThemeFn,
        setCurrentTab,
        handlePrintPreview,
        closePrintModal,
        downloadPDF,
        setSidebarOpen
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};
