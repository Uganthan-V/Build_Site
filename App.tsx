// // // // // // // // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // // // // // // // import CodeEditor from './components/CodeEditor';
// // // // // // // // // // // import PreviewPane from './components/PreviewPane';
// // // // // // // // // // // import ChatInput from './components/ChatInput';
// // // // // // // // // // // import ChatMessageComponent from './components/ChatMessage';
// // // // // // // // // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // // // // // // // // import { generateCodeWithGemini, analyzeCodeErrorWithGemini, analyzeCodeForImprovements } from './services/geminiService';
// // // // // // // // // // // import { LOCAL_STORAGE_CODE_KEY, LOCAL_STORAGE_CHAT_HISTORY_KEY, INITIAL_CODE_SNIPPET } from './constants';
// // // // // // // // // // // import { ChatMessage, StoredData } from './types';
// // // // // // // // // // // import { v4 as uuidv4 } from 'uuid'; // For unique message IDs


// // // // // // // // // // // // Check for API key presence
// // // // // // // // // // // const hasApiKey = !!process.env.API_KEY;

// // // // // // // // // // // const App: React.FC = () => {
// // // // // // // // // // //   const [code, setCode] = useState<string>(
// // // // // // // // // // //     localStorage.getItem(LOCAL_STORAGE_CODE_KEY) || INITIAL_CODE_SNIPPET
// // // // // // // // // // //   );
// // // // // // // // // // //   const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
// // // // // // // // // // //     const storedHistory = localStorage.getItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);
// // // // // // // // // // //     return storedHistory ? JSON.parse(storedHistory) : [];
// // // // // // // // // // //   });
// // // // // // // // // // //   const [isLoading, setIsLoading] = useState<boolean>(false);
// // // // // // // // // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // // // // // // // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // // // // // // // // //   const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
// // // // // // // // // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('code'); // New state for view toggle

// // // // // // // // // // //   const chatMessagesEndRef = useRef<HTMLDivElement>(null);

// // // // // // // // // // //   // Scroll to bottom of chat history on new messages
// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     if (chatMessagesEndRef.current) {
// // // // // // // // // // //       chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [chatHistory]);

// // // // // // // // // // //   // Persist code and chat history to local storage
// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     localStorage.setItem(LOCAL_STORAGE_CODE_KEY, code);
// // // // // // // // // // //   }, [code]);

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     localStorage.setItem(LOCAL_STORAGE_CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
// // // // // // // // // // //   }, [chatHistory]);

// // // // // // // // // // //   // Function to handle AI key selection if needed (e.g., for Veo/Imagen models)
// // // // // // // // // // //   const handleSelectApiKey = useCallback(async () => {
// // // // // // // // // // //     if (window.aistudio && window.aistudio.openSelectKey) {
// // // // // // // // // // //       try {
// // // // // // // // // // //         await window.aistudio.openSelectKey();
// // // // // // // // // // //         // Assuming key selection was successful, proceed.
// // // // // // // // // // //         // The API_KEY env var should now be updated implicitly.
// // // // // // // // // // //         alert('API key selected successfully! You can now use AI features.');
// // // // // // // // // // //         window.location.reload(); // Reload to ensure new key is picked up by GoogleGenAI instance
// // // // // // // // // // //       } catch (error) {
// // // // // // // // // // //         console.error("Failed to select API key:", error);
// // // // // // // // // // //         alert('Failed to select API key. Please ensure you select a key from a paid GCP project.');
// // // // // // // // // // //       }
// // // // // // // // // // //     } else {
// // // // // // // // // // //       alert('`window.aistudio` not available. Ensure you are running in the correct environment.');
// // // // // // // // // // //     }
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // // // // // // // // //     if (!hasApiKey) {
// // // // // // // // // // //       alert('API Key is missing! Please configure process.env.API_KEY or select one using the "Select API Key" button.');
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     const newUserMessage: ChatMessage = { id: uuidv4(), role: 'user', content: message };
// // // // // // // // // // //     setChatHistory((prev) => [...prev, newUserMessage]);
// // // // // // // // // // //     setIsLoading(true);
// // // // // // // // // // //     setCompileError(null);
// // // // // // // // // // //     setRuntimeError(null);
// // // // // // // // // // //     setAiAnalysis(null);

// // // // // // // // // // //     try {
// // // // // // // // // // //       const aiResponse = await generateCodeWithGemini(message, code);
// // // // // // // // // // //       setCode(aiResponse);
// // // // // // // // // // //       const newAiMessage: ChatMessage = { id: uuidv4(), role: 'model', content: "Code updated successfully!" };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, newAiMessage]);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error in AI code generation:", error);
// // // // // // // // // // //       const errorMessage = `Failed to generate code: ${error instanceof Error ? error.message : String(error)}`;
// // // // // // // // // // //       const errorChat: ChatMessage = { id: uuidv4(), role: 'error', content: errorMessage };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, errorChat]);
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setIsLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [code, chatHistory, hasApiKey]);

// // // // // // // // // // //   const handleCompileError = useCallback(async (errorMsg: string) => {
// // // // // // // // // // //     setCompileError(errorMsg);
// // // // // // // // // // //     setRuntimeError(null); // Clear runtime error if new compile error
// // // // // // // // // // //     setAiAnalysis(null); // Clear previous analysis

// // // // // // // // // // //     if (!hasApiKey) {
// // // // // // // // // // //       // Don't attempt AI analysis if no API key
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     setIsLoading(true);
// // // // // // // // // // //     try {
// // // // // // // // // // //       const analysis = await analyzeCodeErrorWithGemini(code, errorMsg);
// // // // // // // // // // //       setAiAnalysis(analysis);
// // // // // // // // // // //       const analysisChat: ChatMessage = { id: uuidv4(), role: 'model', content: `**AI Code Analysis (Compile Error):**\n\n${analysis}` };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, analysisChat]);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error in AI error analysis:", error);
// // // // // // // // // // //       const analysisChat: ChatMessage = { id: uuidv4(), role: 'error', content: `Failed to get AI analysis: ${error instanceof Error ? error.message : String(error)}` };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, analysisChat]);
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setIsLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [code, chatHistory, hasApiKey]);

// // // // // // // // // // //   const handleRuntimeError = useCallback(async (errorMsg: string) => {
// // // // // // // // // // //     setRuntimeError(errorMsg);
// // // // // // // // // // //     setCompileError(null); // Clear compile error if new runtime error
// // // // // // // // // // //     setAiAnalysis(null); // Clear previous analysis

// // // // // // // // // // //     if (!hasApiKey) {
// // // // // // // // // // //       // Don't attempt AI analysis if no API key
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     setIsLoading(true);
// // // // // // // // // // //     try {
// // // // // // // // // // //       const analysis = await analyzeCodeErrorWithGemini(code, errorMsg);
// // // // // // // // // // //       setAiAnalysis(analysis);
// // // // // // // // // // //       const analysisChat: ChatMessage = { id: uuidv4(), role: 'model', content: `**AI Code Analysis (Runtime Error):**\n\n${analysis}` };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, analysisChat]);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error in AI error analysis:", error);
// // // // // // // // // // //       const analysisChat: ChatMessage = { id: uuidv4(), role: 'error', content: `Failed to get AI analysis: ${error instanceof Error ? error.message : String(error)}` };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, analysisChat]);
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setIsLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [code, chatHistory, hasApiKey]);

// // // // // // // // // // //   const handleSuggestImprovements = useCallback(async () => {
// // // // // // // // // // //     if (!hasApiKey) {
// // // // // // // // // // //       alert('API Key is missing! Please configure process.env.API_KEY or select one using the "Select API Key" button.');
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     const newUserMessage: ChatMessage = { id: uuidv4(), role: 'user', content: 'Please suggest improvements for the current code.' };
// // // // // // // // // // //     setChatHistory((prev) => [...prev, newUserMessage]);
// // // // // // // // // // //     setIsLoading(true);
// // // // // // // // // // //     setCompileError(null);
// // // // // // // // // // //     setRuntimeError(null);
// // // // // // // // // // //     setAiAnalysis(null); // Clear previous error analysis

// // // // // // // // // // //     try {
// // // // // // // // // // //       const analysis = await analyzeCodeForImprovements(code);
// // // // // // // // // // //       const analysisChat: ChatMessage = { id: uuidv4(), role: 'model', content: `**AI Code Improvement Suggestions:**\n\n${analysis}` };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, analysisChat]);
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error in AI improvement analysis:", error);
// // // // // // // // // // //       const analysisChat: ChatMessage = { id: uuidv4(), role: 'error', content: `Failed to get AI improvement suggestions: ${error instanceof Error ? error.message : String(error)}` };
// // // // // // // // // // //       setChatHistory((prev) => [...prev, analysisChat]);
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setIsLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   }, [code, chatHistory, hasApiKey]);

// // // // // // // // // // //   const clearError = useCallback(() => {
// // // // // // // // // // //     setCompileError(null);
// // // // // // // // // // //     setRuntimeError(null);
// // // // // // // // // // //     setAiAnalysis(null);
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className="flex h-screen bg-gray-900 text-gray-100 antialiased">
// // // // // // // // // // //       {/* Left Sidebar - Chat History */}
// // // // // // // // // // //       <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col p-4">
// // // // // // // // // // //         <h2 className="text-xl font-bold mb-4 text-blue-400">AI Code Studio Chat</h2>
// // // // // // // // // // //         <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
// // // // // // // // // // //           {chatHistory.length === 0 && (
// // // // // // // // // // //             <p className="text-gray-400 text-center mt-8">Start a conversation with AI!</p>
// // // // // // // // // // //           )}
// // // // // // // // // // //           {chatHistory.map((msg) => (
// // // // // // // // // // //             <ChatMessageComponent key={msg.id} message={msg} />
// // // // // // // // // // //           ))}
// // // // // // // // // // //           <div ref={chatMessagesEndRef} />
// // // // // // // // // // //         </div>
// // // // // // // // // // //         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // // // // // // // // //       </div>

// // // // // // // // // // //       {/* Main Content Area */}
// // // // // // // // // // //       <div className="flex-grow flex flex-col">
// // // // // // // // // // //         {/* Top Bar for API Key Selection, Title, and View Toggles */}
// // // // // // // // // // //         <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
// // // // // // // // // // //           <h1 className="text-xl font-bold text-blue-400 mb-2 sm:mb-0">AI Code Editor & Preview</h1>
          
// // // // // // // // // // //           {/* View Toggle Buttons */}
// // // // // // // // // // //           <div className="flex space-x-2 my-2 sm:my-0">
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={() => setCurrentView('code')}
// // // // // // // // // // //               className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
// // // // // // // // // // //                 currentView === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
// // // // // // // // // // //               }`}
// // // // // // // // // // //             >
// // // // // // // // // // //               Code
// // // // // // // // // // //             </button>
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={() => setCurrentView('preview')}
// // // // // // // // // // //               className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
// // // // // // // // // // //                 currentView === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
// // // // // // // // // // //               }`}
// // // // // // // // // // //             >
// // // // // // // // // // //               Preview
// // // // // // // // // // //             </button>
// // // // // // // // // // //           </div>

// // // // // // // // // // //           <div className="flex items-center space-x-4">
// // // // // // // // // // //             {!hasApiKey && (
// // // // // // // // // // //               <div className="flex items-center space-x-2">
// // // // // // // // // // //                 <span className="text-red-400 text-sm">API Key Missing!</span>
// // // // // // // // // // //                 <button
// // // // // // // // // // //                   onClick={handleSelectApiKey}
// // // // // // // // // // //                   className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors duration-200"
// // // // // // // // // // //                 >
// // // // // // // // // // //                   Select API Key
// // // // // // // // // // //                 </button>
// // // // // // // // // // //                 <a
// // // // // // // // // // //                   href="https://ai.google.dev/gemini-api/docs/billing"
// // // // // // // // // // //                   target="_blank"
// // // // // // // // // // //                   rel="noopener noreferrer"
// // // // // // // // // // //                   className="text-blue-400 hover:underline text-sm"
// // // // // // // // // // //                 >
// // // // // // // // // // //                   Billing Info
// // // // // // // // // // //                 </a>
// // // // // // // // // // //               </div>
// // // // // // // // // // //             )}
// // // // // // // // // // //             <button
// // // // // // // // // // //               onClick={handleSuggestImprovements}
// // // // // // // // // // //               className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
// // // // // // // // // // //                 isLoading || !hasApiKey
// // // // // // // // // // //                   ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
// // // // // // // // // // //                   : 'bg-green-600 hover:bg-green-700 text-white'
// // // // // // // // // // //               }`}
// // // // // // // // // // //               disabled={isLoading || !hasApiKey}
// // // // // // // // // // //               title={!hasApiKey ? "Please select an API key to enable AI features" : "Get AI suggestions for improving your code"}
// // // // // // // // // // //             >
// // // // // // // // // // //               Suggest Improvements
// // // // // // // // // // //             </button>
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </div>

// // // // // // // // // // //         {/* Code Editor or Preview (Conditionally Rendered) */}
// // // // // // // // // // //         <div className="flex-grow p-4 relative">
// // // // // // // // // // //           {currentView === 'code' && (
// // // // // // // // // // //             <div className="flex flex-col h-full">
// // // // // // // // // // //               <h3 className="text-lg font-semibold mb-2 text-gray-300">Code Editor</h3>
// // // // // // // // // // //               <CodeEditor code={code} onCodeChange={setCode} />
// // // // // // // // // // //             </div>
// // // // // // // // // // //           )}
// // // // // // // // // // //           {currentView === 'preview' && (
// // // // // // // // // // //             <div className="flex flex-col h-full">
// // // // // // // // // // //               <h3 className="text-lg font-semibold mb-2 text-gray-300">Live Preview</h3>
// // // // // // // // // // //               <PreviewPane
// // // // // // // // // // //                 generatedCode={code}
// // // // // // // // // // //                 onCompileError={handleCompileError}
// // // // // // // // // // //                 onRuntimeError={handleRuntimeError}
// // // // // // // // // // //               />
// // // // // // // // // // //             </div>
// // // // // // // // // // //           )}

// // // // // // // // // // //           {(compileError || runtimeError) && (
// // // // // // // // // // //             <ErrorDisplay
// // // // // // // // // // //               errorMessage={compileError || runtimeError}
// // // // // // // // // // //               aiAnalysis={aiAnalysis}
// // // // // // // // // // //               onClearError={clearError}
// // // // // // // // // // //             />
// // // // // // // // // // //           )}
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default App;

// // // // // // // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // // // // // // import CodeEditor from './components/CodeEditor';
// // // // // // // // // // import PreviewPane from './components/PreviewPane';
// // // // // // // // // // import ChatInput from './components/ChatInput';
// // // // // // // // // // import ChatMessageComponent from './components/ChatMessage';
// // // // // // // // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // // // // // // // import { generateWebApp, analyzeCodeErrorWithGemini, analyzeCodeForImprovements } from './services/geminiService';
// // // // // // // // // // import { LOCAL_STORAGE_CODE_KEY, LOCAL_STORAGE_CHAT_HISTORY_KEY } from './constants';
// // // // // // // // // // import { ChatMessage } from './types';
// // // // // // // // // // import { v4 as uuidv4 } from 'uuid';
// // // // // // // // // // import JSZip from 'jszip';
// // // // // // // // // // import { saveAs } from 'file-saver';

// // // // // // // // // // const hasApiKey = !!process.env.API_KEY;

// // // // // // // // // // const App: React.FC = () => {
// // // // // // // // // //   const [htmlCode, setHtmlCode] = useState<string>(
// // // // // // // // // //     localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_html`) || 
// // // // // // // // // //     `<!doctype html>
// // // // // // // // // // <html lang="en">
// // // // // // // // // // <head>
// // // // // // // // // //   <meta charset="utf-8">
// // // // // // // // // //   <title>My App</title>
// // // // // // // // // //   <link rel="stylesheet" href="/styles.css">
// // // // // // // // // // </head>
// // // // // // // // // // <body>
// // // // // // // // // //   <h1>Hello World!</h1>
// // // // // // // // // //   <script src="/index.js"></script>
// // // // // // // // // // </body>
// // // // // // // // // // </html>`
// // // // // // // // // //   );
// // // // // // // // // //   const [cssCode, setCssCode] = useState<string>(
// // // // // // // // // //     localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_css`) || 
// // // // // // // // // //     `body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; background: #1a1a1a; color: white; }`
// // // // // // // // // //   );
// // // // // // // // // //   const [jsCode, setJsCode] = useState<string>(
// // // // // // // // // //     localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_js`) || 
// // // // // // // // // //     `console.log("App loaded!");`
// // // // // // // // // //   );

// // // // // // // // // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
// // // // // // // // // //   const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
// // // // // // // // // //     const stored = localStorage.getItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);
// // // // // // // // // //     return stored ? JSON.parse(stored) : [];
// // // // // // // // // //   });
// // // // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // // // // // // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // // // // // // // //   const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
// // // // // // // // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('code');

// // // // // // // // // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // // // // // // // //   }, [chatHistory]);

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_html`, htmlCode);
// // // // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_css`, cssCode);
// // // // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_js`, jsCode);
// // // // // // // // // //   }, [htmlCode, cssCode, jsCode]);

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     localStorage.setItem(LOCAL_STORAGE_CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
// // // // // // // // // //   }, [chatHistory]);

// // // // // // // // // //   // Fixed: Safe aistudio check
// // // // // // // // // //   const handleSelectApiKey = useCallback(async () => {
// // // // // // // // // //     if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
// // // // // // // // // //       try {
// // // // // // // // // //         await (window as any).aistudio.openSelectKey();
// // // // // // // // // //         alert('API key selected! Reloading...');
// // // // // // // // // //         window.location.reload();
// // // // // // // // // //       } catch (err) {
// // // // // // // // // //         alert('Failed to select key. Are you in Google AI Studio?');
// // // // // // // // // //       }
// // // // // // // // // //     } else {
// // // // // // // // // //       alert('This button only works in Google AI Studio.\n\nFor local dev, add your key to .env.local:\nGEMINI_API_KEY=your_key_here');
// // // // // // // // // //     }
// // // // // // // // // //   }, []);

// // // // // // // // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // // // // // // // //     if (!hasApiKey) {
// // // // // // // // // //       alert('Add GEMINI_API_KEY to .env.local or use "Select API Key" in AI Studio');
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: message };
// // // // // // // // // //     setChatHistory(prev => [...prev, userMsg]);
// // // // // // // // // //     setIsLoading(true);
// // // // // // // // // //     setCompileError(null);
// // // // // // // // // //     setRuntimeError(null);
// // // // // // // // // //     setAiAnalysis(null);

// // // // // // // // // //     try {
// // // // // // // // // //       const { html, css, js } = await generateWebApp(message);
// // // // // // // // // //       setHtmlCode(html);
// // // // // // // // // //       setCssCode(css);
// // // // // // // // // //       setJsCode(js);
// // // // // // // // // //       setActiveTab(js.trim() ? 'js' : css.trim() ? 'css' : 'html');

// // // // // // // // // //       const aiMsg: ChatMessage = { id: uuidv4(), role: 'model', content: 'Web app generated!' };
// // // // // // // // // //       setChatHistory(prev => [...prev, aiMsg]);
// // // // // // // // // //     } catch (err: any) {
// // // // // // // // // //       const errorMsg: ChatMessage = { id: uuidv4(), role: 'error', content: `Generation failed: ${err.message}` };
// // // // // // // // // //       setChatHistory(prev => [...prev, errorMsg]);
// // // // // // // // // //     } finally {
// // // // // // // // // //       setIsLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   }, [hasApiKey]);

// // // // // // // // // //   const handleCompileError = useCallback(async (msg: string) => { /* ... same as before */ }, []);
// // // // // // // // // //   const handleRuntimeError = useCallback(async (msg: string) => { /* ... same */ }, []);
// // // // // // // // // //   const handleSuggestImprovements = useCallback(async () => { /* ... same */ }, []);
// // // // // // // // // //   const clearError = useCallback(() => { setCompileError(null); setRuntimeError(null); setAiAnalysis(null); }, []);

// // // // // // // // // //   const downloadZip = useCallback(() => {
// // // // // // // // // //     const zip = new JSZip();
// // // // // // // // // //     zip.file('index.html', htmlCode);
// // // // // // // // // //     zip.file('styles.css', cssCode);
// // // // // // // // // //     zip.file('index.js', jsCode);
// // // // // // // // // //     zip.generateAsync({ type: 'blob' }).then(blob => {
// // // // // // // // // //       saveAs(blob, 'my-web-app.zip');
// // // // // // // // // //     });
// // // // // // // // // //   }, [htmlCode, cssCode, jsCode]);

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="flex h-screen bg-gray-900 text-gray-100">
// // // // // // // // // //       {/* Sidebar */}
// // // // // // // // // //       <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
// // // // // // // // // //         <div className="p-4 border-b border-gray-700">
// // // // // // // // // //           <h2 className="text-xl font-bold text-blue-400">AI Web Builder</h2>
// // // // // // // // // //         </div>
// // // // // // // // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // // // // // // // //           {chatHistory.map(msg => <ChatMessageComponent key={msg.id} message={msg} />)}
// // // // // // // // // //           <div ref={chatEndRef} />
// // // // // // // // // //         </div>
// // // // // // // // // //         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // // // // // // // //       </div>

// // // // // // // // // //       {/* Main Area */}
// // // // // // // // // //       <div className="flex-1 flex flex-col">
// // // // // // // // // //         <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
// // // // // // // // // //           <h1 className="text-xl font-bold text-blue-400">Web App Builder</h1>
// // // // // // // // // //           <div className="flex gap-3">
// // // // // // // // // //             <button onClick={() => setCurrentView('code')} className={`px-4 py-2 rounded ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}>Code</button>
// // // // // // // // // //             <button onClick={() => setCurrentView('preview')} className={`px-4 py-2 rounded ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700'}`}>Preview</button>
// // // // // // // // // //             <button onClick={downloadZip} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">Download ZIP</button>
// // // // // // // // // //             {!hasApiKey && (
// // // // // // // // // //               <button onClick={handleSelectApiKey} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm">
// // // // // // // // // //                 Select API Key
// // // // // // // // // //               </button>
// // // // // // // // // //             )}
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>

// // // // // // // // // //         <div className="flex-1 p-4">
// // // // // // // // // //           {currentView === 'code' && (
// // // // // // // // // //             <CodeEditor
// // // // // // // // // //               htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode}
// // // // // // // // // //               setHtmlCode={setHtmlCode} setCssCode={setCssCode} setJsCode={setJsCode}
// // // // // // // // // //               activeTab={activeTab} setActiveTab={setActiveTab}
// // // // // // // // // //             />
// // // // // // // // // //           )}
// // // // // // // // // //           {currentView === 'preview' && (
// // // // // // // // // //             <PreviewPane
// // // // // // // // // //               htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode}
// // // // // // // // // //               onCompileError={handleCompileError}
// // // // // // // // // //               onRuntimeError={handleRuntimeError}
// // // // // // // // // //             />
// // // // // // // // // //           )}
// // // // // // // // // //           {(compileError || runtimeError) && (
// // // // // // // // // //             <ErrorDisplay errorMessage={compileError || runtimeError} aiAnalysis={aiAnalysis} onClearError={clearError} />
// // // // // // // // // //           )}
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default App;

// // // // // // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // // // // // import CodeEditor from './components/CodeEditor';
// // // // // // // // // import PreviewPane from './components/PreviewPane';
// // // // // // // // // import ChatInput from './components/ChatInput';
// // // // // // // // // import ChatMessageComponent from './components/ChatMessage';
// // // // // // // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // // // // // // import { generateWebApp, CodeBundle } from './services/geminiService';
// // // // // // // // // import { LOCAL_STORAGE_CODE_KEY, LOCAL_STORAGE_CHAT_HISTORY_KEY } from './constants';
// // // // // // // // // import { ChatMessage } from './types';
// // // // // // // // // import { v4 as uuidv4 } from 'uuid';
// // // // // // // // // import JSZip from 'jszip';
// // // // // // // // // import { saveAs } from 'file-saver';

// // // // // // // // // // === API KEY CHECK (Supports GEMINI_API_KEY_1, _2, _3) ===
// // // // // // // // // const API_KEYS = [
// // // // // // // // //   process.env.GEMINI_API_KEY_1,
// // // // // // // // //   process.env.GEMINI_API_KEY_2,
// // // // // // // // //   process.env.GEMINI_API_KEY_3,
// // // // // // // // //   process.env.GEMINI_API_KEY,
// // // // // // // // // ].filter(Boolean);

// // // // // // // // // const hasApiKey = API_KEYS.length > 0;

// // // // // // // // // const App: React.FC = () => {
// // // // // // // // //   // === CODE STATE (Persisted) ===
// // // // // // // // //   const [code, setCode] = useState<CodeBundle>(() => {
// // // // // // // // //     const html = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_html`);
// // // // // // // // //     const css = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_css`);
// // // // // // // // //     const js = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_js`);
// // // // // // // // //     return {
// // // // // // // // //       html: html || `<!doctype html>
// // // // // // // // // <html lang="en">
// // // // // // // // // <head>
// // // // // // // // //   <meta charset="utf-8">
// // // // // // // // //   <title>My App</title>
// // // // // // // // //   <link rel="stylesheet" href="/styles.css">
// // // // // // // // // </head>
// // // // // // // // // <body>
// // // // // // // // //   <h1>Hello World!</h1>
// // // // // // // // //   <script src="/index.js"></script>
// // // // // // // // // </body>
// // // // // // // // // </html>`,
// // // // // // // // //       css: css || `body { font-family: system-ui, sans-serif; text-align: center; padding: 2rem; background: #1a1a1a; color: white; }`,
// // // // // // // // //       js: js || `console.log("App loaded!");`,
// // // // // // // // //     };
// // // // // // // // //   });

// // // // // // // // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
// // // // // // // // //   const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
// // // // // // // // //     const stored = localStorage.getItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);
// // // // // // // // //     return stored ? JSON.parse(stored) : [];
// // // // // // // // //   });
// // // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // // // // // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // // // // // // //   const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
// // // // // // // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('code');

// // // // // // // // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // // // // // // // //   // === AUTO-SCROLL CHAT ===
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // // // // // // //   }, [chatHistory]);

// // // // // // // // //   // === PERSIST CODE ===
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_html`, code.html);
// // // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_css`, code.css);
// // // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_js`, code.js);
// // // // // // // // //   }, [code]);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     localStorage.setItem(LOCAL_STORAGE_CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
// // // // // // // // //   }, [chatHistory]);

// // // // // // // // //   // === SAFE AI STUDIO KEY SELECTOR ===
// // // // // // // // //   const handleSelectApiKey = useCallback(async () => {
// // // // // // // // //     if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
// // // // // // // // //       try {
// // // // // // // // //         await (window as any).aistudio.openSelectKey();
// // // // // // // // //         alert('API key selected! Reloading...');
// // // // // // // // //         window.location.reload();
// // // // // // // // //       } catch {
// // // // // // // // //         alert('Failed to select key. Are you in Google AI Studio?');
// // // // // // // // //       }
// // // // // // // // //     } else {
// // // // // // // // //       alert('This button only works in Google AI Studio.\n\nFor local dev, add your keys to .env.local:\nGEMINI_API_KEY_1=...\nGEMINI_API_KEY_2=...');
// // // // // // // // //     }
// // // // // // // // //   }, []);

// // // // // // // // //   // === SEND MESSAGE: FULL CONTEXT + KEY ROTATION ===
// // // // // // // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // // // // // // //     if (!hasApiKey) {
// // // // // // // // //       alert('Add at least one GEMINI_API_KEY_x in .env.local');
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: message };
// // // // // // // // //     setChatHistory(prev => [...prev, userMsg]);
// // // // // // // // //     setIsLoading(true);
// // // // // // // // //     setCompileError(null);
// // // // // // // // //     setRuntimeError(null);
// // // // // // // // //     setAiAnalysis(null);

// // // // // // // // //     try {
// // // // // // // // //       const previous = code.html.includes('<html') ? code : undefined;
// // // // // // // // //       const newCode = await generateWebApp(message, previous);

// // // // // // // // //       setCode(newCode);
// // // // // // // // //       setActiveTab(newCode.js.trim() ? 'js' : newCode.css.trim() ? 'css' : 'html');

// // // // // // // // //       const aiMsg: ChatMessage = { id: uuidv4(), role: 'model', content: 'App updated!' };
// // // // // // // // //       setChatHistory(prev => [...prev, aiMsg]);
// // // // // // // // //     } catch (err: any) {
// // // // // // // // //       const errorMsg: ChatMessage = { id: uuidv4(), role: 'error', content: `Failed: ${err.message}` };
// // // // // // // // //       setChatHistory(prev => [...prev, errorMsg]);
// // // // // // // // //     } finally {
// // // // // // // // //       setIsLoading(false);
// // // // // // // // //     }
// // // // // // // // //   }, [code, hasApiKey]);

// // // // // // // // //   // === ERROR HANDLERS (Placeholder — implement if needed) ===
// // // // // // // // //   const handleCompileError = useCallback((msg: string) => {
// // // // // // // // //     setCompileError(msg);
// // // // // // // // //   }, []);

// // // // // // // // //   const handleRuntimeError = useCallback((msg: string) => {
// // // // // // // // //     setRuntimeError(msg);
// // // // // // // // //   }, []);

// // // // // // // // //   const clearError = useCallback(() => {
// // // // // // // // //     setCompileError(null);
// // // // // // // // //     setRuntimeError(null);
// // // // // // // // //     setAiAnalysis(null);
// // // // // // // // //   }, []);

// // // // // // // // //   // === DOWNLOAD ZIP ===
// // // // // // // // //   const downloadZip = useCallback(() => {
// // // // // // // // //     const zip = new JSZip();
// // // // // // // // //     zip.file('index.html', code.html);
// // // // // // // // //     zip.file('styles.css', code.css);
// // // // // // // // //     zip.file('index.js', code.js);
// // // // // // // // //     zip.generateAsync({ type: 'blob' }).then(blob => {
// // // // // // // // //       saveAs(blob, 'my-web-app.zip');
// // // // // // // // //     });
// // // // // // // // //   }, [code]);

// // // // // // // // //   return (
// // // // // // // // //     <div className="flex h-screen bg-gray-900 text-gray-100 antialiased">
// // // // // // // // //       {/* Sidebar */}
// // // // // // // // //       <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
// // // // // // // // //         <div className="p-4 border-b border-gray-700">
// // // // // // // // //           <h2 className="text-xl font-bold text-blue-400">AI Web Builder</h2>
// // // // // // // // //         </div>
// // // // // // // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // // // // // // //           {chatHistory.length === 0 && (
// // // // // // // // //             <p className="text-gray-500 text-center">Type a prompt to generate a web app!</p>
// // // // // // // // //           )}
// // // // // // // // //           {chatHistory.map(msg => (
// // // // // // // // //             <ChatMessageComponent key={msg.id} message={msg} />
// // // // // // // // //           ))}
// // // // // // // // //           <div ref={chatEndRef} />
// // // // // // // // //         </div>
// // // // // // // // //         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // // // // // // //       </div>

// // // // // // // // //       {/* Main Area */}
// // // // // // // // //       <div className="flex-1 flex flex-col">
// // // // // // // // //         <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
// // // // // // // // //           <h1 className="text-xl font-bold text-blue-400">Web App Builder</h1>
// // // // // // // // //           <div className="flex gap-3">
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => setCurrentView('code')}
// // // // // // // // //               className={`px-4 py-2 rounded font-medium transition-colors ${
// // // // // // // // //                 currentView === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// // // // // // // // //               }`}
// // // // // // // // //             >
// // // // // // // // //               Code
// // // // // // // // //             </button>
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => setCurrentView('preview')}
// // // // // // // // //               className={`px-4 py-2 rounded font-medium transition-colors ${
// // // // // // // // //                 currentView === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// // // // // // // // //               }`}
// // // // // // // // //             >
// // // // // // // // //               Preview
// // // // // // // // //             </button>
// // // // // // // // //             <button
// // // // // // // // //               onClick={downloadZip}
// // // // // // // // //               className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white"
// // // // // // // // //             >
// // // // // // // // //               Download ZIP
// // // // // // // // //             </button>
// // // // // // // // //             {!hasApiKey && (
// // // // // // // // //               <button
// // // // // // // // //                 onClick={handleSelectApiKey}
// // // // // // // // //                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
// // // // // // // // //               >
// // // // // // // // //                 Select API Key
// // // // // // // // //               </button>
// // // // // // // // //             )}
// // // // // // // // //           </div>
// // // // // // // // //         </div>

