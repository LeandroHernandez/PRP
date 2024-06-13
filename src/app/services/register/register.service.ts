import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Student } from 'app/models/student/student.model';
import { Representativedocum } from '../../models/class/class.documentRepresentative';

interface ErrorValidate {
  [s: string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  /* Validators regex */
  mail_regex = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
  phone_regex = '^((\\+91-?)|0)?[0-9]{10}$';
  pass_regex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$';

  /* !Validators regex */

  constructor(private db: AngularFirestore) { }

  /* Teacher functions */
  get_teacher_by_id(teacher_code: string) {
    return this.db.collection('teacher').doc(teacher_code).get()
      .pipe(
        map(response => {
          return response.data();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  update_teacher(teacherCode, teacherData) {
    return this.db.collection('teacher').doc(teacherCode).update(Object.assign({}, teacherData));
  }

  /* !Teacher functions */

  /* Students functions */
  get_student_by_id(studentCode) {
    return this.db.collection('student').doc(studentCode).get()
      .pipe(
        map(response => {
          return response.data();
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  update_student(studentData: Student) {
    console.log('*** Estudiante ***');
    if ( !studentData.student_id ) {
      studentData.student_id = Date.now().toString();
    }
    if ( !studentData.student_identification ) {
      studentData.student_identification = '';
    }
    if ( !studentData.student_parallel_id ) {
      studentData.student_parallel_id = '';
    }
    if ( !studentData.student_unit_educational ) {
      studentData.student_unit_educational = '';
    }
    console.log(studentData)
    // return this.db.collection('student').doc(studentData.student_id).update(Object.assign({}, studentData));
    return this.db.collection('student').doc(studentData.student_id).set(Object.assign({}, studentData));
  }

  /* !Students functions */

  /* Representant functions */
  update_representative(student_representative, representativeData: Representativedocum, studentData: Student) {
    console.log(student_representative);
    console.log(representativeData);
    console.log('*** representante ***');
    console.log(student_representative, representativeData);
    representativeData.representative_id = student_representative;
    this.db.collection('representative_student').doc(student_representative).set(representativeData);
    return this.db.collection('representative_student').doc(student_representative).collection('student').doc(studentData.student_id).set({'student_id': studentData.student_id});
  }

  /* !Representant functions */

  /* Custom Validators */
  invalidDate(control: FormControl): ErrorValidate {

    const newDate = new Date(control.value);
    const today = new Date(Date.now());

    if (newDate >= today) {
      return {
        invalidDate: true
      }
    }
    return null;
  }

  passwordsIguales(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];
      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    }
  }

  /* !Custom Validators*/

  /* Obtener niveles y subniveles */

  public getGradeInfo() {
    return this.db.collection(`/cuenca/1597765000719/grades`).get().toPromise();
  }
}
