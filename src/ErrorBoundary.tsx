import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
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

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fff', color: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: 'red' }}>App Crashed</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ background: '#eee', padding: '10px', overflowX: 'auto', maxWidth: '100%', marginTop: '10px' }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
