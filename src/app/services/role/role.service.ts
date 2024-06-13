import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DocumentRole } from '../../models/class/class.documentrole';
import { Documentmenu } from '../../models/class/class.documentmenu';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private db : AngularFirestore
  ) { }

  /**
   * Devuelve todos los roles registrados
   * Returns all registered roles
   *
   * @returns
   * @memberof RoleService
   */
  get_all_role(){
    return this.db.collection("config").doc("role_config").collection<DocumentRole>("role").valueChanges();
  }

  /**
   * Guarda o reemplaza un rol siempre y cuando ya este registrado
   * Save or replace a role as long as it is already registered
   *
   * @param {string} uidrole identificador del rol a guardar o reemplazar / identifier of the role to save or replace
   * @param {*} data objeto del rol a guardar o reemplazar / role object to save or replace
   * @returns
   * @memberof RoleService
   */
  add_and_edit_role(uidrole : string, data){
    return this.db.collection("config").doc("role_config").collection("role").doc(uidrole).set(data);
  }

  /**
   * Modifica el estado de un rol
   * Modify the status of a role
   *
   * @param {string} uidrole identificador del rol a actualizar el estado - identifier of the role to update the status
   * @param {*} data objeto que contiene el campo con el nuevo estado - object containing the field with the new state
   * @returns
   * @memberof RoleService
   */
  change_state_role(uidrole : string, data){
    return this.db.collection("config").doc("role_config").collection("role").doc(uidrole).update(data);
  }

  /**
   * Guarda o reemplaza un menu asignado a un rol
   * Save or replace a menu assigned to a role
   *
   * @param {string} uidrole identicador del rol a asignar el menu - identifier of the role to assign the menu
   * @param {string} uidmenu identificador del menu a agregar o reemplazar - menu identifier to add or replace
   * @param {*} data objeto con la informacion del menu a asignar - object with the menu information to assign
   * @returns
   * @memberof RoleService
   */
  assing_menu_to_role(uidrole : string, uidmenu : string, data){
    return this.db.collection("config").doc("role_config").collection("role").doc(uidrole).collection("menu").doc(uidmenu).set(data);
  }

  /**
   * Elimina un menu asignado a un rol
   * Delete a menu assigned to a role
   *
   * @param {string} uidrole Identificador del rol - Role identifier
   * @param {string} uidmenu Identificador del menu a eliminar - Menu identifier to delete
   * @returns
   * @memberof RoleService
   */
  delete_menu_to_role(uidrole : string, uidmenu : string){
    return this.db.collection("config").doc("role_config").collection("role").doc(uidrole).collection("menu").doc(uidmenu).delete();
  }

  /**
   * Devuelve todos los menus asignados a un rol
   * Returns all menus assigned to a role
   *
   * @param {string} uidrole Identificador del rol - Role identifier
   * @returns
   * @memberof RoleService
   */
  get_all_menu_by_role(uidrole : string){
    return this.db.collection("config").doc("role_config").collection("role").doc(uidrole).collection<Documentmenu>("menu").valueChanges();
  }
}
