import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";

/** Models */
import { SubLevels } from "../../../models/class/class.documentSubLevels";
import { Level } from "app/models/class/class.documentLevel";

/** Interface */
import { DataTable } from "app/models/interfaces/data-table";

/** Service */
import { SubLevelsService } from "../../../services/sublevels/sublevels.service";
import { LevelsService } from "app/services/levels/levels.service";
declare var $: any;

@Component({
  selector: "app-sublevels",
  templateUrl: "./sublevels.component.html",
  styleUrls: ["./sublevels.component.css"],
})
export class SubLevelsComponent implements OnInit {
  public sublevel: SubLevels;
  public dataTable: DataTable;
  public arrayLevels: Level[];
  public arraySublevels: Array<any>;
  public resSublevels: Array<Object>;
  public isEdit = false;
  public tablaLevels;
  public contLevels = 0;
  public contSubLevels = 0;

  constructor(
    private sublevelService: SubLevelsService,
    private levelService: LevelsService
  ) {}

  ngOnInit(): void {
    this.tablaLevels = $("#datatablesUser").DataTable({});
    this.sublevel = {
      sublevel_name: "",
      sublevel_id: new Date().getTime().toString(),
      sublevel_status: false,
    };

    this.dataTable = {
      headerRow: ["ID", "NIVEL", "SUBNIVEL", "ESTADO", "ACCIONES"],
      footerRow: ["ID", "NIVEL", "SUBNIVEL", "ESTADO", "ACCIONES"],
      dataRows: [],
    };
    this.arraySublevels = [];
    this.getDataLevel();
    this.arrayLevels = [];
  }

  async getDataSublevels(l) {
    this.arraySublevels = [];
    l.forEach(async (level: Level) => {
      this.arraySublevels = [];
      await this.sublevelService
        .getAllSublevels(level.level_id)
        .subscribe((allSubLevesls) => {
          allSubLevesls.forEach((subLevel) => {
            subLevel.level_name = level.level_name;
            if (
              this.isEdit === true &&
              this.arraySublevels.find(
                (data) => data.sublevel_id === subLevel.sublevel_id
              )
            ) {
              const i = this.arraySublevels.findIndex(
                (data) => data.sublevel_id === subLevel.sublevel_id
              );
              this.arraySublevels.splice(i, 1, subLevel);
            }
            if (
              this.arraySublevels.find(
                (data) => data.sublevel_id === subLevel.sublevel_id
              )
            ) {
              this.arraySublevels = this.arraySublevels;
            } else {
              this.arraySublevels.push(subLevel);
            }
            this.contSubLevels++;
            if (this.contSubLevels === l.length) {
              this.initDataTable();
            }
          });
        });
    });
  }

  /**
   * Metodo para agregar registro de subnivel.
   * @param sublevel
   */
  public addRegisterSublevel(sublevel: SubLevels): void {
    this.isEdit = false;
    sublevel = this.sublevel = {
      sublevel_name: "",
      sublevel_id: new Date().getTime().toString(),
      sublevel_status: false,
    };
  }

  /**
   * Metodo para editar Subnivel.
   * @param sublevel
   */
  public editSublevel(sublevel: SubLevels): void {
    if (sublevel) {
      this.sublevel = sublevel;
      this.isEdit = true;
    } else {
      return null;
    }
  }

  /**
   * Metodo para eliminar Subnivel.
   * @param sublevel
   */
  async deleteSublevel(sublevel: SubLevels): Promise<void> {
    this.isEdit = true;
    swal({
      title: "Desea eliminar el subnivel?",
      text: sublevel.sublevel_name,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, eliminar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.sublevelService.deleteSublevel(sublevel);
        swal({
          title: "Ok",
          text: "Se inactivó el subnivel! " + sublevel.sublevel_name,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
        }).catch(swal.noop);
      }
    });
  }

  /**
   * 1.Metodo para obtner array de niveles.
   * 2. filtrar lista con solo los niveles activos.
   */
  async getDataLevel(): Promise<void> {
    await this.levelService.allLevelActives().subscribe((levels) => {
      this.arrayLevels = levels;
      this.getDataSublevels(levels);
    });
  }

  /**
   * Metodo Guardar subnivel
   * @param sublevel
   * @param isValid
   */
  async saveSublevel(sublevel: SubLevels, isValid: boolean) {
    if (isValid) {
      this.sublevelService.saveSublevel(sublevel);
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
   * Inicializa la datatable
   */
  initDataTable(): void {
    let aaa = this.tablaLevels;
    $("#datatablesLevel").DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $("#datatablesSubLevel").DataTable({
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
