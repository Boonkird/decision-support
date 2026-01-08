export interface Track {
  trackId: number;        // Backend ส่ง trackId
  trackCode: string;      // Backend ส่ง trackCode
  trackNameTh: string;    // Backend ส่ง trackNameTh
  trackNameEn: string;    // Backend ส่ง trackNameEn
  description: string;
}

export interface Question {
  questionId: number;     // Backend ใช้ questionId (ไม่ใช่ id)
  questionText: string;   // Backend ใช้ questionText (ไม่ใช่ text)
  sectionId?: number;
  sectionTitle?: string;  // Backend ส่ง sectionTitle มาให้ด้วย
  // trackWeights ลบออกได้เลย เพราะ Frontend ไม่ต้องคำนวณเองแล้ว
}

export interface StudentProfile {
  fullName: string;       // แก้จาก name เป็น fullName
  school: string;
  levelEducation: string; // แก้จาก level เป็น levelEducation
  gender: string;    
  province?: string;      // ใส่ ? ไว้ก่อนก็ได้เผื่อค่าว่าง
  age?: number;
  studyProgram?: string;     // เพิ่ม gender (Backend มี)
}

export interface AnswerRequest {
  questionId: number;
  score: number;
}

export interface SurveySubmitRequest {
  studentProfile: StudentProfile;
  answers: AnswerRequest[];
}

export interface SurveyResult {
  trackCode: string;
  trackName: string;
  score: number;
  percentage: number;
}