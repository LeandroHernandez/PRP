import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";

/**Models */
import { Level } from "app/models/class/class.documentLevel";
import { SubLevels } from "app/models/class/class.documentSubLevels";
import { Subject } from "app/models/class/classdocumentSubject";
import { Academyareadocum } from "app/models/academyarea/academyareadocum.model";

/**Services */
import { SubLevelsService } from "../../../services/sublevels/sublevels.service";
import { LevelsService } from "app/services/levels/levels.service";
import { SubjectService } from "app/services/subject/subject.service";
import { AcademyareaService } from "app/services/academyarea/academyarea.service";

/** Interface */
import { DataTable } from "app/models/interfaces/data-table";

declare var $: any;
@Component({
  selector: "app-subject",
  templateUrl: "./subject.component.html",
  styleUrls: ["./subject.component.css"],
})
export class SubjectComponent implements OnInit {
  public subject: Subject;
  public dataTable: DataTable;
  public arrayLevels: Level[];
  public arraySublevels: SubLevels[];
  public arrayArea: Academyareadocum[];
  public arraySubjects: Subject[];
  public isEdit = false;
  public tablaLevels;
  public contSubject = 0;
  public levelId: string;
  public arrayColores;
  constructor(
    private levelService: LevelsService,
    private sublevelService: SubLevelsService,
    private areaAcademyService: AcademyareaService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.arraySubjects = [];
    this.arrayColores = [
      {
        area_name: "Matematica",
        color: "matOne",
        icon: "../../../../assets/img/icons/Matematicas.svg",
      },
      {
        area_name: "Ciencias Natutrales",
        color: "matTwo",
        icon: "../../../../assets/img/icons/CienciasNaturales.svg",
      },
      {
        area_name: "Lengua y literatura",
        color: "matThre",
        icon: "../../../../assets/img/icons/LenguaLiteratura.svg",
      },
      {
        area_name: "Ciencias Sociales",
        color: "matFour",
        icon: "../../../../assets/img/icons/CienciasSociales.svg",
      },
      {
        area_name: "Educación Cultural y Artística",
        color: "matFive",
        icon: "../../../../assets/img/icons/EducacionCulturalyArtistica.svg",
      },
      {
        area_name: "Educacion Fisica",
        color: "matSix",
        icon: "../../../../assets/img/icons/EducacionFisica.svg",
      },
      {
        area_name: "Proyectos Escolares",
        color: "matSeven",
        icon: "../../../../assets/img/icons/ProyectosEscolares.svg",
      },
      {
        area_name: "Desarrollo Humano Integral",
        color: "matEight",
        icon: "../../../../assets/img/icons/DesarrolloHumanoIntegral.svg",
      },
      {
        area_name: "Ingles",
        color: "matNine",
        icon: "../../../../assets/img/icons/Ingles.svg",
      },
    ];
    this.tablaLevels = $("#datatablesUser").DataTable({});
    this.subject = {
      subject_name: "",
      subject_id: new Date().getTime().toString(),
      subject_status: false,
    };
    this.dataTable = {
      headerRow: [
        "ID",
        "NIVEL",
        "SUBNIVEL",
        "AREA ACADEMICA",
        "CODIGO",
        "ASIGNATURA",
        "COLOR",
        "ESTADO",
        "ACCIONES",
      ],
      footerRow: [
        "ID",
        "NIVEL",
        "SUBNIVEL",
        "AREA ACADEMICA",
        "CODIGO",
        "ASIGNATURA",
        "COLOR",
        "ESTADO",
        "ACCIONES",
      ],
      dataRows: [],
    };
    this.getAllDataLevelsActive();
  }

  /**
   * 1.Obtener listado de niveles.
   */
  private async getAllDataLevelsActive(): Promise<void> {
    await this.levelService.allLevelActives().subscribe((levels) => {
      this.arrayLevels = levels;
      this.getAllSubjects(levels);
    });
  }