// // // // // // // // //         <div className="flex-1 p-4 relative">
// // // // // // // // //           {currentView === 'code' && (
// // // // // // // // //             <div className="h-full">
// // // // // // // // //               <h3 className="text-lg font-semibold mb-2 text-gray-300">Code Editor</h3>
// // // // // // // // //               <CodeEditor
// // // // // // // // //                 htmlCode={code.html}
// // // // // // // // //                 cssCode={code.css}
// // // // // // // // //                 jsCode={code.js}
// // // // // // // // //                 setHtmlCode={(v) => setCode(prev => ({ ...prev, html: v }))}
// // // // // // // // //                 setCssCode={(v) => setCode(prev => ({ ...prev, css: v }))}
// // // // // // // // //                 setJsCode={(v) => setCode(prev => ({ ...prev, js: v }))}
// // // // // // // // //                 activeTab={activeTab}
// // // // // // // // //                 setActiveTab={setActiveTab}
// // // // // // // // //               />
// // // // // // // // //             </div>
// // // // // // // // //           )}
// // // // // // // // //           {currentView === 'preview' && (
// // // // // // // // //             <div className="h-full">
// // // // // // // // //               <h3 className="text-lg font-semibold mb-2 text-gray-300">Live Preview</h3>
// // // // // // // // //               <PreviewPane
// // // // // // // // //                 htmlCode={code.html}
// // // // // // // // //                 cssCode={code.css}
// // // // // // // // //                 jsCode={code.js}
// // // // // // // // //                 onCompileError={handleCompileError}
// // // // // // // // //                 onRuntimeError={handleRuntimeError}
// // // // // // // // //               />
// // // // // // // // //             </div>
// // // // // // // // //           )}

// // // // // // // // //           {(compileError || runtimeError) && (
// // // // // // // // //             <ErrorDisplay
// // // // // // // // //               errorMessage={compileError || runtimeError}
// // // // // // // // //               aiAnalysis={aiAnalysis}
// // // // // // // // //               onClearError={clearError}
// // // // // // // // //             />
// // // // // // // // //           )}
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default App;

// // // // // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // // // // import CodeEditor from './components/CodeEditor';
// // // // // // // // import PreviewPane from './components/PreviewPane';
// // // // // // // // import ChatInput from './components/ChatInput';
// // // // // // // // import ChatMessageComponent from './components/ChatMessage';
// // // // // // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // // // // // import { generateWebApp, CodeBundle } from './services/geminiService';
// // // // // // // // import { LOCAL_STORAGE_CODE_KEY, LOCAL_STORAGE_CHAT_HISTORY_KEY } from './constants';
// // // // // // // // import { ChatMessage } from './types';
// // // // // // // // import { v4 as uuidv4 } from 'uuid';
// // // // // // // // import JSZip from 'jszip';
// // // // // // // // import { saveAs } from 'file-saver';

// // // // // // // // // === API KEYS (Supports multiple keys) ===
// // // // // // // // const API_KEYS = [
// // // // // // // //   process.env.GEMINI_API_KEY_1,
// // // // // // // //   process.env.GEMINI_API_KEY_2,
// // // // // // // //   process.env.GEMINI_API_KEY_3,
// // // // // // // //   process.env.GEMINI_API_KEY,
// // // // // // // // ].filter(Boolean);

// // // // // // // // const hasApiKey = API_KEYS.length > 0;

// // // // // // // // const INITIAL_CODE: CodeBundle = {
// // // // // // // //   html: `<!doctype html>
// // // // // // // // <html lang="en">
// // // // // // // // <head>
// // // // // // // //   <meta charset="utf-8">
// // // // // // // //   <title>My App</title>
// // // // // // // //   <meta name="viewport" content="width=device-width, initial-scale=1">
// // // // // // // //   <link rel="stylesheet" href="/styles.css">
// // // // // // // // </head>
// // // // // // // // <body>
// // // // // // // //   <div class="container">
// // // // // // // //     <h1>Welcome!</h1>
// // // // // // // //     <p>Start building your web app...</p>
// // // // // // // //   </div>
// // // // // // // //   <script src="/index.js"></script>
// // // // // // // // </body>
// // // // // // // // </html>`,
// // // // // // // //   css: `body { margin: 0; font-family: system-ui, sans-serif; background: #0f172a; color: white; }
// // // // // // // // .container { min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 2rem; }`,
// // // // // // // //   js: `console.log("New project started!");`
// // // // // // // // };

// // // // // // // // const App: React.FC = () => {
// // // // // // // //   const [code, setCode] = useState<CodeBundle>(() => {
// // // // // // // //     const savedHtml = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_html`);
// // // // // // // //     const savedCss = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_css`);
// // // // // // // //     const savedJs = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_js`);

// // // // // // // //     if (savedHtml && savedCss && savedJs) {
// // // // // // // //       return { html: savedHtml, css: savedCss, js: savedJs };
// // // // // // // //     }
// // // // // // // //     return INITIAL_CODE;
// // // // // // // //   });

// // // // // // // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
// // // // // // // //   const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
// // // // // // // //     const stored = localStorage.getItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);
// // // // // // // //     return stored ? JSON.parse(stored) : [];
// // // // // // // //   });
// // // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // // // // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // // // // // //   const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
// // // // // // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('code');

// // // // // // // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // // // // // // //   useEffect(() => {
// // // // // // // //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // // // // // //   }, [chatHistory]);

// // // // // // // //   // === PERSIST CODE & CHAT ===
// // // // // // // //   useEffect(() => {
// // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_html`, code.html);
// // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_css`, code.css);
// // // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_js`, code.js);
// // // // // // // //   }, [code]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     localStorage.setItem(LOCAL_STORAGE_CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
// // // // // // // //   }, [chatHistory]);

// // // // // // // //   // === NEW PROJECT: FULL RESET ===
// // // // // // // //   const startNewProject = useCallback(() => {
// // // // // // // //     if (!confirm("Start a new project? This will clear all code and chat history.")) return;

// // // // // // // //     setCode(INITIAL_CODE);
// // // // // // // //     setChatHistory([]);
// // // // // // // //     setActiveTab('html');
// // // // // // // //     setCurrentView('code');
// // // // // // // //     setCompileError(null);
// // // // // // // //     setRuntimeError(null);
// // // // // // // //     setAiAnalysis(null);

// // // // // // // //     // Clear localStorage
// // // // // // // //     localStorage.removeItem(`${LOCAL_STORAGE_CODE_KEY}_html`);
// // // // // // // //     localStorage.removeItem(`${LOCAL_STORAGE_CODE_KEY}_css`);
// // // // // // // //     localStorage.removeItem(`${LOCAL_STORAGE_CODE_KEY}_js`);
// // // // // // // //     localStorage.removeItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);

// // // // // // // //     // Add welcome message
// // // // // // // //     setChatHistory([
// // // // // // // //       { id: uuidv4(), role: 'model', content: 'New project started! What would you like to build?' }
// // // // // // // //     ]);
// // // // // // // //   }, []);

// // // // // // // //   // === API KEY SELECTOR (AI Studio) ===
// // // // // // // //   const handleSelectApiKey = useCallback(async () => {
// // // // // // // //     if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
// // // // // // // //       try {
// // // // // // // //         await (window as any).aistudio.openSelectKey();
// // // // // // // //         alert('API key selected! Reloading...');
// // // // // // // //         window.location.reload();
// // // // // // // //       } catch {
// // // // // // // //         alert('Failed to select key.');
// // // // // // // //       }
// // // // // // // //     } else {
// // // // // // // //       alert('Add your keys to .env.local:\nGEMINI_API_KEY_1=...\nGEMINI_API_KEY_2=...');
// // // // // // // //     }
// // // // // // // //   }, []);

// // // // // // // //   // === SEND MESSAGE (with context) ===
// // // // // // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // // // // // //     if (!hasApiKey) {
// // // // // // // //       alert('Add at least one GEMINI_API_KEY_x in .env.local');
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: message };
// // // // // // // //     setChatHistory(prev => [...prev, userMsg]);
// // // // // // // //     setIsLoading(true);
// // // // // // // //     setCompileError(null);
// // // // // // // //     setRuntimeError(null);

// // // // // // // //     try {
// // // // // // // //       const previous = code.html.includes('<html') ? code : undefined;
// // // // // // // //       const newCode = await generateWebApp(message, previous);

// // // // // // // //       setCode(newCode);
// // // // // // // //       setActiveTab(newCode.js.trim() ? 'js' : newCode.css.trim() ? 'css' : 'html');

// // // // // // // //       setChatHistory(prev => [...prev, { id: uuidv4(), role: 'model', content: 'Updated!' }]);
// // // // // // // //     } catch (err: any) {
// // // // // // // //       setChatHistory(prev => [...prev, { id: uuidv4(), role: 'error', content: `Error: ${err.message}` }]);
// // // // // // // //     } finally {
// // // // // // // //       setIsLoading(false);
// // // // // // // //     }
// // // // // // // //   }, [code, hasApiKey]);

// // // // // // // //   // === ERROR & DOWNLOAD ===
// // // // // // // //   const handleCompileError = useCallback((msg: string) => setCompileError(msg), []);
// // // // // // // //   const handleRuntimeError = useCallback((msg: string) => setRuntimeError(msg), []);
// // // // // // // //   const clearError = useCallback(() => { setCompileError(null); setRuntimeError(null); setAiAnalysis(null); }, []);

// // // // // // // //   const downloadZip = useCallback(() => {
// // // // // // // //     const zip = new JSZip();
// // // // // // // //     zip.file('index.html', code.html);
// // // // // // // //     zip.file('styles.css', code.css);
// // // // // // // //     zip.file('index.js', code.js);
// // // // // // // //     zip.generateAsync({ type: 'blob' }).then(blob => {
// // // // // // // //       saveAs(blob, 'my-web-app.zip');
// // // // // // // //     });
// // // // // // // //   }, [code]);

// // // // // // // //   return (
// // // // // // // //     <div className="flex h-screen bg-gray-900 text-gray-100 antialiased">
// // // // // // // //       {/* Sidebar */}
// // // // // // // //       <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
// // // // // // // //         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// // // // // // // //           <h2 className="text-xl font-bold text-blue-400">AI Web Builder</h2>
// // // // // // // //           <button
// // // // // // // //             onClick={startNewProject}
// // // // // // // //             className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-gray-300 transition"
// // // // // // // //             title="Start fresh project"
// // // // // // // //           >
// // // // // // // //             New Project
// // // // // // // //           </button>
// // // // // // // //         </div>
// // // // // // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // // // // // //           {chatHistory.length === 0 && (
// // // // // // // //             <p className="text-gray-500 text-center">Type a prompt to begin!</p>
// // // // // // // //           )}
// // // // // // // //           {chatHistory.map(msg => (
// // // // // // // //             <ChatMessageComponent key={msg.id} message={msg} />
// // // // // // // //           ))}
// // // // // // // //           <div ref={chatEndRef} />
// // // // // // // //         </div>
// // // // // // // //         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // // // // // //       </div>

// // // // // // // //       {/* Main Area */}
// // // // // // // //       <div className="flex-1 flex flex-col">
// // // // // // // //         <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
// // // // // // // //           <h1 className="text-xl font-bold text-blue-400">Web App Builder</h1>
// // // // // // // //           <div className="flex gap-3">
// // // // // // // //             <button onClick={() => setCurrentView('code')} className={`px-4 py-2 rounded font-medium ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Code</button>
// // // // // // // //             <button onClick={() => setCurrentView('preview')} className={`px-4 py-2 rounded font-medium ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Preview</button>
// // // // // // // //             <button onClick={downloadZip} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">Download ZIP</button>
// // // // // // // //             {!hasApiKey && (
// // // // // // // //               <button onClick={handleSelectApiKey} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm">
// // // // // // // //                 Select Key
// // // // // // // //               </button>
// // // // // // // //             )}
// // // // // // // //           </div>
// // // // // // // //         </div>

// // // // // // // //         <div className="flex-1 p-4">
// // // // // // // //           {currentView === 'code' && (
// // // // // // // //             <div className="h-full">
// // // // // // // //               <CodeEditor
// // // // // // // //                 htmlCode={code.html}
// // // // // // // //                 cssCode={code.css}
// // // // // // // //                 jsCode={code.js}
// // // // // // // //                 setHtmlCode={(v) => setCode(prev => ({ ...prev, html: v }))}
// // // // // // // //                 setCssCode={(v) => setCode(prev => ({ ...prev, css: v }))}
// // // // // // // //                 setJsCode={(v) => setCode(prev => ({ ...prev, js: v }))}
// // // // // // // //                 activeTab={activeTab}
// // // // // // // //                 setActiveTab={setActiveTab}
// // // // // // // //               />
// // // // // // // //             </div>
// // // // // // // //           )}
// // // // // // // //           {currentView === 'preview' && (
// // // // // // // //             <div className="h-full">
// // // // // // // //               <PreviewPane
// // // // // // // //                 htmlCode={code.html}
// // // // // // // //                 cssCode={code.css}
// // // // // // // //                 jsCode={code.js}
// // // // // // // //                 onCompileError={handleCompileError}
// // // // // // // //                 onRuntimeError={handleRuntimeError}
// // // // // // // //               />
// // // // // // // //             </div>
// // // // // // // //           )}

// // // // // // // //           {(compileError || runtimeError) && (
// // // // // // // //             <ErrorDisplay
// // // // // // // //               errorMessage={compileError || runtimeError}
// // // // // // // //               aiAnalysis={aiAnalysis}
// // // // // // // //               onClearError={clearError}
// // // // // // // //             />
// // // // // // // //           )}
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default App;


// // // // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // // // import CodeEditor from './components/CodeEditor';
// // // // // // // import PreviewPane from './components/PreviewPane';
// // // // // // // import ChatInput from './components/ChatInput';
// // // // // // // import ChatMessageComponent from './components/ChatMessage';
// // // // // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // // // // import { generateWebApp, CodeBundle } from './services/geminiService';
// // // // // // // import { LOCAL_STORAGE_CODE_KEY, LOCAL_STORAGE_CHAT_HISTORY_KEY } from './constants';
// // // // // // // import { ChatMessage } from './types';
// // // // // // // import { v4 as uuidv4 } from 'uuid';
// // // // // // // import JSZip from 'jszip';
// // // // // // // import { saveAs } from 'file-saver';

// // // // // // // const API_KEYS = [
// // // // // // //   process.env.GEMINI_API_KEY_1,
// // // // // // //   process.env.GEMINI_API_KEY_2,
// // // // // // //   process.env.GEMINI_API_KEY_3,
// // // // // // //   process.env.GEMINI_API_KEY,
// // // // // // // ].filter(Boolean) as string[];

// // // // // // // const hasApiKey = API_KEYS.length > 0;

// // // // // // // interface Version {
// // // // // // //   id: string;
// // // // // // //   code: CodeBundle;
// // // // // // //   prompt: string;
// // // // // // //   timestamp: number;
// // // // // // // }

// // // // // // // const INITIAL_CODE: CodeBundle = {
// // // // // // //   html: `<!doctype html>
// // // // // // // <html lang="en">
// // // // // // // <head>
// // // // // // //   <meta charset="utf-8">
// // // // // // //   <title>My App</title>
// // // // // // //   <meta name="viewport" content="width=device-width, initial-scale=1">
// // // // // // //   <link rel="stylesheet" href="/styles.css">
// // // // // // // </head>
// // // // // // // <body>
// // // // // // //   <div class="container">
// // // // // // //     <h1>Welcome to AI Web Builder</h1>
// // // // // // //     <p>Describe what you want to build...</p>
// // // // // // //   </div>
// // // // // // //   <script src="/index.js"></script>
// // // // // // // </body>
// // // // // // // </html>`,
// // // // // // //   css: `body { margin: 0; font-family: system-ui, sans-serif; background: #0f172a; color: white; }
// // // // // // // .container { min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 2rem; }`,
// // // // // // //   js: `console.log("Ready to build!");`
// // // // // // // };

// // // // // // // const App: React.FC = () => {
// // // // // // //   const [currentCode, setCurrentCode] = useState<CodeBundle>(INITIAL_CODE);
// // // // // // //   const [versions, setVersions] = useState<Version[]>([]);
// // // // // // //   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
// // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // // // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // // // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('code');
// // // // // // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

// // // // // // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // // // // // //   // Load from localStorage
// // // // // // //   useEffect(() => {
// // // // // // //     const savedCode = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_current`);
// // // // // // //     const savedVersions = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_versions`);
// // // // // // //     const savedChat = localStorage.getItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);

