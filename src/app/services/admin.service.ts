import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminSession, DashboardStats } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // อย่าลืมใช้ IP 127.0.0.1 เพื่อความเร็ว
  private apiUrl = 'http://127.0.0.1:8080/api/admin';

  constructor(private http: HttpClient) {}

  // ดึงข้อมูลกราฟสถิติ
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }

  // ดึงรายชื่อคนทำแบบทดสอบทั้งหมด
  getSessions(): Observable<AdminSession[]> {
    return this.http.get<AdminSession[]>(`${this.apiUrl}/sessions`);
  }
}