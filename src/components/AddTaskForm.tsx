import { useState, FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Priority } from '../types';

interface AddTaskFormProps {
  onAdd: (task: { name: string; subject: string; deadline: string; priority: Priority }) => void;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('Low');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !deadline) return;
    onAdd({ name, subject, deadline, priority });
    setName('');
    setSubject('');
    setDeadline('');
    setPriority('Low');
  };

  return (
    <section id="add-task-form" className="glass-panel p-6 rounded-xl scroll-mt-24">
      <h3 className="text-xl font-semibold mb-4">Quick Add Task</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">TASK NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prepare biology presentation..."
            className="w-full bg-surface-container-low border-none rounded-lg p-3 focus:ring-2 focus:ring-primary transition-all outline-none"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">SUBJECT</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-lg p-3 ring-0 outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
              required
            >
              <option value="" disabled>Select</option>
              <option value="History">History</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Literature">Literature</option>
              <option value="Art">Art</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">PRIORITY</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-surface-container-low border-none rounded-lg p-3 ring-0 outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">DEADLINE</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg p-3 ring-0 outline-none focus:ring-2 focus:ring-primary transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle size={20} />
          Add to Tracker
        </button>
      </form>
    </section>
  );
}