// // // // // // //     if (savedCode) setCurrentCode(JSON.parse(savedCode));
// // // // // // //     if (savedVersions) setVersions(JSON.parse(savedVersions));
// // // // // // //     if (savedChat) setChatHistory(JSON.parse(savedChat));
// // // // // // //   }, []);

// // // // // // //   // Save everything
// // // // // // //   useEffect(() => {
// // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_current`, JSON.stringify(currentCode));
// // // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_versions`, JSON.stringify(versions));
// // // // // // //     localStorage.setItem(LOCAL_STORAGE_CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
// // // // // // //   }, [currentCode, versions, chatHistory]);

// // // // // // //   useEffect(() => {
// // // // // // //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // // // // //   }, [chatHistory]);

// // // // // // //   const addVersion = (code: CodeBundle, prompt: string) => {
// // // // // // //     const newVersion: Version = {
// // // // // // //       id: uuidv4(),
// // // // // // //       code,
// // // // // // //       prompt,
// // // // // // //       timestamp: Date.now(),
// // // // // // //     };
// // // // // // //     setVersions(prev => [newVersion, ...prev].slice(0, 50)); // Keep last 50 versions
// // // // // // //   };

// // // // // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // // // // //     if (!hasApiKey) {
// // // // // // //       alert('Add GEMINI_API_KEY_x to .env.local');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: message };
// // // // // // //     setChatHistory(prev => [...prev, userMsg]);
// // // // // // //     setIsLoading(true);
// // // // // // //     setCompileError(null);
// // // // // // //     setRuntimeError(null);

// // // // // // //     try {
// // // // // // //       // Always send full context: chat + current code + previous versions
// // // // // // //       const context = {
// // // // // // //         chatHistory: chatHistory.slice(-10), // Last 10 messages
// // // // // // //         currentCode,
// // // // // // //         previousVersions: versions.slice(0, 3).map(v => ({ prompt: v.prompt, code: v.code }))
// // // // // // //       };

// // // // // // //       const newCode = await generateWebApp(message, context);

// // // // // // //       setCurrentCode(newCode);
// // // // // // //       addVersion(newCode, message);

// // // // // // //       setChatHistory(prev => [...prev, {
// // // // // // //         id: uuidv4(),
// // // // // // //         role: 'model',
// // // // // // //         content: `Generated! ${newCode.js.trim() ? 'JS' : 'CSS/HTML'} updated.`
// // // // // // //       }]);

// // // // // // //       setActiveTab(newCode.js.trim() ? 'js' : newCode.css.trim() ? 'css' : 'html');
// // // // // // //     } catch (err: any) {
// // // // // // //       setChatHistory(prev => [...prev, { id: uuidv4(), role: 'error', content: `Failed: ${err.message}` }]);
// // // // // // //     } finally {
// // // // // // //       setIsLoading(false);
// // // // // // //     }
// // // // // // //   }, [currentCode, chatHistory, versions, hasApiKey]);

// // // // // // //   const startNewProject = () => {
// // // // // // //     if (!confirm("Start new project? All history will be cleared.")) return;
// // // // // // //     setCurrentCode(INITIAL_CODE);
// // // // // // //     setVersions([]);
// // // // // // //     setChatHistory([{
// // // // // // //       id: uuidv4(),
// // // // // // //       role: 'model',
// // // // // // //       content: 'New project started! What would you like to build?'
// // // // // // //     }]);
// // // // // // //     localStorage.clear();
// // // // // // //   };

// // // // // // //   const goToVersion = (version: Version) => {
// // // // // // //     setCurrentCode(version.code);
// // // // // // //     setChatHistory(prev => [...prev, {
// // // // // // //       id: uuidv4(),
// // // // // // //       role: 'model',
// // // // // // //       content: `Reverted to: "${version.prompt}"`
// // // // // // //     }]);
// // // // // // //   };

// // // // // // //   const downloadZip = () => {
// // // // // // //     const zip = new JSZip();
// // // // // // //     zip.file('index.html', currentCode.html);
// // // // // // //     zip.file('styles.css', currentCode.css);
// // // // // // //     zip.file('index.js', currentCode.js);
// // // // // // //     zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, 'my-web-app.zip'));
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="flex h-screen bg-gray-900 text-gray-100 antialiased">
// // // // // // //       {/* Sidebar */}
// // // // // // //       <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col">
// // // // // // //         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// // // // // // //           <h2 className="text-xl font-bold text-blue-400">AI Web Builder</h2>
// // // // // // //           <button onClick={startNewProject} className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded">
// // // // // // //             New Project
// // // // // // //           </button>
// // // // // // //         </div>

// // // // // // //         {/* Version History */}
// // // // // // //         {versions.length > 0 && (
// // // // // // //           <div className="p-3 border-b border-gray-700">
// // // // // // //             <p className="text-xs text-gray-400 mb-2">Version History (click to revert)</p>
// // // // // // //             <div className="space-y-1 max-h-40 overflow-y-auto">
// // // // // // //               {versions.slice(0, 10).map(v => (
// // // // // // //                 <button
// // // // // // //                   key={v.id}
// // // // // // //                   onClick={() => goToVersion(v)}
// // // // // // //                   className="block w-full text-left text-xs p-2 bg-gray-700 hover:bg-gray-600 rounded truncate"
// // // // // // //                   title={v.prompt}
// // // // // // //                 >
// // // // // // //                   {v.prompt.substring(0, 40)}...
// // // // // // //                 </button>
// // // // // // //               ))}
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         )}

// // // // // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // // // // //           {chatHistory.map(msg => (
// // // // // // //             <ChatMessageComponent key={msg.id} message={msg} />
// // // // // // //           ))}
// // // // // // //           <div ref={chatEndRef} />
// // // // // // //         </div>
// // // // // // //         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // // // // //       </div>

// // // // // // //       {/* Main */}
// // // // // // //       <div className="flex-1 flex flex-col">
// // // // // // //         <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
// // // // // // //           <h1 className="text-xl font-bold text-blue-400">Live Editor</h1>
// // // // // // //           <div className="flex gap-3">
// // // // // // //             <button onClick={() => setCurrentView('code')} className={`px-4 py-2 rounded ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}>Code</button>
// // // // // // //             <button onClick={() => setCurrentView('preview')} className={`px-4 py-2 rounded ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700'}`}>Preview</button>
// // // // // // //             <button onClick={downloadZip} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">Download ZIP</button>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         <div className="flex-1 p-4">
// // // // // // //           {currentView === 'code' && (
// // // // // // //             <CodeEditor
// // // // // // //               htmlCode={currentCode.html}
// // // // // // //               cssCode={currentCode.css}
// // // // // // //               jsCode={currentCode.js}
// // // // // // //               setHtmlCode={v => setCurrentCode(prev => ({ ...prev, html: v }))}
// // // // // // //               setCssCode={v => setCurrentCode(prev => ({ ...prev, css: v }))}
// // // // // // //               setJsCode={v => setCurrentCode(prev => ({ ...prev, js: v }))}
// // // // // // //               activeTab={activeTab}
// // // // // // //               setActiveTab={setActiveTab}
// // // // // // //             />
// // // // // // //           )}
// // // // // // //           {currentView === 'preview' && (
// // // // // // //             <PreviewPane
// // // // // // //               htmlCode={currentCode.html}
// // // // // // //               cssCode={currentCode.css}
// // // // // // //               jsCode={currentCode.js}
// // // // // // //               onCompileError={setCompileError}
// // // // // // //               onRuntimeError={setRuntimeError}
// // // // // // //             />
// // // // // // //           )}
// // // // // // //           {(compileError || runtimeError) && (
// // // // // // //             <ErrorDisplay errorMessage={compileError || runtimeError} onClearError={() => { setCompileError(null); setRuntimeError(null); }} />
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default App;


// // // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // // import CodeEditor from './components/CodeEditor';
// // // // // // import PreviewPane from './components/PreviewPane';
// // // // // // import ChatInput from './components/ChatInput';
// // // // // // import ChatMessageComponent from './components/ChatMessage';
// // // // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // // // import { generateWebApp, CodeBundle } from './services/geminiService';
// // // // // // import { LOCAL_STORAGE_CODE_KEY, LOCAL_STORAGE_CHAT_HISTORY_KEY } from './constants';
// // // // // // import { ChatMessage } from './types';
// // // // // // import { v4 as uuidv4 } from 'uuid';
// // // // // // import JSZip from 'jszip';
// // // // // // import { saveAs } from 'file-saver';

// // // // // // interface Version {
// // // // // //   id: string;
// // // // // //   code: CodeBundle;
// // // // // //   prompt: string;
// // // // // //   timestamp: number;
// // // // // // }

// // // // // // const INITIAL_CODE: CodeBundle = {
// // // // // //   html: `<!doctype html>
// // // // // // <html lang="en">
// // // // // // <head>
// // // // // //   <meta charset="utf-8">
// // // // // //   <title>My App</title>
// // // // // //   <meta name="viewport" content="width=device-width, initial-scale=1">
// // // // // //   <link rel="stylesheet" href="/styles.css">
// // // // // // </head>
// // // // // // <body>
// // // // // //   <div class="container">
// // // // // //     <h1>Welcome to AI Web Builder</h1>
// // // // // //     <p>Describe what you want to build...</p>
// // // // // //   </div>
// // // // // //   <script src="/index.js"></script>
// // // // // // </body>
// // // // // // </html>`,
// // // // // //   css: `body { margin: 0; font-family: system-ui, sans-serif; background: #0f172a; color: white; }
// // // // // // .container { min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 2rem; }`,
// // // // // //   js: `console.log("Ready to build!");`
// // // // // // };

// // // // // // const App: React.FC = () => {
// // // // // //   const [currentCode, setCurrentCode] = useState<CodeBundle>(INITIAL_CODE);
// // // // // //   const [versions, setVersions] = useState<Version[]>([]);
// // // // // //   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
// // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('code');
// // // // // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

// // // // // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // // // // //   useEffect(() => {
// // // // // //     const savedCode = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_current`);
// // // // // //     const savedVersions = localStorage.getItem(`${LOCAL_STORAGE_CODE_KEY}_versions`);
// // // // // //     const savedChat = localStorage.getItem(LOCAL_STORAGE_CHAT_HISTORY_KEY);

// // // // // //     if (savedCode) setCurrentCode(JSON.parse(savedCode));
// // // // // //     if (savedVersions) setVersions(JSON.parse(savedVersions));
// // // // // //     if (savedChat) setChatHistory(JSON.parse(savedChat));
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_current`, JSON.stringify(currentCode));
// // // // // //     localStorage.setItem(`${LOCAL_STORAGE_CODE_KEY}_versions`, JSON.stringify(versions));
// // // // // //     localStorage.setItem(LOCAL_STORAGE_CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
// // // // // //   }, [currentCode, versions, chatHistory]);

// // // // // //   useEffect(() => {
// // // // // //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // // // //   }, [chatHistory]);

// // // // // //   const addVersion = (code: CodeBundle, prompt: string) => {
// // // // // //     const newVersion: Version = { id: uuidv4(), code, prompt, timestamp: Date.now() };
// // // // // //     setVersions(prev => [newVersion, ...prev].slice(0, 50));
// // // // // //   };

// // // // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // // // //     const isFirstMessage = chatHistory.length === 0;

// // // // // //     const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: message };
// // // // // //     setChatHistory(prev => [...prev, userMsg]);
// // // // // //     setIsLoading(true);
// // // // // //     setCompileError(null);
// // // // // //     setRuntimeError(null);

// // // // // //     try {
// // // // // //       const newCode = await generateWebApp(message, {
// // // // // //   currentCode: isFirstMessage ? undefined : currentCode,
// // // // // //   isFirstMessage,
// // // // // //   chatHistory,
// // // // // // });

// // // // // //       setCurrentCode(newCode);
// // // // // //       addVersion(newCode, message);

// // // // // //       setChatHistory(prev => [...prev, {
// // // // // //         id: uuidv4(),
// // // // // //         role: 'model',
// // // // // //         content: 'App updated!'
// // // // // //       }]);

// // // // // //       setActiveTab(newCode.js.trim() ? 'js' : newCode.css.trim() ? 'css' : 'html');
// // // // // //     } catch (err: any) {
// // // // // //       setChatHistory(prev => [...prev, {
// // // // // //         id: uuidv4(),
// // // // // //         role: 'error',
// // // // // //         content: `Error: ${err.message}`
// // // // // //       }]);
// // // // // //     } finally {
// // // // // //       setIsLoading(false);
// // // // // //     }
// // // // // //   }, [currentCode, chatHistory]);

// // // // // //   const startNewProject = () => {
// // // // // //     if (!confirm("Start a new project? All history will be cleared.")) return;
// // // // // //     setCurrentCode(INITIAL_CODE);
// // // // // //     setVersions([]);
// // // // // //     setChatHistory([{
// // // // // //       id: uuidv4(),
// // // // // //       role: 'model',
// // // // // //       content: 'New project started! What would you like to build?'
// // // // // //     }]);
// // // // // //     localStorage.clear();
// // // // // //   };

// // // // // //   const goToVersion = (version: Version) => {
// // // // // //     setCurrentCode(version.code);
// // // // // //     setChatHistory(prev => [...prev, {
// // // // // //       id: uuidv4(),
// // // // // //       role: 'model',
// // // // // //       content: `Reverted to: "${version.prompt}"`
// // // // // //     }]);
// // // // // //   };

// // // // // //   const downloadZip = () => {
// // // // // //     const zip = new JSZip();
// // // // // //     zip.file('index.html', currentCode.html);
// // // // // //     zip.file('styles.css', currentCode.css);
// // // // // //     zip.file('index.js', currentCode.js);
// // // // // //     zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, 'my-web-app.zip'));
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="flex h-screen bg-gray-900 text-gray-100 antialiased">
// // // // // //       {/* Sidebar */}
// // // // // //       <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col">
// // // // // //         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// // // // // //           <h2 className="text-xl font-bold text-blue-400">AI Web Builder</h2>
// // // // // //           <button onClick={startNewProject} className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded">
// // // // // //             New Project
// // // // // //           </button>
// // // // // //         </div>

// // // // // //         {versions.length > 0 && (
// // // // // //           <div className="p-3 border-b border-gray-700">
// // // // // //             <p className="text-xs text-gray-400 mb-2">History (click to revert)</p>
// // // // // //             <div className="space-y-1 max-h-40 overflow-y-auto">
// // // // // //               {versions.slice(0, 10).map(v => (
// // // // // //                 <button
// // // // // //                   key={v.id}
// // // // // //                   onClick={() => goToVersion(v)}
// // // // // //                   className="block w-full text-left text-xs p-2 bg-gray-700 hover:bg-gray-600 rounded truncate"
// // // // // //                   title={v.prompt}
// // // // // //                 >
// // // // // //                   {v.prompt.substring(0, 40)}...
// // // // // //                 </button>
// // // // // //               ))}
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         )}

// // // // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // // // //           {chatHistory.length === 0 && (
// // // // // //             <p className="text-gray-500 text-center">Type your idea below...</p>
// // // // // //           )}
// // // // // //           {chatHistory.map(msg => (
// // // // // //             <ChatMessageComponent key={msg.id} message={msg} />
// // // // // //           ))}
// // // // // //           <div ref={chatEndRef} />
// // // // // //         </div>
// // // // // //         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // // // //       </div>

// // // // // //       {/* Main Area */}
// // // // // //       <div className="flex-1 flex flex-col">
// // // // // //         <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
// // // // // //           <h1 className="text-xl font-bold text-blue-400">Live Editor</h1>
// // // // // //           <div className="flex gap-3">
// // // // // //             <button onClick={() => setCurrentView('code')} className={`px-4 py-2 rounded font-medium ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
// // // // // //               Code
// // // // // //             </button>
// // // // // //             <button onClick={() => setCurrentView('preview')} className={`px-4 py-2 rounded font-medium ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
// // // // // //               Preview
// // // // // //             </button>
// // // // // //             <button onClick={downloadZip} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">
// // // // // //               Download ZIP
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         <div className="flex-1 p-4 relative">
// // // // // //           {currentView === 'code' && (
// // // // // //             <CodeEditor
// // // // // //               htmlCode={currentCode.html}
// // // // // //               cssCode={currentCode.css}
// // // // // //               jsCode={currentCode.js}
// // // // // //               setHtmlCode={v => setCurrentCode(prev => ({ ...prev, html: v }))}
// // // // // //               setCssCode={v => setCurrentCode(prev => ({ ...prev, css: v }))}
// // // // // //               setJsCode={v => setCurrentCode(prev => ({ ...prev, js: v }))}
// // // // // //               activeTab={activeTab}
// // // // // //               setActiveTab={setActiveTab}
// // // // // //             />
// // // // // //           )}
// // // // // //           {currentView === 'preview' && (
// // // // // //             <PreviewPane
// // // // // //               htmlCode={currentCode.html}
// // // // // //               cssCode={currentCode.css}
// // // // // //               jsCode={currentCode.js}
// // // // // //               onCompileError={setCompileError}
// // // // // //               onRuntimeError={setRuntimeError}
// // // // // //             />
// // // // // //           )}
// // // // // //           {(compileError || runtimeError) && (
// // // // // //             <ErrorDisplay
// // // // // //               errorMessage={compileError || runtimeError || ''}
// // // // // //               onClearError={() => { setCompileError(null); setRuntimeError(null); }}
// // // // // //             />
// // // // // //           )}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default App;

