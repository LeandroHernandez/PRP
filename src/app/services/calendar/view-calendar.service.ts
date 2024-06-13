import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Studentdocum} from 'app/models/class/class.documentstudent';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SchoolGrade} from '../../models/class/class.documentschoolGrade';

@Injectable({
  providedIn: 'root'
})
export class ViewCalendarService {

  today: string;

  constructor(public afs: AngularFirestore) {
    const date = new Date();
    let dd: string;
    let mm: string;
    // let dd = String(date.getDate());
    // let mm = String(date.getMonth() + 1);
    if (date.getDate() < 10) {
      dd = `0${date.getDate()}`
    } else {
      dd = `${date.getDate()}`
    }
    if (date.getMonth() + 1 < 10) {
      mm = `0${date.getMonth()}`
    } else {
      mm = `${date.getMonth()}`
    }
    const yyyy = date.getFullYear();
    // const TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
    this.today = `${yyyy}-${mm}-${dd}`;
  }

  public getStudent(student_id: string) {
    return this.afs.collection('student', ref => ref.where('student_id', '==', student_id)).get().toPromise();
  }

  public getGrades(unit_educational: string, grade_id: string, period: any) {
    return this.afs.collection('cuenca').doc(`${unit_educational}`).collection('PeriodosLectivos').doc(period).collection<SchoolGrade>('grades', ref => ref.where('grade_id', '==', grade_id)).get().toPromise();
  }

  public getSubjectBySublevelId(unit_educational: string, sublevel_id: string, period: any) {
    return this.afs.collection('cuenca').doc(`${unit_educational}`).collection('PeriodosLectivos').doc(period).collection('subjects',
        ref => ref.where('sublevel_id', '==', `${sublevel_id}`)).get().toPromise();

  }

  getSubjectUnit(student_unit_educational, parallel_id, subject_id, period) {
    return this.afs.collection(`/cuenca/${student_unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${subject_id}/units`,
        ref => ref.where('toDate', '>=', this.today)).get().toPromise()
  }

  getAllClassFromUnit(unit_educational, parallel_id, subject_id, unit_id, period) {
    return this.afs.collection('cuenca').doc(`${unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${parallel_id}/subjects/${subject_id}/units/${unit_id}`)
        .collection('classes', ref => ref.where('toDate', '>=', this.today)).get().toPromise();
  }

  getStudentClasses(student_id, subjectId, unit_id) {
    return this.afs.collection(`/student/${student_id}/subjects/${subjectId}/unit/${unit_id}/class`).get().toPromise();
  }

  getStudentClassesResources(student_id, subjectId, unit_id, class_id) {
    return this.afs.collection(`/student/${student_id}/subjects/${subjectId}/unit/${unit_id}/class/${class_id}/resources`).get().toPromise();
  }
}
