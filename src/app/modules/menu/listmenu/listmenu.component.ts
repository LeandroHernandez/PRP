import { Component, OnInit, ViewChild } from '@angular/core';
import { Menudto } from '../../../models/dto/class.menudto';
import { MenuService } from '../../../services/menu/menu.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Documentsubmenu } from '../../../models/class/class.documentsubmenu';
import { Librariesdate } from '../../../libraries/class/class.librariesdate';
import swal from 'sweetalert2';
import { SubmenuService } from '../../../services/menu/submenu.service';
import { DataTable } from '../../../models/interfaces/data-table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/firestore';

declare var $: any;

@Component({
  selector: 'app-listmenu',
  templateUrl: './listmenu.component.html',
  styleUrls: ['./listmenu.component.css']
})
export class ListmenuComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  menu_form: FormGroup;

  public menu_name = new FormControl('');

  public menu_url = new FormControl('');

  public menu_icon = new FormControl('');

  submenu_form: FormGroup;

  public submenu_name = new FormControl('');

  public submenu_url = new FormControl('');

  public submenu_icon = new FormControl('');

  public data_menu_selected_for_edit = new Menudto();

  public data_menu = new Array<Menudto>();

  public data_submenu = new Array<Documentsubmenu>();

  public flag_action_menu = true;

  public name_action_menu = 'Crear Menu';

  public flag_action_submenu = true;

  public name_action_submenu = 'Crear SubMenu';

  public index_submenu_selected_for_edit = 0;

  public headerRow = ['NOMBRE', 'URL', 'ICONO', 'ESTADO', 'ACCIONES'];

  /** Librerias */

  public libraries_date = new Librariesdate();

  public dataTable: DataTable;

  public tablaMenu;

  public displayedColumns;
  public dataSource;

  constructor(
    private menuService: MenuService,
    private submenuService: SubmenuService,
    private formulario: FormBuilder, private firestore: AngularFirestore
  ) {
    this.init_form_menu();
    this.init_form_submenu();
  }


  ngOnInit() {
    this.tablaMenu = $('#datatables').DataTable({});
    this.dataTable = {
      headerRow: ['NOMBRE', 'URL', 'ICONO', 'ACCIONES'],
      footerRow: ['NOMBRE', 'URL', 'ICONO', 'ACCIONES'],
      dataRows: []
    };
    this.get_data_menu();
  }

  init_form_menu() {
    this.menu_form = this.formulario.group({
      menu_name: ['', Validators.required],
      menu_url: ['', Validators.required],
      menu_icon: ['', Validators.required]
    });
  }

  init_form_submenu() {
    this.submenu_form = this.formulario.group({
      submenu_name: ['', Validators.required],
      submenu_url: ['', Validators.required],
      submenu_icon: ['', Validators.required]
    });
  }

  get_data_menu() {
    this.menuService.get_all_menu().subscribe(
      datamenu => {
        this.data_menu = datamenu
        this.load_data_table_pagination(datamenu)
        // this.initDataTable()
      },
      () => {
        this.data_menu = [];
        this.load_data_table_pagination([]);
      }
    )
  }

  load_data_table_pagination(data) {
    this.displayedColumns  = ['menu_name', 'menu_url', 'menu_icon', 'option'];
    this.dataSource = new MatTableDataSource<Menudto>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public load_data_menu_for_edit(element: Menudto) {

    this.data_menu_selected_for_edit = element;
    this.flag_action_menu = false;
    this.name_action_menu = 'Editar Menu';
    this.data_submenu = element.submenu;

    this.menu_form.controls.menu_name.setValue(element.menu.menu_name);
    this.menu_form.controls.menu_url.setValue(element.menu.menu_url);
    this.menu_form.controls.menu_icon.setValue(element.menu.menu_icon);
  }

  public question_delete_menu(element: Menudto) {
    const mensaje = (element.menu.menu_state === true) ? 'desabilitar' : 'habilitar';
    swal({
      title: 'Aviso',
      text: 'Está seguro que desea ' + mensaje + ' el menu ' + element.menu.menu_name + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, ' + mensaje,
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.delete_menu(element.menu.menu_uid, element);
      }
    })
  }

  async delete_menu(uidmenu: string, element: Menudto) {
    const object_for_change_state_menu = {
      menu_state : !element.menu.menu_state
    }
    await this.menuService.change_state_menu(uidmenu, object_for_change_state_menu).then().catch();
    await swal('Aviso', 'Se ha actualizado correctamente.', 'success');
  }

  open_modal_create_menu() {
    this.flag_action_menu = true;
    this.name_action_menu = 'Crear Menu';
    this.data_submenu = [];
    this.init_form_menu();
  }

  open_modal_create_submenu() {
    this.flag_action_submenu = true;
    this.name_action_submenu = 'Crear SubMenu';
    this.init_form_submenu();
  }

  load_data_submenu_for_edit(data: Documentsubmenu, index: number) {
    this.index_submenu_selected_for_edit = index;
    this.flag_action_submenu = false;
    this.name_action_submenu = 'Editar SubMenu';
    this.submenu_form.controls.submenu_name.setValue(data.submenu_name);
    this.submenu_form.controls.submenu_url.setValue(data.submenu_url);
    this.submenu_form.controls.submenu_icon.setValue(data.submenu_icon);
  }

  change_status_submenu(index: number) {
    const mensaje = (this.data_submenu[index].submenu_state === true) ? 'desabilitar' : 'habilitar';
    swal({
      title: 'Aviso',
      text: 'Esta seguro que desea ' + mensaje + ' el submenu ' + this.data_submenu[index].submenu_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, ' + mensaje,
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        const { submenu_state } = this.data_submenu[index];
        this.data_submenu[index].submenu_state = !submenu_state;
        swal({
          title: 'Aviso',
          text: 'Se ha actualizado el submenu correctamente',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }

  async action_menu() {
    let url_menu_for_register = '';
    url_menu_for_register = this.menu_form.value.menu_url;
    if (this.flag_action_menu === true) {
      if (this.validate_repeat_menu(url_menu_for_register.toLowerCase()) === true) {
        await this.add_or_update_data_menu(url_menu_for_register.toLowerCase());
      } else {
        await swal('Aviso', 'Ya existe el menu.', 'warning');
      }
    } else {
      if (url_menu_for_register === this.data_menu_selected_for_edit.menu.menu_url) {
        await this.add_or_update_data_menu(url_menu_for_register.toLowerCase());
      } else {
        if (this.validate_repeat_menu(url_menu_for_register.toLowerCase()) === true) {
          await this.add_or_update_data_menu(url_menu_for_register.toLowerCase());
        } else {
          await swal('Aviso', 'Ya existe el menu.', 'warning');
        }
      }
    }
  }

  async add_or_update_data_menu(urlmenu: string) {
    const uid = (this.flag_action_menu === true) ?
        this.libraries_date.get_timestamp_current().toString() :
        this.data_menu_selected_for_edit.menu.menu_uid;
    const object_menu = {
      menu_uid : uid,
      menu_name : this.menu_form.value.menu_name,
      menu_url : urlmenu,
      menu_icon : this.menu_form.value.menu_icon,
      menu_state : (this.flag_action_menu === true) ? true : this.data_menu_selected_for_edit.menu.menu_state
    };

    if (this.flag_action_menu) {
        await this.menuService.add_menu(uid, object_menu).then().catch();
        for (let i = 0; i < this.data_submenu.length; i++) {
          const object_submenu = {
            submenu_uid : this.data_submenu[i].submenu_uid,
            submenu_name : this.data_submenu[i].submenu_name,
            submenu_url : this.data_submenu[i].submenu_url,
            submenu_icon : this.data_submenu[i].submenu_icon,
            submenu_state : this.data_submenu[i].submenu_state
          };
          await this.submenuService.add_submenu(uid, this.data_submenu[i].submenu_uid, object_submenu).then().catch();
        }
    } else {
        //console.log("Entreer alEditar ")
        // Aquí se llama al nuevo método EditMenuRol() cuando flag_action_menu es false
        await this.menuService.add_menu(uid, object_menu).then().catch();
        await this.updateMenuInAllRoles(uid, object_menu);

    }

    const message_action_menu = (this.flag_action_menu === true) ? 'registrado' : 'actualizado';
    await swal('Aviso', 'Se ha ' + message_action_menu + ' correctamente.', 'success');
}


// Función para actualizar un menú en todos los roles que lo contienen
async updateMenuInAllRoles(menuId: string, updatedMenuData: any) {
  // Obtener un snapshot de todos los documentos en la colección 'role'
  const rolesSnapshot = await this.firestore.collection("config/role_config/role").get().toPromise();

  // Iterar sobre cada documento de rol
  for (const roleDoc of rolesSnapshot.docs) {
    // Referencia a la subcolección de menús dentro del rol actual
    const menuDocRef = this.firestore.doc(`config/role_config/role/${roleDoc.id}/menu/${menuId}`);
    const menuDoc = await menuDocRef.get().toPromise();

    if (menuDoc.exists) {
      // Si el documento del menú existe, actualízalo
      await menuDocRef.set(updatedMenuData, { merge: true });
      //console.log(`Menu ${menuId} updated in role ${roleDoc.id}`);
    } else {
      //console.log(`Menu ${menuId} not found in role ${roleDoc.id}`);
    }
  }
}




  action_submenu() {
    const convert_url_lowercase = this.submenu_form.value.submenu_url;
    if (this.flag_action_submenu === true) {
      if (this.validate_repeat_submenu(convert_url_lowercase.toLowerCase()) === true) {
        const object_submenu = new Documentsubmenu();
        object_submenu.submenu_uid = this.libraries_date.get_timestamp_current().toString();
        object_submenu.submenu_name = this.submenu_form.value.submenu_name;
        object_submenu.submenu_url = convert_url_lowercase.toLowerCase();
        object_submenu.submenu_icon = this.submenu_form.value.submenu_icon;
        object_submenu.submenu_state = true;
        this.data_submenu.push(object_submenu);
        swal('Aviso', 'El submenu se ha registrado correctamente.', 'success');
      } else {
        swal('Aviso', 'El submenu ya esta ingresado.', 'warning');
      }
    } else {
      if (convert_url_lowercase.toLowerCase() === this.data_submenu[this.index_submenu_selected_for_edit].submenu_url) {
        this.data_submenu[this.index_submenu_selected_for_edit].submenu_name = this.submenu_form.value.submenu_name;
        this.data_submenu[this.index_submenu_selected_for_edit].submenu_icon = this.submenu_form.value.submenu_icon;
        swal('Aviso', 'El submenu se ha actualizado correctamente.', 'success');
      } else {
        if (this.validate_repeat_submenu(convert_url_lowercase.toLowerCase()) === true) {

          this.data_submenu[this.index_submenu_selected_for_edit].submenu_name = this.submenu_form.value.submenu_name;
          this.data_submenu[this.index_submenu_selected_for_edit].submenu_icon = this.submenu_form.value.submenu_icon;
          this.data_submenu[this.index_submenu_selected_for_edit].submenu_url = convert_url_lowercase.toLowerCase();
          swal('Aviso', 'El submenu se ha actualizado correctamente.', 'success');
        } else {
          swal('Aviso', 'El submenu ya esta ingresado.', 'warning');
        }
      }
    }
  }

  validate_repeat_submenu(url: string) {
    for (let i = 0; i < this.data_submenu.length; i++) {
      if (this.data_submenu[i].submenu_url === url) {
        return false;
      }
    }
    return true;
  }

  validate_repeat_menu(urlmenu: string) {
    for (let i = 0; i < this.data_menu.length; i++) {
      if (this.data_menu[i].menu.menu_url === urlmenu) {
        return false;
      }
    }
    return true;
  }

  private initDataTable() {
    let aaa = this.tablaMenu;
    $('#datatableMenu').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatableMenu').DataTable({
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
