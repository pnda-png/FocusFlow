export type Priority = 'Low' | 'Medium' | 'High';

export interface UserProfile {
  name: string;
  year: string;
  school: string;
  avatar?: string;
  theme: 'light' | 'dark';
  privacy: {
    marketingEmails: boolean;
    dataAnalytics: boolean;
    publicProfile: boolean;
  };
}

export interface Homework {
  id: string;
  name: string;
  subject: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface ScheduleItem {
  id: string;
  activity: string;
  subject: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  color?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Exam' | 'Study Group' | 'Extracurricular' | 'Personal';
  startTime?: string;
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}
