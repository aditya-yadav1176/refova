type ErrorReportOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

// No-op error reporter. Replace this with your own error tracking service
// (e.g. Sentry, Datadog, Highlight.io) when needed.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function reportError(_error: unknown, _context: Record<string, unknown> = {}, _options?: ErrorReportOptions) {
  // stub — wire up your error tracking here
}

