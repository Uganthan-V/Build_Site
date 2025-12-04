
// // import React, { useEffect, useState, useMemo } from 'react';
// // import { DynamicReactComponent } from '../types';

// // interface PreviewPaneProps {
// //   generatedCode: string;
// //   onCompileError: (error: string) => void;
// //   onRuntimeError: (error: string) => void;
// // }

// // // Minimal styling for error boundaries within the preview
// // const errorBoundaryStyle: React.CSSProperties = {
// //   padding: '16px',
// //   margin: '16px',
// //   backgroundColor: '#fee2e2',
// //   color: '#dc2626',
// //   border: '1px solid #ef4444',
// //   borderRadius: '8px',
// //   fontFamily: 'monospace',
// //   whiteSpace: 'pre-wrap',
// //   overflowX: 'auto',
// // };

// // // Error Boundary Component
// // interface ErrorBoundaryProps {
// //   children: React.ReactNode;
// //   onError: (error: Error, errorInfo: React.ErrorInfo) => void;
// //   fallback: React.ReactNode;
// // }

// // interface ErrorBoundaryState {
// //   hasError: boolean;
// //   error: Error | null;
// // }

// // class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
// //   constructor(props: ErrorBoundaryProps) {
// //     super(props);
// //     this.state = { hasError: false, error: null };
// //   }

// //   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
// //     return { hasError: true, error };
// //   }

// //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
// //     this.props.onError(error, errorInfo);
// //   }

// //   render(): React.ReactNode {
// //     if (this.state.hasError) {
// //       return this.props.fallback;
// //     }
// //     return this.props.children;
// //   }
// // }


// // const PreviewPane: React.FC<PreviewPaneProps> = ({ generatedCode, onCompileError, onRuntimeError }) => {
// //   const [ComponentToRender, setComponentToRender] = useState<DynamicReactComponent>(null);
// //   const [compileError, setCompileError] = useState<string | null>(null);

// //   useEffect(() => {
// //     setCompileError(null); // Clear previous compile errors
// //     if (!generatedCode.trim()) {
// //       setComponentToRender(null);
// //       return;
// //     }

// //     try {
// //       // WARNING: Using 'eval' is a security risk if the code source is untrusted.
// //       // For a code editor/playground scenario where the user generates code for themselves,
// //       // it's a common pattern, but it should be used with extreme caution in production.
// //       // In a real application, you would ideally sandbox this (e.g., iframe with strict policies, web worker, or server-side rendering).

// //       // Create a function that takes React and exports PreviewComponent
// //       const codeFunction = new Function('React', 'ReactDOM', 'exports', generatedCode + '; return exports.PreviewComponent;');
// //       const exports: { PreviewComponent?: React.FC } = {};

// //       // Execute the function in a controlled environment
// //       const component = codeFunction(React, undefined, exports); // Pass React
// //       if (typeof component === 'function') {
// //         setComponentToRender(() => component); // Use functional update for useState
// //       } else {
// //         throw new Error('Generated code did not export a valid React component named PreviewComponent.');
// //       }
// //     } catch (e: any) {
// //       const errorMsg = e instanceof Error ? e.message : String(e);
// //       setCompileError(`Compilation Error: ${errorMsg}`);
// //       onCompileError(errorMsg);
// //       setComponentToRender(null);
// //     }
// //   }, [generatedCode, onCompileError]);

// //   const handleRuntimeError = useMemo(() => (error: Error, errorInfo: React.ErrorInfo) => {
// //     console.error("Runtime Error in Preview Component:", error, errorInfo);
// //     onRuntimeError(`Runtime Error: ${error.message}`);
// //   }, [onRuntimeError]);

// //   if (compileError) {
// //     return (
// //       <div className="flex items-center justify-center h-full bg-red-900 text-red-100 p-4 rounded-lg overflow-auto">
// //         <pre className="text-sm" style={errorBoundaryStyle}>{compileError}</pre>
// //       </div>
// //     );
// //   }

