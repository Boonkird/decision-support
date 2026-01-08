import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminSession, DashboardStats } from '../../../models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-cyber-bg p-6 md:p-8">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-wider">ADMIN COMMAND CENTER</h1>
          <p class="text-cyber-primary text-sm uppercase tracking-[0.2em]">System Status: Online</p>
        </div>
        <button (click)="logout()" class="px-6 py-2 border border-red-500/50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all">
          LOGOUT
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <div class="bg-gray-900/80 border border-white/10 p-6 rounded-xl backdrop-blur-sm relative overflow-hidden group hover:border-cyber-primary/50 transition-all">
          <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-cyber-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 class="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Students</h3>
          <div class="text-5xl font-bold text-white">{{ stats?.totalStudents || 0 }}</div>
          <div class="mt-4 text-xs text-cyber-primary">Active records in database</div>
        </div>

        <div class="bg-gray-900/80 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
          <h3 class="text-gray-400 text-sm uppercase tracking-wider mb-4">Track Popularity</h3>
          
          <div class="space-y-4">
            <div *ngFor="let item of getTrackStats()" class="relative">
              <div class="flex justify-between text-xs mb-1">
                <span class="font-bold text-white">{{ item.key }}</span>
                <span class="text-cyber-secondary">{{ item.value }} คน</span>
              </div>
              <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary transition-all duration-1000"
                     [style.width.%]="(item.value / (stats?.totalStudents || 1)) * 100">
                </div>
              </div>
            </div>
            <div *ngIf="getTrackStats().length === 0" class="text-gray-500 text-center py-4">
              No data available
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-900/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
        <div class="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 class="text-white font-bold tracking-wider">RECENT SUBMISSIONS</h3>
          <button (click)="loadData()" class="text-xs text-cyber-primary hover:text-white transition-colors flex items-center gap-1">
            <span [class.animate-spin]="loading">↻</span> REFRESH DATA
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th class="px-6 py-4 font-medium">Date/Time</th>
                <th class="px-6 py-4 font-medium">Student Name</th>
                <th class="px-6 py-4 font-medium">School</th>
                <th class="px-6 py-4 font-medium text-center">Result</th>
                <th class="px-6 py-4 font-medium text-center">Score</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let session of sessions" class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 text-gray-300 whitespace-nowrap">
                  {{ session.createdAt | date:'short' }}
                </td>
                <td class="px-6 py-4 text-white font-medium">{{ session.studentName }}</td>
                <td class="px-6 py-4 text-gray-400">{{ session.school }}</td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-block px-3 py-1 bg-cyber-primary/20 text-cyber-primary rounded text-xs font-bold border border-cyber-primary/30">
                    {{ session.topTrack }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center text-white">
                  {{ session.topScorePercent | number:'1.0-0' }}%
                </td>
              </tr>
              <tr *ngIf="sessions.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  sessions: AdminSession[] = [];
  loading = false;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.checkAuth();
    this.loadData();
  }

  checkAuth() {
    // เช็คว่าล็อกอินหรือยัง (ถ้าไม่มี Token ดีดกลับหน้า Login)
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      this.router.navigate(['/admin/login']);
    }
  }

  loadData() {
    this.loading = true;
    
    // โหลด Stats
    this.adminService.getDashboardStats().subscribe({
      next: (res) => this.stats = res,
      error: (err) => console.error('Stats error:', err)
    });

    // โหลด List รายชื่อ
    this.adminService.getSessions().subscribe({
      next: (res) => {
        // เรียงลำดับเอาล่าสุดขึ้นก่อน
        this.sessions = res.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Sessions error:', err);
        this.loading = false;
      }
    });
  }

  getTrackStats() {
    if (!this.stats?.trackDistribution) return [];
    return Object.entries(this.stats.trackDistribution).map(([key, value]) => ({ key, value }));
  }

  logout() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    this.router.navigate(['/admin/login']);
  }
}