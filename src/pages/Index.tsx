import React, { useState } from 'react';
import { Plus, BookOpen, Flame, Target, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import TaskFilter from '@/components/TaskFilter';
import EditTaskForm from '@/components/EditTaskForm';
import CelebrationEffect from '@/components/CelebrationEffect';
import { useTasks } from '@/hooks/useTasks';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  createdAt: string;
  subTasks: SubTask[];
}

interface MonthlyStats {
  month: string;
  completedTasks: number;
  goal: number;
  streak: number;
}

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [showCelebration, setShowCelebration] = useState(false);

  // Use API layer through custom hook
  const {
    tasks,
    stats,
    isLoadingTasks,
    isLoadingStats,
    addTask: addTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
    addSubTask: addSubTaskMutation,
    toggleSubTask: toggleSubTaskMutation,
    deleteSubTask: deleteSubTaskMutation,
    updateStreak: updateStreakMutation,
    isAddingTask,
    isUpdatingTask,
    isDeletingTask,
    isUpdatingSubTask,
  } = useTasks();

  // Handle task operations
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    addTaskMutation(taskData);
    setShowAddForm(false);
  };

  const handleEditTask = (taskId: string, updatedTask: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    updateTaskMutation({ taskId, taskData: updatedTask });
    setEditingTask(null);
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks?.find(t => t.id === taskId);
    const wasCompleted = task?.completed;
    
    updateTaskMutation({ 
      taskId, 
      taskData: { completed: !task?.completed } 
    });

    // Show celebration if task was just completed
    if (!wasCompleted) {
      setShowCelebration(true);
      // Update streak
      const currentStreak = stats?.currentStreak || 0;
      updateStreakMutation(currentStreak + 1);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation(taskId);
  };

  const handleAddSubTask = (taskId: string, subTaskTitle: string) => {
    addSubTaskMutation({ taskId, subTaskTitle });
  };

  const handleToggleSubTask = (taskId: string, subTaskId: string) => {
    toggleSubTaskMutation({ taskId, subTaskId });
  };

  const handleDeleteSubTask = (taskId: string, subTaskId: string) => {
    deleteSubTaskMutation({ taskId, subTaskId });
  };

  // Filter tasks
  const filteredTasks = (tasks || []).filter(task => {
    const statusMatch = filter === 'all' || 
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);
    
    const subjectMatch = subjectFilter === 'all' || task.subject === subjectFilter;
    
    return statusMatch && subjectMatch;
  });

  const subjects = [...new Set((tasks || []).map(task => task.subject))];
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {showCelebration && <CelebrationEffect />}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Student Task Mastery Board
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Organize your academic life and achieve your goals</p>
        </div>

        {/* Streak and Goal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-6 bg-gradient-to-r from-orange-100 to-red-100 border-0 shadow-lg">
            <div className="flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-600 mr-3" />
              <div className="text-center">
                {isLoadingStats ? (
                  <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-orange-600">{stats?.currentStreak || 0}</div>
                    <div className="text-gray-700">Current Streak</div>
                  </>
                )}
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-green-100 to-blue-100 border-0 shadow-lg">
            <div className="flex items-center justify-center">
              <Target className="w-8 h-8 text-green-600 mr-3" />
              <div className="text-center">
                {isLoadingStats ? (
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto" />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-green-600">{stats?.thisMonthCompleted || 0}/{stats?.monthlyGoal || 20}</div>
                    <div className="text-gray-700">{currentMonth} Goal</div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center">
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              ) : (
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stats?.totalTasks || 0}</div>
              )}
              <div className="text-gray-600">Total Tasks</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center">
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-2" />
              ) : (
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats?.pendingTasks || 0}</div>
              )}
              <div className="text-gray-600">Pending</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center">
              {isLoadingStats ? (
                <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
              ) : (
                <div className="text-3xl font-bold text-green-600 mb-2">{stats?.completedTasks || 0}</div>
              )}
              <div className="text-gray-600">Completed</div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </Button>
          
          <TaskFilter
            filter={filter}
            setFilter={setFilter}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            subjects={subjects}
          />
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddTaskForm
              onAddTask={handleAddTask}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Edit Task Form */}
        {editingTask && (
          <div className="mb-8">
            <EditTaskForm
              task={editingTask}
              onEditTask={(updatedTask) => handleEditTask(editingTask.id, updatedTask)}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {isLoadingTasks ? (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your tasks...</p>
            </Card>
          ) : filteredTasks.length === 0 ? (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {(tasks || []).length === 0 ? "No tasks yet" : "No tasks match your filters"}
              </h3>
              <p className="text-gray-500">
                {(tasks || []).length === 0 
                  ? "Add your first task to get started with your academic journey!"
                  : "Try adjusting your filters to see more tasks."
                }
              </p>
            </Card>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={setEditingTask}
                onAddSubTask={handleAddSubTask}
                onToggleSubTask={handleToggleSubTask}
                onDeleteSubTask={handleDeleteSubTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
