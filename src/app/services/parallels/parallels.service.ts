import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData, QuerySnapshot} from '@angular/fire/firestore'

/**MODELS */
import { Parallels } from 'app/models/class/classdocument-parallels'
import { Level } from 'app/models/class/class.documentLevel'
import { SubLevels} from 'app/models/class/class.documentSubLevels'
import { SchoolGrade } from 'app/models/class/class.documentschoolGrade'
import { UnitEducational } from 'app/models/class/class.documentUnitEducational';

@Injectable({
  providedIn: 'root'
})
export class ParallelsService {
  parallelsCollection: AngularFirestoreCollection<Parallels>
  constructor( private db: AngularFirestore) {
    this.parallelsCollection = this.db.collection<Parallels>('parallels');
  }

  /**
   * Guardar Paralelo
   * @param parallel
   */
  public saveParallels(parallel: Parallels): Promise<void> {
    const collectionParallels = this.db.collection(`config`).doc('general_config')
    .collection<Level>(`levels`).doc(`${parallel.level_id}`).collection<SubLevels>(`sublevels`).doc(`${parallel.sublevel_id}`)
    .collection<SchoolGrade>(`grades`).doc(`${parallel.grade_id}`).collection<Parallels>(`parallels`).doc(`${parallel.parallel_id}`);
    if (collectionParallels) {
      return collectionParallels.set(parallel);
    }
  }

  /**
   * Consultar paralelos
   * @param level_id
   * @param sublevel_id
   * @param grade_id
   */
  public getAllParallels(level_id: string, sublevel_id: string, grade_id: string): any {
    return this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${level_id}`)
      .collection(`sublevels`).doc(`${sublevel_id}`).collection('grades').doc(`${grade_id}`).
      collection<Parallels>('parallels').valueChanges();

  }

    /**
   * Obtener Lista de paralelos activos
   * @param level_id
   * @param sublevel_id
   * @param grade_id
   */
  public getAllParallelsActive(level_id: string, sublevel_id: string, grade_id: string): any {
    return this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${level_id}`)
      .collection(`sublevels`).doc(`${sublevel_id}`).collection('grades').doc(`${grade_id}`).
      collection<Parallels>('parallels', ref => ref.where('parallel_status', '==', true)).valueChanges();

  }

  public async getAllParallelsActiveNotRealTime(levelId: string, subLevelId: string, gradeId: string) {
    return  await this.db.collection('config')
        .doc('general_config')
        .collection<Level>('levels')
        .doc(levelId)
        .collection('sublevels')
        .doc(subLevelId)
        .collection('grades')
        .doc(gradeId).
        collection<Parallels>('parallels', ref => ref.where('parallel_status', '==', true))
        .get().toPromise();

  }

    /**
   * ELIMINAR PARALELO
   * @param parallel
   */
  public deleteParallel(parallel: Parallels) {
    const collectionParallels = this.db.collection(`config`).doc('general_config')
    .collection<Level>(`levels`).doc(`${parallel.level_id}`).collection<SubLevels>(`sublevels`).doc(`${parallel.sublevel_id}`)
    .collection<SchoolGrade>(`grades`).doc(`${parallel.grade_id}`).collection<Parallels>(`parallels`).doc(`${parallel.parallel_id}`);
    return collectionParallels.update({
      'parallel_status': false,
    });
  }

  /**
   * Obtener listado de paralelos que pertenecen a una Unidad Educativa.
   * @param unitEducational
   * @param parallel
   */

  public getParallelsUnitEducational(unitEducational: UnitEducational, parallel: Parallels): any {
    const collection = this.db.collection(unitEducational.unit_educational_city.toLowerCase())
    .doc(unitEducational.unit_educational_id.toString()).collection<Parallels>(`parallels`).doc(`${parallel.parallel_id}`);
    return collection.valueChanges();
  }

  public async getParallelsUnitEducationalNotRealTime(unitEducational: UnitEducational): Promise<QuerySnapshot<DocumentData>> {
    return await this.db.collection(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id.toString())
        .collection<Parallels>('parallels', ref => ref.where('parallel_status', '==', true))
        .get().toPromise();
  }
}
