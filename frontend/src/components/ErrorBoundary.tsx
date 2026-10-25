import { Component, type ReactNode } from "react";
import { Button } from "./ui";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // The fallback below is the user-facing result. Details stay in the console.
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="max-w-md text-center" role="alert">
          <h1 className="font-display text-4xl text-ink">Something went wrong</h1>
          <p className="mt-3 text-muted">
            An unexpected error stopped this page. Reload it, or go back to the store.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button type="button" onClick={() => window.location.reload()}>
              Reload page
            </Button>
            <Button type="button" variant="outline" onClick={() => { window.location.href = "/"; }}>
              Go home
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
