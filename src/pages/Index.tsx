
import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Flame, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import TaskFilter from '@/components/TaskFilter';
import EditTaskForm from '@/components/EditTaskForm';
import CelebrationEffect from '@/components/CelebrationEffect';
import { useToast } from '@/hooks/use-toast';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState(20);
  const [currentStreak, setCurrentStreak] = useState(0);
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('studentTasks');
    const savedGoal = localStorage.getItem('monthlyGoal');
    const savedStreak = localStorage.getItem('currentStreak');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedGoal) {
      setMonthlyGoal(parseInt(savedGoal));
    }
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('studentTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Calculate monthly stats
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const thisMonthCompletedTasks = tasks.filter(task => {
    const completedDate = new Date(task.createdAt);
    const currentDate = new Date();
    return task.completed && 
           completedDate.getMonth() === currentDate.getMonth() && 
           completedDate.getFullYear() === currentDate.getFullYear();
  }).length;

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'subTasks'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      subTasks: [],
    };
    setTasks(prev => [newTask, ...prev]);
    setShowAddForm(false);
    toast({
      title: "Task added successfully!",
      description: `${taskData.title} has been added to your task list.`,
    });
  };

  const editTask = (taskId: string, updatedTask: Omit<Task, 'id' | 'completed' | 'createdAt' | 'subTasks'>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updatedTask }
          : task
      )
    );
    setEditingTask(null);
    toast({
      title: "Task updated successfully!",
      description: `${updatedTask.title} has been updated.`,
    });
  };

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const wasCompleted = task?.completed;
    
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );

    // Show celebration if task was just completed
    if (!wasCompleted) {
      setShowCelebration(true);
      // Update streak
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        localStorage.setItem('currentStreak', newStreak.toString());
        return newStreak;
      });
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const addSubTask = (taskId: string, subTaskTitle: string) => {
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: subTaskTitle,
      completed: false,
    };
    
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, subTasks: [...task.subTasks, newSubTask] }
          : task
      )
    );
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              subTasks: task.subTasks.map(subTask =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              )
            }
          : task
      )
    );
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId) }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || 
      (filter === 'pending' && !task.completed) ||
      (filter === 'completed' && task.completed);
    
    const subjectMatch = subjectFilter === 'all' || task.subject === subjectFilter;
    
    return statusMatch && subjectMatch;
  });

  const subjects = [...new Set(tasks.map(task => task.subject))];
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;

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
                <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
                <div className="text-gray-700">Current Streak</div>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-green-100 to-blue-100 border-0 shadow-lg">
            <div className="flex items-center justify-center">
              <Target className="w-8 h-8 text-green-600 mr-3" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{thisMonthCompletedTasks}/{monthlyGoal}</div>
                <div className="text-gray-700">{currentMonth} Goal</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{tasks.length}</div>
              <div className="text-gray-600">Total Tasks</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{pendingCount}</div>
              <div className="text-gray-600">Pending</div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completedCount}</div>
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
              onAddTask={addTask}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Edit Task Form */}
        {editingTask && (
          <div className="mb-8">
            <EditTaskForm
              task={editingTask}
              onEditTask={(updatedTask) => editTask(editingTask.id, updatedTask)}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"}
              </h3>
              <p className="text-gray-500">
                {tasks.length === 0 
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
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={setEditingTask}
                onAddSubTask={addSubTask}
                onToggleSubTask={toggleSubTask}
                onDeleteSubTask={deleteSubTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
