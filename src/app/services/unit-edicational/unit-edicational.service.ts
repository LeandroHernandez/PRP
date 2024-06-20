import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestoreCollection, AngularFirestore} from '@angular/fire/firestore';

/**Models */
import {UnitEducational} from '../../models/class/class.documentUnitEducational';
import {Level} from '../../models/class/class.documentLevel';
import {SubLevels} from 'app/models/class/class.documentSubLevels';
import {SchoolGrade} from 'app/models/class/class.documentschoolGrade';
import {Parallels} from 'app/models/class/classdocument-parallels';
import {Academyareadocum} from 'app/models/academyarea/academyareadocum.model';
import {Subject} from 'app/models/class/classdocumentSubject';
import swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})

export class UnitEdicationalService {

  levelCollection: AngularFirestoreCollection<UnitEducational>;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) 
  {
    this.levelCollection = this.db.collection<UnitEducational>('cuenca');
  }


  uploadFile(filePath: string, file: File): Promise<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return task.snapshotChanges().toPromise().then(() => fileRef.getDownloadURL().toPromise());
  }

  deleteFile(filePath: string): Promise<void> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.delete().toPromise();
  }

  /** Obtiene todas las UE */
  public allUnitEducationals() {
    return this.levelCollection.get().toPromise();
  }


  /**
   * Guardamos la unidad educativa
   * @param UnitEducational
   */
  public async saveUnitEducational(unitEducational: UnitEducational, isNew: boolean) {
    const collection: AngularFirestoreCollection<UnitEducational> = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase());

    if (isNew) {
      try {
        const docRef = await collection.add(unitEducational);
        unitEducational.unit_educational_id = docRef.id; // Establece el ID generado por Firestore en el objeto
        await docRef.update({ unit_educational_id: docRef.id }); // Actualiza el documento con el ID generado

        swal({
          title: 'Ok',
          text: 'Datos de la UE procesados correctamente!',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success',
        }).catch(swal.noop);
      } catch (error) {
        console.error('Error al crear el documento:', error);
      }
    } else {
      const docRef = collection.doc(`${unitEducational.unit_educational_id}`);
      try {
        await docRef.update(unitEducational);
        swal({
          title: 'Ok',
          text: 'Datos de la UE editados correctamente!',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success',
        }).catch(swal.noop);
      } catch (error) {
        console.error('Error al actualizar el documento:', error);
      }
    }
  }


  public async deleteUnitEducational(unitEducationalId: string, city: string): Promise<void> {
    const collection: AngularFirestoreCollection<UnitEducational> = this.db.collection<UnitEducational>(city.toLowerCase());
    const docRef = collection.doc(unitEducationalId);

    try {
      await docRef.delete();
      swal({
        title: 'Ok',
        text: 'Unidad educativa eliminada correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success',
      }).catch(swal.noop);
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
      swal({
        title: 'Error',
        text: 'Hubo un error al eliminar la unidad educativa. Inténtalo nuevamente.',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-danger',
        type: 'error',
      }).catch(swal.noop);
    }
  }

  

  /**
   * Actualizamos la unidad educativa
   * @param UnitEducational
   */
  public updateUnitEducational(unitEducational: UnitEducational) {
    const collection = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase()).doc(`${unitEducational.unit_educational_id}`);
    return collection.update(unitEducational);
  }

  addLevelsUnitEducational(unitEducational: UnitEducational, level: Level, period) {
    return this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(`${unitEducational.unit_educational_id}`)
        .collection('PeriodosLectivos/' + period + '/levels')
        .doc(`${level.level_id}`)
        .set(level);
  }

  /**
   * Al crear la unidad educativa agregamos los niveles, subniveles, grados, paralelos
   * del sistema a la nueva UE
   * @param unitEducational
   * @param levels
   * @param sublevels
   */
  async saverLevelsUnitEducational(unitEducational: UnitEducational, levels: Level[], sublevels: SubLevels[],
                                   grades: SchoolGrade[], parallels: Parallels[], academy_area: Academyareadocum[], subjects: Subject[], period) {
    console.log(levels, sublevels, grades, parallels, academy_area, subjects);
    this.setLevels(unitEducational, levels, period);
    this.setSubLevels(unitEducational, sublevels, period);
    this.setGrades(unitEducational, grades, period);
    this.setParallels(unitEducational, parallels, period);
    this.setAcademyArea(unitEducational, academy_area, period);
    this.setSubjects(unitEducational, subjects, period);
  }

  setLevels(unitEducational, levels, period) {
    levels.forEach(async (level) => {
      level.level_status = false;
      await this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
          .doc(`${unitEducational.unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('levels').doc(`${level.level_id}`).set(level);
    });
  }

  setSubLevels(unitEducational, sublevels, period) {
    sublevels.forEach(async (sublevel) => {
      sublevel.sublevel_status = false;
      await this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
          .doc(`${unitEducational.unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('sublevels').doc(`${sublevel.sublevel_id}`).set(sublevel);
    });
  }

  setGrades(unitEducational, grades, period) {
    grades.forEach(async (grade) => {
      grade.grade_status = false;
      await this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
          .doc(`${unitEducational.unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('grades').doc(`${grade.grade_id}`).set(grade);
    })
  }

  setParallels(unitEducational, parallels, period) {
    parallels.forEach(async (parallel) => {
      parallel.parallel_status = false;
      await this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
          .doc(`${unitEducational.unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('parallels').doc(`${parallel.parallel_id}`).set(parallel);
    })
  }

  setAcademyArea(unitEducational, academy_area, period) {
    academy_area.forEach(async (acadArea) => {
      acadArea.academyarea_state = false;
      await this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
          .doc(`${unitEducational.unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('academy_area').doc(`${acadArea.academyarea_id}`).set(acadArea);
    })
  }

  setSubjects(unitEducational, subjects, period) {
    subjects.forEach(async (subject) => {
      subject.subject_status = false;
      await this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
          .doc(`${unitEducational.unit_educational_id}`).collection('PeriodosLectivos').doc(period).collection('subjects').doc(`${subject.subject_id}`).set(subject);
    })
  }


  /**
   * Cambiamos estado del nivel en la UE
   * @param unitEducational
   * @param level
   */
  public changeStateLevelUnitEducational(unitEducational: UnitEducational, level: Level, period) {
    const levelUpdate = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id)
        .collection('PeriodosLectivos').doc(period)
        .collection('levels')
        .doc(level.level_id);
    levelUpdate.set(level)
        .then(function() {
          console.log('Document Level successfully updated!');
        }).catch(reason => {
          console.log('Error update Level: ', reason);
    });
  }


  /**
   * Cambiamos estado del sub nivel en la UE
   * @param unitEducational
   * @param subLevel
   */
  public changeStateSubLevelUnitEducational(unitEducational: UnitEducational, subLevel: SubLevels, period) {
    const collection = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id)
        .collection('PeriodosLectivos').doc(period)
        .collection('sublevels')
        .doc(subLevel.sublevel_id);
    collection.set(subLevel)
        .then(function() {
          console.log('Document subLevel successfully updated!');
        }).catch(reason => {
          console.log('Error update subLevel: ', reason);
        });
  }

  /**
   * Cambiar estado de grado  en la UE
   * @param unitEducational
   * @param grade
   */
  public changeStateGradeUnitEducational(unitEducational: UnitEducational, grade: SchoolGrade, period) {
    const collectionGrade = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id)
        .collection('PeriodosLectivos').doc(period)
        .collection('grades')
        .doc(grade.grade_id);
    collectionGrade.set(grade)
        .then(function() {
          console.log('Document Grade successfully updated!');
        }).catch(reason => {
          console.log('Error update Grade: ', reason);
        });
  }

  /**
   * Cambiar estado de paralelo  en la UE
   * @param unitEducational
   * @param parallel
   */
  public changeStateParallelUnitEducational(unitEducational: UnitEducational, parallel: Parallels, period) {
    const collectionParallel = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id)
        .collection('PeriodosLectivos').doc(period)
        .collection('parallels')
        .doc(parallel.parallel_id);
    collectionParallel.set(parallel)
        .then(function() {
          console.log('Document Parallel successfully updated!');
        }).catch(reason => {
          console.log('Error update Parallel: ', reason);
        });
  }

  /**
   * Cambiar estado de area academica en la UE
   * @param unitEducational
   * @param academy_area
   */
  public changeStateAcademyAreaUnitEducational(unitEducational: UnitEducational, academy_area: Academyareadocum, period) {
    const collectionAcademyArea = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id)
        .collection('PeriodosLectivos').doc(period)
        .collection('academy_area')
        .doc(academy_area.academyarea_id);
    collectionAcademyArea.set(academy_area)
        .then(function() {
          console.log('Document Academy Area successfully updated!');
        }).catch(reason => {
          console.log('Error update Academy Area: ', reason);
        });
  }
  public NewChangeStateAcademyAreaUnitEducational(unitEducational: UnitEducational, academy_area: Academyareadocum, state: boolean) {
    academy_area.academyarea_state = state;
    const collectionAcademyArea = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(`${unitEducational.unit_educational_id}`)
        .collection('academy_area')
        .doc(`${academy_area.academyarea_id}`);
    return collectionAcademyArea.set(academy_area);
  }

  /**
   * Cambiar estatus de asignatura dentro de la UE.
   * @param unitEducational
   * @param subject
   * @param state
   */
  public changeStateSubjectUnitEducational(unitEducational: UnitEducational, subject: Subject, period: any) {
    const collectionSubject = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id)
        .collection('PeriodosLectivos').doc(period)
        .collection('subjects')
        .doc(subject.subject_id);
    collectionSubject.set(subject)
        .then(function() {
          console.log('Document Subject successfully updated!');
        }).catch(reason => {
      console.log('Error update Subject: ', reason);
    });
  }
  public NewChangeStateSubjectUnitEducational(unitEducational: UnitEducational, subject: Subject, state: boolean) {
    subject.subject_status = state;

    const collectionSubject = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase()).doc(`${unitEducational.unit_educational_id}`).collection('subjects').doc(`${subject.subject_id}`);
    return collectionSubject.set(subject);
  }

  

  /**
   * Activamos - Desactivamos la UE
   * cambiamos el estado de la unidad educativa
   * @param unitEducational
   * @param state
   */
  public changeState(unitEducational: UnitEducational, state: boolean) {
    const collection = this.db.collection<UnitEducational>(unitEducational.unit_educational_city.toLowerCase()).doc(`${unitEducational.unit_educational_id}`);
    return collection.update({'unit_educational_status': state});
  }

  /**
   * Obtener lista de paises
   */

  public getCountries() {
    return this.db.collection('country').valueChanges()
  }

  /**
   * Obtener lista de ciudades
   */
  public getCities() {
    return this.db.collection('cities').valueChanges()
  }

  public getGrades(unit_educational: string, grade_id: string, period: any): Observable<any> {
    return this.levelCollection.doc(`${unit_educational}`).collection('PeriodosLectivos').doc(period).collection<SchoolGrade>('grades').doc(`${grade_id}`).valueChanges();
  }

  public getSubjectBySublevelId(unit_educational: string, sublevel_id: string, period: any): Observable<any> {
    return this.levelCollection.doc(`${unit_educational}`).collection('PeriodosLectivos').doc(period).collection('subjects',
        ref => ref.where('sublevel_id', '==', `${sublevel_id}`)).valueChanges();

  }

  /* Get planification
  ** @param activeSubject
   */
  getSubjectUnits(activeStudent, activeSubject, period) {
    return this.levelCollection.doc(`${activeStudent.student_unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${activeStudent.student_parallel_id}/subjects/${activeSubject.subject_id}`)
        .collection('units').valueChanges();
  }

  /* Get Classes from unit
  ** @param activeUnit
  ** @param activeSubject
   */
  getClassFromUnit(activeStudent, activeSubject, activeUnit, period) {
    console.log('*** EN EL SERVICIO ***');
    console.log(activeUnit.unit_id);
    return this.levelCollection.doc(`${activeStudent.student_unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${activeStudent.student_parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}`)
        .collection('classes', ref => ref.orderBy("fromDate", "desc")).valueChanges();
  }

  /* Get Classes from unit
  ** @param activeUnit
  ** @param activeSubject
  ** @param activeClass
   */
  getClassResources(activeStudent, activeSubject, activeUnit, activeClass, period) {
    return this.levelCollection.doc(`${activeStudent.student_unit_educational}/PeriodosLectivos/${period}/planification/planification_parallels/parallels/${activeStudent.student_parallel_id}/subjects/${activeSubject.subject_id}/units/${activeUnit.unit_id}`)
        .collection('classes')
        .doc(activeClass.class_id).collection('resources', ref => ref.where('resource_status', '==', false) .orderBy('resource_index')).valueChanges();
  }
}
