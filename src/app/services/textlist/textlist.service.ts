import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Listtext } from 'app/models/class/classdocumenttext';
import { TextBook } from 'app/models/external_resources/textbook.model';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TextlistService {
  textCollection: AngularFirestoreCollection<Listtext>
  constructor( private db: AngularFirestore) {
    this.textCollection = this.db.collection<Listtext>('text');
   }
    /**
   * optener texto
   */

  public getAllText() {
    return this.db.collection<Listtext>('text').valueChanges();
  }
  public getTextById(textId: string) {
    return this.db.collection('text').doc(`${textId}`).valueChanges()
  };

  getText2List():Observable<any>{
    return this.db.collection('external_resourses')
        .doc('uploaded_files')
        .collection('textbooks').snapshotChanges();

  }

}

