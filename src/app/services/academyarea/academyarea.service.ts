import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import { Academyareadocum } from '../../models/academyarea/academyareadocum.model';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';

/** MODELS */
import { Level } from 'app/models/class/class.documentLevel'
import { SubLevels } from 'app/models/class/class.documentSubLevels'
import { UnitEducational } from 'app/models/class/class.documentUnitEducational';


@Injectable({
  providedIn: 'root'
})
export class AcademyareaService {

  private AcademyCollection: AngularFirestoreCollection<Academyareadocum>;
  constructor(private db: AngularFirestore) {
    this.AcademyCollection = this.db.collection('config').doc('general_config').collection<Academyareadocum>(`academy_area`)
  }

     /** Obtener Area Academica relacionado a su level_id y sublevel_id
   * @param level_id
   * @param sublevel_id
   */
  public getAllAcademyArea(level_id: string, sublevel_id: string): Observable<Academyareadocum[]> {
    return this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${level_id}`)
      .collection(`sublevels`).doc(`${sublevel_id}`).collection<Academyareadocum>(`academy_area`).valueChanges();

  }

  /**
   * OBTENER LISTADO DE AREAS ACADEMICAS ACTIVAS
   * @param level_id
   * @param sublevel_id
   */
  public getAllAcademyAreaActives(level_id: string, sublevel_id: string): Observable<Academyareadocum[]> {
    return this.db.collection(`config`)
        .doc('general_config')
        .collection<Level>(`levels`)
        .doc(`${level_id}`)
      .collection(`sublevels`)
        .doc(`${sublevel_id}`)
      .collection<Academyareadocum>('academy_area', ref => ref.where('academyarea_state', '==', true))
      .valueChanges();

  }

  /**
   * OBTENER LISTADO DE AREAS ACADEMICAS ACTIVAS
   * @param levelID
   * @param subLevelID
   */
  public async getAllAcademyAreaActivesNotRealTime(levelID: string, subLevelID: string) {
     return await this.db.collection('config')
        .doc('general_config')
        .collection<Level>('levels')
        .doc(levelID)
        .collection('sublevels')
        .doc(subLevelID)
        .collection<Academyareadocum>('academy_area', ref => ref.where('academyarea_state', '==', true))
        .get()
        .toPromise();

  }


  public allacademyarea(): Observable<any> {
    return this.AcademyCollection.valueChanges();
  }
  public getarea(academyarea_id: string): Observable<any> {
    return this.db.collection('config').doc('general_config')
   .collection<Academyareadocum>(`academy_area`)
    .doc(`${academyarea_id}`).valueChanges();
  }

  public saveAcadArea(area: Academyareadocum) {
    console.log(area)
    console.log(area.level_id, area.sublevel_id, area.academyarea_id)
   const collection = this.db.collection(`config`).doc('general_config')
    .collection<Level>(`levels`).doc(`${area.level_id}`).collection<SubLevels>(`sublevels`).doc(`${area.sublevel_id}`)
    .collection<Academyareadocum>(`academy_area`).doc(`${area.academyarea_id}`);
    if (collection) {
      return collection.set(area);
    }
  }


  public deletearea(area: Academyareadocum) {
    // const collection = this.AcademyCollection.doc(`${area.academyarea_id}`);
    const collection = this.db.collection(`config`).doc('general_config').collection<Level>(`levels`).doc(`${area.level_id}`)
    .collection(`sublevels`).doc(`${area.sublevel_id}`).collection<Academyareadocum>(`academy_area`).doc(`${area.academyarea_id}`);
    return collection.update({
      'academyarea_state': false,
    });
  }

    /**
   * Obtener listado de areas acdemicas que pertenecen a una Unidad Educativa.
   * @param unitEducational
   * @param parallel
   */

  public getAcademyAreaUnitEducational(unitEducational: UnitEducational, academy_area: Academyareadocum): any {
    const collection = this.db.collection(unitEducational.unit_educational_city.toLowerCase())
    .doc(unitEducational.unit_educational_id.toString()).collection<Academyareadocum>(`academy_area`).doc(`${academy_area.academyarea_id}`);
    return collection.valueChanges();
  }

  public async getAcademyAreaUnitEducationalNotRealTime(unitEducational: UnitEducational): Promise<QuerySnapshot<DocumentData>> {
    return await this.db.collection(unitEducational.unit_educational_city.toLowerCase())
        .doc(unitEducational.unit_educational_id.toString())
        .collection<Academyareadocum>('academy_area', ref => ref.where('academyarea_state', '==', true))
        .get().toPromise();
  }

}
