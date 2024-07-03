import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

/** Models */
import { Level } from 'app/models/class/class.documentLevel';
import { DataTable } from 'app/models/interfaces/data-table';

/** Service */
import { LevelsService } from 'app/services/levels/levels.service'
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {

  public arrayGrades;
  public level: Level;
  public arrayLevels: Array<Level>;
  public isEdit = false;
  public dataTable: DataTable;
  public tablaLevels;
  public = false;
  public nvideos;
  constructor(
    private levelService: LevelsService,
    private _sanitizer: DomSanitizer

  ) {
  }

  ngOnInit(): void {
    this.arrayGrades = [1,2,3,4,5,6,7,8,9,0]
    this.tablaLevels = $('#datatablesUser').DataTable({});

    this.level = {
      level_name: '',
      level_id: new Date().getTime().toString(),
      level_status: false,
    }

    this.dataTable = {
      headerRow: ['ID', 'NIVEL', 'ESTADO', 'ACCIONES'],
      footerRow: ['ID', 'NIVEL', 'ESTADO', 'ACCIONES'],
      dataRows: []
    };
    this.arrayLevels = [];
    this.nvideos = [1]
    this.getDataLevel()
    // this.getVideoIframe()
  }

  getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
}


  /**
   * AGREGAR REGISTRO DE NIVEL
   * @param level
   */
  public addRegisterLevel(level: Level): void {
    this.isEdit = false;
    level = this.level = {
      level_name: '',
      level_id: new Date().getTime().toString(),
      level_status: false,
    }
  }

  /**
   * OBTENER DATOS DE NIVEL
   */
  async getDataLevel(): Promise<void> {
    const response = await this.levelService.allLevel();
    response.subscribe(level => {
      this.arrayLevels = level;
      this.initDataTable();
    });
  }

  /**
   *  GUARDAR NIVEL
   * @param level
   * @param isValid
   */
  async saveLevel(level: Level, isValid: boolean): Promise<void> {
    if (isValid) {
      this.levelService.saveLevel(level);
      $('#exampleModalCenter').modal('hide');
      swal({
        title: 'Ok',
        text: 'Datos procesados correctamente!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success',

      }).catch(swal.noop)
    } else {
      console.log('*** INVALIDO ***');
    }
  }

  /**
   *  EDITAR NIVEL
   * @param level
   */
  public editLevel(level: Level): void {
    if (level) {
      this.level = level;
      this.isEdit = true;
      console.log(level)
    } else {
    }

  }

  /**
   * ELIMINAR NIVEL
   * @param level
   */
  async deleteLevel(level: Level): Promise<void> {
    swal({
      title: 'Actualizar el estado del nivel ?',
      text: level.level_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, actulizar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.levelService.deleteLevel(level);

        swal({
          title: 'Ok',
          text: 'Se inactivó el nivel! ' + level.level_name,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-fill btn-success',
          type: 'success'
        }).catch(swal.noop)
      }
    })
  }

  /**
   * Inicializa la datatable
   */
  initDataTable() {
    // Destruir DataTable si ya está inicializada
    if ($.fn.DataTable.isDataTable('#datatablesLevel')) {
      $('#datatablesLevel').DataTable().destroy();
    }
    
    // Inicializar DataTable
    this.tablaLevels = $('#datatablesLevel').DataTable({
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
  }
  
}
