// src/services/storageService.ts
export interface CodeBundle {
  html: string;
  css: string;
  js: string;
}

export interface CodeVersion {
  id: string;
  code: CodeBundle;
  prompt: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "error";
  content: string;
  versionId?: string; // links to CodeVersion
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  chat: ChatMessage[];
  versions: CodeVersion[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "ai_web_builder_projects_v2";

export const storageService = {
  getAllProjects(): Project[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProjects(projects: Project[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  getProject(id: string): Project | null {
    return this.getAllProjects().find(p => p.id === id) || null;
  },

  createProject(name: string = "Untitled Project"): Project {
    const projects = this.getAllProjects();
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      chat: [{
        id: crypto.randomUUID(),
        role: "model",
        content: "New project created! What would you like to build?",
        timestamp: Date.now()
      }],
      versions: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    projects.unshift(newProject);
    this.saveProjects(projects);
    return newProject;
  },

  updateProject(project: Project) {
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      projects[index] = { ...project, updatedAt: Date.now() };
      this.saveProjects(projects);
    }
  },

  deleteProject(id: string) {
    const projects = this.getAllProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
  },

  addChatMessage(projectId: string, message: ChatMessage) {
    const project = this.getProject(projectId);
    if (project) {
      project.chat.push(message);
      this.updateProject(project);
    }
  },

  addCodeVersion(projectId: string, version: CodeVersion) {
    const project = this.getProject(projectId);
    if (project) {
      project.versions.unshift(version);
      project.versions = project.versions.slice(0, 100);
      this.updateProject(project);
    }
  }
};