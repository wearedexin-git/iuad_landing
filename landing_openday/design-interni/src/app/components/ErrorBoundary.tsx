import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#D2E8DB] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl text-center border-2 border-[#719E85]">
            <h1 className="font-tiempos text-4xl md:text-5xl text-[#719E85] mb-4">
              Qualcosa è andato storto
            </h1>
            <p className="font-sarabun text-lg md:text-xl text-[#201f1f] mb-8">
              Ci scusiamo per l'inconveniente. Prova a ricaricare la pagina.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#719E85] text-white font-tiempos text-lg px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
