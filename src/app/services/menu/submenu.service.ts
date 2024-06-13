import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SubmenuService {

  constructor(
    private db : AngularFirestore
  ) { }

  /**
   * Asignar un submenu a un menu en especifico
   * Assign a submenu to a specific menu
   *
   * @param {string} uidmenu Idenficador del menu - Menu identifier
   * @param {string} uid Identificador del submenu - Submenu identifier
   * @param {*} data Objeto con la informacion del submenu - Object with the information from the submenu
   * @returns
   * @memberof SubmenuService
   */
  add_submenu(uidmenu : string, uid : string, data){
    return this.db.collection("config").doc("menu_config").collection("menu").doc(uidmenu).collection("submenu").doc(uid).set(data);
  }
}
