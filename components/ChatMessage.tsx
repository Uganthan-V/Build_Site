
// import React from "react";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { ChatMessage } from "../types";
// import { RotateCcw } from "lucide-react";

// interface Props {
//   message: ChatMessage;
//   onRollback: (versionId: string) => void;
// }

// const ChatMessageComponent: React.FC<Props> = ({ message, onRollback }) => {
//   const isUser = message.role === "user";
//   const isError = message.role === "error";
//   const isCodeUpdate = message.isCodeUpdate;

//   const bubbleClasses = `
//     max-w-[85%] px-5 py-4 rounded-2xl break-words
//     shadow-md
//     ${
//       isUser
//         ? "bg-cyan-600 text-white"
//         : isError
//         ? "bg-red-700 text-red-100"
//         : "bg-gray-800 text-gray-100 border border-gray-700"
//     }
//   `;

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//       <div className={bubbleClasses}>
//         <Markdown
//           remarkPlugins={[remarkGfm]}
//           components={{
//             p: ({ children }) => (
//               <p className="mb-3 last:mb-0 leading-relaxed text-sm">
//                 {children}
//               </p>
//             ),
//             strong: ({ children }) => (
//               <strong className="font-semibold text-cyan-300">
//                 {children}
//               </strong>
//             ),
//             ul: ({ children }) => (
//               <ul className="list-disc pl-5 space-y-2 mb-4 text-sm">
//                 {children}
//               </ul>
//             ),
//             code: ({ children }) => (
//               <code className="px-1.5 py-0.5 bg-black/40 rounded text-xs font-mono">
//                 {children}
//               </code>
//             ),
//           }}
//         >
//           {message.content}
//         </Markdown>

//         {/* CODE UPDATE CARD */}
//         {isCodeUpdate && message.changedFiles && message.versionId && (
//           <div className="mt-5 pt-4 border-t border-gray-700">
//             <div className="flex items-center gap-2 mb-3 text-emerald-400 text-sm font-medium">
//               <span>✔</span>
//               <span>
//                 {message.changedFiles.length} file
//                 {message.changedFiles.length > 1 ? "s" : ""} updated
//               </span>
//             </div>

//             <div className="flex flex-wrap gap-2 mb-4">
//               {message.changedFiles.map(file => (
//                 <span
//                   key={file}
//                   className="px-2.5 py-1 bg-emerald-900/40 text-emerald-300 text-xs rounded-full font-mono"
//                 >
//                   {file}
//                 </span>
//               ))}
//             </div>

//             <button
//               onClick={() => onRollback(message.versionId!)}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition"
//             >
//               <RotateCcw size={14} />
//               Restore this version
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatMessageComponent;

// src/components/ChatMessageComponent.tsx
import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../types";
import { RotateCcw, Copy } from "lucide-react";

interface Props {
  message: ChatMessage;
  onRollback: (versionId: string) => void;
}

const ChatMessageComponent: React.FC<Props> = ({ message, onRollback }) => {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";
  const isError = message.role === "error";
  const isCodeUpdate = message.isCodeUpdate;
  const isPlanMessage = message.role === "model" && message.isPlan === true;

  const handleCopyPlan = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const bubbleClasses = `
    max-w-[85%] px-5 py-4 rounded-2xl break-words shadow-md
    ${
      isUser
        ? "bg-cyan-600 text-white"
        : isError
        ? "bg-red-700 text-red-100"
        : "bg-gray-800 text-gray-100 border border-gray-700"
    }
  `;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={bubbleClasses}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="mb-3 last:mb-0 leading-relaxed text-sm">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-cyan-300">
                {children}
              </strong>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-2 mb-4 text-sm">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-2 mb-4 text-sm">
                {children}
              </ol>
            ),
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 bg-black/40 rounded text-xs font-mono">
                {children}
              </code>
            ),
          }}
        >
          {message.content}
        </Markdown>

        {/* COPY PLAN BUTTON — Only for plan messages */}
        {isPlanMessage && (
          <div className="mt-5 pt-4 border-t border-gray-700">
            <button
              onClick={handleCopyPlan}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition active:scale-95"
              title="Copy this plan to clipboard"
            >
              {copied ? (
                <>
                  <span className="text-green-300">✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Plan
                </>
              )}
            </button>
          </div>
        )}

        {/* CODE UPDATE CARD */}
        {isCodeUpdate && message.changedFiles && message.versionId && (
          <div className="mt-5 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 text-sm font-medium">
              <span>✔</span>
              <span>
                {message.changedFiles.length} file
                {message.changedFiles.length > 1 ? "s" : ""} updated
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {message.changedFiles.map((file) => (
                <span
                  key={file}
                  className="px-2.5 py-1 bg-emerald-900/40 text-emerald-300 text-xs rounded-full font-mono"
                >
                  {file}
                </span>
              ))}
            </div>

            <button
              onClick={() => onRollback(message.versionId!)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition"
            >
              <RotateCcw size={14} />
              Restore this version
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageComponent;