import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { StudentProfile } from '../../models/survey.model';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden">
      
      <div class="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.gif')] opacity-20 pointer-events-none"></div>
      <div class="absolute w-96 h-96 bg-cyber-primary blur-[150px] opacity-20 -top-20 -left-20 animate-pulse"></div>
      <div class="absolute w-96 h-96 bg-cyber-secondary blur-[150px] opacity-20 -bottom-20 -right-20 animate-pulse"></div>

      <div class="bg-gray-900/80 border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg backdrop-blur-xl relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 tracking-wider glitch-text">
            IDENTIFY YOURSELF
          </h1>
          <p class="text-cyber-primary text-sm uppercase tracking-[0.3em] animate-pulse">
            System Access Required
          </p>
        </div>

        <form (ngSubmit)="onSubmit(infoForm)" #infoForm="ngForm" class="space-y-5">
          
          <div class="space-y-2">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">Full Name</label>
            <input type="text" [(ngModel)]="data.fullName" name="fullName" required 
              class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all" 
              placeholder="กรอกชื่อ-นามสกุลของคุณ">
          </div>

          <div class="space-y-2">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">Gender</label>
            <div class="flex gap-4">
              <button type="button" (click)="data.gender = 'male'"
                class="flex-1 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="{
                  'bg-cyber-primary text-black border-cyber-primary shadow-[0_0_15px_rgba(0,243,255,0.4)] font-bold': data.gender === 'male',
                  'bg-black/40 border-white/20 text-gray-400 hover:border-white/50 hover:text-white': data.gender !== 'male'
                }">
                ชาย
              </button>
              <button type="button" (click)="data.gender = 'female'"
                class="flex-1 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="{
                  'bg-cyber-secondary text-white border-cyber-secondary shadow-[0_0_15px_rgba(188,19,254,0.4)] font-bold': data.gender === 'female',
                  'bg-black/40 border-white/20 text-gray-400 hover:border-white/50 hover:text-white': data.gender !== 'female'
                }">
                หญิง
              </button>
              <button type="button" (click)="data.gender = 'other'"
                class="flex-1 py-3 rounded-lg border transition-all duration-300 font-medium tracking-wide"
                [ngClass]="{
                  'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] font-bold': data.gender === 'other',
                  'bg-black/40 border-white/20 text-gray-400 hover:border-white/50 hover:text-white': data.gender !== 'other'
                }">
                อื่นๆ
              </button>
            </div>
            <input type="text" [(ngModel)]="data.gender" name="gender" required hidden>
          </div>

          <div class="grid grid-cols-2 gap-4">
             <div class="space-y-2">
                <label class="text-cyber-primary text-sm uppercase tracking-wider">Age</label>
                <input type="number" [(ngModel)]="data.age" name="age" required min="10" max="99"
                       class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all" placeholder="อายุ">
             </div>

             <div class="space-y-2">
                <label class="text-cyber-primary text-sm uppercase tracking-wider">Province</label>
                <select [(ngModel)]="data.province" name="province" required 
                        class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all appearance-none">
                  <option value="" disabled selected>เลือกจังหวัด</option>
                  <option *ngFor="let p of provinces" [value]="p.name">{{ p.name }}</option>
                  <option *ngIf="provinces.length === 0" value="Bangkok">กรุงเทพมหานคร</option>
                  <option *ngIf="provinces.length === 0" value="Chiang Mai">เชียงใหม่</option>
                </select>
             </div>
          </div>

          <div class="space-y-2 relative">
            <label class="text-cyber-primary text-sm uppercase tracking-wider">School</label>
            <input type="text" 
                   name="school"
                   [value]="data.school"
                   (input)="onSchoolInput($event)"
                   autocomplete="off"
                   required
                   class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all"
                   placeholder="พิมพ์ชื่อโรงเรียน (เช่น ยุพราช...)">

            <div *ngIf="showSchoolList && filteredSchools.length > 0" 
                 class="absolute z-50 w-full mt-1 bg-gray-900 border border-cyber-primary rounded-lg shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
              <div *ngFor="let school of filteredSchools"
                   (click)="selectSchool(school.name)"
                   class="px-4 py-3 text-white hover:bg-cyber-primary hover:text-black cursor-pointer transition-colors border-b border-white/10 last:border-0">
                {{ school.name }}
              </div>
            </div>
            <input type="text" [(ngModel)]="data.school" name="school_valid" required hidden>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-cyber-primary text-sm uppercase tracking-wider">Level</label>
              <select [(ngModel)]="data.levelEducation" name="levelEducation" required 
                class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all appearance-none">
                <option value="" disabled selected>ระดับชั้น</option>
                <option value="m4">ม.4</option>
                <option value="m5">ม.5</option>
                <option value="m6">ม.6</option>
                <option value="voc">ปวช.</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-cyber-primary text-sm uppercase tracking-wider">Program</label>
              <select [(ngModel)]="data.studyProgram" name="studyProgram" required 
                      class="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-cyber-primary focus:outline-none transition-all appearance-none">
                <option value="" disabled selected>สายการเรียน</option>
                <option value="sci-math">วิทย์-คณิต</option>
                <option value="arts-math">ศิลป์-คำนวณ</option>
                <option value="arts-lang">ศิลป์-ภาษา</option>
                <option value="vocational">สายอาชีพ</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
          </div>

          <button type="submit" [disabled]="!infoForm.form.valid"
            class="w-full mt-8 bg-gradient-to-r from-cyber-primary to-cyber-secondary text-white font-bold py-4 rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none tracking-widest text-lg">
            INITIATE SCAN
          </button>

        </form>
      </div>
    </div>
  `
})
export class StudentInfoComponent implements OnInit {
  data: StudentProfile = { 
    fullName: '', 
    school: '', 
    levelEducation: '', 
    gender: '',
    province: '', 
    age: undefined, 
    studyProgram: ''
  };

  provinces: any[] = [];
  filteredSchools: any[] = [];
  showSchoolList = false;

  constructor(private router: Router, private surveyService: SurveyService) {}

  ngOnInit() {
    // โหลดจังหวัด (ถ้า Backend เสร็จแล้วจะดึงได้ ถ้ายังไม่เสร็จมันจะเงียบๆ ไป)
    this.surveyService.getProvinces().subscribe({
        next: (res) => this.provinces = res,
        error: () => console.log('Backend province API not ready yet')
    });
  }

  onSchoolInput(event: any) {
    const query = event.target.value;
    this.data.school = query; // เก็บค่าที่พิมพ์เผื่อไว้

    if (query.length >= 2) {
      this.surveyService.searchSchools(query).subscribe({
        next: (res) => {
          this.filteredSchools = res;
          this.showSchoolList = true;
        },
        error: () => {
             // Mock data สำหรับเทสถ้า Backend ยังไม่พร้อม
             const mockSchools = [
                 { name: 'โรงเรียนยุพราชวิทยาลัย' },
                 { name: 'โรงเรียนเตรียมอุดมศึกษา' },
                 { name: 'โรงเรียนสวนกุหลาบวิทยาลัย' }
             ];
             this.filteredSchools = mockSchools.filter(s => s.name.includes(query));
             this.showSchoolList = true;
        }
      });
    } else {
      this.showSchoolList = false;
    }
  }

  selectSchool(schoolName: string) {
    this.data.school = schoolName;
    this.showSchoolList = false;
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.surveyService.saveProfile(this.data);
      this.router.navigate(['/survey']);
    }
  }
}