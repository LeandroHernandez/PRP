import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
/** Models */
import { SubLevels } from '../../../models/class/class.documentSubLevels';
import { Level } from 'app/models/class/class.documentLevel';
import { SchoolGrade } from 'app/models/class/class.documentschoolGrade';
import { Parallels } from 'app/models/class/classdocument-parallels';

/** Interface */
import { DataTable } from 'app/models/interfaces/data-table';

/** Service */
import { SubLevelsService } from '../../../services/sublevels/sublevels.service'
import { LevelsService } from 'app/services/levels/levels.service';
import { GradesService } from 'app/services/grades/grades.service';
import { ParallelsService } from 'app/services/parallels/parallels.service'

declare var $: any;
@Component({
  selector: 'app-parallels',
  templateUrl: './parallels.component.html',
  styleUrls: ['./parallels.component.css']
})
export class ParallelsComponent implements OnInit {

  public parallel: Parallels;
  public dataTable: DataTable;
  public arrayLevels: Level[];
  public arraySublevels: SubLevels[];
  public arrayGrades: SchoolGrade[];
  public arrayParallels: Parallels[];
  public isEdit = false;
  public tablaLevels;

  public contParallels = 0;
  private levelId: string;

  constructor(private gradeService: GradesService,
    private levelService: LevelsService,
    private sublevelService: SubLevelsService,
    private parallelService: ParallelsService
  ) { }

  ngOnInit(): void {
    this.arrayParallels = [];
    this.tablaLevels = $('#datatablesUser').DataTable({});
    this.parallel = {
      parallel_name: '',
      parallel_id: new Date().getTime().toString(),
      parallel_status: false,
    }
    this.dataTable = {
      headerRow: ['ID', 'NIVEL', 'SUBNIVEL', 'GRADO', 'PARALELO', 'ESTADO', 'ACCIONES'],
      footerRow: ['ID', 'NIVEL', 'SUBNIVEL', 'GRADO', 'PARALELO', 'ESTADO', 'ACCIONES'],
      dataRows: []
    };
    this.getAllDataLevelsActive()
  }

  /** Función Guardar*/
  public async saveParallel(parallel: Parallels, isValid: boolean): Promise<void> {
    console.log(parallel)
    if (isValid) {
      this.parallelService.saveParallels(parallel);
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
   * Obtener datos de niveles.
   */
  private async getAllDataLevelsActive(): Promise<void> {
    await this.levelService.allLevelActives().subscribe(levels => {
      this.arrayLevels = levels;
      this.getDataParallels(levels)
    });
  }

  /**
 * 1.Accion del boton registrar
 * 2.Cambia el status de la variable isEdit a false
 * 3.Limpia el formulario */
  public addRegisterParallel(parallel: Parallels): void {
    this.isEdit = false;
    parallel = this.parallel = {
      parallel_name: '',
      parallel_id: new Date().getTime().toString(),
      parallel_status: false,
    }
  }

  /**
   * Detectar selección de nivel y generar array de Subniveles
   * @param levelId
   */
  public async onChangeLevel(levelId): Promise<void> {
    this.levelId = levelId
    await this.sublevelService.getALLSublevelActive(levelId).subscribe(sublevel => {
      this.arraySublevels = sublevel
    })
  }

  /**
   * Detectar selección de subnivel y generar array de grados
   * @param sublevelId
   */
  public async onChangeSublevel(sublevelId): Promise<void> {
    await this.gradeService.getAllGradesActive(this.levelId, sublevelId).subscribe(grades => {
      this.arrayGrades = grades;
    })
  }

  /**
   * Metodo para obtener listado de Paralelos
   * @param levels
   */
  async getDataParallels(levels) {
    this.arrayParallels = [];
    levels.forEach(async (level: Level) => {
      await this.sublevelService.getALLSublevelActive(level.level_id).subscribe(allSublevels => {
        allSublevels.forEach((subLevel) => {
          this.gradeService.getAllGradesActive(level.level_id, subLevel.sublevel_id).subscribe(dataGrade => {
            dataGrade.forEach(grade => {
              this.parallelService.getAllParallels(level.level_id, subLevel.sublevel_id, grade.grade_id).subscribe(parallels => {
                parallels.forEach(parallel => {
                  parallel.level_name = level.level_name;
                  parallel.sublevel_name = subLevel.sublevel_name;
                  parallel.grade_name = grade.grade_name;
                  if (this.isEdit === true && this.arrayParallels.find(data => data.parallel_id === parallel.parallel_id)) {
                    const i = this.arrayParallels.findIndex(data => data.parallel_id === parallel.parallel_id)
                    this.arrayParallels.splice(i, 1, parallel)
                  }
                  if (this.arrayParallels.find(data => data.parallel_id === parallel.parallel_id)) {
                    this.arrayParallels = this.arrayParallels;
                  } else {
                    this.arrayParallels.push(parallel)
                  }
                  this.contParallels++;
                  if (this.contParallels === levels.length) {
                    this.initDataTable();
                  }
                })
              })
            })
          })
        })
      })
    })

  }

  /**
 * 1.Función Editar
 * 2.Cambia estatus de variable isEdit a true */
  public async editParallel(parallel: Parallels) {
    if (parallel) {
      this.parallel = parallel;
      this.isEdit = true;
      this.onChangeLevel(parallel.level_id);
      this.onChangeSublevel(parallel.sublevel_id);
    } else {
      return null;
    }
  }

  /** Elimina de manera logica el paralelo  */
  async deleteParallel(parallel: Parallels) {
    this.isEdit = true;
    swal({
      title: 'Desea eliminar el paralelo?',
      text: parallel.parallel_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, eliminar!',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.parallelService.deleteParallel(parallel);
        swal({
          title: 'Ok',
          text: 'Se inactivó el paralelo! ' + parallel.parallel_name,
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
  initDataTable(): void {
    let aaa = this.tablaLevels;
    $('#datatablesLevel').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesLevel').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[50, -1], [50, 'All']],
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
        },
      });
    }, 10)
  }
}

