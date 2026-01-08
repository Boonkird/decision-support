import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SurveyResult } from '../../models/survey.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div *ngIf="bestMatch" class="text-center slide-in w-full max-w-4xl">
        <h2 class="text-cyber-primary text-lg uppercase tracking-[0.3em] mb-4">
          Analysis Complete
        </h2>

        <div
          class="bg-gradient-to-br from-cyber-secondary/20 to-blue-900/20 border border-cyber-secondary p-8 rounded-3xl mb-12 relative overflow-hidden group hover:bg-cyber-secondary/10 transition-all cursor-default"
        >
          <div
            class="absolute -right-10 -top-10 w-40 h-40 bg-cyber-secondary blur-[80px] opacity-40"
          ></div>

          <h1 class="text-5xl md:text-7xl font-bold text-white mb-4 relative z-10">
            {{ bestMatch.trackCode }}
          </h1>
          
          <h3 class="text-2xl text-cyber-primary mb-6">{{ bestMatch.trackName }}</h3>
          
          <div
            class="mt-8 inline-block bg-cyber-secondary text-white font-bold py-2 px-6 rounded-full shadow-[0_0_15px_#bc13fe]"
          >
            Match {{ bestMatch.percentage | number : '1.0-0' }}%
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div
            *ngFor="let res of allResults; let i = index"
            class="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center gap-4 hover:border-white/30 transition-all"
            [ngClass]="{ 'opacity-50': i > 0 }"
          >
            <div class="text-2xl font-bold text-gray-500 w-8">#{{ i + 1 }}</div>

            <div class="flex-1">
              <div class="flex justify-between mb-2">
                <span class="font-bold text-white">{{ res.trackName }}</span>
                <span class="text-cyber-primary">{{ res.percentage | number : '1.0-0' }}%</span>
              </div>
              <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  [style.width.%]="res.percentage"
                  [ngClass]="i === 0 ? 'bg-cyber-secondary' : 'bg-cyber-primary'"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 flex gap-4 justify-center">
          <button
            (click)="restart()"
            class="px-8 py-3 border border-white/30 text-white rounded-lg hover:bg-white hover:text-black transition-all"
          >
            Restart System
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ResultComponent implements OnInit {
  allResults: SurveyResult[] = [];
  bestMatch: SurveyResult | undefined;

  constructor(private router: Router) {
    // รับข้อมูลจากหน้า Survey
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.allResults = nav.extras.state['results'];
    }
  }

  ngOnInit() {
    // ถ้าไม่มีข้อมูล (เช่น refresh หน้า) ให้ดีดกลับไปหน้าแรก
    if (!this.allResults || this.allResults.length === 0) {
      this.router.navigate(['/']);
      return;
    }
    this.bestMatch = this.allResults[0];
  }

  restart() {
    this.router.navigate(['/']);
  }
}