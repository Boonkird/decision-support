import { Routes } from '@angular/router';
import { IntroComponent } from './pages/intro/intro.component';
import { StudentInfoComponent } from './pages/student-info/student-info.component';
import { SurveyComponent } from './pages/survey/survey.component';
import { ResultComponent } from './pages/result/result.component';
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'student-info', component: StudentInfoComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'result', component: ResultComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent },

  { path: '**', redirectTo: '' }, //อยู่ล่างสุดเสมอ
];
