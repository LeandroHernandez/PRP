import {Injectable} from '@angular/core';
import {Student} from '../../models/student/student.model';
import {AngularFirestoreCollection, AngularFirestore} from '@angular/fire/firestore';
import {Teacher} from '../../models/teacher/teacher.model';
import {User} from '../../models/interfaces/user';

export interface Email {
  from_name?: string;
  to_email?: string;
  to_name?: string;
  subject?: string;
  user_code?: string;
  user_type?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {
  private StudentCollection: AngularFirestoreCollection<Email>;
  public email: Email

  constructor(
      private db: AngularFirestore,
  ) {
    this.StudentCollection = this.db.collection<Email>(`emails`)
  }

  sendEmeilConfirRegisterProf(teacher: Teacher) {
    this.email = {
      from_name: `${teacher.teacher_name} ${teacher.teacher_surname}, por favor confirme su registro en Dydáctico`,
      to_email: teacher.teacher_email,
      to_name: `${teacher.teacher_name} ${teacher.teacher_surname}`,
      subject: `Estimad@ Profesor`,
      user_code: teacher.teacher_id,
      user_type: 'Profesor',
    };
    const collection = this.StudentCollection;
    return collection.add(this.email);
  }

  sendEmeilConfirRegisterStudent(student: Student) {
    this.email = {
      from_name: `Dydáctico: Por favor confirme el registro de: ${student.student_name} ${student.student_lastname}`,
      to_email: student.student_email,
      to_name: `${student.student_name} ${student.student_lastname}`,
      subject: `Estimad@ Representante`,
      user_code: student.student_id,
      user_type: 'Estudiante',
    };
    const collection = this.StudentCollection;
    return collection.add(this.email);
  }

  sendEmailConfirmImportStudent(student: Student, email) {
    this.email = {
      from_name: `Dydáctico: Por favor confirme el registro de: ${student.student_name} ${student.student_lastname}`,
      to_email: email,
      to_name: `${student.student_name} ${student.student_lastname}`,
      subject: `Estimad@ Representante`,
      user_code: student.student_id,
      user_type: 'Estudiante',
    };
    const collection = this.StudentCollection;
    return collection.add(this.email);
  }

  sendEmailForgotPassword(user: User) {
    this.email = {
      from_name: `Dydáctico: Recuperación de contraseña`,
      to_email: user.email,
      subject: `Estimad@ Usuario`,
      user_code: user.uid,
      password: user.password
    };

    return this.db.collection('emails_recovery').add(this.email);
  }


}
