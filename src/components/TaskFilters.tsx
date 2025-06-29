import React from 'react';
import { Search, Filter, X, Calendar, Flag, CheckCircle, Sparkles } from 'lucide-react';
import { useTask } from '../contexts/TaskContext';

export const TaskFilters: React.FC = () => {
  const { filters, setFilters } = useTask();

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-warning-500', icon: CheckCircle },
    { value: 'in-progress', label: 'In Progress', color: 'bg-primary-500', icon: Sparkles },
    { value: 'completed', label: 'Completed', color: 'bg-success-500', icon: CheckCircle },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-500' },
    { value: 'medium', label: 'Medium', color: 'bg-warning-500' },
    { value: 'high', label: 'High', color: 'bg-error-500' },
  ];

  const dueDateOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'today', label: 'Due Today' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
  ];

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.dueDate !== 'all' || 
    filters.search.length > 0;

  const clearAllFilters = () => {
    setFilters({
      status: [],
      priority: [],
      dueDate: 'all',
      assignedTo: '',
      search: '',
    });
  };

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    setFilters({ status: newStatus });
  };

  const togglePriority = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    setFilters({ priority: newPriority });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Smart Filters</h3>
              <p className="text-sm text-gray-500">Refine your task view</p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search tasks, descriptions, or tags..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <label className="font-medium text-gray-900">Status</label>
            </div>
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = filters.status.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleStatus(option.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary-50 border-2 border-primary-200 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${option.color} ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-primary-50' : ''}`} />
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-5 h-5 text-gray-600" />
              <label className="font-medium text-gray-900">Priority</label>
            </div>
            <div className="space-y-2">
              {priorityOptions.map((option) => {
                const isSelected = filters.priority.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => togglePriority(option.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary-50 border-2 border-primary-200 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${option.color} ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-primary-50' : ''}`} />
                    <Flag className={`w-4 h-4 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <label className="font-medium text-gray-900">Due Date</label>
            </div>
            <div className="space-y-2">
              {dueDateOptions.map((option) => {
                const isSelected = filters.dueDate === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilters({ dueDate: option.value as any })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary-50 border-2 border-primary-200 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <Calendar className={`w-4 h-4 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-900">Active Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.status.map((status) => (
                <span key={status} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                  {status.replace('-', ' ')}
                  <button onClick={() => toggleStatus(status)} className="hover:text-primary-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.priority.map((priority) => (
                <span key={priority} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-800 text-xs font-medium rounded-full">
                  {priority}
                  <button onClick={() => togglePriority(priority)} className="hover:text-secondary-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.dueDate !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-800 text-xs font-medium rounded-full">
                  {dueDateOptions.find(opt => opt.value === filters.dueDate)?.label}
                  <button onClick={() => setFilters({ dueDate: 'all' })} className="hover:text-accent-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};