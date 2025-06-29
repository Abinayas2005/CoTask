export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  sharedWith: string[];
  tags: string[];
}

export interface FilterOptions {
  status: string[];
  priority: string[];
  dueDate: 'all' | 'today' | 'overdue' | 'this-week' | 'this-month';
  assignedTo: string;
  search: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  tags: string[];
  sharedWith: string[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}