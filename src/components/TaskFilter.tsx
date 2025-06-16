
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface TaskFilterProps {
  filter: 'all' | 'pending' | 'completed';
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  subjectFilter: string;
  setSubjectFilter: (subject: string) => void;
  subjects: string[];
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  filter,
  setFilter,
  subjectFilter,
  setSubjectFilter,
  subjects
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
          className={filter === 'all' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
          className={filter === 'pending' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
          size="sm"
          className={filter === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Completed
        </Button>
      </div>

      {subjects.length > 0 && (
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default TaskFilter;
