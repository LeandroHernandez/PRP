import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'

/**Models */
import {Teacher} from 'app/models/teacher/teacher.model'
import {UnitEducational} from '../../models/class/class.documentUnitEducational';
import {SendEmailService} from '../sendEmail/send-email.service';

@Injectable({
    providedIn: 'root'
})
export class TeachersService {

    public infoUser: UnitEducational;
    teacherCollection: AngularFirestoreCollection<Teacher>

    constructor(
        private db: AngularFirestore,
        public sendEmailService: SendEmailService
    ) {
        this.teacherCollection = this.db.collection<Teacher>('teacher');
    }

    OnInit() {
        console.log('*** INICIANDO SERVICIO ***');
    }

    /**
     * GUARDAR PROFESOR
     * @param level
     */
    public saveTeacher(teacher: Teacher, isNew: boolean, unit_educational_id) {
        console.log(teacher);
        teacher.teacher_unit_educational = [unit_educational_id];
        const collection = this.db.collection('teacher').doc(`${teacher.teacher_id}`);
        if (isNew) {
            this.sendEmailService.sendEmeilConfirRegisterProf(teacher);
            return collection.set(teacher);
        } else {
            return collection.update(teacher)
        }
    }

    public addUnitEducational(teacher: Teacher, isNew: boolean) {
        const collection = this.db.collection('teacher').doc(`${teacher.teacher_id}`);
        if (isNew) {
            this.sendEmailService.sendEmeilConfirRegisterProf(teacher);
            return collection.set(teacher);
        } else {
            return collection.update(teacher)
        }
    }

    /**
     * OBTENER LISTA DE PROFESORES
     */

    public getAllTeachers(unit_educational_id) {
        console.log(unit_educational_id)
        return this
            .db
            .collection<Teacher>('teacher',
                ref => ref.where('teacher_unit_educational',
                    'array-contains',
                    unit_educational_id)
            ).valueChanges();
    }

  /**
   * BUCSAR UN PROFESOR POR SU EMAIL.
   * @param teacherEmail
   */
    public findTeacherEmail(teacherEmail: string) {
        return this
            .db
            .collection<Teacher>('teacher',
                ref => ref
                    .where(
                        'teacher_email',
                        '==',
                        teacherEmail)
            ).valueChanges();
    }

    /**
     * ELIMINAR DOCENTE
     * @param teacher
     */
    public deleteTeacher(teacher: Teacher) {
        const collection = this.db.collection('teacher').doc(`${teacher.teacher_id}`);
        return collection.update({
            'teacher_status': false,
        });
    }

    public getTeacherById(teacherId: string) {
        return this.db.collection('teacher').doc(`${teacherId}`).valueChanges()
    }
}
