import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
  QuerySnapshot,
} from "@angular/fire/firestore";

/** Models */
import { Level } from "../../models/class/class.documentLevel";
import { Observable } from "rxjs";
import { UnitEducational } from "../../models/class/class.documentUnitEducational";
import { SubLevels } from "../../models/class/class.documentSubLevels";

@Injectable({
  providedIn: "root",
})
export class LevelsService {
  levelCollection: AngularFirestoreCollection<Level>;
  levelUnitEducationalCollection: AngularFirestoreCollection<Level>;

  constructor(private db: AngularFirestore) {
    this.levelCollection = this.db
      .collection("config")
      .doc("general_config")
      .collection<Level>(`levels`);
    this.levelUnitEducationalCollection = this.db
      .collection("config")
      .doc("general_config")
      .collection<Level>(`levels`);
  }

  /**
   * GUARDAR NIVEL
   * @param level
   */
  public saveLevel(level: Level) {
    const collection = this.db
      .collection("config")
      .doc("general_config")
      .collection<Level>(`levels`)
      .doc(`${level.level_id}`);
    return collection.set(level);
  }

  /**
   * OBTENER LISTA DE NIVELES
   */

  public allLevel(): Observable<any> {
    return this.levelCollection.valueChanges();
  }

  /**
   * Ontenemos los niveles de la unidad educativa
   */

  public getLevelsUnitEducational(
    unitEducational: UnitEducational,
    level: Level
  ): Observable<any> {
    const collection = this.db
      .collection(unitEducational.unit_educational_city.toLowerCase())
      .doc(unitEducational.unit_educational_id.toString())
      .collection<Level>(`levels`)
      .doc(`${level.level_id}`);
    return collection.valueChanges();
  }

  public async getLevelsUnitEducationalNotRealTime(
    unitEducational: UnitEducational
  ): Promise<QuerySnapshot<DocumentData>> {
    return await this.db
      .collection(unitEducational.unit_educational_city.toLowerCase())
      .doc(unitEducational.unit_educational_id.toString())
      .collection<Level>("levels", (ref) =>
        ref.where("level_status", "==", true)
      )
      .get()
      .toPromise();
  }

  /**
   * Ontenemos los subniveles de la unidad educativa
   */
  public getSubLevelsUnitEducational(
    unitEducational: UnitEducational,
    sublevel: SubLevels
  ): Observable<any> {
    const collection = this.db
      .collection(unitEducational.unit_educational_city.toLowerCase())
      .doc(unitEducational.unit_educational_id.toString())
      .collection<Level>(`sublevels`)
      .doc(`${sublevel.sublevel_id}`);
    return collection.valueChanges();
  }

  public async getSubLevelsUnitEducationalNotRealTime(
    unitEducational: UnitEducational
  ): Promise<QuerySnapshot<DocumentData>> {
    return await this.db
      .collection(unitEducational.unit_educational_city.toLowerCase())
      .doc(unitEducational.unit_educational_id.toString())
      .collection<Level>("sublevels", (ref) =>
        ref.where("sublevel_status", "==", true)
      )
      .get()
      .toPromise();
  }

  public allLevelActives(): Observable<any> {
    return this.db
      .collection("config")
      .doc("general_config")
      .collection<Level>("levels", (ref) =>
        ref.where("level_status", "==", true)
      )
      .valueChanges();
  }

  public async getAllLevels() {
    return await this.db
      .collection("config")
      .doc("general_config")
      .collection<Level>("levels", (ref) =>
        ref.where("level_status", "==", true)
      )
      .get()
      .toPromise();
  }

  /**
   * ELIMINAR NIVEL
   * @param level
   */
  public deleteLevel(level: Level) {
    const collection = this.db
      .collection("config")
      .doc("general_config")
      .collection<Level>(`levels`)
      .doc(`${level.level_id}`);
    return collection.update({
      level_status: false,
    });
  }

  /**
   * OBTENER DATOS DE UN NIVEL EN ESPECIFICO.
   * @param level_id
   */
  public getLevel(level_id: string): Observable<any> {
    return this.db
      .collection("config")
      .doc("general_config")
      .collection<Level>(`levels`)
      .doc(`${level_id}`)
      .valueChanges();
  }
}