// //   if (!ComponentToRender) {
// //     return (
// //       <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400 p-4 rounded-lg">
// //         <p className="text-xl">Preview will appear here after code generation...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="relative h-full w-full bg-gray-800 rounded-lg overflow-auto">
// //       <ErrorBoundary onError={handleRuntimeError} fallback={
// //         <pre className="text-sm" style={errorBoundaryStyle}>
// //           A runtime error occurred in the preview. Please check the console for details.
// //         </pre>
// //       }>
// //         <ComponentToRender />
// //       </ErrorBoundary>
// //     </div>
// //   );
// // };

// // export default PreviewPane;


// import React, { useEffect, useState } from 'react';

// interface PreviewPaneProps {
//   htmlCode: string;
//   cssCode: string;
//   jsCode: string;
//   onCompileError: (error: string) => void;
//   onRuntimeError: (error: string) => void;
// }

// const PreviewPane: React.FC<PreviewPaneProps> = ({ htmlCode, cssCode, jsCode, onCompileError, onRuntimeError }) => {
//   const [iframeSrc, setIframeSrc] = useState<string>('');

//   useEffect(() => {
//     try {
//       // Combine HTML, CSS, and JS into a single document
//       const fullHtml = `
//         ${htmlCode.replace(/<link rel="stylesheet" href="\/styles.css">/, `<style>${cssCode}</style>`)}
//         ${htmlCode.includes('<script src="/index.js">') ? '' : `<script>${jsCode}</script>`}
//       `;
//       const blob = new Blob([fullHtml], { type: 'text/html' });
//       const url = URL.createObjectURL(blob);
//       setIframeSrc(url);

//       // Cleanup
//       return () => URL.revokeObjectURL(url);
//     } catch (e: any) {
//       const errorMsg = `Preview Error: ${e.message}`;
//       onCompileError(errorMsg);
//     }
//   }, [htmlCode, cssCode, jsCode, onCompileError]);

//   // Handle runtime errors via message event
//   useEffect(() => {
//     const handleError = (event: MessageEvent) => {
//       if (event.data && event.data.type === 'error') {
//         onRuntimeError(`Runtime Error: ${event.data.message}`);
//       }
//     };
//     window.addEventListener('message', handleError);
//     return () => window.removeEventListener('message', handleError);
//   }, [onRuntimeError]);

//   if (!htmlCode && !cssCode && !jsCode) {
//     return (
//       <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400 p-4 rounded-lg">
//         <p className="text-xl">Preview will appear here after code generation...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative h-full w-full bg-gray-800 rounded-lg overflow-hidden">
//       <iframe
//         src={iframeSrc}
//         className="w-full h-full border-none"
//         sandbox="allow-scripts allow-same-origin"
//         title="Web App Preview"
//         onError={(e: any) => onRuntimeError(`Iframe Error: ${e.message || 'Unknown error'}`)}
//       />
//     </div>
//   );
// };

// export default PreviewPane;

// src/components/PreviewPane.tsx — AUTO-FIXES BROKEN CALCULATORS!
import React, { useEffect, useRef } from 'react';

interface PreviewPaneProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  onCompileError: (err: string) => void;
  onRuntimeError: (err: string) => void;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({
  htmlCode,
  cssCode,
  jsCode,
  onCompileError,
  onRuntimeError,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (err) {
              parent.postMessage({ type: 'runtimeError', message: err.message }, '*');
            }
            window.onerror = (msg) => {
              parent.postMessage({ type: 'runtimeError', message: String(msg) }, '*');
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    const handler = (e: MessageEvent) => {
      if (e.data.type === 'runtimeError') {
        onRuntimeError(e.data.message);
      }
    };
    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
      URL.revokeObjectURL(url);
    };
  }, [htmlCode, cssCode, jsCode, onCompileError, onRuntimeError]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-modals"
      title="preview"
    />
  );
};

export default PreviewPane;