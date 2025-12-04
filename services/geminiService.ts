// // // // // // // // import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// // // // // // // // import { GEMINI_MODEL_CODE_GENERATION, GEMINI_MODEL_ERROR_ANALYSIS } from '../constants';

// // // // // // // // // CRITICAL: New GoogleGenAI instance must be created right before an API call
// // // // // // // // // to ensure it uses the most up-to-date API key from the dialog if opened.
// // // // // // // // // The API key is assumed to be available via process.env.API_KEY.

// // // // // // // // /**
// // // // // // // //  * Calls the Gemini API to generate or update code based on a prompt.
// // // // // // // //  * @param prompt The user's prompt for code generation.
// // // // // // // //  * @param currentCode Optional: The existing code to be updated.
// // // // // // // //  * @returns A promise that resolves to the generated code string.
// // // // // // // //  */
// // // // // // // // export async function generateCodeWithGemini(
// // // // // // // //   prompt: string,
// // // // // // // //   currentCode: string = ''
// // // // // // // // ): Promise<string> {
// // // // // // // //   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// // // // // // // //   const messages = [
// // // // // // // //     {
// // // // // // // //       role: 'user',
// // // // // // // //       parts: [{
// // // // // // // //         text: `You are an expert React TypeScript developer. Your task is to generate or update a React functional component named 'PreviewComponent'.
// // // // // // // //           The component should be exported as 'export const PreviewComponent: React.FC = () => { /* ... */ };'
// // // // // // // //           It should use Tailwind CSS for styling. Do not include any external imports beyond 'react'.
// // // // // // // //           If a current code is provided, update it according to the prompt.
// // // // // // // //           Your response should ONLY contain the full, updated or new TypeScript React component code, nothing else.

// // // // // // // //           Prompt: "${prompt}"
// // // // // // // //           ${currentCode ? `Current code to update:\n\`\`\`tsx\n${currentCode}\n\`\`\`` : ''}
// // // // // // // //           `,
// // // // // // // //       }],
// // // // // // // //     },
// // // // // // // //   ];

// // // // // // // //   try {
// // // // // // // //     const response: GenerateContentResponse = await ai.models.generateContent({
// // // // // // // //       model: GEMINI_MODEL_CODE_GENERATION,
// // // // // // // //       contents: messages,
// // // // // // // //       config: {
// // // // // // // //         maxOutputTokens: 2048, // Generous token limit for code
// // // // // // // //         temperature: 0.7,
// // // // // // // //         topP: 0.95,
// // // // // // // //       },
// // // // // // // //     });
// // // // // // // //     return response.text?.trim() || '';
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error generating code with Gemini:", error);
// // // // // // // //     throw new Error(`Failed to generate code: ${error instanceof Error ? error.message : String(error)}`);
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * Calls the Gemini API to analyze an error and suggest fixes for the code.
// // // // // // // //  * @param code The code that caused the error.
// // // // // // // //  * @param errorMessage The error message received.
// // // // // // // //  * @returns A promise that resolves to the AI's analysis and suggested fixes.
// // // // // // // //  */
// // // // // // // // export async function analyzeCodeErrorWithGemini(
// // // // // // // //   code: string,
// // // // // // // //   errorMessage: string
// // // // // // // // ): Promise<string> {
// // // // // // // //   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// // // // // // // //   const messages = [
// // // // // // // //     {
// // // // // // // //       role: 'user',
// // // // // // // //       parts: [{
// // // // // // // //         text: `I encountered an error with the following React TypeScript component.
// // // // // // // //           Please analyze the error and suggest specific fixes. Explain your reasoning clearly.
// // // // // // // //           Your response should be in markdown format.

// // // // // // // //           Error message:
// // // // // // // //           \`\`\`
// // // // // // // //           ${errorMessage}
// // // // // // // //           \`\`\`

// // // // // // // //           Code:
// // // // // // // //           \`\`\`tsx
// // // // // // // //           ${code}
// // // // // // // //           \`\`\`
// // // // // // // //           `,
// // // // // // // //       }],
// // // // // // // //     },
// // // // // // // //   ];

