import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Pickles crashed:", error, info);
    try {
      sessionStorage.setItem(
        "picklesLastCrash",
        `${(error && error.message) || error}\n${(error && error.stack) || ""}`
      );
    } catch (e) {}
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "24px",
            fontFamily: "sans-serif",
            textAlign: "center",
            color: "#fff",
            background: "#222",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          <h2>Something went wrong</h2>
          <p
            style={{
              fontSize: "13px",
              color: "#ff9a9a",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {String((this.state.error && this.state.error.message) || "")}
          </p>
          <p style={{ fontSize: "12px", color: "#999" }}>
            (The error was saved; open Settings &rarr; Show Debug after
            reloading.)
          </p>
          <button onClick={() => window.location.reload()}>
            Reload Pickles
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
