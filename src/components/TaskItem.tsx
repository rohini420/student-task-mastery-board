
import React, { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Calendar, AlertCircle, Edit, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Task, SubTask } from '@/pages/Index';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onAddSubTask: (taskId: string, subTaskTitle: string) => void;
  onToggleSubTask: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask: (taskId: string, subTaskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onEdit,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask
}) => {
  const [showSubTaskForm, setShowSubTaskForm] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isPriorityHigh = task.priority === 'high';
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const completedSubTasks = task.subTasks.filter(subTask => subTask.completed).length;
  const totalSubTasks = task.subTasks.length;

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTaskTitle.trim()) {
      onAddSubTask(task.id, newSubTaskTitle.trim());
      setNewSubTaskTitle('');
      setShowSubTaskForm(false);
    }
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
              {totalSubTasks > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    Subtasks: {completedSubTasks}/{totalSubTasks} completed
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
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

          {/* Sub Tasks */}
          {task.subTasks.length > 0 && (
            <div className="mb-4 space-y-2">
              {task.subTasks.map(subTask => (
                <div key={subTask.id} className="flex items-center gap-2 ml-4 p-2 bg-gray-50 rounded">
                  <button
                    onClick={() => onToggleSubTask(task.id, subTask.id)}
                    className="transition-colors duration-200"
                  >
                    {subTask.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 hover:text-indigo-600" />
                    )}
                  </button>
                  <span className={`text-sm flex-1 ${
                    subTask.completed ? 'line-through text-gray-500' : 'text-gray-700'
                  }`}>
                    {subTask.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteSubTask(task.id, subTask.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Sub Task Form */}
          {showSubTaskForm && (
            <form onSubmit={handleAddSubTask} className="mb-4 ml-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newSubTaskTitle}
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  placeholder="Enter subtask..."
                  className="text-sm"
                  autoFocus
                />
                <Button type="submit" size="sm">Add</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowSubTaskForm(false);
                    setNewSubTaskTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

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

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubTaskForm(true)}
                className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
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
      </div>
    </Card>
  );
};

export default TaskItem;
