import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { IParameter } from "app/models/interfaces/parameter";
import { DbCollections } from "constants/db-collections";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ParametersService {
  constructor(private db: AngularFirestore) {}

  get_all_parameter(): Observable<IParameter[]> {
    // return this.db
    //   .collection("config")
    //   .doc("role_config")
    //   .collection<DocumentRole>("role")
    //   .valueChanges();
    return this.db
      .collection<IParameter>(DbCollections.parameters)
      .valueChanges();
  }

  // add_and_edit_role(uidrole: string, data) {
  //   return this.db
  //     .collection("config")
  //     .doc("role_config")
  //     .collection("role")
  //     .doc(uidrole)
  //     .set(data);
  // }

  add_and_edit_parameter(uidParameter: string, data: any): Promise<void> {
    return this.db
      .collection(DbCollections.parameters)
      .doc(uidParameter)
      .set(data);
  }

  delete_parameter(uidParameter: string): Promise<void> {
    return this.db
      .collection(DbCollections.parameters)
      .doc(uidParameter)
      .delete();
  }
}
