import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData, QuerySnapshot} from '@angular/fire/firestore'
import {Observable} from 'rxjs';

/** Models */
import {Level} from '../../models/class/class.documentLevel'
import {SubLevels} from '../../models/class/class.documentSubLevels'
import {SchoolGrade} from '../../models/class/class.documentschoolGrade'
import {UnitEducational} from 'app/models/class/class.documentUnitEducational';


@Injectable({
  providedIn: 'root'
})
export class GradesService {

  gradeCollection: AngularFirestoreCollection<SchoolGrade>

  constructor(private db: AngularFirestore) {
    this.gradeCollection = this.db.collection<SchoolGrade>(`grades`)
  }

  /** Guardar grado
   * @param grade
   */
  public saveSchoolGrade(grade: SchoolGrade): Promise<void> {
    const collectionSublevels = this.db.collection(`config`).doc('general_config')
    .collection<Level>(`levels`).doc(`${grade.level_id}`).collection<SubLevels>(`sublevels`).doc(`${grade.sublevel_id}`)
    .collection<SchoolGrade>(`grades`).doc(`${grade.grade_id}`);
    if (collectionSublevels) {
      return collectionSublevels.set(grade);
    }
  }

   /** Obtener grado relacionado a su level_id y sublevel_id
   * @param level_id
   * @param sublevel_id
   */
  public getAllGrades(level_id: string, sublevel_id: string): Observable<SchoolGrade[]> {
    return this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${level_id}`)
      .collection(`sublevels`).doc(`${sublevel_id}`).collection<SchoolGrade>(`grades`).valueChanges();

  }
  public getAllGradesActive(level_id: string, sublevel_id: string): Observable<SchoolGrade[]> {
    return this.db.collection(`config`)
        .doc('general_config')
        .collection<Level>(`levels`)
        .doc(`${level_id}`)
        .collection(`sublevels`)
        .doc(`${sublevel_id}`)
        .collection<SchoolGrade>('grades', ref => ref.where('grade_status', '==', true))
      .valueChanges();

  }

  public async getAllGradesActiveNoRealTime(level_id: string, sublevel_id: string) {
    return await this.db.collection('config')
        .doc('general_config')
        .collection<Level>('levels')
        .doc(level_id)
        .collection('sublevels')
        .doc(sublevel_id)
        .collection<SchoolGrade>('grades', ref => ref.where('grade_status', '==', true))
        .get().toPromise();

  }
  /**
   * Obtener datos de un grade en especifico
   * @param level_id
   * @param sublevel_id
   * @param grade_id
   */
  public getGradeBySublevelId(level_id: string, sublevel_id: string, grade_id: string): Observable<SchoolGrade> {
    return this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${level_id}`)
      .collection(`sublevels`).doc(`${sublevel_id}`).collection<SchoolGrade>(`grades`).doc(`${grade_id}`).valueChanges();
  }

  /** Elminar de manera logica el grado escolar seleccionado
   * @param grade
   */
  public deleteSchoolGrade(grade: SchoolGrade): void {
    const collection = this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${grade.level_id}`)
    .collection(`sublevels`).doc(`${grade.sublevel_id}`).collection<SchoolGrade>(`grades`).doc(`${grade.grade_id}`);
    collection.update({
      'grade_status': false,
    });
  }

  /**
   * Obtener listado de grados de una Unidad Educativa.
   * @param unitEducational
   * @param grade
   */
  public getGradesUnitEducational(unitEducational: UnitEducational, grade: SchoolGrade): Observable<any> {
    const collection = this.db.collection(unitEducational.unit_educational_city.toLowerCase())
    .doc(unitEducational.unit_educational_id.toString()).collection<SchoolGrade>(`grades`).doc(`${grade.grade_id}`);
    return collection.valueChanges();
  }

  public async getGradesUnitEducationalNotRealTime(unitEducational: UnitEducational): Promise<QuerySnapshot<DocumentData>> {
    return await this.db
        .collection(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id.toString())
        .collection<SchoolGrade>('grades', ref => ref.where('grade_status', '==', true))
        .get().toPromise();
  }

    /**
   * Obtener listado de grados de una Unidad Educativa.
   * @param unitEducational
   * @param grade
   */
  public getGradeByGradeId(unitEducational: UnitEducational, gradeId: String): Observable<any> {
    const collection = this.db.collection(unitEducational.unit_educational_city.toLowerCase())
    .doc(unitEducational.unit_educational_id.toString()).collection<SchoolGrade>(`grades`).doc(`${gradeId}`);
    return collection.valueChanges();
  }


}