// // // // // // // //   try {
// // // // // // // //     const response: GenerateContentResponse = await ai.models.generateContent({
// // // // // // // //       model: GEMINI_MODEL_ERROR_ANALYSIS,
// // // // // // // //       contents: messages,
// // // // // // // //       config: {
// // // // // // // //         maxOutputTokens: 1024,
// // // // // // // //         temperature: 0.5,
// // // // // // // //       },
// // // // // // // //     });
// // // // // // // //     return response.text?.trim() || 'No analysis available.';
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error analyzing code with Gemini:", error);
// // // // // // // //     throw new Error(`Failed to analyze error: ${error instanceof Error ? error.message : String(error)}`);
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // /**
// // // // // // // //  * Calls the Gemini API to analyze code for general improvements and best practices.
// // // // // // // //  * @param code The code to be analyzed for improvements.
// // // // // // // //  * @returns A promise that resolves to the AI's suggestions for improvement.
// // // // // // // //  */
// // // // // // // // export async function analyzeCodeForImprovements(code: string): Promise<string> {
// // // // // // // //   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// // // // // // // //   const messages = [
// // // // // // // //     {
// // // // // // // //       role: 'user',
// // // // // // // //       parts: [{
// // // // // // // //         text: `You are an expert React TypeScript developer. Analyze the following React functional component for best practices, readability, performance, and overall code quality. Suggest specific improvements and explain your reasoning clearly.
// // // // // // // //           Your response should be in markdown format. Do not rewrite the entire component unless necessary; focus on actionable suggestions.

// // // // // // // //           Code to analyze:
// // // // // // // //           \`\`\`tsx
// // // // // // // //           ${code}
// // // // // // // //           \`\`\`
// // // // // // // //           `,
// // // // // // // //       }],
// // // // // // // //     },
// // // // // // // //   ];

// // // // // // // //   try {
// // // // // // // //     const response: GenerateContentResponse = await ai.models.generateContent({
// // // // // // // //       model: GEMINI_MODEL_ERROR_ANALYSIS, // Using flash model for quick analysis
// // // // // // // //       contents: messages,
// // // // // // // //       config: {
// // // // // // // //         maxOutputTokens: 1024,
// // // // // // // //         temperature: 0.5,
// // // // // // // //       },
// // // // // // // //     });
// // // // // // // //     return response.text?.trim() || 'No improvement suggestions available.';
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error analyzing code for improvements with Gemini:", error);
// // // // // // // //     throw new Error(`Failed to get improvement suggestions: ${error instanceof Error ? error.message : String(error)}`);
// // // // // // // //   }
// // // // // // // // }

// // // // // // // import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// // // // // // // import { GEMINI_MODEL } from '../constants';

// // // // // // // // Helper to extract clean code from Gemini response
// // // // // // // function extractCodeFromResponse(text: string): string {
// // // // // // //   const codeBlock = text.match(/```(?:tsx|typescript|jsx)?\n([\s\S]*?)\n```/);
// // // // // // //   if (codeBlock) return codeBlock[1].trim();

// // // // // // //   // Fallback: try to find export const PreviewComponent
// // // // // // //   const fallback = text.match(/export\s+const\s+PreviewComponent[\s\S]*/);
// // // // // // //   return fallback ? fallback[0].trim() : text.trim();
// // // // // // // }

// // // // // // // export async function generateCodeWithGemini(
// // // // // // //   prompt: string,
// // // // // // //   currentCode: string = ''
// // // // // // // ): Promise<string> {
// // // // // // //   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// // // // // // //   const systemPrompt = `You are an expert React + TypeScript + Tailwind CSS developer.
// // // // // // // Your ONLY job is to output a complete, valid React component named "PreviewComponent".
// // // // // // // - Export it as: export const PreviewComponent: React.FC = () => { ... }
// // // // // // // - Use only 'import React from "react"' (no other imports)
// // // // // // // - Use Tailwind CSS classes
// // // // // // // - Never explain, never add comments, never wrap in markdown unless it's code
// // // // // // // - If updating existing code, improve and refine it based on the user's request

// // // // // // // Current code (if any):
// // // // // // // \`\`\`tsx
// // // // // // // ${currentCode}
// // // // // // // \`\`\`

// // // // // // // User request: ${prompt}

// // // // // // // Respond with ONLY the full component code inside \`\`\`tsx ... \`\`\``;

// // // // // // //   try {
// // // // // // //     const response: GenerateContentResponse = await ai.models.generateContent({
// // // // // // //       model: GEMINI_MODEL,
// // // // // // //       contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
// // // // // // //       config: {
// // // // // // //         temperature: 0.8,
// // // // // // //         maxOutputTokens: 2048,
// // // // // // //         topP: 0.95,
// // // // // // //       },
// // // // // // //     });

// // // // // // //     const rawText = response.text?.trim() || '';
// // // // // // //     return extractCodeFromResponse(rawText);
// // // // // // //   } catch (error: any) {
// // // // // // //     console.error("Gemini API Error:", error);
// // // // // // //     throw new Error(`Gemini failed: ${error.message || error}`);
// // // // // // //   }
// // // // // // // }

