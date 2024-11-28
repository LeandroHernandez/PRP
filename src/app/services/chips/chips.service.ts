import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { IChip } from "app/models/interfaces/chip";
import { DbCollections } from "constants/db-collections";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChipsService {
  constructor(private db: AngularFirestore) {}

  get_all_chip(): Observable<IChip[]> {
    // return this.db
    //   .collection("config")
    //   .doc("role_config")
    //   .collection<DocumentRole>("role")
    //   .valueChanges();
    return this.db.collection<IChip>(DbCollections.chips).valueChanges();
  }

  // add_and_edit_role(uidrole: string, data) {
  //   return this.db
  //     .collection("config")
  //     .doc("role_config")
  //     .collection("role")
  //     .doc(uidrole)
  //     .set(data);
  // }

  add_and_edit_chip(uidchip: string, data: any): Promise<void> {
    console.log({ uidchip, data });
    return this.db.collection(DbCollections.chips).doc(uidchip).set(data);
  }

  delete_chip(uidchip: string): Promise<void> {
    return this.db.collection(DbCollections.chips).doc(uidchip).delete();
  }
}
