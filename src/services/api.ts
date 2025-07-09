import { Task, SubTask } from '@/pages/Index';

// Mock API base URL - using JSONPlaceholder for demonstration
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Types for API responses
interface ApiTask extends Omit<Task, 'subTasks'> {
  userId: number;
  subTasks: SubTask[];
}

interface StatsResponse {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  currentStreak: number;
  monthlyGoal: number;
  thisMonthCompleted: number;
}

class TaskAPI {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    try {
      // Since JSONPlaceholder doesn't have our task structure, 
      // we'll simulate it with local storage as fallback for demo
      const savedTasks = localStorage.getItem('studentTasks');
      if (savedTasks) {
        return JSON.parse(savedTasks);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  // Get dashboard stats
  async getStats(): Promise<StatsResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const tasks = await this.getTasks();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthCompleted = tasks.filter(task => {
        const createdDate = new Date(task.createdAt);
        return task.completed && 
               createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      }).length;

      const savedGoal = localStorage.getItem('monthlyGoal');
      const savedStreak = localStorage.getItem('currentStreak');

      return {
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => !task.completed).length,
        completedTasks: tasks.filter(task => task.completed).length,
        currentStreak: savedStreak ? parseInt(savedStreak) : 0,
        monthlyGoal: savedGoal ? parseInt(savedGoal) : 20,
        thisMonthCompleted
      };
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw new Error('Failed to fetch stats');
    }
  }

  // Add new task
  async addTask(taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>): Promise<Task> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      // Update local storage to simulate persistence
      const tasks = await this.getTasks();
      const updatedTasks = [newTask, ...tasks];
      localStorage.setItem('studentTasks', JSON.stringify(updatedTasks));

      return newTask;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw new Error('Failed to add task');
    }
  }

  // Update task
  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      );
      
      localStorage.setItem('studentTasks', JSON.stringify(updatedTasks));
      
      const updatedTask = updatedTasks.find(task => task.id === taskId);
      if (!updatedTask) {
        throw new Error('Task not found');
      }
      
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw new Error('Failed to update task');
    }
  }

  // Delete task
  async deleteTask(taskId: string): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const tasks = await this.getTasks();
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('studentTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw new Error('Failed to delete task');
    }
  }

  // Add subtask
  async addSubTask(taskId: string, subTaskTitle: string): Promise<SubTask> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newSubTask: SubTask = {
        id: Date.now().toString(),
        title: subTaskTitle,
        completed: false,
      };

      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, subTasks: [...task.subTasks, newSubTask] }
          : task
      );
      
      localStorage.setItem('studentTasks', JSON.stringify(updatedTasks));
      return newSubTask;
    } catch (error) {
      console.error('Failed to add subtask:', error);
      throw new Error('Failed to add subtask');
    }
  }

  // Toggle subtask
  async toggleSubTask(taskId: string, subTaskId: string): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task => 
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
      );
      
      localStorage.setItem('studentTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
      throw new Error('Failed to toggle subtask');
    }
  }

  // Delete subtask
  async deleteSubTask(taskId: string, subTaskId: string): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId) }
          : task
      );
      
      localStorage.setItem('studentTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      throw new Error('Failed to delete subtask');
    }
  }

  // Update streak
  async updateStreak(newStreak: number): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      localStorage.setItem('currentStreak', newStreak.toString());
    } catch (error) {
      console.error('Failed to update streak:', error);
      throw new Error('Failed to update streak');
    }
  }
}

export const taskAPI = new TaskAPI();
export type { StatsResponse };