  /**
   * 1. Obtener listado de subniveles de acuerdo al nivel elegido.
   * @param level
   */
  public async onChangeLevel(level): Promise<void> {
    this.levelId = level;
    const dataSubLevel = await this.sublevelService.getALLSublevelActive(level);
    dataSubLevel.subscribe((sublevels) => {
      this.arraySublevels = sublevels;
    });
  }

  /**
   * 1. Obtener listado de areas academicas  de acuerdo al subnivel elegido.
   * @param sublevelId
   */
  public async onChangeSublevel(sublevelId): Promise<void> {
    const dataAreaAcademy =
      await this.areaAcademyService.getAllAcademyAreaActives(
        this.levelId,
        sublevelId
      );
    dataAreaAcademy.subscribe((area) => {
      this.arrayArea = area;
    });
  }

  /** Función Guardar.
   * @param subject
   * @param isValid
   */
  public async saveSubject(subject: Subject, isValid: boolean): Promise<void> {
    if (isValid) {
      this.subjectService.saveSubject(subject);
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
   * 1.Accion del boton registrar.
   * 2.Cambia el status de la variable isEdit a false.
   * 3.Limpia el formulario.
   * @param subject
   */
  public addRegisterSubject(subject: Subject): void {
    this.isEdit = false;
    subject = this.subject = {
      subject_name: "",
      subject_id: new Date().getTime().toString(),
      subject_status: false,
    };
  }

  /**
   * Función para obtener listado de asignaturas.
   * @param levels
   */
  async getAllSubjects(levels) {
    this.arraySubjects = [];
    levels.forEach(async (level: Level) => {
      await this.sublevelService
        .getALLSublevelActive(level.level_id)
        .subscribe((allSublevels) => {
          allSublevels.forEach((subLevel) => {
            this.areaAcademyService
              .getAllAcademyAreaActives(level.level_id, subLevel.sublevel_id)
              .subscribe((areas) => {
                areas.forEach((area) => {
                  this.subjectService
                    .getAllSubjects(
                      level.level_id,
                      subLevel.sublevel_id,
                      area.academyarea_id
                    )
                    .subscribe((subjects) => {
                      subjects.forEach((subject) => {
                        subject.level_name = level.level_name;
                        subject.sublevel_name = subLevel.sublevel_name;
                        subject.academyarea_name = area.academyarea_name;
                        if (
                          this.isEdit === true &&
                          this.arraySubjects.find(
                            (data) => data.subject_id === subject.subject_id
                          )
                        ) {
                          const i = this.arraySubjects.findIndex(
                            (data) => data.subject_id === subject.subject_id
                          );
                          this.arraySubjects.splice(i, 1, subject);
                        }
                        if (
                          this.arraySubjects.find(
                            (data) => data.subject_id === subject.subject_id
                          )
                        ) {
                          this.arraySubjects = this.arraySubjects;
                        } else {
                          this.arraySubjects.push(subject);
                        }
                        this.contSubject++;
                        if (this.contSubject === levels.length) {
                          // this.initDataTable();
                        }
                      });
                    });
                });
              });
          });
        });
    });
  }

  /**
   * 1.Función Editar asignatura.
   * 2.Cambia estatus de variable isEdit a true
   * @param subject
   */
  public async editSubject(subject: Subject) {
    if (subject) {
      this.subject = subject;
      this.isEdit = true;
      this.onChangeLevel(subject.level_id);
      this.onChangeSublevel(subject.sublevel_id);
    } else {
      return null;
    }
  }

  /** Elimina de manera logica la asignatura
   * @param subject
   */
  async deleteSubject(subject: Subject) {
    this.isEdit = true;
    swal({
      title: "Desea eliminar la asignatura?",
      text: subject.subject_name,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, eliminar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.subjectService.deleteSubject(subject);

        swal({
          title: "Ok",
          text: "Se inactivó la asignatura! " + subject.subject_name,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
        }).catch(swal.noop);
      }
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
