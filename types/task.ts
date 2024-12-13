export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    REVIEW = 'REVIEW',
    DONE = 'DONE'
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface User {
    id: string;
    name: string;
    email?: string;
}

export interface Participant { id: string; name: string; }
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    creator: User;
    performers: User[];
    createdAt: string;
    updatedAt: string;
    dueDate?: string;
    assignee?: User;
    tags?: string[];
}

export interface TaskFilter {
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    tags?: string[];
}