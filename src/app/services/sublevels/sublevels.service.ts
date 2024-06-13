import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Observable } from 'rxjs';

/**Models */
import { SubLevels } from '../../models/class/class.documentSubLevels'
import { Level } from '../../models/class/class.documentLevel'


@Injectable({
  providedIn: 'root'
})
export class SubLevelsService {

  subLevelCollection: AngularFirestoreCollection<SubLevels>
  constructor(private db: AngularFirestore) {
    this.subLevelCollection = this.db.collection<SubLevels>('subniveles');
  }
  /**
   * Almacenar subnivel
   * @param sublevel
   */
  public saveSublevel(sublevel: SubLevels): Promise<void> {
    const collectionSublevels = this.db.collection('config').doc('general_config').collection<Level>(`levels`)
    .doc(`${sublevel.level_id}`).collection<SubLevels>(`sublevels`).doc(`${sublevel.sublevel_id}`)
    if (collectionSublevels) {
      return collectionSublevels.set(sublevel);
    }
  }

  /**
   * 
   * @param level_id
   */

   public getALLSublevelActive(level_id) {
    return this.db.collection('config').doc('general_config').collection<Level>('levels').doc(`${level_id}`).collection
    ('sublevels', ref => ref.where('sublevel_status', '==', true)).valueChanges();
   }
  /**
   * Obtener subniveles con respecto a un nivel_id
   * @param level_id
   */
  public getAllSublevels(level_id: string): Observable<SubLevels[]> {
    return this.db
        .collection('config')
        .doc('general_config')
        .collection<Level>(`levels`)
        .doc(`${level_id}`)
        .collection<SubLevels>(`sublevels`)
        .valueChanges();
  }

  public async getAllSubLevelsNoRealTime(level_id: string) {
    return await this.db
        .collection('config')
        .doc('general_config')
        .collection<Level>('levels')
        .doc(level_id)
        .collection<SubLevels>('sublevels')
        .get()
        .toPromise();
  }


  /**
   * Obtener un subnivel en especifico
   * @param level_id
   * @param sublevel_id
   */
  public getSublevelbySublevelId(level_id: string, sublevel_id: string): Observable<SubLevels> {
    return this.db.collection('config').doc('general_config').collection<Level>(`levels`).doc(`${level_id}`).collection<SubLevels>(`sublevels`).doc(`${sublevel_id}`).valueChanges();
  }
  /**
   * Eliminar Subnivel
   * @param sublevel
   */
  public deleteSublevel(sublevel: SubLevels): void {
    const collection = this.db.collection('config').doc('general_config').collection<Level>(`levels`)
    .doc(`${sublevel.level_id}`).collection<SubLevels>(`sublevels`).doc(`${sublevel.sublevel_id}`);
    collection.update({
      'sublevel_status': false,
    });
  }

}