// // // // // // src/App.tsx
// // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // import CodeEditor from './components/CodeEditor';
// // // // // import PreviewPane from './components/PreviewPane';
// // // // // import ChatInput from './components/ChatInput';
// // // // // import ChatMessageComponent from './components/ChatMessage';
// // // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // // import { generateWebApp, CodeBundle } from './services/geminiService';
// // // // // import { storageService, Project, ChatMessage, CodeVersion } from './services/storageService';
// // // // // import { v4 as uuidv4 } from 'uuid';
// // // // // import JSZip from 'jszip';
// // // // // import { saveAs } from 'file-saver';

// // // // // const App: React.FC = () => {
// // // // //   const [projects, setProjects] = useState<Project[]>([]);
// // // // //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// // // // //   const [currentCode, setCurrentCode] = useState<CodeBundle>({
// // // // //     html: "<h1>Loading...</h1>", css: "", js: ""
// // // // //   });
// // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('preview');
// // // // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
// // // // //   const [showHistory, setShowHistory] = useState(false);

// // // // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // // // //   // Load all projects once
// // // // //   useEffect(() => {
// // // // //     const all = storageService.getAllProjects();
// // // // //     setProjects(all);

// // // // //     if (all.length === 0) {
// // // // //       const newProj = storageService.createProject("My First Project");
// // // // //       setProjects([newProj]);
// // // // //       setCurrentProject(newProj);
// // // // //     } else {
// // // // //       setCurrentProject(all[0]); // latest first
// // // // //     }
// // // // //   }, []);

// // // // //   // THIS IS THE FIX: When currentProject changes → reload chat + code
// // // // //   useEffect(() => {
// // // // //     if (currentProject) {
// // // // //       // Reload latest code version
// // // // //       if (currentProject.versions.length > 0) {
// // // // //         setCurrentCode(currentProject.versions[0].code);
// // // // //       } else {
// // // // //         setCurrentCode({
// // // // //           html: `<!doctype html><html><head><link rel="stylesheet" href="/styles.css"></head><body><h1>Start building...</h1><script src="/index.js"></script></body></html>`,
// // // // //           css: "body{margin:0;font-family:sans-serif;background:#0f172a;color:white;display:grid;place-items:center;height:100vh}",
// // // // //           js: "console.log('Ready');"
// // // // //         });
// // // // //       }
// // // // //       // Force scroll to bottom
// // // // //       setTimeout(() => {
// // // // //         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // // //       }, 100);
// // // // //     }
// // // // //   }, [currentProject]);

// // // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // // //     if (!currentProject) return;

// // // // //     const userMsg: ChatMessage = {
// // // // //       id: uuidv4(),
// // // // //       role: "user",
// // // // //       content: message,
// // // // //       timestamp: Date.now()
// // // // //     };
// // // // //     storageService.addChatMessage(currentProject.id, userMsg);
// // // // //     setCurrentProject({ ...currentProject, chat: [...currentProject.chat, userMsg] });

// // // // //     setIsLoading(true);
// // // // //     setCompileError(null);
// // // // //     setRuntimeError(null);

// // // // //     try {
// // // // //       const isFirst = currentProject.versions.length === 0;
// // // // //       const prevCode = currentProject.versions[0]?.code;

// // // // //       const newCode = await generateWebApp(message, {
// // // // //         currentCode: isFirst ? undefined : prevCode,
// // // // //         isFirstMessage: isFirst
// // // // //       });

// // // // //       const version: CodeVersion = {
// // // // //         id: uuidv4(),
// // // // //         code: newCode,
// // // // //         prompt: message,
// // // // //         timestamp: Date.now()
// // // // //       };
// // // // //       storageService.addCodeVersion(currentProject.id, version);

// // // // //       const aiMsg: ChatMessage = {
// // // // //         id: uuidv4(),
// // // // //         role: "model",
// // // // //         content: "Updated!",
// // // // //         versionId: version.id,
// // // // //         timestamp: Date.now()
// // // // //       };
// // // // //       storageService.addChatMessage(currentProject.id, aiMsg);

// // // // //       // Refresh project from storage
// // // // //       const updatedProject = storageService.getProject(currentProject.id);
// // // // //       if (updatedProject) {
// // // // //         setCurrentProject(updatedProject);
// // // // //         setProjects(storageService.getAllProjects());
// // // // //       }
// // // // //     } catch (err: any) {
// // // // //       const errorMsg: ChatMessage = {
// // // // //         id: uuidv4(),
// // // // //         role: "error",
// // // // //         content: err.message || "Generation failed",
// // // // //         timestamp: Date.now()
// // // // //       };
// // // // //       storageService.addChatMessage(currentProject.id, errorMsg);
// // // // //       setCurrentProject(storageService.getProject(currentProject.id)!);
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   }, [currentProject]);

// // // // //   const startNewProject = () => {
// // // // //     const name = prompt("Project name?", "New Project") || "Untitled";
// // // // //     const newProj = storageService.createProject(name);
// // // // //     setProjects(storageService.getAllProjects());
// // // // //     setCurrentProject(newProj);
// // // // //   };

// // // // //   const loadVersion = (versionId: string) => {
// // // // //     const version = currentProject?.versions.find(v => v.id === versionId);
// // // // //     if (version) {
// // // // //       setCurrentCode(version.code);
// // // // //     }
// // // // //   };

// // // // //   const downloadZip = () => {
// // // // //     const zip = new JSZip();
// // // // //     zip.file('index.html', currentCode.html);
// // // // //     zip.file('styles.css', currentCode.css);
// // // // //     zip.file('index.js', currentCode.js);
// // // // //     zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, `${currentProject?.name || "app"}.zip`));
// // // // //   };

// // // // //   if (!currentProject) {
// // // // //     return <div className="flex h-screen items-center justify-center text-2xl text-gray-400">Loading projects...</div>;
// // // // //   }

// // // // //   return (
// // // // //     <div className="flex h-screen bg-gray-900 text-gray-100">
// // // // //       {/* Sidebar */}
// // // // //       <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col">
// // // // //         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// // // // //           <button
// // // // //             onClick={() => setShowHistory(!showHistory)}
// // // // //             className="text-blue-400 hover:text-blue-300 font-bold text-lg"
// // // // //           >
// // // // //             History ({projects.length})
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={startNewProject}
// // // // //             className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
// // // // //           >
// // // // //             + New Project
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Project History Panel */}
// // // // //         {showHistory && (
// // // // //           <div className="absolute top-16 left-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
// // // // //             <div className="p-3 border-b border-gray-700 flex justify-between items-center">
// // // // //               <h3 className="font-bold text-lg">All Projects</h3>
// // // // //               <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
// // // // //             </div>
// // // // //             <div className="max-h-80 overflow-y-auto">
// // // // //               {projects.map(p => (
// // // // //                 <button
// // // // //                   key={p.id}
// // // // //                   onClick={() => {
// // // // //                     setCurrentProject(p);
// // // // //                     setShowHistory(false);
// // // // //                   }}
// // // // //                   className={`block w-full text-left p-4 hover:bg-gray-700 border-b border-gray-750 ${currentProject?.id === p.id ? 'bg-blue-900' : ''}`}
// // // // //                 >
// // // // //                   <div className="font-semibold text-white">{p.name}</div>
// // // // //                   <div className="text-xs text-gray-400">
// // // // //                     {new Date(p.updatedAt).toLocaleString()} • {p.versions.length} versions
// // // // //                   </div>
// // // // //                 </button>
// // // // //               ))}
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Chat */}
// // // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // // //           {currentProject.chat.map(msg => (
// // // // //             <div key={msg.id}>
// // // // //               <ChatMessageComponent message={msg} />
// // // // //               {msg.role === "model" && msg.versionId && (
// // // // //                 <button
// // // // //                   onClick={() => loadVersion(msg.versionId!)}
// // // // //                   className="mt-2 text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full"
// // // // //                 >
// // // // //                   View This Version
// // // // //                 </button>
// // // // //               )}
// // // // //             </div>
// // // // //           ))}
// // // // //           <div ref={chatEndRef} />
// // // // //         </div>

// // // // //         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // // //       </div>

// // // // //       {/* Main Editor */}
// // // // //       <div className="flex-1 flex flex-col">
// // // // //         <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
// // // // //           <h1 className="text-xl font-bold text-blue-400">
// // // // //             {currentProject.name}
// // // // //           </h1>
// // // // //           <div className="flex gap-3">
// // // // //             <button onClick={() => setCurrentView('code')} className={`px-4 py-2 rounded font-medium ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
// // // // //               Code
// // // // //             </button>
// // // // //             <button onClick={() => setCurrentView('preview')} className={`px-4 py-2 rounded font-medium ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
// // // // //               Preview
// // // // //             </button>
// // // // //             <button onClick={downloadZip} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">
// // // // //               Download ZIP
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>

// // // // //         <div className="flex-1 relative bg-black">
// // // // //           {currentView === 'code' && (
// // // // //             <CodeEditor
// // // // //               htmlCode={currentCode.html}
// // // // //               cssCode={currentCode.css}
// // // // //               jsCode={currentCode.js}
// // // // //               setHtmlCode={v => setCurrentCode(p => ({ ...p, html: v }))}
// // // // //               setCssCode={v => setCurrentCode(p => ({ ...p, css: v }))}
// // // // //               setJsCode={v => setCurrentCode(p => ({ ...p, js: v }))}
// // // // //               activeTab={activeTab}
// // // // //               setActiveTab={setActiveTab}
// // // // //             />
// // // // //           )}
// // // // //           {currentView === 'preview' && (
// // // // //             <PreviewPane
// // // // //               htmlCode={currentCode.html}
// // // // //               cssCode={currentCode.css}
// // // // //               jsCode={currentCode.js}
// // // // //               onCompileError={setCompileError}
// // // // //               onRuntimeError={setRuntimeError}
// // // // //             />
// // // // //           )}
// // // // //           {(compileError || runtimeError) && (
// // // // //             <ErrorDisplay
// // // // //               errorMessage={compileError || runtimeError || ''}
// // // // //               onClearError={() => { setCompileError(null); setRuntimeError(null); }}
// // // // //             />
// // // // //           )}
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default App;

// // // // // src/App.tsx — FINAL WITH PLANNING AGENT
// // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // import CodeEditor from './components/CodeEditor';
// // // // import PreviewPane from './components/PreviewPane';
// // // // import ChatInput from './components/ChatInput';
// // // // import ChatMessageComponent from './components/ChatMessage';
// // // // import ErrorDisplay from './components/ErrorDisplay';
// // // // import { generateWebApp, CodeBundle } from './services/geminiService';
// // // // import { storageService, Project, ChatMessage, CodeVersion } from './services/storageService';
// // // // import { v4 as uuidv4 } from 'uuid';
// // // // import JSZip from 'jszip';
// // // // import { saveAs } from 'file-saver';
// // // // import ReactMarkdown from 'react-markdown';  // npm install react-markdown

// // // // const App: React.FC = () => {
// // // //   const [projects, setProjects] = useState<Project[]>([]);
// // // //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// // // //   const [currentCode, setCurrentCode] = useState<CodeBundle>({ html: "", css: "", js: "" });
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const [mode, setMode] = useState<"plan" | "code">("code"); // NEW
// // // //   const [compileError, setCompileError] = useState<string | null>(null);
// // // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('preview');
// // // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
// // // //   const [showHistory, setShowHistory] = useState(false);

// // // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // // //   useEffect(() => {
// // // //     const all = storageService.getAllProjects();
// // // //     setProjects(all);
// // // //     if (all.length === 0) {
// // // //       const p = storageService.createProject("My Project");
// // // //       setProjects([p]); setCurrentProject(p);
// // // //     } else {
// // // //       setCurrentProject(all[0]);
// // // //     }
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     if (currentProject?.versions[0]) {
// // // //       setCurrentCode(currentProject.versions[0].code);
// // // //     }
// // // //   }, [currentProject]);

// // // //   const handleSendMessage = useCallback(async (message: string) => {
// // // //     if (!currentProject) return;

// // // //     const userMsg: ChatMessage = { id: uuidv4(), role: "user", content: message, timestamp: Date.now() };
// // // //     storageService.addChatMessage(currentProject.id, userMsg);
// // // //     setCurrentProject({ ...currentProject, chat: [...currentProject.chat, userMsg] });

// // // //     setIsLoading(true);
// // // //     try {
// // // //       const result = await generateWebApp(message, {
// // // //         currentCode: currentProject.versions[0]?.code,
// // // //         isFirstMessage: currentProject.versions.length === 0,
// // // //         mode
// // // //       });

// // // //       if (result.type === "plan") {
// // // //         const planMsg: ChatMessage = {
// // // //           id: uuidv4(),
// // // //           role: "model",
// // // //           content: result.content,
// // // //           timestamp: Date.now()
// // // //         };
// // // //         storageService.addChatMessage(currentProject.id, planMsg);
// // // //       } else if (result.code) {
// // // //         const version: CodeVersion = {
// // // //           id: uuidv4(),
// // // //           code: result.code,
// // // //           prompt: message,
// // // //           timestamp: Date.now()
// // // //         };
// // // //         storageService.addCodeVersion(currentProject.id, version);
// // // //         const aiMsg: ChatMessage = {
// // // //           id: uuidv4(),
// // // //           role: "model",
// // // //           content: "Code updated!",
// // // //           versionId: version.id,
// // // //           timestamp: Date.now()
// // // //         };
// // // //         storageService.addChatMessage(currentProject.id, aiMsg);
// // // //       }

// // // //       setCurrentProject(storageService.getProject(currentProject.id)!);
// // // //     } catch (err: any) {
// // // //       storageService.addChatMessage(currentProject.id, {
// // // //         id: uuidv4(), role: "error", content: err.message, timestamp: Date.now()
// // // //       });
// // // //       setCurrentProject(storageService.getProject(currentProject.id)!);
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   }, [currentProject, mode]);

// // // //   const startNewProject = () => {
// // // //     const name = prompt("Project name?", "New Project") || "Untitled";
// // // //     const p = storageService.createProject(name);
// // // //     setProjects(storageService.getAllProjects());
// // // //     setCurrentProject(p);
// // // //     setMode("plan"); // Start with planning!
// // // //   };

// // // //   const loadVersion = (id: string) => {
// // // //     const v = currentProject?.versions.find(x => x.id === id);
// // // //     if (v) setCurrentCode(v.code);
// // // //   };

// // // //   const downloadZip = () => {
// // // //     const zip = new JSZip();
// // // //     zip.file('index.html', currentCode.html);
// // // //     zip.file('styles.css', currentCode.css);
// // // //     zip.file('index.js', currentCode.js);
// // // //     zip.generateAsync({ type: 'blob' }).then(b => saveAs(b, `${currentProject?.name}.zip`));
// // // //   };

// // // //   if (!currentProject) return <div className="flex h-screen items-center justify-center text-3xl">Loading...</div>;

// // // //   return (
// // // //     <div className="flex h-screen bg-gray-900 text-gray-100">
// // // //       {/* Sidebar */}
// // // //       <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col">
// // // //         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// // // //           <button onClick={() => setShowHistory(!showHistory)} className="text-blue-400 font-bold">
// // // //             History ({projects.length})
// // // //           </button>
// // // //           <button onClick={startNewProject} className="px-4 py-2 bg-green-600 rounded-lg text-sm">
// // // //             + New Project
// // // //           </button>
// // // //         </div>

