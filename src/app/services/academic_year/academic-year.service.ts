import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection } from '@angular/fire/firestore';
import { Academicyeardocum } from '../../models/class/class.documentacademicyear';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {
  private AcademicyearCollection: AngularFirestoreCollection<Academicyeardocum>;

  constructor(private db: AngularFirestore) {
    this.AcademicyearCollection = this.db.collection<Academicyeardocum>(`academic_year`)
  }
  public allAcademicyear(): Observable<any> {
    return this.AcademicyearCollection.valueChanges();
  }
  public getAcademicyear(academic_year_id: string): Observable<any> {
     return this.AcademicyearCollection.doc(`${academic_year_id}`).valueChanges();
  }
  public saveAcademicyear(academicyear: Academicyeardocum) {
     const collection = this.AcademicyearCollection.doc(`${academicyear.academic_year_id}`);
    return collection.set(academicyear);
  }
  public updateAcademicyear(academicyear: Academicyeardocum) {
     const collection = this.AcademicyearCollection.doc(`${academicyear.academic_year_id}`);
      return collection.update({
      'student_status': false,
    });
  }

  public deleteAcademicyear(academicyear: Academicyeardocum) {
    const docRef = this.AcademicyearCollection.doc(`${academicyear.academic_year_id}`);
    return docRef.delete();
  }

}
