 import { Timestamp } from "rxjs/internal/operators/timestamp";
// import { Timestamp } from '@firebase/firestore-types'; 
// import { DatePipe } from '@angular/common';

export class Academicyeardocum {
  academic_year_id?: string;
  academic_year_name?: string;
  month_start?: string;
  day_start?: string;
  year_start?: string;
  month_end?: string;
  day_end?: string;
  year_end?: string;
  year_status?: boolean;

  constructor(Academicyeardocum: any) {
    this.academic_year_id = Academicyeardocum.academic_year_id;
    this.academic_year_name = Academicyeardocum.academic_year_name;
    this.month_start = Academicyeardocum.month_start;
    this.day_start = Academicyeardocum.day_start;
    this.year_start = Academicyeardocum.year_start;
    this.month_end = Academicyeardocum.month_end;
    this.day_end = Academicyeardocum.day_end;
    this.year_end = Academicyeardocum.year_end;
    this.year_status = Academicyeardocum.year_status;
  }
}
