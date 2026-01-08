import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-20 pointer-events-none"></div>
      <div class="absolute w-96 h-96 bg-cyber-primary blur-[150px] opacity-20 -top-20 -left-20"></div>
      <div class="absolute w-96 h-96 bg-cyber-secondary blur-[150px] opacity-20 -bottom-20 -right-20"></div>

      <div class="bg-gray-900/80 border border-white/10 p-8 rounded-2xl w-full max-w-md backdrop-blur-xl relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2 tracking-wider">SYSTEM ACCESS</h1>
          <p class="text-cyber-primary text-sm uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>

        <form (ngSubmit)="onLogin()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-gray-400 text-xs uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username"
              class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
              placeholder="Enter admin ID"
              required
            >
          </div>

          <div class="space-y-2">
            <label class="text-gray-400 text-xs uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-secondary focus:outline-none focus:shadow-[0_0_15px_rgba(188,19,254,0.3)] transition-all"
              placeholder="Enter security code"
              required
            >
          </div>

          <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM' }}
          </button>
        </form>

      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) return;

    this.loading = true;
    this.errorMessage = '';

    // ยิง API ไปที่ Backend
    const body = { username: this.username, password: this.password };
    
    // อย่าลืมแก้ IP ตรงนี้ให้เป็น 127.0.0.1 เหมือน SurveyService นะครับ
    this.http.post('http://127.0.0.1:8080/api/auth/login', body).subscribe({
      next: (res: any) => {
        console.log('Login Success:', res);
        // บันทึกสถานะว่า Login แล้ว (แบบง่าย)
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminUser', JSON.stringify(res));
        
        // ไปหน้า Dashboard (ที่เราจะสร้างต่อไป)
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Login Failed:', err);
        this.errorMessage = 'Access Denied: Invalid credentials';
        this.loading = false;
      }
    });
  }
}