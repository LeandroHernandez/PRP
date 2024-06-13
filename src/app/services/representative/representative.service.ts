import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection } from '@angular/fire/firestore';
import { Representativedocum } from '../../models/class/class.documentRepresentative';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { UnitEducational } from 'app/models/class/class.documentUnitEducational';
import { RepresentedStudentdocum } from 'app/models/class/class.documentrepresentedstudent';

@Injectable({
  providedIn: 'root'
})
export class RepresentativeService {
  private RepresentativeCollection: AngularFirestoreCollection<Representativedocum>;
  public infoUser: UnitEducational;
  constructor(private db: AngularFirestore) {
    this.RepresentativeCollection = this.db.collection<Representativedocum>(`representative_student`)
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
  }
  public allrepresentative(): Observable<any> {
    return this.db.collection('representative_student', ref => ref.where('representative_unit_educational', 'array-contains', this.infoUser.unit_educational_id)).valueChanges();
  }
  public getrepresentative(representative_id: string): Observable<any> {
     return this.RepresentativeCollection.doc(`${representative_id}`).valueChanges();
    // return this.db.collection('cuenca').doc('general_config').collection<Academyareadocum>(`academy_area`).doc(`${academyarea_id}`).valueChanges();
  }
  public getrepresentedstudent(representative_id: string): Observable<any> {
    return this.RepresentativeCollection.doc(`${representative_id}`).collection('student').valueChanges();
 }

 public getrepresentedstudentById(representative_id: string, student_id: string): Observable<any> {
  return this.RepresentativeCollection.doc(`${representative_id}`).collection('student').doc(`${student_id}`).valueChanges();
}
 public saverepresentedstudent(representative_id: string, representedstudent: RepresentedStudentdocum): Promise<any> {
  const collection =  this.RepresentativeCollection.doc(`${representative_id}`)
  .collection('student').doc(`${representedstudent.student_id}`);
  return collection.set(representedstudent);
}

  public saveRepresentative(repres: Representativedocum) {
    repres.representative_unit_educational = [this.infoUser.unit_educational_id]
     const collection = this.RepresentativeCollection.doc(`${repres.representative_id}`);
    // const collection = this.db.collection('config').doc('general_config').collection<Academyareadocum>(`academy_area`).doc(`${area.academyarea_id}`);
    return collection.set(repres);
  }
  public deletearea(repres: Representativedocum) {
     const collection = this.RepresentativeCollection.doc(`${repres.representative_id}`);
    // const collection = this.db.collection('config').doc('general_config').collection<Academyareadocum>(`academy_area`).doc(`${area.academyarea_id}`);
    return collection.update({
      'representative_status': false,
    });
  }

}
