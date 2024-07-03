import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DocumentRole } from '../../../models/class/class.documentrole';
import { MatTableDataSource } from '@angular/material/table';
import { Documentmenu } from '../../../models/class/class.documentmenu';
import { RoleService } from '../../../services/role/role.service';
import { MenuService } from '../../../services/menu/menu.service';
import swal from 'sweetalert2';
import { Librariesdate } from '../../../libraries/class/class.librariesdate';
declare var $: any;
@Component({
  selector: 'app-listrole',
  templateUrl: './listrole.component.html',
  styleUrls: ['./listrole.component.css']
})
export class ListroleComponent implements OnInit {

  /** Formulario de Rol */

  role_form: FormGroup;

  public role_name = new FormControl('');

  public data_menu = new Array<Documentmenu>();

  public data_role = new Array<DocumentRole>();

  /** Variables para CRUD de rol */

  public data_menu_assing_to_rol = new Array<Documentmenu>();

  public data_role_selected = new DocumentRole();

  public flag_action_role = true;

  public name_action_role = 'Crear';

  /** Libreria Fecha */

  public libraries_date = new Librariesdate();

  public tablaLevels;

  /** Variables para la tabla de material desing */

  public displayedColumns;
  public dataSource;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.init_form_role();
    this.get_data_menu_for_assign_rod();
    this.get_data_role();
  }

  /**
   * Inicializa el formulario de registro y edicion del rol
   * Initialize the registration form and edit the role
   *
   * @memberof ListroleComponent
   */
  init_form_role() {
    this.role_form = this.formBuilder.group({
      role_name: ['', Validators.required]
    });
  }

  /**
   * Obtiene la informacion de menus relacionados al rol seleccionado para su modificacion
   * Obtains the menu information related to the selected role for modification
   *
   * @memberof ListroleComponent
   */
  get_data_menu_for_assign_rod() {
    this.menuService.get_all_menu_only_data().subscribe(
      datamenu => {
        this.data_menu = datamenu;
        //console.log("Data del Menu --->" , this.data_menu)
      },
      () => {
        this.data_menu = [];
      }
    )
  }

  /**
   * Obtiene la data de los roles registrados y los carga en la tabla
   * Get the data of the registered roles and load them into the table
   *
   * @memberof ListroleComponent
   */
  get_data_role() {
    this.roleService.get_all_role().subscribe(
      datarole => {
        this.load_data_table_pagination(datarole);
        this.data_role = datarole;
        this.initDataTable()
      },
      () => {
        this.load_data_table_pagination([]);
        this.data_role = [];
      }
    )
  }

  /**
   * Carga la data en la tabla de material desing
   * Load the data into the material design table
   *
   * @param {*} data
   * @memberof ListroleComponent
   */
  load_data_table_pagination(data) {
    this.displayedColumns  = ['role_name', 'option'];
    this.dataSource = new MatTableDataSource<DocumentRole>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Carga la data del rol seleccionado para editar
   * Load the data of the selected role to edit
   *
   * @param {DocumentRole} data
   * @memberof ListroleComponent
   */
  load_data_role_for_edit(data: DocumentRole) {

    this.flag_action_role = false;
    this.name_action_role = 'Editar';
    this.role_form.controls.role_name.setValue(data.role_name);
    this.data_role_selected = data;

    this.roleService.get_all_menu_by_role(data.role_uid).subscribe(
      datamenubyrole => {
        this.data_menu_assing_to_rol = datamenubyrole;
        //console.log(datamenubyrole)
      },
        () => {
        this.data_menu_assing_to_rol = [];
      }
    )
  }

  /**
   * Agrega o modifica un rol deacuerdo a la opcion seleccionada por el usuario
   * Add or modify a role according to the option selected by the user
   *
   * @memberof ListroleComponent
   */
  async action_role() {
    let name_for_save_or_update_role = '';
    name_for_save_or_update_role = this.role_form.value.role_name;
    const uid = this.libraries_date.get_timestamp_current().toString();
    if (this.flag_action_role === true) {
      if (this.valid_repeat_role(name_for_save_or_update_role.toUpperCase()) === true) {
        await this.add_or_update_role(name_for_save_or_update_role, uid);
        await swal('Aviso', 'Se ha creado correctamente.', 'success');
      } else {
        await swal('Aviso', 'Ya existe el rol.', 'warning');
      }
    } else {
      if (name_for_save_or_update_role.toUpperCase() !== this.data_role_selected.role_name) {
        if (this.valid_repeat_role(name_for_save_or_update_role.toUpperCase()) === true) {
          await this.add_or_update_role(name_for_save_or_update_role, this.data_role_selected.role_uid);
          await swal('Aviso', 'Se ha creado correctamente.', 'success');
        } else {
          await swal('Aviso', 'Ya existe el rol.', 'warning');
        }
      } else {
        await this.add_or_update_role(name_for_save_or_update_role, this.data_role_selected.role_uid);
        await swal('Aviso', 'Se ha creado correctamente.', 'success');
      }
    }
  }

  /**
   * Logica para guardar o reemplazar el rol
   * Logic to save or replace the role
   *
   * @param {string} namerole Nombre del rol a guardar o actualizar - Role name to save or update
   * @param {string} uidrole Identificador del rol a guardar o actualizar - Identifier of the role to save or update
   * @memberof ListroleComponent
   */
  async add_or_update_role(namerole: string, uidrole: string) {
      const object_role = {
        role_uid : uidrole,
        role_name : namerole.toUpperCase(),
        role_state : true
      }
      await this.roleService.add_and_edit_role(uidrole, object_role).then().catch();
      for (let i = 0; i < this.data_menu_assing_to_rol.length; i++) {
        await this.roleService.assing_menu_to_role(uidrole,
            this.data_menu_assing_to_rol[i].menu_uid,
            this.data_menu_assing_to_rol[i]).then().catch();
      }
  }

  /**
   * Resetea las variables para la creación de un rol
   * Reset variables for creating a role
   *
   * @memberof ListroleComponent
   */
  open_modal_add_role() {
    this.init_form_role();
    this.flag_action_role = true;
    this.name_action_role = 'Crear';
    this.data_menu_assing_to_rol = [];
  }

  /**
   * Elimina un menu asignado a un rol
   * Delete a menu assigned to a role
   *
   * @param {Documentmenu} menu Objeto del menu a eliminar - Menu object to remove
   * @param {number} index Indice del menu a eliminar - Index of the menu to delete
   * @memberof ListroleComponent
   */
  question_delete_menu(menu: Documentmenu, index: number) {

    swal({
      title: 'Aviso',
      text: 'Esta seguro que desea eliminar el menu ' + menu.menu_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar',
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.value) {

        if (this.flag_action_role === true) {
          this.data_menu_assing_to_rol.splice(index, 1);
        } else {
          await this.roleService.delete_menu_to_role(
              this.data_role_selected.role_uid,
              menu.menu_uid).then()
              .catch();
        }

        swal({
          title: 'Aviso',
          text: 'Se ha eliminado el menu correctamente',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })

  }

  /**
   * Modifica el estado de un rol
   * Modify the status of a role
   *
   * @param {DocumentRole} role Objeto del rol a modificar el estado - Purpose of the role to modify the status
   * @memberof ListroleComponent
   */
  question_delete_role(role: DocumentRole) {
    const mensaje = (role.role_state === true) ? 'desabilitar' : 'habilitar';
    swal({
      title: 'Aviso',
      text: 'Está seguro que desea ' + mensaje + ' el rol ' + role.role_name + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, ' + mensaje,
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.delete_menu(role.role_uid, role);
      }
    })
  }

  /**
   * Elimina el menu en firebase
   * Delete the menu in firebase
   *
   * @param {string} uidrole Identificador del rol - Role identifier
   * @param {DocumentRole} element Objeto del rol - Purpose of the role
   * @memberof ListroleComponent
   */
  async delete_menu(uidrole: string, element: DocumentRole) {
    const object_for_change_state_role = {
      role_state : !element.role_state
    }
    await this.roleService.change_state_role(uidrole, object_for_change_state_role).then().catch();
    await swal('Aviso', 'Se ha actualizado correctamente.', 'success');
  }

  /**
   * Asigna un menu a un rol
   * Assign a menu to a role
   *
   * @param {Documentmenu} menu Objeto del menu a asignar - Menu object to assign
   * @memberof ListroleComponent
   */
  assign_menu_to_role(menu: Documentmenu) {
    if (this.valid_repeat_menu_assign_to_role(menu) === true) {
      this.data_menu_assing_to_rol.push(menu);
      swal('Aviso', 'Se ha asignado correctamente.', 'success');
    } else {
      swal('Aviso', 'Ya existe el menu.', 'warning');
    }
  }

  /**
   * Valida que no se repitan los menus asignados a un rol
   * Validate that the menus assigned to a role are not repeated
   * @param {Documentmenu} menu Objeto del menu - Menu object
   * @returns
   * @memberof ListroleComponent
   */
  valid_repeat_menu_assign_to_role(menu: Documentmenu) {
    for (let i = 0; i < this.data_menu_assing_to_rol.length; i++) {
      if (this.data_menu_assing_to_rol[i].menu_url === menu.menu_url) {
        return false;
      }
    }
    return true;
  }

  /**
   * Valida que no se repitan los roles
   * Validate that the roles are not repeated
   *
   * @param {string} namerole Nombre del rol - Role name
   * @returns
   * @memberof ListroleComponent
   */
  valid_repeat_role(namerole: string) {
    for (let i = 0; i < this.data_role.length; i++) {
      if (this.data_role[i].role_name === namerole) {
        return false;
      }
    }

    return true;
  }
  // Activar Busqueda
  private initDataTable() {
    let aaa = this.tablaLevels;
    $('#datatablesRole').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesRole').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
        },
      });
    }, 10)
  }

}
