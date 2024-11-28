import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
/** Models */
import { SubLevels } from "../../../models/class/class.documentSubLevels";
import { Level } from "app/models/class/class.documentLevel";
import { SchoolGrade } from "app/models/class/class.documentschoolGrade";

/** Interface */
import { DataTable } from "app/models/interfaces/data-table";

/** Service */
import { SubLevelsService } from "../../../services/sublevels/sublevels.service";
import { LevelsService } from "app/services/levels/levels.service";
import { GradesService } from "app/services/grades/grades.service";
import { map } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-grades",
  templateUrl: "./grades.component.html",
  styleUrls: ["./grades.component.css"],
})
export class GradesComponent implements OnInit {
  public grade: SchoolGrade;
  public dataTable: DataTable;
  public arrayLevels: Level[];
  public arraySublevels: SubLevels[];
  public arrayGrades: SchoolGrade[];
  public isEdit = false;
  public tablaLevels;
  public sublevel_name: string;
  public level_name: Level;
  public contGrades = 0;

  constructor(
    private gradeService: GradesService,
    private levelService: LevelsService,
    private sublevelService: SubLevelsService
  ) {}

  ngOnInit(): void {
    this.arrayGrades = [];
    this.tablaLevels = $("#datatablesUser").DataTable({});
    this.grade = {
      grade_name: "",
      grade_id: new Date().getTime().toString(),
      grade_status: false,
    };
    this.dataTable = {
      headerRow: ["ID", "NIVEL", "SUBNIVEL", "GRADO", "ESTADO", "ACCIONES"],
      footerRow: ["ID", "NIVEL", "SUBNIVEL", "GRADO", "ESTADO", "ACCIONES"],
      dataRows: [],
    };
    this.getAllDataLevelsActive();
  }

  /**
   * 1. Obtiene el valor level_id del array de niveles
   * 2. Obtiene el subnivel de acuerdo al nivel_ id obtenido.
   * 3. Obtiene el valor sublevel_Id
   * 4. Realiza consulta de grados de acuerdo al sublevel_id
   */
  async getDataGrades(levels) {
    this.arrayGrades = [];
    levels.forEach(async (level: Level) => {
      await this.sublevelService
        .getALLSublevelActive(level.level_id)
        .subscribe((allSublevels) => {
          allSublevels.forEach((subLevel) => {
            this.gradeService
              .getAllGrades(level.level_id, subLevel.sublevel_id)
              .subscribe((dataGrade) => {
                dataGrade.forEach((grade) => {
                  grade.level_name = level.level_name;
                  grade.sublevel_name = subLevel.sublevel_name;
                  if (
                    this.isEdit === true &&
                    this.arrayGrades.find(
                      (data) => data.grade_id === grade.grade_id
                    )
                  ) {
                    const i = this.arrayGrades.findIndex(
                      (data) => data.grade_id === grade.grade_id
                    );
                    this.arrayGrades.splice(i, 1, grade);
                  }
                  if (
                    this.arrayGrades.find(
                      (data) => data.grade_id === grade.grade_id
                    )
                  ) {
                    this.arrayGrades = this.arrayGrades;
                  } else {
                    this.arrayGrades.push(grade);
                  }
                  this.contGrades++;
                  if (this.contGrades === levels.length) {
                    this.initDataTable();
                  }
                });
              });
          });
        });
    });
  }

  /**
   * 1.Obtener listado de niveles
   * 2. filtro para listar solo los niveles activos
   */
  private async getAllDataLevelsActive(): Promise<void> {
    await this.levelService.allLevelActives().subscribe((levels) => {
      this.arrayLevels = levels;
      this.getDataGrades(levels);
    });
  }

  /**
   * 1.Función Editar
   * 2.Cambia estatus de variable isEdit a true */
  public async editSchoolGrade(grade: SchoolGrade) {
    if (grade) {
      this.grade = grade;
      this.isEdit = true;
      this.onChangeLevel(grade.level_id);
    } else {
      return null;
    }
  }

  /** Elimina de manera logica el grado escolar */
  async deleteSchoolGrade(grade: SchoolGrade) {
    this.isEdit = true;
    swal({
      title: "Desea eliminar el grado?",
      text: grade.grade_name,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, eliminar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.gradeService.deleteSchoolGrade(grade);

        swal({
          title: "Ok",
          text: "Se inactivó el grado! " + grade.grade_name,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
        }).catch(swal.noop);
      }
    });
  }

  /** Función Guardar*/
  public async saveSchoolGrade(
    grade: SchoolGrade,
    isValid: boolean
  ): Promise<void> {
    if (isValid) {
      this.gradeService.saveSchoolGrade(grade);
      $("#exampleModalCenter").modal("hide");
      swal({
        title: "Ok",
        text: "Datos procesados correctamente!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "success",
      }).catch(swal.noop);
    } else {
      console.log("*** INVALIDO ***");
    }
  }

  /**
   * 1.Accion del boton registrar
   * 2.Cambia el status de la variable isEdit a false
   * 3.Limpia el formulario */
  public addRegisterSchoolGrade(grade: SchoolGrade): void {
    this.isEdit = false;
    grade = this.grade = {
      grade_name: "",
      grade_id: new Date().getTime().toString(),
      grade_status: false,
    };
  }

  /**
   * 1. Obtener listado de subniveles de acuerdo al nivel elegido
   * 2. Filtrar array, listando solo los subniveles activos
   */
  public async onChangeLevel(level): Promise<void> {
    const dataSubLevel = await this.sublevelService.getALLSublevelActive(level);
    dataSubLevel.subscribe((sublevels) => {
      this.arraySublevels = sublevels;
    });
  }
  /**
   * Inicializa la datatable
   */
  initDataTable() {
    let aaa = this.tablaLevels;
    $("#datatablesLevel").DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $("#datatablesLevel").DataTable({
        paging: true,
        ordering: true,
        info: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        responsive: true,
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Buscar",
        },
      });
    }, 10);
  }
}