// // // // // // // export async function analyzeCodeErrorWithGemini(
// // // // // // //   code: string,
// // // // // // //   errorMessage: string
// // // // // // // ): Promise<string> {
// // // // // // //   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// // // // // // //   const prompt = `You are a senior React debugger. A user got this error:

// // // // // // // Error:
// // // // // // // \`\`\`
// // // // // // // ${errorMessage}
// // // // // // // \`\`\`

// // // // // // // Code:
// // // // // // // \`\`\`tsx
// // // // // // // ${code}
// // // // // // // \`\`\`

// // // // // // // Explain the error in simple terms and give a fixed version of the code (full component).
// // // // // // // Respond in clean Markdown with a code block.`;

// // // // // // //   try {
// // // // // // //     const response: GenerateContentResponse = await ai.models.generateContent({
// // // // // // //       model: GEMINI_MODEL,
// // // // // // //       contents: [{ role: 'user', parts: [{ text: prompt }] }],
// // // // // // //       config: { temperature: 0.4, maxOutputTokens: 1024 },
// // // // // // //     });
// // // // // // //     return response.text?.trim() || 'No analysis available.';
// // // // // // //   } catch (error: any) {
// // // // // // //     throw new Error(`Analysis failed: ${error.message}`);
// // // // // // //   }
// // // // // // // }

// // // // // // // export async function analyzeCodeForImprovements(code: string): Promise<string> {
// // // // // // //   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// // // // // // //   const prompt = `You are a React + TypeScript code reviewer.

// // // // // // // Review this component for:
// // // // // // // - Performance
// // // // // // // - Accessibility
// // // // // // // - Best practices
// // // // // // // - Readability
// // // // // // // - Modern React patterns

// // // // // // // Code:
// // // // // // // \`\`\`tsx
// // // // // // // ${code}
// // // // // // // \`\`\`

// // // // // // // Give 3–5 bullet point suggestions. Then provide an improved full version if changes are meaningful. Use Markdown.`;

// // // // // // //   try {
// // // // // // //     const response: GenerateContentResponse = await ai.models.generateContent({
// // // // // // //       model: GEMINI_MODEL,
// // // // // // //       contents: [{ role: 'user', parts: [{ text: prompt }] }],
// // // // // // //       config: { temperature: 0.6, maxOutputTokens: 1024 },
// // // // // // //     });
// // // // // // //     return response.text?.trim() || 'No suggestions.';
// // // // // // //   } catch (error: any) {
// // // // // // //     throw new Error(`Improvement analysis failed: ${error.message}`);
// // // // // // //   }
// // // // // // // }

// // // // // // import { GoogleGenerativeAI } from "@google/generative-ai";
// // // // // // import { GEMINI_MODEL } from '../constants';

// // // // // // const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

// // // // // // export async function generateWebApp(prompt: string): Promise<{ html: string; css: string; js: string }> {
// // // // // //   const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

// // // // // //   const systemPrompt = `You are a professional frontend developer. Generate a complete web app using only HTML, CSS, and JavaScript.

// // // // // // Rules:
// // // // // // - Output exactly 3 sections separated by <!--Section-separator-->
// // // // // // - Use <link rel="stylesheet" href="/styles.css"> and <script src="/index.js"></script>
// // // // // // - Make it responsive and beautiful
// // // // // // - No frameworks

// // // // // // User request: ${prompt}

// // // // // // Format:
// // // // // // <!doctype html>
// // // // // // ...
// // // // // // <!--Section-separator-->
// // // // // // body { ... }
// // // // // // <!--Section-separator-->
// // // // // // console.log(...);`;

// // // // // //   const result = await model.generateContent(systemPrompt);
// // // // // //   const text = await result.response.text();

// // // // // //   const [html = '', css = '', js = ''] = text.split('<!--Section-separator-->').map(s => s.trim());

// // // // // //   return {
// // // // // //     html: html || '<h1>Hello World</h1>',
// // // // // //     css: css || 'body { font-family: sans-serif; }',
// // // // // //     js: js || 'console.log("Ready");'
// // // // // //   };
// // // // // // }

// // // // // // // Keep your other functions (analyzeCodeErrorWithGemini, etc.) unchanged
// // // // // // export const analyzeCodeErrorWithGemini = async (code: string, error: string) => { /* ... */ };
// // // // // // export const analyzeCodeForImprovements = async (code: string) => { /* ... */ };


