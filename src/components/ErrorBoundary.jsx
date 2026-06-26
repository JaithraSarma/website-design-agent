import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-950/20 border border-red-900/50 rounded-xl text-center">
          <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 mb-3 text-lg">
            ⚠
          </div>
          <h3 className="text-sm font-semibold text-red-200 mb-1">Something went wrong</h3>
          <p className="text-xs text-red-400 max-w-sm mb-4 leading-relaxed">
            {this.state.error?.message || 'An unexpected error occurred in this panel.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 bg-red-800/30 hover:bg-red-800/50 text-red-200 rounded-md text-xs transition-colors border border-red-700/50"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