// // // //         {/* History Panel */}
// // // //         {showHistory && (
// // // //           <div className="absolute top-16 left-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
// // // //             <div className="p-3 border-b border-gray-700 flex justify-between">
// // // //               <h3 className="font-bold">Projects</h3>
// // // //               <button onClick={() => setShowHistory(false)} className="text-2xl">×</button>
// // // //             </div>
// // // //             {projects.map(p => (
// // // //               <button key={p.id} onClick={() => { setCurrentProject(p); setShowHistory(false); }}
// // // //                 className={`block w-full text-left p-4 hover:bg-gray-700 ${currentProject?.id === p.id ? 'bg-blue-900' : ''}`}>
// // // //                 <div className="font-semibold">{p.name}</div>
// // // //                 <div className="text-xs text-gray-400">{new Date(p.updatedAt).toLocaleString()}</div>
// // // //               </button>
// // // //             ))}
// // // //           </div>
// // // //         )}

// // // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // // //           {currentProject.chat.map(msg => (
// // // //             <div key={msg.id}>
// // // //               {msg.role === "model" && !msg.versionId ? (
// // // //                 <div className="bg-gray-700 p-4 rounded-lg prose prose-invert max-w-none">
// // // //                   <ReactMarkdown>{msg.content}</ReactMarkdown>
// // // //                 </div>
// // // //               ) : (
// // // //                 <ChatMessageComponent message={msg} />
// // // //               )}
// // // //               {msg.role === "model" && msg.versionId && (
// // // //                 <button onClick={() => loadVersion(msg.versionId!)}
// // // //                   className="mt-2 text-xs px-3 py-1 bg-blue-600 rounded-full hover:bg-blue-700">
// // // //                   View Code
// // // //                 </button>
// // // //               )}
// // // //             </div>
// // // //           ))}
// // // //           <div ref={chatEndRef} />
// // // //         </div>

// // // //         {/* INPUT WITH MODE TOGGLE */}
// // // //         <div className="p-4 border-t border-gray-700 bg-gray-800">
// // // //           <div className="flex gap-2 mb-3">
// // // //             <button
// // // //               onClick={() => setMode("plan")}
// // // //               className={`flex-1 py-2 rounded-lg font-medium transition ${mode === "plan" ? "bg-purple-600" : "bg-gray-700"}`}
// // // //             >
// // // //               Plan Project
// // // //             </button>
// // // //             <button
// // // //               onClick={() => setMode("code")}
// // // //               className={`flex-1 py-2 rounded-lg font-medium transition ${mode === "code" ? "bg-blue-600" : "bg-gray-700"}`}
// // // //             >
// // // //               Write Code
// // // //             </button>
// // // //           </div>
// // // //           <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // // //         </div>
// // // //       </div>

// // // //       {/* Main */}
// // // //       <div className="flex-1 flex flex-col">
// // // //         <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
// // // //           <h1 className="text-xl font-bold text-blue-400">{currentProject.name}</h1>
// // // //           <div className="flex gap-3">
// // // //             <button onClick={() => setCurrentView('code')} className={`px-4 py-2 rounded ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}>Code</button>
// // // //             <button onClick={() => setCurrentView('preview')} className={`px-4 py-2 rounded ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700'}`}>Preview</button>
// // // //             <button onClick={downloadZip} className="px-5 py-2 bg-purple-600 rounded-lg font-bold">Download ZIP</button>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex-1 relative bg-black">
// // // //           {currentView === 'code' && (
// // // //             <CodeEditor htmlCode={currentCode.html} cssCode={currentCode.css} jsCode={currentCode.js}
// // // //               setHtmlCode={v => setCurrentCode(p => ({ ...p, html: v }))}
// // // //               setCssCode={v => setCurrentCode(p => ({ ...p, css: v }))}
// // // //               setJsCode={v => setCurrentCode(p => ({ ...p, js: v }))}
// // // //               activeTab={activeTab} setActiveTab={setActiveTab} />
// // // //           )}
// // // //           {currentView === 'preview' && (
// // // //             <PreviewPane htmlCode={currentCode.html} cssCode={currentCode.css} jsCode={currentCode.js}
// // // //               onCompileError={setCompileError} onRuntimeError={setRuntimeError} />
// // // //           )}
// // // //           {(compileError || runtimeError) && (
// // // //             <ErrorDisplay errorMessage={compileError || runtimeError || ''} onClearError={() => { setCompileError(null); setRuntimeError(null); }} />
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default App;

// // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // import CodeEditor from './components/CodeEditor';
// // // import PreviewPane from './components/PreviewPane';
// // // import ChatInput from './components/ChatInput';
// // // import ChatMessageComponent from './components/ChatMessage';
// // // import ErrorDisplay from './components/ErrorDisplay';
// // // import { generateWebApp, CodeBundle } from './services/geminiService';
// // // import { storageService, Project, ChatMessage, CodeVersion } from './services/storageService';
// // // import { v4 as uuidv4 } from 'uuid';
// // // import JSZip from 'jszip';
// // // import { saveAs } from 'file-saver';
// // // import ReactMarkdown from 'react-markdown';

// // // const App: React.FC = () => {
// // //   const [projects, setProjects] = useState<Project[]>([]);
// // //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// // //   const [currentCode, setCurrentCode] = useState<CodeBundle>({ html: "", css: "", js: "" });
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [mode, setMode] = useState<"plan" | "code">("code");
// // //   const [compileError, setCompileError] = useState<string | null>(null);
// // //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// // //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('preview');
// // //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
// // //   const [showHistory, setShowHistory] = useState(false);

// // //   // RESIZABLE SIDEBAR — FIXED WITH DEBUG
// // //   const [sidebarWidth, setSidebarWidth] = useState<number>(
// // //     parseInt(localStorage.getItem("sidebarWidth") || "384", 10)
// // //   );
// // //   const isResizing = useRef(false);
// // //   const sidebarRef = useRef<HTMLDivElement>(null);
// // //   const dragHandleRef = useRef<HTMLDivElement>(null);

// // //   const chatEndRef = useRef<HTMLDivElement>(null);

// // //   // Load projects
// // //   useEffect(() => {
// // //     const all = storageService.getAllProjects();
// // //     setProjects(all);
// // //     if (all.length === 0) {
// // //       const p = storageService.createProject("My Project");
// // //       setProjects([p]); setCurrentProject(p);
// // //     } else {
// // //       setCurrentProject(all[0]);
// // //     }
// // //   }, []);

// // //   // Update code when project changes
// // //   useEffect(() => {
// // //     if (currentProject?.versions[0]) {
// // //       setCurrentCode(currentProject.versions[0].code);
// // //     }
// // //   }, [currentProject]);

// // //   // FIXED RESIZE LOGIC — with debug logs + touch support
// // //   useEffect(() => {
// // //     const handleMouseMove = (e: MouseEvent) => {
// // //       if (!isResizing.current) return;
// // //       const newWidth = e.clientX;
// // //       if (newWidth >= 200 && newWidth <= 800) {
// // //         setSidebarWidth(newWidth);
// // //         localStorage.setItem("sidebarWidth", newWidth.toString());
// // //         console.log("DEBUG: Resizing to", newWidth); // Remove this line later
// // //       }
// // //     };

// // //     const handleTouchMove = (e: TouchEvent) => {
// // //       if (!isResizing.current || !e.touches[0]) return;
// // //       const newWidth = e.touches[0].clientX;
// // //       if (newWidth >= 200 && newWidth <= 800) {
// // //         setSidebarWidth(newWidth);
// // //         localStorage.setItem("sidebarWidth", newWidth.toString());
// // //         console.log("DEBUG: Touch resizing to", newWidth);
// // //       }
// // //     };

// // //     const handleMouseUp = () => {
// // //       if (isResizing.current) {
// // //         console.log("DEBUG: Resize stopped");
// // //         isResizing.current = false;
// // //         document.body.style.cursor = 'default';
// // //       }
// // //       document.removeEventListener('mousemove', handleMouseMove);
// // //       document.removeEventListener('touchmove', handleTouchMove);
// // //       document.removeEventListener('mouseup', handleMouseUp);
// // //       document.removeEventListener('touchend', handleMouseUp);
// // //     };

// // //     if (isResizing.current) {
// // //       document.body.style.cursor = 'col-resize';
// // //       document.addEventListener('mousemove', handleMouseMove);
// // //       document.addEventListener('touchmove', handleTouchMove, { passive: false });
// // //       document.addEventListener('mouseup', handleMouseUp);
// // //       document.addEventListener('touchend', handleMouseUp);
// // //     }

// // //     return () => {
// // //       document.removeEventListener('mousemove', handleMouseMove);
// // //       document.removeEventListener('touchmove', handleTouchMove);
// // //       document.removeEventListener('mouseup', handleMouseUp);
// // //       document.removeEventListener('touchend', handleMouseUp);
// // //     };
// // //   }, [isResizing.current, sidebarWidth]);

// // //   const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
// // //     e.preventDefault();
// // //     e.stopPropagation();
// // //     isResizing.current = true;
// // //     console.log("DEBUG: Resize started"); // Remove this line later
// // //   }, []);

// // //   const handleSendMessage = useCallback(async (message: string) => {
// // //     if (!currentProject) return;

// // //     const userMsg: ChatMessage = { id: uuidv4(), role: "user", content: message, timestamp: Date.now() };
// // //     storageService.addChatMessage(currentProject.id, userMsg);
// // //     setCurrentProject({ ...currentProject, chat: [...currentProject.chat, userMsg] });

// // //     setIsLoading(true);
// // //     try {
// // //       const result = await generateWebApp(message, {
// // //         currentCode: currentProject.versions[0]?.code,
// // //         isFirstMessage: currentProject.versions.length === 0,
// // //         mode
// // //       });

// // //       if (result.type === "plan") {
// // //         const planMsg: ChatMessage = {
// // //           id: uuidv4(),
// // //           role: "model",
// // //           content: result.content,
// // //           timestamp: Date.now()
// // //         };
// // //         storageService.addChatMessage(currentProject.id, planMsg);
// // //       } else if (result.code) {
// // //         const version: CodeVersion = {
// // //           id: uuidv4(),
// // //           code: result.code,
// // //           prompt: message,
// // //           timestamp: Date.now()
// // //         };
// // //         storageService.addCodeVersion(currentProject.id, version);
// // //         const aiMsg: ChatMessage = {
// // //           id: uuidv4(),
// // //           role: "model",
// // //           content: "Code updated!",
// // //           versionId: version.id,
// // //           timestamp: Date.now()
// // //         };
// // //         storageService.addChatMessage(currentProject.id, aiMsg);
// // //       }

// // //       setCurrentProject(storageService.getProject(currentProject.id)!);
// // //     } catch (err: any) {
// // //       storageService.addChatMessage(currentProject.id, {
// // //         id: uuidv4(), role: "error", content: err.message, timestamp: Date.now()
// // //       });
// // //       setCurrentProject(storageService.getProject(currentProject.id)!);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   }, [currentProject, mode]);

// // //   const startNewProject = () => {
// // //     const name = prompt("Project name?", "New Project") || "Untitled";
// // //     const p = storageService.createProject(name);
// // //     setProjects(storageService.getAllProjects());
// // //     setCurrentProject(p);
// // //     setMode("plan");
// // //   };

// // //   const loadVersion = (id: string) => {
// // //     const v = currentProject?.versions.find(x => x.id === id);
// // //     if (v) setCurrentCode(v.code);
// // //   };

// // //   const downloadZip = () => {
// // //     const zip = new JSZip();
// // //     zip.file('index.html', currentCode.html);
// // //     zip.file('styles.css', currentCode.css);
// // //     zip.file('index.js', currentCode.js);
// // //     zip.generateAsync({ type: 'blob' }).then(b => saveAs(b, `${currentProject?.name || "app"}.zip`));
// // //   };

// // //   if (!currentProject) return <div className="flex h-screen items-center justify-center text-3xl text-gray-400">Loading...</div>;

// // //   return (
// // //     <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
// // //       {/* RESIZABLE SIDEBAR */}
// // //       <div
// // //         ref={sidebarRef}
// // //         style={{ width: `${sidebarWidth}px` }}
// // //         className="bg-gray-800 border-r border-gray-700 flex flex-col relative min-w-[200px] max-w-[800px] transition-width duration-100"
// // //       >
// // //         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// // //           <button onClick={() => setShowHistory(!showHistory)} className="text-blue-400 font-bold">
// // //             History ({projects.length})
// // //           </button>
// // //           <button onClick={startNewProject} className="px-4 py-2 bg-green-600 rounded-lg text-sm">
// // //             + New Project
// // //           </button>
// // //         </div>

// // //         {showHistory && (
// // //           <div className="absolute top-16 left-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
// // //             <div className="p-3 border-b border-gray-700 flex justify-between">
// // //               <h3 className="font-bold">Projects</h3>
// // //               <button onClick={() => setShowHistory(false)} className="text-2xl">×</button>
// // //             </div>
// // //             {projects.map(p => (
// // //               <button key={p.id} onClick={() => { setCurrentProject(p); setShowHistory(false); }}
// // //                 className={`block w-full text-left p-4 hover:bg-gray-700 ${currentProject?.id === p.id ? 'bg-blue-900' : ''}`}>
// // //                 <div className="font-semibold">{p.name}</div>
// // //                 <div className="text-xs text-gray-400">{new Date(p.updatedAt).toLocaleString()}</div>
// // //               </button>
// // //             ))}
// // //           </div>
// // //         )}

// // //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// // //           {currentProject.chat.map(msg => (
// // //             <div key={msg.id}>
// // //               {msg.role === "model" && !msg.versionId ? (
// // //                 <div className="bg-gray-700 p-4 rounded-lg prose prose-invert max-w-none">
// // //                   <ReactMarkdown>{msg.content}</ReactMarkdown>
// // //                 </div>
// // //               ) : (
// // //                 <ChatMessageComponent message={msg} />
// // //               )}
// // //               {msg.role === "model" && msg.versionId && (
// // //                 <button onClick={() => loadVersion(msg.versionId!)}
// // //                   className="mt-2 text-xs px-3 py-1 bg-blue-600 rounded-full hover:bg-blue-700">
// // //                   View Code
// // //                 </button>
// // //               )}
// // //             </div>
// // //           ))}
// // //           <div ref={chatEndRef} />
// // //         </div>

// // //         <div className="p-4 border-t border-gray-700 bg-gray-800">
// // //           <div className="flex gap-2 mb-3">
// // //             <button onClick={() => setMode("plan")}
// // //               className={`flex-1 py-2 rounded-lg font-medium ${mode === "plan" ? "bg-purple-600" : "bg-gray-700"}`}>
// // //               Plan
// // //             </button>
// // //             <button onClick={() => setMode("code")}
// // //               className={`flex-1 py-2 rounded-lg font-medium ${mode === "code" ? "bg-blue-600" : "bg-gray-700"}`}>
// // //               Code
// // //             </button>
// // //           </div>
// // //           <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// // //         </div>
// // //       </div>

// // //       {/* DRAG HANDLE — FIXED WITH BETTER EVENTS */}
// // //       <div
// // //         ref={dragHandleRef}
// // //         onMouseDown={startResize}
// // //         onTouchStart={startResize}
// // //         className="w-1 bg-gray-600 hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0 z-10"
// // //         style={{ minHeight: '100vh' }}
// // //         title="Drag to resize sidebar"
// // //       />

// // //       {/* Main Content */}
// // //       <div className="flex-1 flex flex-col min-w-0">
// // //         <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
// // //           <h1 className="text-xl font-bold text-blue-400">{currentProject.name}</h1>
// // //           <div className="flex gap-3">
// // //             <button onClick={() => setCurrentView('code')} className={`px-4 py-2 rounded ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}>Code</button>
// // //             <button onClick={() => setCurrentView('preview')} className={`px-4 py-2 rounded ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700'}`}>Preview</button>
// // //             <button onClick={downloadZip} className="px-5 py-2 bg-purple-600 rounded-lg font-bold">Download ZIP</button>
// // //           </div>
// // //         </div>

