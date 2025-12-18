import React from 'react';
import { useApp } from '../../context/AppContext';
import './LightRays.css';

interface LightRaysProps {
  children?: React.ReactNode;
  className?: string;
}

const LightRays: React.FC<LightRaysProps> = ({ children, className = '' }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className={`light-rays-container ${className}`}>
      {/* Multiple static ray elements with CSS animations */}
      <div className="light-ray ray-1" style={{ animationDelay: '0s', animationDuration: '8s' }}></div>
      <div className="light-ray ray-2" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
      <div className="light-ray ray-3" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
      <div className="light-ray ray-4" style={{ animationDelay: '1s', animationDuration: '9s' }}></div>
      <div className="light-ray ray-5" style={{ animationDelay: '3s', animationDuration: '11s' }}></div>
      <div className="light-ray ray-6" style={{ animationDelay: '5s', animationDuration: '6s' }}></div>
      <div className="light-ray ray-7" style={{ animationDelay: '0.5s', animationDuration: '12s' }}></div>
      <div className="light-ray ray-8" style={{ animationDelay: '2.5s', animationDuration: '8.5s' }}></div>

      {/* Subtle background overlay */}
      <div
        className="light-rays-overlay"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 50%, transparent 100%)'
            : 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.005) 50%, transparent 100%)'
        }}
      ></div>

      {children}
    </div>
  );
};

export default LightRays;