// // // // // // services/geminiService.ts
// // // // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // // // const API_KEYS = [
// // // // //   process.env.GEMINI_API_KEY_1,
// // // // //   process.env.GEMINI_API_KEY_2,
// // // // //   process.env.GEMINI_API_KEY_3,
// // // // //   process.env.GEMINI_API_KEY,
// // // // // ].filter(Boolean) as string[];

// // // // // let currentKeyIndex = 0;
// // // // // function getNextClient() {
// // // // //   if (API_KEYS.length === 0) throw new Error("No API keys");
// // // // //   const key = API_KEYS[currentKeyIndex];
// // // // //   currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
// // // // //   return new GoogleGenerativeAI(key);
// // // // // }

// // // // // async function callGemini<T>(fn: (client: GoogleGenerativeAI) => Promise<T>): Promise<T> {
// // // // //   let lastError;
// // // // //   for (let i = 0; i < API_KEYS.length; i++) {
// // // // //     try {
// // // // //       return await fn(getNextClient());
// // // // //     } catch (err: any) {
// // // // //       lastError = err;
// // // // //     }
// // // // //   }
// // // // //   throw lastError;
// // // // // }

// // // // // export interface CodeBundle { html: string; css: string; js: string; }

// // // // // export async function generateWebApp(prompt: string, previous?: CodeBundle): Promise<CodeBundle> {
// // // // //   return callGemini(async (genAI) => {
// // // // //     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // // // //     const context = previous
// // // // //       ? `PREVIOUS CODE:\nHTML:\n\`\`\`html\n${previous.html}\n\`\`\`\nCSS:\n\`\`\`css\n${previous.css}\n\`\`\`\nJS:\n\`\`\`js\n${previous.js}\n\`\`\``
// // // // //       : "Create from scratch.";

// // // // //     const fullPrompt = `You are a pro frontend dev. ${context}\n\nREQUEST: "${prompt}"\n\nOutput ONLY 3 sections separated by <!--Section-separator-->\nInclude <link href="/styles.css"> and <script src="/index.js">\nMake it beautiful & responsive.`;

// // // // //     const result = await model.generateContent(fullPrompt);
// // // // //     const text = (await result.response).text();

// // // // //     const parts = text.split('<!--Section-separator-->').map(s => s.trim());
// // // // //     return {
// // // // //       html: parts[0] || "<h1>Error</h1>",
// // // // //       css: parts[1] || "",
// // // // //       js: parts[2] || "console.log('done');"
// // // // //     };
// // // // //   });
// // // // // }


// // // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // // const API_KEYS = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY].filter(Boolean) as string[];

// // // // let keyIndex = 0;
// // // // const getClient = () => new GoogleGenerativeAI(API_KEYS[keyIndex = (keyIndex + 1) % API_KEYS.length]);

// // // // export interface CodeBundle { html: string; css: string; js: string; }
// // // // export interface GenerationContext {
// // // //   chatHistory: any[];
// // // //   currentCode: CodeBundle;
// // // //   previousVersions: { prompt: string; code: CodeBundle }[];
// // // // }

// // // // export async function generateWebApp(prompt: string, context: GenerationContext): Promise<CodeBundle> {
// // // //   return new Promise((resolve, reject) => {
// // // //     const tryGenerate = async (attempt = 1): Promise<void> => {
// // // //       try {
// // // //         const genAI = getClient();
// // // //         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // // //         const history = context.chatHistory.map(m => `${m.role}: ${m.content}`).join('\n');
// // // //         const prevVersions = context.previousVersions
// // // //           .map((v, i) => `Version ${i + 1} (from: "${v.prompt}"):\nHTML:\n\`\`\`\n${v.code.html}\n\`\`\`\nCSS:\n\`\`\`\n${v.code.css}\n\`\`\`\nJS:\n\`\`\`\n${v.code.js}\n\`\`\``)
// // // //           .join('\n\n');

// // // //         const fullPrompt = `You are an elite full-stack web developer.

// // // // CURRENT CODE (this is what exists now):
// // // // HTML:
// // // // \`\`\`html
// // // // ${context.currentCode.html}
// // // // \`\`\`
// // // // CSS:
// // // // \`\`\`css
// // // // ${context.currentCode.css}
// // // // \`\`\`
// // // // JS:
// // // // \`\`\`js
// // // // ${context.currentCode.js}
// // // // \`\`\`

// // // // PREVIOUS VERSIONS (for context):
// // // // ${prevVersions || "None"}

// // // // CHAT HISTORY:
// // // // ${history}

// // // // USER REQUEST: "${prompt}"