// // //         <div className="flex-1 relative bg-black">
// // //           {currentView === 'code' && (
// // //             <CodeEditor
// // //               htmlCode={currentCode.html} cssCode={currentCode.css} jsCode={currentCode.js}
// // //               setHtmlCode={v => setCurrentCode(p => ({ ...p, html: v }))}
// // //               setCssCode={v => setCurrentCode(p => ({ ...p, css: v }))}
// // //               setJsCode={v => setCurrentCode(p => ({ ...p, js: v }))}
// // //               activeTab={activeTab} setActiveTab={setActiveTab}
// // //             />
// // //           )}
// // //           {currentView === 'preview' && (
// // //             <PreviewPane
// // //               htmlCode={currentCode.html} cssCode={currentCode.css} jsCode={currentCode.js}
// // //               onCompileError={setCompileError} onRuntimeError={setRuntimeError}
// // //             />
// // //           )}
// // //           {(compileError || runtimeError) && (
// // //             <ErrorDisplay
// // //               errorMessage={compileError || runtimeError || ''}
// // //               onClearError={() => { setCompileError(null); setRuntimeError(null); }}
// // //             />
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default App;

// // // src/App.tsx
// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import CodeEditor from './components/CodeEditor';
// // import PreviewPane from './components/PreviewPane';
// // import ChatInput from './components/ChatInput';
// // import ChatMessageComponent from './components/ChatMessage';
// // import ErrorDisplay from './components/ErrorDisplay';
// // import { generateWebApp, CodeBundle } from './services/geminiService';
// // import { storageService, Project, ChatMessage, CodeVersion } from './services/storageService';
// // import { v4 as uuidv4 } from 'uuid';
// // import JSZip from 'jszip';
// // import { saveAs } from 'file-saver';
// // import ReactMarkdown from 'react-markdown';

// // const App: React.FC = () => {
// //   const [projects, setProjects] = useState<Project[]>([]);
// //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// //   const [currentCode, setCurrentCode] = useState<CodeBundle>({ html: "", css: "", js: "" });
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [mode, setMode] = useState<"plan" | "code">("code");
// //   const [compileError, setCompileError] = useState<string | null>(null);
// //   const [runtimeError, setRuntimeError] = useState<string | null>(null);
// //   const [currentView, setCurrentView] = useState<'code' | 'preview'>('preview');
// //   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
// //   const [showHistory, setShowHistory] = useState(false);

// //   // RESIZING STATES
// //   const [sidebarWidth, setSidebarWidth] = useState<number>(
// //     parseInt(localStorage.getItem("sidebarWidth") || "400", 10)
// //   );
// //   const [chatHeightPercent, setChatHeightPercent] = useState<number>(
// //     parseInt(localStorage.getItem("chatHeightPercent") || "60", 10) // 60% of sidebar height
// //   );

// //   const isResizingHorizontal = useRef(false);
// //   const isResizingVertical = useRef(false);
// //   const sidebarRef = useRef<HTMLDivElement>(null);

// //   const chatEndRef = useRef<HTMLDivElement>(null);

// //   // Load projects
// //   useEffect(() => {
// //     const all = storageService.getAllProjects();
// //     setProjects(all);
// //     if (all.length === 0) {
// //       const p = storageService.createProject("My Project");
// //       setProjects([p]);
// //       setCurrentProject(p);
// //     } else {
// //       setCurrentProject(all[0]);
// //     }
// //   }, []);

// //   // Sync code when project changes
// //   useEffect(() => {
// //     if (currentProject?.versions[0]) {
// //       setCurrentCode(currentProject.versions[0].code);
// //     }
// //   }, [currentProject]);

// //   // GLOBAL RESIZE HANDLER (both axes)
// //   useEffect(() => {
// //     const handleMouseMove = (e: MouseEvent) => {
// //       if (isResizingHorizontal.current) {
// //         const newWidth = e.clientX;
// //         if (newWidth >= 280 && newWidth <= 800) {
// //           setSidebarWidth(newWidth);
// //           localStorage.setItem("sidebarWidth", String(newWidth));
// //         }
// //       }

// //       if (isResizingVertical.current && sidebarRef.current) {
// //         const rect = sidebarRef.current.getBoundingClientRect();
// //         const newHeight = e.clientY - rect.top;
// //         const totalHeight = rect.height;
// //         const percent = Math.round((newHeight / totalHeight) * 100);
// //         if (percent >= 10 && percent <= 90) {
// //           setChatHeightPercent(percent);
// //           localStorage.setItem("chatHeightPercent", String(percent));
// //         }
// //       }
// //     };

// //     const handleMouseUp = () => {
// //       isResizingHorizontal.current = false;
// //       isResizingVertical.current = false;
// //       document.body.style.cursor = "default";
// //     };

// //     document.addEventListener("mousemove", handleMouseMove);
// //     document.addEventListener("mouseup", handleMouseUp);

// //     return () => {
// //       document.removeEventListener("mousemove", handleMouseMove);
// //       document.removeEventListener("mouseup", handleMouseUp);
// //     };
// //   }, []);

// //   const startHorizontalResize = (e: React.MouseEvent) => {
// //     e.preventDefault();
// //     isResizingHorizontal.current = true;
// //     document.body.style.cursor = "col-resize";
// //   };

// //   const startVerticalResize = (e: React.MouseEvent) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     isResizingVertical.current = true;
// //     document.body.style.cursor = "row-resize";
// //   };

// //   const handleSendMessage = useCallback(async (message: string) => {
// //     if (!currentProject) return;

// //     const userMsg: ChatMessage = { id: uuidv4(), role: "user", content: message, timestamp: Date.now() };
// //     storageService.addChatMessage(currentProject.id, userMsg);
// //     setCurrentProject(prev => prev ? { ...prev, chat: [...prev.chat, userMsg] } : null);

// //     setIsLoading(true);
// //     try {
// //       const result = await generateWebApp(message, {
// //         currentCode: currentProject.versions[0]?.code,
// //         isFirstMessage: currentProject.versions.length === 0,
// //         mode
// //       });

// //       if (result.type === "plan") {
// //         const planMsg: ChatMessage = { id: uuidv4(), role: "model", content: result.content, timestamp: Date.now() };
// //         storageService.addChatMessage(currentProject.id, planMsg);
// //       } else if (result.code) {
// //         const version: CodeVersion = { id: uuidv4(), code: result.code, prompt: message, timestamp: Date.now() };
// //         storageService.addCodeVersion(currentProject.id, version);
// //         const aiMsg: ChatMessage = { id: uuidv4(), role: "model", content: "Code updated!", versionId: version.id, timestamp: Date.now() };
// //         storageService.addChatMessage(currentProject.id, aiMsg);
// //       }

// //       setCurrentProject(storageService.getProject(currentProject.id)!);
// //     } catch (err: any) {
// //       const errorMsg: ChatMessage = { id: uuidv4(), role: "error", content: err.message || "Error", timestamp: Date.now() };
// //       storageService.addChatMessage(currentProject.id, errorMsg);
// //       setCurrentProject(storageService.getProject(currentProject.id)!);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }, [currentProject, mode]);

// //   const startNewProject = () => {
// //     const name = prompt("Project name?", "New Project") || "Untitled";
// //     const p = storageService.createProject(name);
// //     setProjects(storageService.getAllProjects());
// //     setCurrentProject(p);
// //     setMode("plan");
// //   };

// //   const loadVersion = (id: string) => {
// //     const v = currentProject?.versions.find(x => x.id === id);
// //     if (v) setCurrentCode(v.code);
// //   };

// //   const downloadZip = () => {
// //     const zip = new JSZip();
// //     zip.file('index.html', currentCode.html);
// //     zip.file('styles.css', currentCode.css);
// //     zip.file('index.js', currentCode.js);
// //     zip.generateAsync({ type: 'blob' }).then(b => saveAs(b, `${currentProject?.name || "app"}.zip`));
// //   };

// //   if (!currentProject) return <div className="flex h-screen items-center justify-center text-3xl text-gray-400">Loading...</div>;

// //   return (
// //     <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
// //       {/* LEFT SIDEBAR - RESIZABLE WIDTH */}
// //       <div
// //         ref={sidebarRef}
// //         style={{ width: `${sidebarWidth}px` }}
// //         className="bg-gray-800 border-r border-gray-700 flex flex-col min-w-[280px] max-w-[800px]"
// //       >
// //         {/* Header */}
// //         <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
// //           <button onClick={() => setShowHistory(!showHistory)} className="text-blue-400 font-bold">
// //             History ({projects.length})
// //           </button>
// //           <button onClick={startNewProject} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium">
// //             + New Project
// //           </button>
// //         </div>

// //         {/* CHAT MESSAGES - RESIZABLE HEIGHT */}
// //         <div className="flex-1 flex flex-col min-h-0">
// //           <div
// //             className="overflow-y-auto p-4 space-y-4 flex-1"
// //             style={{ height: `${chatHeightPercent}%` }}
// //           >
// //             {currentProject.chat.map(msg => (
// //               <div key={msg.id}>
// //                 {msg.role === "model" && !msg.versionId ? (
// //                   <div className="bg-gray-700 p-5 rounded-xl prose prose-invert max-w-none">
// //                    <ReactMarkdown>{msg.content}</ReactMarkdown>
// //                   </div>
// //                 ) : (
// //                   <ChatMessageComponent message={msg} />
// //                 )}
// //                 {msg.role === "model" && msg.versionId && (
// //                   <button
// //                     onClick={() => loadVersion(msg.versionId!)}
// //                     className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-sm"
// //                   >
// //                     View This Version
// //                   </button>
// //                 )}
// //               </div>
// //             ))}
// //             <div ref={chatEndRef} />
// //           </div>

// //           {/* VERTICAL RESIZE HANDLE */}
// //           <div
// //             onMouseDown={startVerticalResize}
// //             className="h-2 bg-gray-700 hover:bg-blue-500 cursor-row-resize transition-colors"
// //             title="Drag to resize chat"
// //           />

// //           {/* INPUT AREA - FIXED BOTTOM */}
// //           <div className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0">
// //             <div className="flex gap-2 mb-3">
// //               <button
// //                 onClick={() => setMode("plan")}
// //                 className={`flex-1 py-2.5 rounded-lg font-medium transition ${mode === "plan" ? "bg-purple-600" : "bg-gray-700"}`}
// //               >
// //                 Plan Project
// //               </button>
// //               <button
// //                 onClick={() => setMode("code")}
// //                 className={`flex-1 py-2.5 rounded-lg font-medium transition ${mode === "code" ? "bg-blue-600" : "bg-gray-700"}`}
// //               >
// //                 Write Code
// //               </button>
// //             </div>
// //             <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
// //           </div>
// //         </div>
// //       </div>

// //       {/* HORIZONTAL RESIZE HANDLE */}
// //       <div
// //         onMouseDown={startHorizontalResize}
// //         className="w-1.5 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors z-10"
// //         title="Drag to resize sidebar"
// //       />

// //       {/* MAIN CONTENT AREA */}
// //       <div className="flex-1 flex flex-col min-w-0">
// //         <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
// //           <h1 className="text-2xl font-bold text-blue-400">{currentProject.name}</h1>
// //           <div className="flex gap-4">
// //             <button
// //               onClick={() => setCurrentView('code')}
// //               className={`px-5 py-2 rounded-lg font-medium ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}
// //             >
// //               Code
// //             </button>
// //             <button
// //               onClick={() => setCurrentView('preview')}
// //               className={`px-5 py-2 rounded-lg font-medium ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700'}`}
// //             >
// //               Preview
// //             </button>
// //             <button
// //               onClick={downloadZip}
// //               className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
// //             >
// //               Download ZIP
// //             </button>
// //           </div>
// //         </div>

// //         <div className="flex-1 relative bg-black">
// //           {currentView === 'code' && (
// //             <CodeEditor
// //               htmlCode={currentCode.html}
// //               cssCode={currentCode.css}
// //               jsCode={currentCode.js}
// //               setHtmlCode={v => setCurrentCode(p => ({ ...p, html: v }))}
// //               setCssCode={v => setCurrentCode(p => ({ ...p, css: v }))}
// //               setJsCode={v => setCurrentCode(p => ({ ...p, js: v }))}
// //               activeTab={activeTab}
// //               setActiveTab={setActiveTab}
// //             />
// //           )}
// //           {currentView === 'preview' && (
// //             <PreviewPane
// //               htmlCode={currentCode.html}
// //               cssCode={currentCode.css}
// //               jsCode={currentCode.js}
// //               onCompileError={setCompileError}
// //               onRuntimeError={setRuntimeError}
// //             />
// //           )}
// //           {(compileError || runtimeError) && (
// //             <ErrorDisplay
// //               errorMessage={compileError || runtimeError || ''}
// //               onClearError={() => { setCompileError(null); setRuntimeError(null); }}
// //             />
// //           )}
// //         </div>
// //       </div>

// //       {/* HISTORY PANEL */}
// //       {showHistory && (
// //         <div className="absolute top-20 left-6 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
// //           <div className="p-4 border-b border-gray-700 flex justify-between items-center">
// //             <h3 className="text-lg font-bold">All Projects</h3>
// //             <button onClick={() => setShowHistory(false)} className="text-2xl hover:text-white">×</button>
// //           </div>
// //           {projects.map(p => (
// //             <button
// //               key={p.id}
// //               onClick={() => { setCurrentProject(p); setShowHistory(false); }}
// //               className={`w-full text-left p-4 hover:bg-gray-700 border-b border-gray-700 ${currentProject?.id === p.id ? 'bg-blue-900' : ''}`}
// //             >
// //               <div className="font-semibold">{p.name}</div>
// //               <div className="text-xs text-gray-400">
// //                 {new Date(p.updatedAt).toLocaleString()} • {p.versions.length} versions
// //               </div>
// //             </button>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default App;
// // src/App.tsx — FINAL, NO ERRORS, BEAUTIFUL
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import CodeEditor from './components/CodeEditor';
// import PreviewPane from './components/PreviewPane';
// import ChatInput from './components/ChatInput';
// import ChatMessageComponent from './components/ChatMessage';
// import ErrorDisplay from './components/ErrorDisplay';
// import { generateWebApp, CodeBundle } from './services/geminiService';
// import { storageService, Project, ChatMessage, CodeVersion } from './services/storageService';
// import { v4 as uuidv4 } from 'uuid';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import ReactMarkdown from 'react-markdown';

// const App: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [currentProject, setCurrentProject] = useState<Project | null>(null);
//   const [currentCode, setCurrentCode] = useState<CodeBundle>({ html: "", css: "", js: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [mode, setMode] = useState<"plan" | "code">("code");
//   const [compileError, setCompileError] = useState<string | null>(null);
//   const [runtimeError, setRuntimeError] = useState<string | null>(null);
//   const [currentView, setCurrentView] = useState<'code' | 'preview'>('preview');
//   const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
//   const [showHistory, setShowHistory] = useState(false);
//   const [showNewProjectModal, setShowNewProjectModal] = useState(false);
//   const [newProjectName, setNewProjectName] = useState("");

//   // Resizing
//   const [sidebarWidth] = useState<number>(420);
//   const [chatHeightPercent] = useState<number>(65);

//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Load projects
//   useEffect(() => {
//     const all = storageService.getAllProjects();
//     setProjects(all);

//     if (all.length === 0) {
//       const p = storageService.createProject("Multi-Agent Interaction: Creating Websites with Ease");
//       setProjects([p]);
//       setCurrentProject(p);
//     } else {
//       setCurrentProject(all[0]);
//     }
//   }, []);

//   // Update code when project changes
//   useEffect(() => {
//     if (!currentProject) return;

//     const latest = currentProject.versions[0];
//     if (latest) {
//       setCurrentCode(latest.code);
//     } else {
//       setCurrentCode({
//         html: `<!doctype html>
// <html lang="en">
// <head>
//   <meta charset="utf-8">
//   <title>Multi-Agent Interaction</title>
//   <link rel="stylesheet" href="/styles.css">
//   <meta name="viewport" content="width=device-width, initial-scale=1">
// </head>
// <body>
//   <div class="hero">
//     <h1>Multi-Agent Interaction</h1>
//     <p>Creating Websites with Ease</p>
//     <div class="sparkle">Start building...</div>
//   </div>
//   <script src="/index.js"></script>
// </body>
// </html>`,
//         css: `* { margin: 0; padding: 0; box-sizing: border-box; }
// body {
//   font-family: 'Segoe UI', system-ui, sans-serif;
//   height: 100vh;
//   background: linear-gradient(135deg, #ffffff 0%, #000000 100%);
//   overflow: hidden;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: white;
// }
// .hero { text-align: center; }
// h1 {
//   font-size: 5rem;
//   font-weight: 900;
//   background: linear-gradient(90deg, #ffffff, #cccccc);
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
// }
// p { font-size: 2rem; margin: 1rem 0; }
// .sparkle { font-size: 1.6rem; animation: pulse 3s infinite; }
// @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }`,
//         js: `console.log("Multi-Agent Web Builder Ready");`
//       });
//     }

