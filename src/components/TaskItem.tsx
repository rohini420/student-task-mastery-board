
import React from 'react';
import { CheckCircle2, Circle, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/pages/Index';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isPriorityHigh = task.priority === 'high';
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <Card className={`p-6 transition-all duration-200 hover:shadow-lg border-0 ${
      task.completed 
        ? 'bg-gray-50/80 backdrop-blur-sm' 
        : 'bg-white/80 backdrop-blur-sm'
    } ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-1 transition-colors duration-200"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
            <div>
              <h3 className={`text-lg font-semibold transition-all duration-200 ${
                task.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {task.subject}
              </Badge>
              <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                {isOverdue && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;