// // // // INSTRUCTIONS:
// // // // 1. You MUST output EXACTLY 3 sections separated by <!--Section-separator-->
// // // // 2. Always include <link rel="stylesheet" href="/styles.css"> and <script src="/index.js"></script>
// // // // 3. Fix any bugs automatically
// // // // 4. Improve performance, accessibility, and design
// // // // 5. Make it responsive and beautiful
// // // // 6. Never break existing functionality unless asked

// // // // OUTPUT FORMAT:
// // // // <!doctype html>
// // // // ...
// // // // <!--Section-separator-->
// // // // body { ... }
// // // // <!--Section-separator-->
// // // // console.log("...");

// // // // Now generate the updated app:`;

// // // //         const result = await model.generateContent(fullPrompt);
// // // //         const text = (await result.response).text();

// // // //         const parts = text.split("<!--Section-separator-->").map(s => s.trim());
// // // //         if (parts.length < 3) throw new Error("Invalid output format");

// // // //         resolve({
// // // //           html: parts[0],
// // // //           css: parts[1],
// // // //           js: parts[2]
// // // //         });
// // // //       } catch (err: any) {
// // // //         if (attempt < API_KEYS.length * 2) {
// // // //           console.warn(`Attempt ${attempt} failed, retrying...`, err.message);
// // // //           setTimeout(() => tryGenerate(attempt + 1), 1000);
// // // //         } else {
// // // //           reject(err);
// // // //         }
// // // //       }
// // // //     };

// // // //     tryGenerate();
// // // //   });
// // // // }

// // // import { GoogleGenerativeAI } from "@google/generative-ai";

// // // const API_KEYS = [
// // //   process.env.GEMINI_API_KEY_1,
// // //   process.env.GEMINI_API_KEY_2,
// // //   process.env.GEMINI_API_KEY_3,
// // //   process.env.GEMINI_API_KEY,
// // // ].filter(Boolean) as string[];

// // // let keyIndex = 0;
// // // const getClient = () => new GoogleGenerativeAI(API_KEYS[keyIndex = (keyIndex + 1) % API_KEYS.length]);

// // // export interface CodeBundle { html: string; css: string; js: string; }

// // // // === ULTRA-ROBUST CODE EXTRACTOR ===
// // // function extractCode(text: string): CodeBundle {
// // //   const cleaned = text
// // //     .replace(/```html/g, '<!--HTML-START-->')
// // //     .replace(/```css/g, '<!--CSS-START-->')
// // //     .replace(/```js|```javascript/g, '<!--JS-START-->')
// // //     .replace(/```/g, '')
// // //     .replace(/<!--Section-separator-->/g, '<!--SEP-->');

// // //   let html = '';
// // //   let css = '';
// // //   let js = '';

// // //   // Try primary separator first
// // //   if (cleaned.includes('<!--SEP-->')) {
// // //     const parts = cleaned.split('<!--SEP-->').map(s => s.trim());
// // //     html = parts[0] || '';
// // //     css = parts[1] || '';
// // //     js = parts[2] || '';
// // //   }

// // //   // Fallback: Look for our custom markers
// // //   if (!html.includes('<html') || !html.includes('<body')) {
// // //     const htmlMatch = cleaned.match(/<!--HTML-START-->([\s\S]*?)(<!--|$)/);
// // //     html = htmlMatch ? htmlMatch[1].trim() : '';
// // //   }
// // //   if (!css.includes('{') || !css.includes('}')) {
// // //     const cssMatch = cleaned.match(/<!--CSS-START-->([\s\S]*?)(<!--|$)/);
// // //     css = cssMatch ? cssMatch[1].trim() : '';
// // //   }
// // //   if (!js.includes('console.log') && !js.includes('function')) {
// // //     const jsMatch = cleaned.match(/<!--JS-START-->([\s\S]*?)(<!--|$)/);
// // //     js = jsMatch ? jsMatch[1].trim() : '';
// // //   }

// // //   // Final fallback: regex-based extraction
// // //   if (!html) html = (cleaned.match(/<!doctype html>[\s\S]*?<\s*\/html\s*>/i) || [])[0] || '<h1>Error</h1>';
// // //   if (!css) css = (cleaned.match(/body\s*{[\s\S]*?}/i) || cleaned.match(/[\w-]+\s*{[\s\S]*?}/) || [])[0] || 'body { margin: 0; }';
// // //   if (!js) js = (cleaned.match(/console\.log\([^)]*\)|function\s+\w+\s*\(/) ? cleaned.match(/[\s\S]*$/)![0] : '') || 'console.log("Ready");';

