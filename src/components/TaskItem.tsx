import React, { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { 
  Calendar, 
  Users, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Share, 
  Clock,
  CheckCircle,
  Circle,
  PlayCircle,
  Flag,
  Tag,
  Sparkles
} from 'lucide-react';
import { Task } from '../types';
import { useTask } from '../contexts/TaskContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onShare: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onShare }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { updateTask, deleteTask } = useTask();

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'bg-error-500', textColor: 'text-error-700', bgColor: 'bg-error-50', borderColor: 'border-error-200' };
      case 'medium':
        return { color: 'bg-warning-500', textColor: 'text-warning-700', bgColor: 'bg-warning-50', borderColor: 'border-warning-200' };
      case 'low':
        return { color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
      default:
        return { color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          color: 'bg-success-500', 
          textColor: 'text-success-700', 
          bgColor: 'bg-success-50', 
          borderColor: 'border-success-200',
          icon: CheckCircle,
          iconColor: 'text-success-500'
        };
      case 'in-progress':
        return { 
          color: 'bg-primary-500', 
          textColor: 'text-primary-700', 
          bgColor: 'bg-primary-50', 
          borderColor: 'border-primary-200',
          icon: PlayCircle,
          iconColor: 'text-primary-500'
        };
      case 'pending':
        return { 
          color: 'bg-warning-500', 
          textColor: 'text-warning-700', 
          bgColor: 'bg-warning-50', 
          borderColor: 'border-warning-200',
          icon: Circle,
          iconColor: 'text-gray-400'
        };
      default:
        return { 
          color: 'bg-gray-500', 
          textColor: 'text-gray-700', 
          bgColor: 'bg-gray-50', 
          borderColor: 'border-gray-200',
          icon: Circle,
          iconColor: 'text-gray-400'
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  const isOverdue = isPast(task.dueDate) && task.status !== 'completed';
  const isDueToday = isToday(task.dueDate);

  const handleStatusChange = async (newStatus: Task['status']) => {
    await updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
  };

  return (
    <div className={`group bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      task.status === 'completed' ? 'border-success-200 bg-success-50/30' : 
      isOverdue ? 'border-error-200 bg-error-50/30' : 
      isDueToday ? 'border-warning-200 bg-warning-50/30' : 
      'border-gray-200 hover:border-primary-200'
    }`}>
      {/* Priority Indicator */}
      <div className={`h-1 w-full rounded-t-2xl ${priorityConfig.color}`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={() => {
                const nextStatus = task.status === 'pending' ? 'in-progress' : 
                               task.status === 'in-progress' ? 'completed' : 'pending';
                handleStatusChange(nextStatus);
              }}
              className="mt-1 hover:scale-110 transition-transform duration-200"
            >
              <StatusIcon className={`w-6 h-6 ${statusConfig.iconColor}`} />
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-xl mb-2 transition-all duration-200 ${
                task.status === 'completed' 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900 group-hover:text-primary-600'
              }`}>
                {task.title}
              </h3>
              <p className="text-gray-600 leading-relaxed line-clamp-2">
                {task.description}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-10 min-w-[180px] animate-slide-in">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    onShare(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                >
                  <Share className="w-4 h-4" />
                  Share Task
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-error-50 flex items-center gap-3 text-error-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
              {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${priorityConfig.bgColor} ${priorityConfig.borderColor}`}>
            <Flag className={`w-3 h-3 ${priorityConfig.textColor}`} />
            <span className={`text-sm font-medium ${priorityConfig.textColor}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-sm rounded-full border border-primary-200"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${
              isOverdue ? 'text-error-600 font-medium' : 
              isDueToday ? 'text-warning-600 font-medium' : 
              'text-gray-500'
            }`}>
              <Calendar className="w-4 h-4" />
              <span>
                {format(task.dueDate, 'MMM d, yyyy')}
                {isOverdue && ' (Overdue)'}
                {isDueToday && ' (Today)'}
              </span>
            </div>
            
            {task.sharedWith.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{task.sharedWith.length} shared</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Updated {format(task.updatedAt, 'MMM d')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};