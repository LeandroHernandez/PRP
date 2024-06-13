import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Documenteducationalunit } from '../../models/class/class.documenteducationalunit';

@Injectable({
  providedIn: 'root'
})
export class EducationalunitService {

  constructor(
    private db : AngularFirestore
  ) { }

  get_all_educational_unit(){
    return this.db.collection<Documenteducationalunit>("educational_unit").valueChanges();
  }

  save_and_update_educational_unit(uid : string, data){
    return this.db.collection("educational_unit").doc(uid).set(data);
  }

  delete_logic_educational_unit(uid : string, data){
    return this.db.collection("educational_unit").doc(uid).update(data);
  }
}
