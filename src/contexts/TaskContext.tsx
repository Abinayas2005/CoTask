import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, FilterOptions, PaginationData, TaskFormData } from '../types';
import { isToday, isPast, isThisWeek, isThisMonth } from 'date-fns';
import toast from 'react-hot-toast';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: FilterOptions;
  pagination: PaginationData;
  loading: boolean;
  createTask: (taskData: TaskFormData) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setPage: (page: number) => void;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFiltersState] = useState<FilterOptions>({
    status: [],
    priority: [],
    dueDate: 'all',
    assignedTo: '',
    search: '',
  });
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design new landing page',
        description: 'Create a modern, responsive landing page for the new product launch',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
        assignedTo: 'user@gmail.com',
        sharedWith: ['colleague@example.com'],
        tags: ['design', 'web'],
      },
      {
        id: '2',
        title: 'Review code changes',
        description: 'Review and approve pending pull requests',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(), // Today
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(),
        assignedTo: 'user@gmail.com',
        sharedWith: [],
        tags: ['code', 'review'],
      },
      {
        id: '3',
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        priority: 'low',
        status: 'completed',
        dueDate: new Date(Date.now() - 86400000), // Yesterday (overdue but completed)
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(),
        assignedTo: 'user@gmail.com',
        sharedWith: ['team@example.com'],
        tags: ['docs'],
      },
      {
        id: '4',
        title: 'Prepare presentation',
        description: 'Create slides for quarterly review meeting',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() - 172800000), // Overdue
        createdAt: new Date(Date.now() - 345600000),
        updatedAt: new Date(),
        assignedTo: 'user@gmail.com',
        sharedWith: [],
        tags: ['presentation', 'meeting'],
      },
    ];
    
    setTasks(mockTasks);
  }, []);

  // Filter tasks based on current filters
  useEffect(() => {
    let filtered = [...tasks];

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    // Due date filter
    if (filters.dueDate !== 'all') {
      filtered = filtered.filter(task => {
        switch (filters.dueDate) {
          case 'today':
            return isToday(task.dueDate);
          case 'overdue':
            return isPast(task.dueDate) && task.status !== 'completed';
          case 'this-week':
            return isThisWeek(task.dueDate);
          case 'this-month':
            return isThisMonth(task.dueDate);
          default:
            return true;
        }
      });
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Update pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.limit);
    setPagination(prev => ({ ...prev, total, totalPages }));

    // Apply pagination
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    setFilteredTasks(filtered.slice(start, end));
  }, [tasks, filters, pagination.page, pagination.limit]);

  const createTask = async (taskData: TaskFormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: 'user@gmail.com',
      };

      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully!');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTasks(prev => prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ));
      
      toast.success('Task updated successfully!');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } finally {
      setLoading(false);
    }
  };

  const setFilters = (newFilters: Partial<FilterOptions>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const refreshTasks = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would fetch from the API
      toast.success('Tasks refreshed!');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    tasks,
    filteredTasks,
    filters,
    pagination,
    loading,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    setPage,
    refreshTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};