import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Documentmenu } from '../../models/class/class.documentmenu';
import { Menudto } from '../../models/dto/class.menudto';
import { Documentsubmenu } from '../../models/class/class.documentsubmenu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
      private db: AngularFirestore
  ) {
  }

  /**
   * Devuelve la informacion de menus con sus respectivos submenus
   * Returns the menu information with their respective submenus
   *
   * @returns {Observable<Array<Menudto>>}
   * @memberof MenuService
   */
  get_all_menu() : Observable<Array<Menudto>>{

    return new Observable((observer) => {
      
      this.db.collection("config").doc("menu_config").collection<Documentmenu>("menu").valueChanges().subscribe(
        datamenu => {
          
          var dataarray = new Array<Menudto>();

            for (let i = 0; i < datamenu.length; i++) {

            this.db.collection("config").doc("menu_config").collection("menu").doc(datamenu[i].menu_uid).collection<Documentsubmenu>("submenu").valueChanges().subscribe(
              datasubmenu => {
                  var objectmenu = new Menudto();

                    objectmenu.menu = datamenu[i];
                    objectmenu.submenu = datasubmenu;

                  var index = this.validate_repeat_menu(dataarray, datamenu[i]);

                  if(index >= 0){
                    dataarray[index].menu = datamenu[i];
                    dataarray[index].submenu = datasubmenu;
                  }else{
                    dataarray.push(objectmenu);
                  }

                    if (i == datamenu.length - 1) {
                      observer.next(dataarray);
                    }
                  },
                  errorsubmenu => {
                    observer.next(dataarray);
                  }
              )
            }
          },
          errormenu => {
            observer.next([]);
          }
      )
    })
  }

  /**
   * Guarda o reemplaza un menu
   * Save or replace a menu
   *
   * @param {string} uid Identificador del menu - Menu identifier
   * @param {*} data Objeto con la información del menu - Object with the menu information
   * @returns
   * @memberof MenuService
   */
  add_menu(uid : string, data){
    return this.db.collection("config").doc("menu_config").collection("menu").doc(uid).set(data);
  }

  /**
   * Modifica el estado del menu
   * Modify the menu status
   *
   * @param {string} uid Identificador del menu a modificar el estado - Menu identifier to modify the status
   * @param {*} data Objeto con el nuevo estado del menu - Object with new menu status
   * @returns
   * @memberof MenuService
   */
  change_state_menu(uid : string, data){
    return this.db.collection("config").doc("menu_config").collection("menu").doc(uid).update(data);
  }

  /**
   * Valida que al obtener los menus con sus submenus, estos no se repitan
   * Validates that when obtaining the menus with their submenus, they are not repeated
   *
   * @param {Array<Menudto>} data Arreglo con la informacion de los menus - Arrangement with menu information
   * @param {Documentmenu} object objeto con la informacion del nuevo menu a agregar - object with the information of the new menu to add
   * @returns
   * @memberof MenuService
   */
  validate_repeat_menu(data : Array<Menudto>, object : Documentmenu){

    for(let i = 0; i < data.length; i++){
      if(data[i].menu.menu_url == object.menu_url){
        return i;
      }
    }

    return -1;

  }

  /**
   * Devuelve solamente la data de menus registrados
   * Returns only the data from registered menus
   *
   * @returns
   * @memberof MenuService
   */
  get_all_menu_only_data(){
    return this.db.collection("config").doc("menu_config").collection<Documentmenu>("menu").valueChanges();
  }
}
