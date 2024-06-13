
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Observable } from 'rxjs';

/**Models */
import { UnitEducational } from 'app/models/class/class.documentUnitEducational';
import { Student } from 'app/models/student/student.model';
import { Teacher } from 'app/models/teacher/teacher.model';
import { Subject } from 'app/models/class/classdocumentSubject';
import { Parallels } from 'app/models/class/classdocument-parallels';

@Injectable({
  providedIn: 'root'
})
export class AdminEducationalUnitService {

  adminEducationalUnitCollection: AngularFirestoreCollection<UnitEducational>
  
  constructor(private db: AngularFirestore) {
    this.adminEducationalUnitCollection = this.db.collection<UnitEducational>('cuenca');
    
  }

  /*public getCurrentUnitEduc(): Observable<firebase.firestore.DocumentData[]> {
    const aux = JSON.parse(localStorage.getItem('user'));
    const collectionUnitEd = this.db.collection('cuenca', ref => ref.where('unit_educational_email', '==', aux.email));
    if (collectionUnitEd) {
      return collectionUnitEd.valueChanges();
    }
  }*/

  /**
 * OBTENER LISTADO DE GRADOS DE UNIDAD EDUCATIVA
 */

  public getGradesFromUnitEducational(unitEducationalId: String, period: any) {
    const collectionGrades = this.db.collection('cuenca').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period)
      .collection('grades', ref => ref.where('grade_status', '==', true))
    if (collectionGrades) {
      return collectionGrades.valueChanges()
    }

  }

  /** Obtener los periodos lectivos*/
  public getAcademicPeriodic() {
    const collectionPeriodic = this.db.collection('academic_year', ref => ref.where('academic_year_status', '==', false));
    if (collectionPeriodic) {
      return collectionPeriodic.valueChanges();
    }
  }

  public getAcademicPeriodicActive() {
    const collectionPeriodic = this.db.collection('academic_year', ref => ref.where('active', '==', true));
    if (collectionPeriodic) {
      return collectionPeriodic.valueChanges();
    }
  }

  public getStudents() {
    const collectionStudents = this.db.collection('student',  ref => ref.where('student_status', '==', true));
    if (collectionStudents) {
      return collectionStudents.valueChanges();
    }
  }
  /** Actualizar Periodo Académico Actual**/
  public updatePeriod(id, opcion: boolean) {
    const collectionPeriod = this.db.collection('academic_year').doc(id);
    if (collectionPeriod) {
      const postData = {
        academic_year_status: opcion,
        active: true
      };
      return collectionPeriod.update(postData);
    }
  }

  public updatePeriodActive(id) {
    const collectionPeriod = this.db.collection('academic_year').doc(id);
    if (collectionPeriod) {
      const postData = {
        active: false
      };
      return collectionPeriod.update(postData);
    }
  }

  public updateStudents(idStudent) {
    const colleccionStudents = this.db.collection('student').doc(idStudent);
    if (colleccionStudents) {
      const postData = {
        student_status: false,
        student_grade_id: '',
        student_parallel_id: ''
      };
      return colleccionStudents.update(postData);
    }
  }

  /** OBTENER LISTADO DE PARALELOS DE UNIDAD EDUCATIVA */
  public getParallelsFromUnitEducational(gradeId: string, unitEducationalId: String, period: any): Observable<firebase.firestore.DocumentData[]> {
    const collectionParallels = this.db.collection('cuenca').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period)
        .collection('parallels', ref => ref.where('parallel_status', '==', true));
    if (collectionParallels) {
      return collectionParallels.valueChanges();
    }
  }
  public getParallelsFromStudent(unitEducationalId: String) {
    return this.db.collection('student', ref => ref.where('student_unit_educational', '==', unitEducationalId)
    ).valueChanges()
  }
  /**
   * OBTENER LISTADO DE ESTUDIANTES DE UNIDAD EDUCATIVA.
   * 1. QUE TENGAN STATUS ACTIVO.
   * 2. QUE PERTENEZCAN A UNA UNIDAD EDUCATIVA ESPECIFICA.
   */
  public getStudentsFromEducationalUnit(unitEducationalId: String) {
    const collectionStudents = this.db.collection('student', ref =>  ref.where
    ('student_unit_educational', '==', unitEducationalId)).valueChanges()
    if (collectionStudents) {
      return collectionStudents;
    }

  }
  /**
   * OBTENER DATOS DE UN GRADO EN ESPECIFICO, DENTRO DE UNA UNIDAD EDUC.
   * @param unitEducationalId.
   * @param gradeId
   */
  public getGradeByGradeId( gradeId: string, unitEducationalId: String, period: any) {
    return this.db.collection('cuenca').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period).collection('grades').doc(`${gradeId}`).valueChanges()
  }

  /**
   *  OBTENER DATOS DE UN PARALELO ESPECIFICO, DENTRO DE UNA UNIDAD EDUC.
   * @param unitEducationalId
   * @param parallelId
   */
  public getParallelByParallelId( parallelId: String, unitEducationalId: String, period: string) {
    return this.db.collection('cuenca').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period).collection('parallels').doc(`${parallelId}`).valueChanges();
  }
  /**
   * OBTENER DATOS DE PARALELOS QUE CONTENGAN DATOS DE ESTUDIANTE.
   * @param unitEducationalId
   */
  public getParallelContainingDataStudent(unitEducationalId: String) {
    return this.db.collection('student', ref => ref.where('student_unit_educational', '==', unitEducationalId)
    && ref.orderBy('student_parallel_id', 'asc')
    ).valueChanges()
  }

  /**
   * ACTUALIZAR DATOS DE ESTUDIANTE AL CUAL SE LE ASIGNA UN GRADO Y UN PARALELO.
   * @param student
   * @param data
   */
  public updateStudent(student: Student, data) {
    const collectionStudent = this.db.collection('student').doc(`${student.student_id}`);
    if (collectionStudent) {
      return collectionStudent.update(data)
    }
  }

  /**
   * OBTENER LISTADO DE ESTUDIANTES QUE PERTENECEN A UN GRADO Y A UN PARALELO ESPECIFICO.
   * @param gradeId
   * @param parallelId
   */
  public getStudentsAssignedToGrade(unitEducationalId: String): Observable<unknown[]> {
    return this.db.collection('student', ref => ref.where('student_unit_educational', '==', unitEducationalId )).valueChanges()
  }

  /**
   * OBTENER ASIGNATURAS DE UN GRADO
   * @param unitEducationalId
   */
  public getSubjectsFromEducationalUnit(unitEducationalId: String, sublevelId: String, period: any) {
    return this.db.collection('cuenca').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period).collection('subjects', ref =>
      ref.where('sublevel_id', '==', sublevelId))
      .valueChanges()
  }

  /**
   * OBTENER LISTADO DE DOCENTES DE UNA UNIDAD EDUCATIVA.
   * @param unitEducationalId
   */
  public getTeachersFromUnitEducational(unitEducationalId: String) {
    return this.db.collection('teacher', ref => ref.where('teacher_unit_educational', 'array-contains', unitEducationalId)).valueChanges()
  }

  public getPadre(idCedula: String) {
    return this.db.collection('representative_student', ref => ref.where('representative_email', '==',idCedula)).valueChanges()
  }

  /**
   * GUARDAR LISTADO DE DOCENTES ASIGNADOS A UNA MATERIA
   */

  public saveTeacherAssignSubject(teacher: Teacher, unitEducationalId: String, subject: Subject, parallel: Parallels, period: any) {
    const collectionsubject = this.db.collection('teacher').doc(`${teacher.teacher_id}`).collection('unit_educational')
        .doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period)
      .collection('parallels').doc(`${parallel.parallel_id}`).collection('subjects').doc(`${subject.subject_id}`);
    if (collectionsubject) {
      collectionsubject.set(subject);
    }
  }

  /**
   * AGREGAR DATO EN COLECCION PARALELO DE RUTA PARA ASIGNACIÓN DE ASIGNATURA EN DOCENTE.
   * @param teacher
   * @param unitEducationalId
   * @param parallel
   */
  public addParallelIdInTeacherCollection(teacher: Teacher, parallel: Parallels,  unitEducationalId: String, period: any) {
    const parallel_id = {
      'parallel_id': parallel.parallel_id
    }
    return this.db.collection('teacher').doc(`${teacher.teacher_id}`).collection('unit_educational').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period)
      .collection('parallels').doc(`${parallel.parallel_id}`).set(parallel_id);

  }

  /**
   * OBTENER LISTADO DE DOCENTES ASIGNADOS A UNA MATERIA
   */
  public getSubjectTeachers(teacherId: String, unitEducationalId: String , parallelId: String, subjectId: String, period: any) {
    return this.db.collection('teacher').doc(`${teacherId}`).collection('unit_educational').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period)
      .collection('parallels').doc(`${parallelId}`).collection('subjects', ref => ref.where('subject_id', '==', subjectId)).valueChanges()
  }

  /**
   * ELIMINAR DATOS DE DE ASIGNATURA EN DOCENTE.
   * @param teacher
   * @param unitEducationalId
   * @param parallels
   * @param subject
   */
  public deleteTeacherFromSubject(teacher: Teacher, unitEducationalId: String, parallels: Parallels, subject: Subject, period: any) {
    const collectionSubjectInTeacher = this.db.collection('teacher').doc(`${teacher.teacher_id}`).collection('unit_educational').doc(`${unitEducationalId}`).collection('PeriodosLectivos').doc(period)
      .collection('parallels').doc(`${parallels.parallel_id}`).collection('subjects').doc(`${subject.subject_id}`);
    if (collectionSubjectInTeacher) {
      collectionSubjectInTeacher.delete();
    }
  }
  /**
   * Eliminar datos de grade_id y parallel_id de un estudiante..
   * @param student
   */
  public deleteStudentFromSubject(student: Student) {
    const data = {
      'student_grade_id': '',
      'student_parallel_id': ''
    }
    const collectionStudent = this.db.collection('student').doc(`${student.student_id}`)
    if (collectionStudent) {
      collectionStudent.update(data)
    }
  }

  public unitsFromUE(ue, parallel, subject, period) {
    const docRef = this.db
        .collection('cuenca')
        .doc(ue)
        .collection('PeriodosLectivos').doc(period)
        .collection('planification')
        .doc('planification_parallels')
        .collection('parallels')
        .doc(parallel)
        .collection('subjects')
        .doc(subject)
        .collection('units');
    return docRef.get()
        .toPromise();
  }

  public sessionsFromUnit(ue, parallel, subject, unit, period) {
    const docRef = this.db
        .collection('cuenca')
        .doc(ue)
        .collection('PeriodosLectivos').doc(period)
        .collection('planification')
        .doc('planification_parallels')
        .collection('parallels')
        .doc(parallel)
        .collection('subjects')
        .doc(subject)
        .collection('units')
        .doc(unit)
        .collection('classes');
    return docRef.get()
        .toPromise();
  }

  public evaluationsFromSession(ue, parallel, subject, unit, session, period) {
    const docRef = this.db
        .collection('cuenca')
        .doc(ue)
        .collection('PeriodosLectivos').doc(period)
        .collection('planification')
        .doc('planification_parallels')
        .collection('parallels')
        .doc(parallel)
        .collection('subjects')
        .doc(subject)
        .collection('units')
        .doc(unit)
        .collection('classes')
        .doc(session)
        .collection('evaluations');
    return docRef.get()
        .toPromise();
  }
}