// // //   return {
// // //     html: html.trim(),
// // //     css: css.trim(),
// // //     js: js.trim(),
// // //   };
// // // }

// // // export async function generateWebApp(prompt: string, context: any): Promise<CodeBundle> {
// // //   return new Promise((resolve, reject) => {
// // //     const attempt = async (retry = 0): Promise<void> => {
// // //       try {
// // //         const genAI = getClient();
// // //         const model = genAI.getGenerativeModel({
// // //           model: "gemini-2.5-flash",
// // //           generationConfig: { temperature: 0.4, maxOutputTokens: 8192 }
// // //         });

// // //         const fullPrompt = `You are an expert frontend developer.

// // // CURRENT CODE:
// // // HTML:
// // // \`\`\`html
// // // ${context.currentCode?.html || '<h1>Loading...</h1>'}
// // // \`\`\`
// // // CSS:
// // // \`\`\`css
// // // ${context.currentCode?.css || ''}
// // // \`\`\`
// // // JS:
// // // \`\`\`js
// // // ${context.currentCode?.js || ''}
// // // \`\`\`

// // // USER REQUEST: "${prompt}"

// // // RULES:
// // // - Output EXACTLY 3 code blocks
// // // - Use: \`\`\`html ... \`\`\` then \`\`\`css ... \`\`\` then \`\`\`js ... \`\`\`
// // // - Or use <!--Section-separator--> if you prefer
// // // - ALWAYS include:
// // //   <link rel="stylesheet" href="/styles.css">
// // //   <script src="/index.js"></script>
// // // - Make it beautiful, responsive, bug-free
// // // - Fix any errors automatically

// // // Now generate the updated app:`;

// // //         const result = await model.generateContent(fullPrompt);
// // //         const rawText = (await result.response).text();

// // //         const extracted = extractCode(rawText);

// // //         // Final validation
// // //         if (!extracted.html.includes('<html') || !extracted.html.includes('</html>')) {
// // //           throw new Error("Invalid HTML generated");
// // //         }

// // //         resolve(extracted);
// // //       } catch (err: any) {
// // //         if (retry < API_KEYS.length * 3) {
// // //           console.warn(`Parse attempt ${retry + 1} failed, retrying...`, err.message);
// // //           setTimeout(() => attempt(retry + 1), 1200);
// // //         } else {
// // //           reject(new Error(`Failed to generate valid code: ${err.message}`));
// // //         }
// // //       }
// // //     };

// // //     attempt();
// // //   });
// // // }


