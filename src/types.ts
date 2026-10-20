export type Status = "offen" | "in_arbeit" | "erledigt";

export interface Project {
  id: string;
  name: string;
  archived: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  due?: string;
  archived: boolean;
  createdAt: string;
}

export interface AppData {
  version: 1;
  projects: Project[];
  tasks: Task[];
  lastProjectId?: string;
}
