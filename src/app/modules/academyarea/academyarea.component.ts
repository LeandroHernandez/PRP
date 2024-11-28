import { Component, OnInit, ViewChild } from "@angular/core";
import { Academyareadocum } from "../../models/academyarea/academyareadocum.model";
import swal from "sweetalert2";
import { DataTable } from "app/models/academyarea/datatable";
import { AcademyareaService } from "../../services/academyarea/academyarea.service";

/**SERVICES */
import { LevelsService } from "app/services/levels/levels.service";
import { SubLevelsService } from "app/services/sublevels/sublevels.service";

/** Models */
import { Level } from "app/models/class/class.documentLevel";
import { SubLevels } from "app/models/class/class.documentSubLevels";

declare var $: any;
@Component({
  selector: "app-academyarea",
  templateUrl: "./academyarea.component.html",
  styleUrls: ["./academyarea.component.css"],
})
export class AcademyareaComponent implements OnInit {
  public data_academyarea: Array<Academyareadocum>;
  public AcademyD: Academyareadocum;
  public isEdit = false;
  public dataTable: DataTable;
  public tablaAcad;
  public arrayLevels: Level[];
  public arraySublevels: SubLevels[];
  public arrayAreas = [];
  public = false;
  contAreas: any;

  constructor(
    private academyareaService: AcademyareaService,
    private levelService: LevelsService,
    private sublevelService: SubLevelsService
  ) {}

  ngOnInit(): void {
    this.tablaAcad = $("#datatables1").DataTable({});

    this.AcademyD = {
      academyarea_id: new Date().getTime().toString(),
      academyarea_cod: "",
      academyarea_name: "",
      academyarea_state: false,
    };

    this.dataTable = {
      headerRow: [
        "ID",
        "NIVEL",
        "SUBNIVEL",
        "CODIGO",
        "NOMBRE",
        "ESTADO",
        "ACCIONES",
      ],
      footerRow: [
        "ID",
        "NIVEL",
        "SUBNIVEL",
        "CODIGO",
        "NOMBRE",
        "ESTADO",
        "ACCIONES",
      ],
      dataRows: [],
    };
    this.data_academyarea = [];
    //  this.getAcademydata()
    this.getAllDataLevelsActive();
  }
  async getAcademydata(levels) {
    this.arrayAreas = [];
    levels.forEach(async (level: Level) => {
      await this.sublevelService
        .getALLSublevelActive(level.level_id)
        .subscribe((allSublevels) => {
          allSublevels.forEach((subLevel) => {
            this.academyareaService
              .getAllAcademyArea(level.level_id, subLevel.sublevel_id)
              .subscribe((areas) => {
                areas.forEach((area) => {
                  area.level_name = level.level_name;
                  area.sublevel_name = subLevel.sublevel_name;
                  if (
                    this.isEdit === true &&
                    this.arrayAreas.find(
                      (data) => data.academyarea_id === area.academyarea_id
                    )
                  ) {
                    const i = this.arrayAreas.findIndex(
                      (data) => data.academyarea_id === area.academyarea_id
                    );
                    this.arrayAreas.splice(i, 1, area);
                  }
                  if (
                    this.arrayAreas.find(
                      (data) => data.academyarea_id === area.academyarea_id
                    )
                  ) {
                    this.arrayAreas = this.arrayAreas;
                  } else {
                    this.arrayAreas.push(area);
                  }
                  this.contAreas++;
                  if (this.contAreas === levels.length) {
                    this.initDataTable();
                  }
                });
              });
          });
        });
    });
    /*  const response = await this.academyareaService.allacademyarea();
    response.subscribe(AcademyD => {
      this.data_academyarea = AcademyD;
      this.initDataTable();
    });*/
  }

  public addAcademy(AcademyD: Academyareadocum): void {
    this.isEdit = false;
    AcademyD = this.AcademyD = {
      academyarea_id: new Date().getTime().toString(),
      academyarea_cod: "",
      academyarea_name: "",
      academyarea_state: false,
    };
  }
  async saveAcademyArea(AcademyD: Academyareadocum, isValid: boolean) {
    if (isValid) {
      this.academyareaService.saveAcadArea(AcademyD);
      $("#exampleModalCenter").modal("hide");

      // swal.fire({
      //   title: 'Ok',
      //   text: 'Datos procesados correctamente!',
      //   buttonsStyling: false,
      //   confirmButtonClass: 'btn btn-fill btn-success',
      //   type: 'success',

      // })
    } else {
      console.log("*** ERROR INVALIDO ***");
    }
  }
  public editArea(AcademyD: Academyareadocum): void {
    if (AcademyD) {
      this.AcademyD = AcademyD;
      this.isEdit = true;
      this.onChangeLevel(AcademyD.level_id);
    } else {
    }
  }

  async deleteArea(AcademyD: Academyareadocum) {
    swal({
      title: "Desea eliminar esta Area?",
      text: AcademyD.academyarea_name,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, eliminar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.academyareaService.deletearea(AcademyD);

        swal({
          title: "Ok",
          text: "Se inactivó el area! " + AcademyD.academyarea_name,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
        }).catch(swal.noop);
      }
    });
  }

  initDataTable() {
    let gridgeneral = this.tablaAcad;
    $("#datatables").DataTable().destroy();
    setTimeout(function () {
      gridgeneral = $("#datatables").DataTable({
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
          sProcessing: "Procesando...",
          sLengthMenu: "Mostrar _MENU_ registros",
          sZeroRecords: "No se encontraron resultados",
          sEmptyTable: "Ningún dato disponible",
          sInfo:
            "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
          sInfoEmpty: "Registros del 0 al 0 de un total de 0 registros",
          sInfoFiltered: "(Total de _MAX_ registros)",
          sInfoPostFix: "",
          sSearch: "Buscar:",
          sUrl: "",
          sInfoThousands: ",",
          sLoadingRecords: "Cargando...",
          oPaginate: {
            sFirst: "Primero",
            sLast: "Último",
            sNext: "Siguiente",
            sPrevious: "Anterior",
          },
          oAria: {
            sSortAscending:
              ": Activar para ordenar la columna de manera ascendente",
            sSortDescending:
              ": Activar para ordenar la columna de manera descendente",
          },
          buttons: {
            copy: "Copiar",
            colvis: "Visibilidad",
          },
        },
      });
    }, 10);
  }
  /**
   * 1.Obtener listado de niveles
   *
   */
  private async getAllDataLevelsActive(): Promise<void> {
    await this.levelService.allLevelActives().subscribe((levels) => {
      this.arrayLevels = levels;
      this.getAcademydata(levels);
    });
  }

  /**
   * Detectar selección de nivel y generar array de subniveles
   * @param level
   */
  public async onChangeLevel(level): Promise<void> {
    const dataSubLevel = await this.sublevelService.getALLSublevelActive(level);
    dataSubLevel.subscribe((sublevels) => {
      this.arraySublevels = sublevels;
    });
  }
}
