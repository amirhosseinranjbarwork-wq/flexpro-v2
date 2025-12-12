import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center glass-panel rounded-3xl p-8 max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              خطایی رخ داد
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              متأسفانه مشکلی در بارگذاری این بخش پیش آمده است.
            </p>
            {this.state.error && (
              <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-lg mb-4 font-mono text-left dir-ltr">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleRetry}
              className="btn-glass bg-[var(--accent-color)] text-white px-6 py-2.5 flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} />
              تلاش مجدد
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

