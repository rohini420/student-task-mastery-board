
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Task, SubTask } from '@/pages/Index';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });

  const [subTasks, setSubTasks] = useState<Omit<SubTask, 'id'>[]>([]);
  const [newSubTask, setNewSubTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim() || !formData.dueDate) {
      return;
    }
    
    onAddTask({ 
      ...formData, 
      subTasks: subTasks.map(subTask => ({
        ...subTask,
        id: Date.now().toString() + Math.random().toString()
      }))
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      subject: '',
      priority: 'medium',
      dueDate: '',
    });
    setSubTasks([]);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks(prev => [...prev, { title: newSubTask.trim(), completed: false }]);
      setNewSubTask('');
    }
  };

  const removeSubTask = (index: number) => {
    setSubTasks(prev => prev.filter((_, i) => i !== index));
  };

  const updateSubTask = (index: number, newTitle: string) => {
    setSubTasks(prev => prev.map((subTask, i) => 
      i === index ? { ...subTask, title: newTitle } : subTask
    ));
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Task Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Complete Math Assignment"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject/Course *
            </Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="e.g., Mathematics, Physics, English"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Additional details about the task..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Priority
            </Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => handleChange('priority', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Due Date *
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="mt-1"
              required
            />
          </div>
        </div>

        {/* Subtasks Section */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Subtasks
          </Label>
          
          {/* Add Subtask Input */}
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              value={newSubTask}
              onChange={(e) => setNewSubTask(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubTask())}
            />
            <Button type="button" onClick={addSubTask} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Subtasks List */}
          {subTasks.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {subTasks.map((subTask, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Input
                    type="text"
                    value={subTask.title}
                    onChange={(e) => updateSubTask(index, e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubTask(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            Add Task
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddTaskForm;
