export interface DashboardStats {
  totalStudents: number;
  trackDistribution: { [key: string]: number }; // เช่น { "CS": 5, "IT": 2 }
}

export interface AdminSession {
  sessionId: number;
  createdAt: string;
  studentName: string;
  school: string;
  topTrack: string;
  topScorePercent: number;
}