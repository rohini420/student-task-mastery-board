import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI, StatsResponse } from '@/services/api';
import { Task, SubTask } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const QUERY_KEYS = {
  TASKS: ['tasks'],
  STATS: ['stats'],
} as const;

// Custom hook for tasks
export const useTasks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all tasks
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    error: tasksError
  } = useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: taskAPI.getTasks,
  });

  // Get stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: taskAPI.getStats,
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: taskAPI.addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      toast({
        title: "Task added successfully!",
        description: "Your new task has been added to the list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }: { taskId: string; taskData: Partial<Task> }) =>
      taskAPI.updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      toast({
        title: "Task updated successfully!",
        description: "Your task has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: taskAPI.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add subtask mutation
  const addSubTaskMutation = useMutation({
    mutationFn: ({ taskId, subTaskTitle }: { taskId: string; subTaskTitle: string }) =>
      taskAPI.addSubTask(taskId, subTaskTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add subtask. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Toggle subtask mutation
  const toggleSubTaskMutation = useMutation({
    mutationFn: ({ taskId, subTaskId }: { taskId: string; subTaskId: string }) =>
      taskAPI.toggleSubTask(taskId, subTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subtask. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete subtask mutation
  const deleteSubTaskMutation = useMutation({
    mutationFn: ({ taskId, subTaskId }: { taskId: string; subTaskId: string }) =>
      taskAPI.deleteSubTask(taskId, subTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete subtask. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update streak mutation
  const updateStreakMutation = useMutation({
    mutationFn: taskAPI.updateStreak,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update streak. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    tasks,
    stats,
    
    // Loading states
    isLoadingTasks,
    isLoadingStats,
    
    // Error states
    tasksError,
    statsError,
    
    // Mutations
    addTask: addTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    addSubTask: addSubTaskMutation.mutate,
    toggleSubTask: toggleSubTaskMutation.mutate,
    deleteSubTask: deleteSubTaskMutation.mutate,
    updateStreak: updateStreakMutation.mutate,
    
    // Loading states for mutations
    isAddingTask: addTaskMutation.isPending,
    isUpdatingTask: updateTaskMutation.isPending,
    isDeletingTask: deleteTaskMutation.isPending,
    isUpdatingSubTask: toggleSubTaskMutation.isPending || deleteSubTaskMutation.isPending,
  };
};