//     setTimeout(() => {
//       chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   }, [currentProject]);

//   // Auto-focus modal
//   useEffect(() => {
//     if (showNewProjectModal && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [showNewProjectModal]);

//   const createNewProject = () => {
//     const name = newProjectName.trim() || "New Project";
//     const p = storageService.createProject(name);
//     setProjects(storageService.getAllProjects());
//     setCurrentProject(p);
//     setMode("plan");
//     setShowNewProjectModal(false);
//     setNewProjectName("");
//   };

//   const handleSendMessage = useCallback(async (message: string) => {
//     if (!currentProject) return;

//     const userMsg: ChatMessage = { id: uuidv4(), role: "user", content: message, timestamp: Date.now() };
//     storageService.addChatMessage(currentProject.id, userMsg);

//     setIsLoading(true);
//     try {
//       const result = await generateWebApp(message, {
//         currentCode: currentProject.versions[0]?.code,
//         isFirstMessage: currentProject.versions.length === 0,
//         mode
//       });

//       if (result.type === "plan") {
//         const planMsg: ChatMessage = { id: uuidv4(), role: "model", content: result.content, timestamp: Date.now() };
//         storageService.addChatMessage(currentProject.id, planMsg);
//       } else if (result.code) {
//         const version: CodeVersion = { id: uuidv4(), code: result.code, prompt: message, timestamp: Date.now() };
//         storageService.addCodeVersion(currentProject.id, version);
//         const aiMsg: ChatMessage = { id: uuidv4(), role: "model", content: "Code updated!", versionId: version.id, timestamp: Date.now() };
//         storageService.addChatMessage(currentProject.id, aiMsg);
//       }

//       setCurrentProject(storageService.getProject(currentProject.id)!);
//     } catch (err: any) {
//       const errMsg: ChatMessage = { id: uuidv4(), role: "error", content: err.message || "Error", timestamp: Date.now() };
//       storageService.addChatMessage(currentProject.id, errMsg);
//       setCurrentProject(storageService.getProject(currentProject.id)!);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentProject, mode]);

//   const loadVersion = (id: string) => {
//     const v = currentProject?.versions.find(x => x.id === id);
//     if (v) setCurrentCode(v.code);
//   };

//   const downloadZip = () => {
//     const zip = new JSZip();
//     zip.file('index.html', currentCode.html);
//     zip.file('styles.css', currentCode.css);
//     zip.file('index.js', currentCode.js);
//     zip.generateAsync({ type: 'blob' }).then(b => saveAs(b, `${currentProject?.name || "app"}.zip`));
//   };

//   if (!currentProject) return (
//     <div className="flex h-screen items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-purple-900 to-black">
//       Loading...
//     </div>
//   );

//   return (
//     <>
//       <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
//         {/* SIDEBAR */}
//         <div ref={sidebarRef} style={{ width: `${sidebarWidth}px` }} className="bg-gray-800 border-r border-gray-700 flex flex-col min-w-[300px] max-w-[800px]">
//           <div className="p-5 border-b border-gray-700 flex justify-between items-center">
//             <button onClick={() => setShowHistory(!showHistory)} className="text-blue-400 font-bold text-lg">
//               History ({projects.length})
//             </button>
//             <button onClick={() => setShowNewProjectModal(true)} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl font-bold shadow-lg transition">
//               + New Project
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-5 space-y-5">
//             {currentProject.chat.map(msg => (
//               <div key={msg.id}>
//                 {msg.role === "model" && !msg.versionId ? (
//                   <div className="bg-gray-700 p-6 rounded-xl prose prose-invert max-w-none">
//                     <ReactMarkdown>{msg.content}</ReactMarkdown>
//                   </div>
//                 ) : (
//                   <ChatMessageComponent message={msg} />
//                 )}
//                 {msg.role === "model" && msg.versionId && (
//                   <button onClick={() => loadVersion(msg.versionId!)} className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-medium">
//                     View This Version
//                   </button>
//                 )}
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="p-5 border-t border-gray-700 bg-gray-800">
//             <div className="flex gap-3 mb-4">
//               <button onClick={() => setMode("plan")} className={`flex-1 py-3 rounded-xl font-bold ${mode === "plan" ? "bg-purple-600" : "bg-gray-700"}`}>
//                 Plan
//               </button>
//               <button onClick={() => setMode("code")} className={`flex-1 py-3 rounded-xl font-bold ${mode === "code" ? "bg-blue-600" : "bg-gray-700"}`}>
//                 Code
//               </button>
//             </div>
//             <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
//           </div>
//         </div>

//         {/* MAIN AREA */}
//         <div className="flex-1 flex flex-col">
//           <div className="p-5 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
//             <h1 className="text-3xl font-bold text-blue-400">{currentProject.name}</h1>
//             <div className="flex gap-4">
//               <button onClick={() => setCurrentView('code')} className={`px-6 py-3 rounded-xl font-bold ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}>
//                 Code
//               </button>
//               <button onClick={() => setCurrentView('preview')} className={`px-6 py-3 rounded-xl font-bold ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700'}`}>
//                 Preview
//               </button>
//               <button onClick={downloadZip} className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold shadow-lg hover:shadow-purple-500/50 transition">
//                 Download ZIP
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 relative bg-black">
//             {currentView === 'code' && (
//               <CodeEditor
//                 htmlCode={currentCode.html}
//                 cssCode={currentCode.css}
//                 jsCode={currentCode.js}
//                 setHtmlCode={v => setCurrentCode(p => ({ ...p, html: v }))}
//                 setCssCode={v => setCurrentCode(p => ({ ...p, css: v }))}
//                 setJsCode={v => setCurrentCode(p => ({ ...p, js: v }))}
//                 activeTab={activeTab}
//                 setActiveTab={setActiveTab}
//               />
//             )}
//             {currentView === 'preview' && (
//               <PreviewPane
//                 htmlCode={currentCode.html || '<div></div>'}
//                 cssCode={currentCode.css}
//                 jsCode={currentCode.js}
//                 onCompileError={setCompileError}
//                 onRuntimeError={setRuntimeError}
//               />
//             )}
//             {(compileError || runtimeError) && (
//               <ErrorDisplay
//                 errorMessage={compileError || runtimeError || ''}
//                 onClearError={() => { setCompileError(null); setRuntimeError(null); }}
//               />
//             )}
//           </div>
//         </div>

//         {/* HISTORY */}
//         {showHistory && (
//           <div className="absolute top-24 left-8 w-96 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto">
//             <div className="p-6 border-b border-gray-700 flex justify-between items-center">
//               <h3 className="text-xl font-bold">All Projects</h3>
//               <button onClick={() => setShowHistory(false)} className="text-3xl hover:text-red-400">×</button>
//             </div>
//             {projects.map(p => (
//               <button
//                 key={p.id}
//                 onClick={() => { setCurrentProject(p); setShowHistory(false); }}
//                 className={`w-full text-left p-5 hover:bg-gray-700 transition ${currentProject?.id === p.id ? 'bg-blue-900/50' : ''}`}
//               >
//                 <div className="font-bold text-lg">{p.name}</div>
//                 <div className="text-sm opacity-70">{new Date(p.updatedAt).toLocaleDateString()}</div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* NEW PROJECT MODAL */}
//       {showNewProjectModal && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50" onClick={() => setShowNewProjectModal(false)}>
//           <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-2xl rounded-3xl p-12 w-full max-w-lg border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}>
//             <h2 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//               New Project
//             </h2>
//             <input
//               ref={inputRef}
//               type="text"
//               value={newProjectName}
//               onChange={e => setNewProjectName(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && createNewProject()}
//               placeholder="Enter project name..."
//               className="w-full px-8 py-5 bg-white/10 border border-white/30 rounded-2xl text-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
//             />
//             <div className="flex gap-6 mt-10">
//               <button onClick={() => setShowNewProjectModal(false)} className="flex-1 py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition">
//                 Cancel
//               </button>
//               <button onClick={createNewProject} className="flex-1 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl font-bold text-white shadow-xl transition">
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default App;

// src/App.tsx — INSTANT USER MESSAGE + PERFECT UX
import React, { useState, useEffect, useRef, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';
import PreviewPane from './components/PreviewPane';
import ChatInput from './components/ChatInput';
import ChatMessageComponent from './components/ChatMessage';
import ErrorDisplay from './components/ErrorDisplay';
import { generateWebApp, CodeBundle } from './services/geminiService';
import { storageService, Project, ChatMessage, CodeVersion } from './services/storageService';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentCode, setCurrentCode] = useState<CodeBundle>({ html: "", css: "", js: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"plan" | "code">("code");
  const [compileError, setCompileError] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'code' | 'preview'>('preview');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [showHistory, setShowHistory] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load projects
  useEffect(() => {
    const all = storageService.getAllProjects();
    setProjects(all);

    if (all.length === 0) {
      const p = storageService.createProject("Multi-Agent Interaction: Creating Websites with Ease");
      setProjects([p]);
      setCurrentProject(p);
    } else {
      setCurrentProject(all[0]);
    }
  }, []);

  // Update code when project changes
  useEffect(() => {
    if (!currentProject) return;

    const latest = currentProject.versions[0];
    if (latest) {
      setCurrentCode(latest.code);
    } else {
      setCurrentCode({
        html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Multi-Agent Interaction</title>
  <link rel="stylesheet" href="/styles.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div class="hero">
    <h1>Multi-Agent Interaction</h1>
    <p>Creating Websites with Ease</p>
    <div class="sparkle">Start building...</div>
  </div>
  <script src="/index.js"></script>
</body>
</html>`,
        css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #000000 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
.hero { text-align: center; }
h1 {
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
p { font-size: 2rem; margin: 1rem 0; }
.sparkle { font-size: 1.6rem; animation: pulse 3s infinite; }
@keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }`,
        js: `console.log("Ready");`
      });
    }

    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [currentProject]);

  const createNewProject = () => {
    const name = newProjectName.trim() || "New Project";
    const p = storageService.createProject(name);
    setProjects(storageService.getAllProjects());
    setCurrentProject(p);
    setMode("plan");
    setShowNewProjectModal(false);
    setNewProjectName("");
  };

  // THIS IS THE KEY FIX — SHOW USER MESSAGE INSTANTLY
  const handleSendMessage = useCallback(async (message: string) => {
    if (!currentProject || !message.trim()) return;

    // 1. Create user message
    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: message,
      timestamp: Date.now()
    };

    // 2. Add to storage + update UI IMMEDIATELY
    storageService.addChatMessage(currentProject.id, userMsg);
    setCurrentProject(prev => prev ? {
      ...prev,
      chat: [...prev.chat, userMsg]
    } : null);

    // 3. Scroll to bottom
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    // 4. Now call AI
    setIsLoading(true);
    try {
      const result = await generateWebApp(message, {
        currentCode: currentProject.versions[0]?.code,
        isFirstMessage: currentProject.versions.length === 0,
        mode
      });

      if (result.type === "plan") {
        const planMsg: ChatMessage = { id: uuidv4(), role: "model", content: result.content, timestamp: Date.now() };
        storageService.addChatMessage(currentProject.id, planMsg);
      } else if (result.code) {
        const version: CodeVersion = { id: uuidv4(), code: result.code, prompt: message, timestamp: Date.now() };
        storageService.addCodeVersion(currentProject.id, version);
        const aiMsg: ChatMessage = { id: uuidv4(), role: "model", content: "Code updated!", versionId: version.id, timestamp: Date.now() };
        storageService.addChatMessage(currentProject.id, aiMsg);
      }

      // Refresh project to get latest
      setCurrentProject(storageService.getProject(currentProject.id)!);
    } catch (err: any) {
      const errMsg: ChatMessage = { id: uuidv4(), role: "error", content: err.message || "Error", timestamp: Date.now() };
      storageService.addChatMessage(currentProject.id, errMsg);
      setCurrentProject(storageService.getProject(currentProject.id)!);
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, mode]);

  const loadVersion = (id: string) => {
    const v = currentProject?.versions.find(x => x.id === id);
    if (v) setCurrentCode(v.code);
  };

  const downloadZip = () => {
    const zip = new JSZip();
    zip.file('index.html', currentCode.html);
    zip.file('styles.css', currentCode.css);
    zip.file('index.js', currentCode.js);
    zip.generateAsync({ type: 'blob' }).then(b => saveAs(b, `${currentProject?.name || "app"}.zip`));
  };

  if (!currentProject) return (
    <div className="flex h-screen items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-purple-900 to-black">
      Loading...
    </div>
  );

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        {/* SIDEBAR */}
        <div ref={sidebarRef} className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-5 border-b border-gray-700 flex justify-between items-center">
            <button onClick={() => setShowHistory(!showHistory)} className="text-blue-400 font-bold text-lg">
              History ({projects.length})
            </button>
            <button onClick={() => setShowNewProjectModal(true)} className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl font-bold shadow-lg transition">
              + New Project
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {currentProject.chat.map(msg => (
              <div key={msg.id}>
                {msg.role === "model" && !msg.versionId ? (
                  <div className="bg-gray-700 p-6 rounded-xl prose prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <ChatMessageComponent message={msg} />
                )}
                {msg.role === "model" && msg.versionId && (
                  <button onClick={() => loadVersion(msg.versionId!)} className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-medium">
                    View This Version
                  </button>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-5 border-t border-gray-700 bg-gray-800">
            <div className="flex gap-3 mb-4">
              <button onClick={() => setMode("plan")} className={`flex-1 py-3 rounded-xl font-bold ${mode === "plan" ? "bg-purple-600" : "bg-gray-700"}`}>
                Plan
              </button>
              <button onClick={() => setMode("code")} className={`flex-1 py-3 rounded-xl font-bold ${mode === "code" ? "bg-blue-600" : "bg-gray-700"}`}>
                Code
              </button>
            </div>
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col">
          <div className="p-5 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-400">{currentProject.name}</h1>
            <div className="flex gap-4">
              <button onClick={() => setCurrentView('code')} className={`px-6 py-3 rounded-xl font-bold ${currentView === 'code' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                Code
              </button>
              <button onClick={() => setCurrentView('preview')} className={`px-6 py-3 rounded-xl font-bold ${currentView === 'preview' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                Preview
              </button>
              <button onClick={downloadZip} className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold shadow-lg hover:shadow-purple-500/50 transition">
                Download ZIP
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-black">
            {currentView === 'code' && (
              <CodeEditor
                htmlCode={currentCode.html}
                cssCode={currentCode.css}
                jsCode={currentCode.js}
                setHtmlCode={v => setCurrentCode(p => ({ ...p, html: v }))}
                setCssCode={v => setCurrentCode(p => ({ ...p, css: v }))}
                setJsCode={v => setCurrentCode(p => ({ ...p, js: v }))}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
            {currentView === 'preview' && (
              <PreviewPane
                htmlCode={currentCode.html}
                cssCode={currentCode.css}
                jsCode={currentCode.js}
                onCompileError={setCompileError}
                onRuntimeError={setRuntimeError}
              />
            )}
            {(compileError || runtimeError) && (
              <ErrorDisplay
                errorMessage={compileError || runtimeError || ''}
                onClearError={() => { setCompileError(null); setRuntimeError(null); }}
              />
            )}
          </div>
        </div>

        {/* HISTORY & MODAL — same as before */}
        {showHistory && (
          <div className="absolute top-24 left-8 w-96 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">All Projects</h3>
              <button onClick={() => setShowHistory(false)} className="text-3xl hover:text-red-400">×</button>
            </div>
            {projects.map(p => (
              <button key={p.id} onClick={() => { setCurrentProject(p); setShowHistory(false); }}
                className={`w-full text-left p-5 hover:bg-gray-700 transition ${currentProject?.id === p.id ? 'bg-blue-900/50' : ''}`}>
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-sm opacity-70">{new Date(p.updatedAt).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
        )}

        {showNewProjectModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50" onClick={() => setShowNewProjectModal(false)}>
            <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-2xl rounded-3xl p-12 w-full max-w-lg border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                New Project
              </h2>
              <input
                ref={inputRef}
                type="text"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createNewProject()}
                placeholder="Enter project name..."
                className="w-full px-8 py-5 bg-white/10 border border-white/30 rounded-2xl text-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
              />
              <div className="flex gap-6 mt-10">
                <button onClick={() => setShowNewProjectModal(false)} className="flex-1 py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition">
                  Cancel
                </button>
                <button onClick={createNewProject} className="flex-1 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl font-bold text-white shadow-xl transition">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;