// // // src/services/geminiService.ts
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const API_KEYS = [
// //   process.env.GEMINI_API_KEY_1,
// //   process.env.GEMINI_API_KEY_2,
// //   process.env.GEMINI_API_KEY_3,
// //   process.env.GEMINI_API_KEY,
// // ].filter(Boolean) as string[];

// // if (API_KEYS.length === 0) {
// //   console.error("No GEMINI API keys found! Add to .env.local");
// // }

// // let keyIndex = 0;
// // const getClient = () => {
// //   const key = API_KEYS[keyIndex];
// //   keyIndex = (keyIndex + 1) % API_KEYS.length;
// //   return new GoogleGenerativeAI(key);
// // };

// // export interface CodeBundle {
// //   html: string;
// //   css: string;
// //   js: string;
// // }

// // export async function generateWebApp(
// //   prompt: string,
// //   context: { currentCode?: CodeBundle; isFirstMessage: boolean; chatHistory?: any[] }
// // ): Promise<CodeBundle> {
// //   const run = async (attempt = 1): Promise<CodeBundle> => {
// //     try {
// //       const model = getClient().getGenerativeModel({
// //         model: "gemini-2.5-flash",
// //         generationConfig: {
// //           temperature: 0.2,
// //           maxOutputTokens: 8192,
// //         },
// //       });

// //       const codeContext = context.isFirstMessage
// //         ? ""
// //         : `
// // Here is the current code you must improve:

// // HTML:
// // \`\`\`html
// // ${context.currentCode?.html || ""}
// // \`\`\`

// // CSS:
// // \`\`\`css
// // ${context.currentCode?.css || ""}
// // \`\`\`

// // JS:
// // \`\`\`js
// // ${context.currentCode?.js || ""}
// // \`\`\`
// // `;

// //       const fullPrompt = `You are an expert frontend developer.

// // ${context.isFirstMessage ? "Create a new web app from scratch." : "Improve the existing code."}

// // ${codeContext}

// // USER REQUEST: "${prompt}"

// // OUTPUT EXACTLY IN THIS FORMAT — NO TEXT OUTSIDE CODE BLOCKS:

// // \`\`\`html
// // (full complete HTML with <link rel="stylesheet" href="/styles.css"> and <script src="/index.js"></script>)
// // \`\`\`

// // \`\`\`css
// // (full complete CSS)
// // \`\`\`

// // \`\`\`js
// // (full complete JavaScript — never empty)
// // \`\`\`

// // RULES:
// // - Use only triple backticks with html/css/js
// // - Never use <!--Section-separator-->
// // - Never write explanations
// // - Never skip the JS block
// // - Always include the <link> and <script> tags

// // Generate now.`;

// //       const result = await model.generateContent(fullPrompt);
// //       const text = (await result.response).text();

// //       // FIXED REGEX — proper escaping and closing
// //       const htmlMatch = text.match(/```html\r?\n([\s\S]*?)\r?\n```/);
// //       const cssMatch = text.match(/```css\r?\n([\s\S]*?)\r?\n```/);
// //       const jsMatch = text.match(/```(?:js|javascript)\r?\n([\s\S]*?)\r?\n```/);

// //       let html = htmlMatch?.[1]?.trim() || "<h1>Error generating HTML</h1>";
// //       let css = cssMatch?.[1]?.trim() || "body { margin: 0; font-family: sans-serif; }";
// //       let js = jsMatch?.[1]?.trim() || 'console.log("App ready");';

// //       // Force required tags if missing
// //       if (!html.includes('<link rel="stylesheet" href="/styles.css">')) {
// //         html = html.replace(
// //           "</head>",
// //           '  <link rel="stylesheet" href="/styles.css">\n  </head>'
// //         );
// //       }
// //       if (!html.includes('<script src="/index.js"></script>')) {
// //         html = html.replace(
// //           "</body>",
// //           '  <script src="/index.js"></script>\n  </body>'
// //         );
// //       }

// //       return { html, css, js };
// //     } catch (err: any) {
// //       console.warn(`Attempt ${attempt} failed, retrying...`, err.message);
// //       if (attempt < 5) {
// //         await new Promise(r => setTimeout(r, 1500));
// //         return run(attempt + 1);
// //       }
// //       throw new Error("Failed to generate valid code after 5 attempts");
// //     }
// //   };

// //   return run();
// // }

// // src/services/geminiService.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEYS = [
//   process.env.GEMINI_API_KEY_1,
//   process.env.GEMINI_API_KEY_2,
//   process.env.GEMINI_API_KEY_3,
//   process.env.GEMINI_API_KEY,
// ].filter(Boolean) as string[];

// let keyIndex = 0;
// const getClient = () => new GoogleGenerativeAI(API_KEYS[keyIndex = (keyIndex + 1) % API_KEYS.length]);

// export interface CodeBundle { html: string; css: string; js: string; }

// export async function generateWebApp(
//   prompt: string,
//   context: { currentCode?: CodeBundle; isFirstMessage: boolean }
// ): Promise<CodeBundle> {
//   const run = async (attempt = 1): Promise<CodeBundle> => {
//     try {
//       const model = getClient().getGenerativeModel({
//         model: "gemini-2.5-flash",
//         generationConfig: { temperature: 0.4, maxOutputTokens: 8192 },
//       });

//       const codeContext = context.isFirstMessage ? "" : `
// FULL CURRENT CODE TO MODIFY:

// HTML:
// \`\`\`html
// ${context.currentCode?.html}
// \`\`\`

//   CSS:
// \`\`\`css
// ${context.currentCode?.css}
// \`\`\`

//   JS:
// \`\`\`js
// ${context.currentCode?.js}
// \`\`\`
// `;

//       const fullPrompt = `You are a senior frontend developer.

// ${context.isFirstMessage ? "Create from scratch." : "You MUST update the existing code."}

// ${codeContext}

// USER REQUEST: "${prompt}"

// OUTPUT ONLY 3 CODE BLOCKS — NO OTHER TEXT:

// \`\`\`html
// <!doctype html>
// <!-- FULL UPDATED HTML -->
// </html>
// \`\`\`

// \`\`\`css
// /* FULL UPDATED CSS */
// \`\`\`

// \`\`\`js
// // FULL UPDATED JAVASCRIPT
// \`\`\`

// RULES:
// - Always include <link rel="stylesheet" href="/styles.css"> and <script src="/index.js">
// - You MUST make real, visible changes
// - Never repeat old code
// - Never skip JS block

// Do it now.`;

//       const result = await model.generateContent(fullPrompt);
//       const text = (await result.response).text();

//       const html = text.match(/```html\n([\s\S]*?)\n```/)?.[1]?.trim() ?? "<h1>Error</h1>";
//       const css = text.match(/```css\n([\s\S]*?)\n```/)?.[1]?.trim() ?? "body{margin:0}";
//       const js = text.match(/```(?:js|javascript)\n([\s\S]*?)\n```/)?.[1]?.trim() ?? 'console.log("ready");';

//       let finalHtml = html;
//       if (!finalHtml.includes('<link rel="stylesheet" href="/styles.css">')) {
//         finalHtml = finalHtml.replace(/<\/head>/i, '  <link rel="stylesheet" href="/styles.css">\n</head>');
//       }
//       if (!finalHtml.includes('<script src="/index.js"></script>')) {
//         finalHtml = finalHtml.replace(/<\/body>/i, '  <script src="/index.js"></script>\n</body>');
//       }

//       return { html: finalHtml, css, js };
//     } catch (err) {
//       if (attempt < 5) return run(attempt + 1);
//       throw err;
//     }
//   };
//   return run();
// }

// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY,
].filter(Boolean) as string[];

let keyIndex = 0;
const getClient = () => new GoogleGenerativeAI(API_KEYS[keyIndex = (keyIndex + 1) % API_KEYS.length]);

export interface CodeBundle { html: string; css: string; js: string; }

export async function generateWebApp(
  prompt: string,
  context: {
    currentCode?: CodeBundle;
    isFirstMessage: boolean;
    mode: "plan" | "code";  // NEW: mode
  }
): Promise<{ type: "plan" | "code"; content: string; code?: CodeBundle }> {
  const run = async (attempt = 1): Promise<any> => {
    try {
      const model = getClient().getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { temperature: context.mode === "plan" ? 0.3 : 0.4, maxOutputTokens: 8192 },
      });

      const codeContext = context.isFirstMessage ? "" : `
CURRENT CODE:
HTML:
\`\`\`html
${context.currentCode?.html}
\`\`\`
CSS:
\`\`\`css
${context.currentCode?.css}
\`\`\`
JS:
\`\`\`js
${context.currentCode?.js}
\`\`\`
`;

      const fullPrompt = context.mode === "plan" ? `
You are a Senior Full-Stack Architect.

USER REQUEST: "${prompt}"

Your job is to create a COMPLETE PROJECT PLAN before any code.

OUTPUT ONLY A DETAILED PLAN IN MARKDOWN:

# Project Plan: [Project Name]

## Features
- List all features

## Tech Stack
- HTML, CSS, JS only (no React/Vue)

## Layout Structure
- Header, Main, Footer?
- Grid? Flexbox?

## Components
- Navbar
- Hero section
- Cards
- Form
- etc.

## Color Scheme & Style
- Dark/light mode?
- Fonts, colors

## Step-by-step Implementation Plan
1. First: Build layout
2. Then: Add styles
3. Then: Add interactivity

Do NOT write any code. Only the plan.
` : `
You are an expert frontend developer.

${context.isFirstMessage ? "Create from scratch." : "Improve the existing code."}

${codeContext}

USER REQUEST: "${prompt}"

OUTPUT ONLY 3 CODE BLOCKS:

\`\`\`html
<!-- FULL HTML -->
\`\`\`

\`\`\`css
/* FULL CSS */
\`\`\`

\`\`\`js
// FULL JS
\`\`\`

Always include <link href="/styles.css"> and <script src="/index.js">
`;

      const result = await model.generateContent(fullPrompt);
      const text = (await result.response).text().trim();

      if (context.mode === "plan") {
        return { type: "plan", content: text };
      }

      const html = text.match(/```html\n([\s\S]*?)\n```/)?.[1]?.trim() ?? "<h1>Error</h1>";
      const css = text.match(/```css\n([\s\S]*?)\n```/)?.[1]?.trim() ?? "body{margin:0}";
      const js = text.match(/```(?:js|javascript)\n([\s\S]*?)\n```/)?.[1]?.trim() ?? 'console.log("ready");';

      let finalHtml = html
        .replace(/<\/head>/i, '  <link rel="stylesheet" href="/styles.css">\n</head>')
        .replace(/<\/body>/i, '  <script src="/index.js"></script>\n</body>');

      return { type: "code", content: "Code generated!", code: { html: finalHtml, css, js } };
    } catch (err) {
      if (attempt < 5) return run(attempt + 1);
      throw err;
    }
  };
  return run();
}