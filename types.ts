

// // export interface CodeBundle {
// //   html: string;
// //   css: string;
// //   js: string;
// //   json: string; // data.json
// //   extraFiles?: FileNode[];
// // }

// // export interface CodeVersion {
// //   id: string;
// //   code: CodeBundle;
// //   prompt: string;
// //   timestamp: number;
// //   changesSummary?: string;
// //   changedFiles?: string[];
// //   plan?: string;
// // }

// // export interface ChatMessage {
// //   id: string;
// //   role: "user" | "model" | "error";
// //   content: string;
// //   versionId?: string;
// //   timestamp: number;
// //   isCodeUpdate?: boolean;
// //   changedFiles?: string[];
// //   changesSummary?: string;
// // }

// // export interface Project {
// //   id: string;
// //   name: string;
// //   versions: CodeVersion[];
// //   chat: ChatMessage[];
// //   createdAt: number;
// //   updatedAt: number;
// // }

// // // For VSCode IDE (optional but safe to keep)
// // export type FileType = "file" | "folder";

// // export interface FileNode {
// //   id: string;
// //   name: string;
// //   type: FileType;
// //   content?: string;
// //   language?: string;
// //   children?: FileNode[];
// //   fileType?: string;
// // }

// // src/types.ts

// export interface CodeBundle {
//   html: string;
//   css: string;
//   js: string;
//   json: string; // data.json
//   extraFiles?: FileNode[];
// }

// // This was the missing piece causing the TS error!
// export interface ProjectArtifacts extends CodeBundle {
//   plan: string;
// }

// export interface CodeVersion {
//   id: string;
//   code: CodeBundle;
//   prompt: string;
//   timestamp: number;
//   changesSummary?: string;
//   changedFiles?: string[];
//   plan?: string; // Optional plan text for this version
// }

// export interface ChatMessage {
//   id: string;
//   role: "user" | "model" | "error";
//   content: string;
//   versionId?: string;
//   timestamp: number;
//   isCodeUpdate?: boolean;
//   changedFiles?: string[];
//   changesSummary?: string;
// }

// export interface Project {
//   id: string;
//   name: string;
//   versions: CodeVersion[];
//   chat: ChatMessage[];
//   createdAt: number;
//   updatedAt: number;
// }

// export type FileType = "file" | "folder";

// export interface FileNode {
//   id: string;
//   name: string;
//   type: FileType;
//   content?: string;       // For files
//   language?: string;      // e.g., "typescript", "svg", "markdown"
//   children?: FileNode[];  // For folders
//   fileType?: string;      // Optional: e.g., "component", "asset", "page"
// }

// src/types.ts

export interface CodeBundle {
  html: string;
  css: string;
  js: string;
  json: string;
  extraFiles?: FileNode[];
}

export interface ProjectArtifacts extends CodeBundle {
  plan: string;
}

export interface CodeVersion {
  id: string;
  code: CodeBundle;
  prompt: string;
  timestamp: number;
  changesSummary?: string;
  changedFiles?: string[];
  plan?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "error";
  content: string;
  versionId?: string;
  timestamp: number;
  isCodeUpdate?: boolean;
  changedFiles?: string[];
  changesSummary?: string;
  isPlan?: boolean; // ← NEW: Marks plan messages for special UI
}

export interface Project {
  id: string;
  name: string;
  versions: CodeVersion[];
  chat: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export type FileType = "file" | "folder";

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  language?: string;
  children?: FileNode[];
  fileType?: string;
}