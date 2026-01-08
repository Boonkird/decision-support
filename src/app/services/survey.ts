import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from './survey.service';
import { Question, AnswerRequest } from '../models/survey.model';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col p-4 md:p-8 relative bg-cyber-bg overflow-hidden">
      <div
        *ngIf="loading"
        class="absolute inset-0 flex flex-col items-center justify-center bg-cyber-bg z-50"
      >
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyber-primary mb-4"
        ></div>
        <div class="text-cyber-primary animate-pulse">LOADING DATA...</div>
      </div>

      <div
        class="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full slide-in relative z-10"
        *ngIf="currentQuestion && !loading"
      >
        <div class="flex justify-between items-end mb-6 border-b border-white/10 pb-4 w-full">
          <div>
            <h3 class="text-cyber-primary text-sm uppercase tracking-widest mb-1">
              Current Section
            </h3>
            <h2 class="text-2xl font-bold text-white capitalize">
              {{ currentQuestion.sectionTitle }} Phase
            </h2>
          </div>
          <div class="text-right">
            <span class="text-4xl font-bold text-cyber-secondary">{{ currentIndex + 1 }}</span>
            <span class="text-gray-500 text-xl">/{{ questions.length }}</span>
          </div>
        </div>

        <div class="w-full bg-gray-800 h-1 rounded-full mb-12 overflow-hidden relative">
          <div
            class="bg-gradient-to-r from-cyber-primary to-cyber-secondary h-full transition-all duration-500"
            [style.width.%]="((currentIndex + 1) / questions.length) * 100"
          ></div>
        </div>

        <div
          class="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8 md:p-12 rounded-3xl w-full text-center mb-12 backdrop-blur-sm relative shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          <h1 class="text-2xl md:text-4xl font-medium leading-relaxed text-white">
            {{ currentQuestion.questionText }}
          </h1>
        </div>

        <div class="w-full max-w-2xl px-4">
          <div class="flex justify-center mb-8 h-24">
            <div
              class="text-8xl transition-all duration-200 transform drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              [ngClass]="{ 'scale-125': isInteracting }"
            >
              {{ getEmoji(currentScore) }}
            </div>
          </div>
          <div class="text-center text-cyber-primary text-xl mb-8 font-bold tracking-wider h-8">
            {{ getLabel(currentScore) }}
          </div>

          <div class="relative w-full h-16 flex items-center justify-center mb-8">
            <div class="absolute w-full h-4 bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div
                class="h-full opacity-70 transition-all duration-100"
                [ngClass]="{
                  'bg-red-500': currentScore <= 2,
                  'bg-yellow-400': currentScore == 3,
                  'bg-green-500': currentScore >= 4
                }"
                [style.width.%]="(currentScore - 1) * 25"
              ></div>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              [(ngModel)]="currentScore"
              (mousedown)="isInteracting = true"
              (mouseup)="isInteracting = false"
              (touchstart)="isInteracting = true"
              (touchend)="isInteracting = false"
              class="w-full absolute z-20 opacity-0 cursor-pointer h-16"
            />
            <div
              class="absolute h-10 w-10 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 border-cyber-bg pointer-events-none transition-all duration-100 ease-out z-10"
              [style.left.%]="(currentScore - 1) * 25"
              style="transform: translateX(-50%)"
            ></div>
          </div>

          <div class="flex justify-center mt-12">
            <button
              (click)="nextQuestion()"
              class="bg-cyber-primary text-cyber-bg font-bold py-4 px-16 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] cursor-pointer text-lg"
            >
              CONFIRM CHOICE
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SurveyComponent implements OnInit {
  questions: Question[] = [];
  currentIndex = 0;
  currentScore = 3;
  answers: AnswerRequest[] = [];
  loading = true;
  isInteracting = false;

  constructor(private surveyService: SurveyService, private router: Router) {}

  ngOnInit() {
    // โหลดคำถามจาก Service
    this.surveyService.getQuestions().subscribe({
      next: (q) => {
        console.log('Loaded Questions:', q); // Log ดูว่าข้อมูลมาไหม
        this.questions = q;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading questions:', err); // ถ้า Error จะเห็นตรงนี้
        this.loading = false;
      },
    });
  }

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }
  getEmoji(score: number): string {
    const emojis = ['😫', '☹️', '😐', '🙂', '🤩'];
    return emojis[score - 1] || '😐';
  }
  getLabel(score: number): string {
    const labels = [
      'ไม่เห็นด้วยอย่างยิ่ง',
      'ไม่ค่อยเห็นด้วย',
      'เฉยๆ / ไม่แน่ใจ',
      'ค่อนข้างเห็นด้วย',
      'เห็นด้วยอย่างยิ่ง!',
    ];
    return labels[score - 1];
  }

  nextQuestion() {
    this.answers.push({ questionId: this.currentQuestion.questionId, score: this.currentScore });
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.currentScore = 3;
    } else {
      this.finish();
    }
  }

  finish() {
    this.loading = true;
    this.surveyService.submitSurvey(this.answers).subscribe((results) => {
      this.router.navigate(['/result'], { state: { results } });
    });
  }
}
