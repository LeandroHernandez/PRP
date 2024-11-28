import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { DbCollections } from "constants/db-collections";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { Observable } from "rxjs";
import { ICountry } from "app/models/interfaces/country";
import { ICity } from "app/models/interfaces/city";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: "root",
})
export class EducationalUnitService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  get_all_educational_unit(): Observable<IEducationalUnit[]> {
    return this.db
      .collection<IEducationalUnit>(DbCollections.educationalUnit)
      .valueChanges();
  }

  // save_and_update_club(uid: string, data) {
  //   return this.db.collection(DbCollections.clubs).doc(uid).set(data);
  // }

  save_and_update_educational_unit(uid: string, data: IEducationalUnit) {
    // return this.db.collection(DbCollections.educationalUnit).doc(uid).set(data);
    return this.db
      .collection(DbCollections.educationalUnit)
      .doc(uid)
      .set({ ...data, clubId: "1727213389379" });
  }

  delete_logic_educational_unit(uid: string, data) {
    return this.db
      .collection(DbCollections.educationalUnit)
      .doc(uid)
      .update(data);
  }

  //

  public getCountries(): Observable<ICountry[]> {
    // return this.db.collection("country").valueChanges();
    return this.db.collection<ICountry>(DbCollections.countries).valueChanges();
  }

  /**
   * Obtener lista de ciudades
   */
  public getCities(): Observable<ICity[]> {
    return this.db.collection<ICity>(DbCollections.cities).valueChanges();
  }

  /** Método para subir una imganen a Storage */
  uploadFile(filePath: string, file: File): Promise<string> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return task
      .snapshotChanges()
      .toPromise()
      .then(() => fileRef.getDownloadURL().toPromise());
  }

  /** Método para eliminar una imganen de Storage */
  deleteFile(filePath: string): Promise<void> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.delete().toPromise();
  }
}
