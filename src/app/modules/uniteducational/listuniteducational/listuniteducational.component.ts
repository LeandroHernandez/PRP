import { Component, OnInit } from "@angular/core";

/**Models */
import { DataTable } from "../../../models/interfaces/data-table";
import { UnitEducational } from "../../../models/class/class.documentUnitEducational";
import { Level } from "app/models/class/class.documentLevel";
import { SchoolGrade } from "app/models/class/class.documentschoolGrade";
import { SubLevels } from "app/models/class/class.documentSubLevels";
import { Parallels } from "app/models/class/classdocument-parallels";
import { Academyareadocum } from "app/models/academyarea/academyareadocum.model";
import { Subject } from "app/models/class/classdocumentSubject";

/**Services */
import { StorageService } from "app/services/storage/storage.service";
import { UnitEdicationalService } from "../../../services/unit-edicational/unit-edicational.service";
import { LevelsService } from "app/services/levels/levels.service";
import { SubLevelsService } from "../../../services/sublevels/sublevels.service";
import { GradesService } from "app/services/grades/grades.service";
import { ParallelsService } from "app/services/parallels/parallels.service";
import { AcademyareaService } from "app/services/academyarea/academyarea.service";
import { SubjectService } from "app/services/subject/subject.service";
import { AuthService } from "../../../services/login/auth.service";
import DocumentData = firebase.firestore.DocumentData;
import { QuerySnapshot } from "@angular/fire/firestore";

/** Angular Materials */
import { MatDialog } from "@angular/material/dialog";
import { ModalAddNewUEComponent } from "app/modals/modal-add-new-ue/modal-add-new-ue.component";
import { ShareDataService } from "app/services/ShareData/share-data.service";

import swal from "sweetalert2";
import { ModalUploadLogoComponent } from "app/modals/modal-upload-logo/modal-upload-logo.component";
import { Subscription } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-listuniteducational",
  templateUrl: "./listuniteducational.component.html",
  styleUrls: ["./listuniteducational.component.css"],
})
export class ListuniteducationalComponent implements OnInit {
  public unitEducational: UnitEducational;
  public dataTable: DataTable;
  public tablaunitEducationals;
  public isEdit: boolean = false;
  public listCountries = [];
  public listCities = [];
  public uniEducId: string;
  public loadedImage = false;
  public imageSrc: any;
  public imageFile: any;
  state_plain: boolean = true;

  /** DATOS DE ARRAYS PARA MOSTRAR */
  public arrayUnitEducational: UnitEducational[];
  public arrayLevels: Level[] = [];
  public arraySubLevels: SubLevels[] = [];
  public arrayLevelsAux: Level[];
  public arraySubLevelsAux: SubLevels[];
  public arrayGrades: SchoolGrade[];
  public arrayGradesAux: SchoolGrade[];
  public arrayParallels: Parallels[];
  public arrayParallelsAux: Parallels[];
  public arrayAcademy_area: Academyareadocum[];
  public arrayAcademy_areaAux: Academyareadocum[];
  public arraySubjects: Subject[];
  public arraySubjectsAux: Subject[];
  public academicPeriodStorage;

  selectedFile: File | null = null;
  subscription: Subscription;
  nameImagen: String = "";
  unidadEducativa: UnitEducational;

  constructor(
    public unitEdicationalService: UnitEdicationalService,
    private levelService: LevelsService,
    private sublevelService: SubLevelsService,
    private storageService: StorageService,
    private gradeService: GradesService,
    private parallelService: ParallelsService,
    private academyAreaService: AcademyareaService,
    private subjectService: SubjectService,
    public auth: AuthService,
    private dialog: MatDialog,
    private shareDataService: ShareDataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.arraySubLevels = [];
    this.arrayUnitEducational = [];
    this.getUnitEducationl();
    this.academicPeriodStorage = JSON.parse(
      localStorage.getItem("academic_period")
    );
    this.unitEducational = {
      unit_educational_id: new Date().getTime().toString(),
      unit_educational_name: "",
      unit_educational_address: "",
      unit_educational_phone: "",
      unit_educational_phoneBill: "",
      unit_educational_email: "",
      unit_educational_academy: "",
      unit_educational_country: "",
      unit_educational_city: "",
      unit_educational_logo: "",
      unit_educational_password: "",
      unit_educational_status: false,
    };

    this.tablaunitEducationals = $("#datatablesUnitEducational").DataTable({});
    this.dataTable = {
      headerRow: [
        "#",
        "LOGO",
        "NOMBRE",
        "CÓDIGO",
        "CONTRASEÑA",
        "ESTADO",
        "ACCIONES",
      ],
      footerRow: [
        "#",
        "LOGO",
        "NOMBRE",
        "CÓDIGO",
        "CONTRASEÑA",
        "ESTADO",
        "ACCIONES",
      ],
      dataRows: [[]],
    };
    this.getCountries();
    this.getCities();
    this.getDataLevel();

    //Para tomar el nombre de la imagen en la seccion "Editar" UE
    this.subscription = this.shareDataService.file$.subscribe((file) => {
      this.selectedFile = file;
      if (file) {
        this.nameImagen = file.name; // Almacenar el nombre del archivo en la variable
        //console.log('Archivo recibido:', file.name);
      } else {
        this.nameImagen = ""; // Limpiar el nombre si no hay archivo
      }
    });
  }

  //Abrir Modal para crear una nueva UE
  openModalAddNewUE(): void {
    const dialogRef = this.dialog.open(ModalAddNewUEComponent, {
      width: "",
      disableClose: true, // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.shareDataService.setFile(null);
    });
  }

  //Abrir moodal "Edit" logo de UE
  openModalEditLogo(): void {
    const dialogRef = this.dialog.open(ModalUploadLogoComponent, {
      width: "400px",
      disableClose: true, // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("modal cerrrdo Edit Logo")
    });
  }

  /**
   * Optenemos todas las unidades educativas
   */
  // private getUnitEducational2() {
  //     this.arrayUnitEducational = [];

  //     this.unitEdicationalService.allUnitEducationals()
  //         .then(doc => {
  //             if (!doc.empty) {
  //                 doc.forEach(ac => {
  //                     const unitEducational: UnitEducational = ac.data() as UnitEducational;
  //                     this.arrayUnitEducational.push(unitEducational)

  //                 });
  //             } else {
  //                 console.log('DATA UNIT EDUCATIONAL NOT FOUND')
  //             }
  //         })
  //         .catch(function (error) {
  //             console.log('ERROR GETTING DOCUMENTS UNIT EDUCATIONAL:', error);
  //         });
  // }

  getUnitEducationl() {
    this.unitEdicationalService.allUnitEducationals().subscribe((players) => {
      this.arrayUnitEducational = players;
      //console.log(this.players)
    });
  }

  /**
   * Limpiamos todo cuando se va a hacer un registro nuevo
   */
  public async addRegister() {
    this.isEdit = false;
    this.unitEducational = {
      unit_educational_id: new Date().getTime().toString(),
      unit_educational_name: "",
      unit_educational_address: "",
      unit_educational_phone: "",
      unit_educational_email: "",
      unit_educational_academy: "",
      unit_educational_phoneBill: "",
      unit_educational_country: "",
      unit_educational_city: "",
      unit_educational_logo: "",
      unit_educational_password: "",
      unit_educational_Confirmpassword: "",
      unit_educational_status: false,
    };
  }

  public passwordsMatch = (): boolean => {
    if (
      this.unitEducational.unit_educational_password ===
      this.unitEducational.unit_educational_Confirmpassword
    ) {
      return true;
    } else {
      return false;
    }
  };

  // /**
  //  * Editar una UE
  //  * @param unitEdicational
  //  * @param isValid
  //  */
  async editUE(unitEducational: UnitEducational, isValid: boolean) {
    if (isValid && this.isEdit) {
      try {
        // Solo procesar la imagen si hay un nuevo archivo seleccionado
        if (this.selectedFile) {
          // Borrar la imagen anterior si existe
          await this.deleteLogo(unitEducational);

          // Subir la nueva imagen
          const newFilePath = `UnitEducational/logo_${
            unitEducational.unit_educational_id
          }_${Date.now()}.png`;
          const newLogoUrl = await this.unitEdicationalService.uploadFile(
            newFilePath,
            this.selectedFile
          );

          // Actualizar la URL del logo en el objeto unitEducational
          unitEducational.unit_educational_logo = newLogoUrl;

          // Limpiar la selección de archivo
          this.selectedFile = null;
          this.nameImagen = "";

          this.updateView();
        }

        // Guardar los cambios en la unidad educativa
        await this.unitEdicationalService.saveUnitEducational(
          unitEducational,
          false
        );

        swal({
          title: "Éxito",
          text: "La unidad educativa se ha actualizado correctamente.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
        });
      } catch (error) {
        console.error("Error al editar la unidad educativa:", error);
        swal({
          title: "Error",
          text: "Hubo un error al actualizar la unidad educativa. Por favor, inténtalo de nuevo.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-danger",
          type: "error",
        });
      }
    } else if (!isValid) {
      console.log("Formulario inválido");
    }
  }

  updateView() {
    setTimeout(() => {
      this.cd.detectChanges();
    }, 0);
  }

  /** Borrar el logo o imagne de Storage de Firebase */
  deleteLogo(unitEducational: UnitEducational) {
    if (unitEducational && unitEducational.unit_educational_logo) {
      const fullUrl = unitEducational.unit_educational_logo;

      // Extraer el nombre del archivo de la URL
      const urlParts = fullUrl.split("UnitEducational%2F");
      if (urlParts.length > 1) {
        const fileName = urlParts[1].split("?")[0];
        const oldFilePath = `UnitEducational/${decodeURIComponent(fileName)}`;
        try {
          this.unitEdicationalService.deleteFile(oldFilePath);
          console.log("Imagen anterior borrada con éxito");
        } catch (deleteError) {
          console.error("Error al borrar la imagen anterior:", deleteError);
        }
      } else {
        console.error("No se pudo extraer el nombre del archivo de la URL");
      }
    } else {
      console.log("No hay logo para borrar");
    }
  }

  // Método en el componente para eliminar una unidad educativa con confirmación
  async deleteUnitEducational(unitEducational: UnitEducational): Promise<void> {
    swal({
      title: "¿Estás seguro?",
      text: `¿Seguro que quieres eliminar la unidad educativa ${unitEducational.unit_educational_name}?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-fill btn-success",
      cancelButtonClass: "btn btn-fill btn-danger",
    }).then(async (result) => {
      if (result.value) {
        // result.value es true si se presiona el botón "Sí, eliminar"
        try {
          this.deleteLogo(unitEducational);
          await this.unitEdicationalService.deleteUnitEducational(
            unitEducational.unit_educational_id,
            unitEducational.unit_educational_city
          );
          console.log("Unidad educativa eliminada correctamente.");
          swal({
            title: "Eliminado!",
            text: "La unidad educativa ha sido eliminada.",
            type: "success",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-fill btn-success",
          });
          //this.loadUnitEducationals(); // Recargar la lista después de eliminar
        } catch (error) {
          console.error("Error al eliminar la unidad educativa:", error);
          swal({
            title: "Error",
            text: "Hubo un problema al eliminar la unidad educativa. Por favor, intenta de nuevo.",
            type: "error",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-fill btn-danger",
          });
        }
      }
    });
  }

  /**
   * creamos los niveles en la UE
   * @param unitEdicational
   */
  async saverLevelsUnitEducational(unitEdicational) {
    await this.unitEdicationalService.saverLevelsUnitEducational(
      unitEdicational,
      this.arrayLevels,
      this.arraySubLevels,
      this.arrayGrades,
      this.arrayParallels,
      this.arrayAcademy_area,
      this.arraySubjects,
      this.academicPeriodStorage[0].academic_year_name
    );
  }

  /**
   * Seleccionamos la UE que se desea editar
   * @param editUnitEducational
   */
  async editUnitEducational(editUnitEducational: UnitEducational) {
    this.isEdit = true;
    this.unitEducational = editUnitEducational;

    this.getLevelsUnitEducational().then(() => "");
    this.getSubLevelsUnitEducational().then(() => "");
    this.getGradesUnitEducational().then(() => "");
    this.getParallelsUnitEducational().then(() => "");
    this.getAcademyAreaUnitEducational().then(() => "");
    this.getSubjectsUnitEducational().then(() => "");
  }

  /**
   * Activamos - inactivamos la UE
   * esta funcion cambia el estado directamente el la DB
   * @param state
   */
  changeState(state: boolean, editUnitEducational?: UnitEducational) {
    this.unitEdicationalService
      .changeState(editUnitEducational ?? this.unitEducational, state)
      .then(() => (this.unitEducational.unit_educational_status = state))
      .catch((error) => console.log({ error }));
  }

  /**
   * Obtenemos todos los niveles del sistema
   */
  private getDataLevel() {
    const dataLevel: Promise<QuerySnapshot<DocumentData>> =
      this.levelService.getAllLevels();
    dataLevel
      .then((doc) => {
        if (!doc.empty) {
          doc.forEach((aux) => {
            this.arrayLevels.push(aux.data());
          });
          this.getDataSubLevel();
        } else {
          console.log("DATA ARRAY LEVELS NOT FOUND");
        }
      })
      .catch(function (error) {
        console.log("ERROR GETTING DOCUMENT LEVELS:", error);
      });
  }

  /**
   * OBTENER LISTA DE GRADOS.
   */

  private getDataGrades() {
    this.arrayGrades = [];
    for (const subLevel of this.arraySubLevels) {
      const dataGrades: Promise<QuerySnapshot<DocumentData>> =
        this.gradeService.getAllGradesActiveNoRealTime(
          subLevel.level_id,
          subLevel.sublevel_id
        );
      dataGrades
        .then((doc) => {
          if (!doc.empty) {
            doc.forEach((aux) => {
              const grade: SchoolGrade = aux.data() as SchoolGrade;
              grade.level_id = subLevel.level_id;
              grade.level_name = subLevel.level_name;
              grade.level_id = subLevel.level_id;
              grade.sublevel_name = subLevel.sublevel_name;
              if (
                !this.arrayGrades.find(
                  (data) => data.grade_id === grade.grade_id
                )
              ) {
                this.arrayGrades.push(grade);
              }
            });
          } else {
            console.log("DATA GRADES NOT FOUND");
          }
          this.getDataParallels();
        })
        .catch(function (error) {
          console.log("ERROR GETTING DOCUMENTS GRADES:", error);
        });
    }
  }

  /**
   * OBTENER LISTA DE PARALELOS.
   */

  public getDataParallels() {
    this.arrayParallels = [];
    for (const grades of this.arrayGrades) {
      const dataParallels: Promise<QuerySnapshot<DocumentData>> =
        this.parallelService.getAllParallelsActiveNotRealTime(
          grades.level_id,
          grades.sublevel_id,
          grades.grade_id
        );
      dataParallels
        .then((doc) => {
          if (!doc.empty) {
            doc.forEach((aux) => {
              const parallel: Parallels = aux.data() as Parallels;
              parallel.level_id = grades.level_id;
              parallel.level_name = grades.level_name;
              parallel.sublevel_id = grades.sublevel_id;
              parallel.sublevel_name = grades.sublevel_name;
              parallel.grade_id = grades.grade_id;
              parallel.grade_name = grades.grade_name;
              if (
                !this.arrayParallels.find(
                  (data) => data.parallel_id === parallel.parallel_id
                )
              ) {
                this.arrayParallels.push(parallel);
              }
            });
          } else {
            console.log("DATA PARALLELS NOT FOUND");
          }
        })
        .catch(function (error) {
          console.log("ERROR GETTING DOCUMENTS PARALLELS:", error);
        });
    }
  }

  /**
   * OBTENER LISTA DE AREAS ACADEMICAS.
   */

  private getDataAcademyArea() {
    this.arrayAcademy_area = [];
    for (const arraySubLevel of this.arraySubLevels) {
      const dataAcademyArea: Promise<QuerySnapshot<DocumentData>> =
        this.academyAreaService.getAllAcademyAreaActivesNotRealTime(
          arraySubLevel.level_id,
          arraySubLevel.sublevel_id
        );
      dataAcademyArea
        .then((doc) => {
          if (!doc.empty) {
            doc.forEach((ac) => {
              const academyArea: Academyareadocum =
                ac.data() as Academyareadocum;
              academyArea.level_name = arraySubLevel.level_name;
              academyArea.sublevel_id = arraySubLevel.sublevel_id;
              academyArea.sublevel_name = arraySubLevel.sublevel_name;
              academyArea.level_id = arraySubLevel.level_id;
              if (
                !this.arrayAcademy_area.find(
                  (data) => data.academyarea_id === academyArea.academyarea_id
                )
              ) {
                this.arrayAcademy_area.push(academyArea);
              }
            });
            this.getDataSubjects();
          } else {
            console.log("DATA ACADEMY AREA NOT FOUND");
          }
        })
        .catch(function (error) {
          console.log("ERROR GETTING DOCUMENTS PARALLELS:", error);
        });
    }
  }

  /**
   * OBTENER LISTA DE ASIGNATURAS.
   */

  private getDataSubjects() {
    this.arraySubjects = [];
    for (const academyArea of this.arrayAcademy_area) {
      const dataSubjects: Promise<QuerySnapshot<DocumentData>> =
        this.subjectService.getAllSubjectsActiveNotRealTime(
          academyArea.level_id,
          academyArea.sublevel_id,
          academyArea.academyarea_id
        );
      dataSubjects
        .then((doc) => {
          if (!doc.empty) {
            doc.forEach((ac) => {
              const subject: Subject = ac.data() as Subject;
              subject.level_name = academyArea.level_name;
              subject.sublevel_id = academyArea.sublevel_id;
              subject.sublevel_name = academyArea.sublevel_name;
              subject.level_id = academyArea.level_id;
              if (
                !this.arraySubjects.find(
                  (data) => data.subject_id === subject.subject_id
                )
              ) {
                this.arraySubjects.push(subject);
              }
            });
          } else {
            console.log("DATA SUBJECT NOT FOUND");
          }
        })
        .catch(function (error) {
          console.log("ERROR GETTING DOCUMENTS SUBJECT:", error);
        });
    }
  }

  /**
   * Obtenemos todos los niveles de la UE para determinar su estado
   */
  private async getLevelsUnitEducational() {
    this.arrayLevelsAux = [];
    const levelUnitEducational: Promise<QuerySnapshot<DocumentData>> =
      this.levelService.getLevelsUnitEducationalNotRealTime(
        this.unitEducational
      );
    levelUnitEducational
      .then((doc) => {
        if (!doc.empty) {
          doc.forEach((lev) => {
            const level: Level = lev.data() as Level;
            this.arrayLevelsAux.push(level);
          });
        } else {
          console.log("DATA UNIT LEVEL NOT FOUND");
        }
      })
      .catch(function (error) {
        console.log("ERROR GETTING DOCUMENTS UNIT LEVEL:", error);
      });
  }

  /**
   * Obtenemos todos los niveles de la UE para determinar su estado
   */
  private async getSubLevelsUnitEducational() {
    this.arraySubLevelsAux = [];
    const unitEducationalSubLevel: Promise<QuerySnapshot<DocumentData>> =
      this.levelService.getSubLevelsUnitEducationalNotRealTime(
        this.unitEducational
      );
    unitEducationalSubLevel
      .then((doc) => {
        if (!doc.empty) {
          doc.forEach((lev) => {
            const subLevels: SubLevels = lev.data() as SubLevels;
            this.arraySubLevelsAux.push(subLevels);
          });
        } else {
          console.log("DATA UNIT SUBLEVEL NOT FOUND");
        }
      })
      .catch(function (error) {
        console.log("ERROR GETTING DOCUMENTS UNIT SUBLEVEL:", error);
      });
  }

  /**
   * Obtenemos todos los grados de la UE para determinar su estado
   */
  private async getGradesUnitEducational() {
    this.arrayGradesAux = [];
    const gradesUnitEducational: Promise<QuerySnapshot<DocumentData>> =
      this.gradeService.getGradesUnitEducationalNotRealTime(
        this.unitEducational
      );
    gradesUnitEducational
      .then((doc) => {
        if (!doc.empty) {
          doc.forEach((grad) => {
            const grades: SchoolGrade = grad.data() as SchoolGrade;
            this.arrayGradesAux.push(grades);
          });
        } else {
          console.log("DATA UNIT GRADES UNIT EDUCATIONAL NOT FOUND");
        }
      })
      .catch(function (error) {
        console.log("ERROR GETTING DOCUMENTS GRADES UNIT EDUCATIONAL:", error);
      });
  }

  /**
   * Obtenemos todos los paralelos de la UE para determinar su estado
   */
  private async getParallelsUnitEducational() {
    this.arrayParallelsAux = [];
    const response: Promise<QuerySnapshot<DocumentData>> =
      this.parallelService.getParallelsUnitEducationalNotRealTime(
        this.unitEducational
      );
    response
      .then((doc) => {
        if (!doc.empty) {
          doc.forEach((grad) => {
            const parallel: Parallels = grad.data() as Parallels;
            this.arrayParallelsAux.push(parallel);
          });
        } else {
          console.log("DATA PARALLELS UNIT EDUCATIONAL NOT FOUND");
        }
      })
      .catch(function (error) {
        console.log(
          "ERROR GETTING DOCUMENTS PARALLELS UNIT EDUCATIONAL:",
          error
        );
      });
  }

  /**
   * Obtenemos todos los paralelos de la UE para determinar su estado
   */
  private async getAcademyAreaUnitEducational() {
    this.arrayAcademy_areaAux = [];
    const response: Promise<QuerySnapshot<DocumentData>> =
      this.academyAreaService.getAcademyAreaUnitEducationalNotRealTime(
        this.unitEducational
      );
    response
      .then((doc) => {
        if (!doc.empty) {
          doc.forEach((academyA) => {
            const academyArea: Academyareadocum =
              academyA.data() as Academyareadocum;
            this.arrayAcademy_areaAux.push(academyArea);
          });
        } else {
          console.log("DATA ACADEMY AREA UNIT EDUCATIONAL NOT FOUND");
        }
      })
      .catch(function (error) {
        console.log(
          "ERROR GETTING DOCUMENTS ACADEMY AREA UNIT EDUCATIONAL:",
          error
        );
      });
  }

  /**
   * Obtener asignaturas de la UE para determinar su estado.
   */
  private async getSubjectsUnitEducational() {
    this.arraySubjectsAux = [];
    for (const subjects of this.arraySubjects) {
      const response: Promise<QuerySnapshot<DocumentData>> =
        this.subjectService.getSubjectsUnitEducationalNotRealTime(
          this.unitEducational
        );
      response
        .then((doc) => {
          if (!doc.empty) {
            doc.forEach((subj) => {
              const subject: Subject = subj.data() as Subject;
              this.arraySubjectsAux.push(subject);
            });
          } else {
            console.log("DATA SUBJECT UNIT EDUCATIONAL NOT FOUND");
          }
        })
        .catch(function (error) {
          console.log(
            "ERROR GETTING DOCUMENTS SUBJECT UNIT EDUCATIONAL:",
            error
          );
        });
    }
  }

  /**
   * Activamos - inactivamos el nivel dentro de la UE
   * esta funcion cambia el estado directamente el la DB
   * @param state
   * @param level
   */
  // async changeStateLevelUnitEducational(state, level: Level) {
  //     if (state === false) {
  //         console.log('ELIMINAR DATO DE LA LISTA');
  //     } else {
  //         console.log('AGREGAR DATO DE LA LISTA');
  //     }
  //     // await this.unitEdicationalService.changeStateLevelUnitEducational(this.unitEducational, level, state);
  // }

  public changeStateLevelUnitEducational(state: boolean, level: Level) {
    console.log({
      state,
      level,
      academicPeriodStorage: this.academicPeriodStorage,
    });
    level.level_status = state;
    this.unitEdicationalService.changeStateLevelUnitEducational(
      this.unitEducational,
      level,
      // this.academicPeriodStorage[0].academic_year_name
      this.academicPeriodStorage[0].academic_year_id
    );
  }

  /**
   * Activamos - inactivamos el subnivel dentro de la UE
   * esta funcion cambia el estado directamente el la DB
   * @param state
   * @param subLevel
   */
  public changeStateSubLevelUnitEducational(
    state: boolean,
    subLevel: SubLevels
  ) {
    subLevel.sublevel_status = state;
    this.unitEdicationalService.changeStateSubLevelUnitEducational(
      this.unitEducational,
      subLevel,
      this.academicPeriodStorage[0].academic_year_name
    );
  }

  /**
   * Activamos - inactivamos el grado dentro de la UE
   * @param state
   * @param grade
   */
  public changeStateGradeUnitEducational(state: boolean, grade: SchoolGrade) {
    grade.grade_status = state;
    this.unitEdicationalService.changeStateGradeUnitEducational(
      this.unitEducational,
      grade,
      this.academicPeriodStorage[0].academic_year_name
    );
  }

  /**
   * Activamos - inactivamos el paralelo dentro de la UE
   * @param state
   * @param parallel
   */
  public changeStateParallelUnitEducational(
    state: boolean,
    parallel: Parallels
  ) {
    parallel.parallel_status = state;
    this.unitEdicationalService.changeStateParallelUnitEducational(
      this.unitEducational,
      parallel,
      this.academicPeriodStorage[0].academic_year_name
    );
  }

  /**
   * Activamos - inactivamos el area academica dentro de la UE
   * @param state
   * @param academy_area
   */
  async changeStateAcademyAreaUnitEducational(
    state: boolean,
    academy_area: Academyareadocum
  ) {
    academy_area.academyarea_state = state;
    this.unitEdicationalService.changeStateAcademyAreaUnitEducational(
      this.unitEducational,
      academy_area,
      this.academicPeriodStorage[0].academic_year_name
    );
  }

  /**
   * Activamos - inactivamos el asignatura dentro de la UE
   * @param state
   * @param subject
   */
  public changeStateSubjectUnitEducational(state: boolean, subject: Subject) {
    subject.subject_status = state;
    const period = this.academicPeriodStorage[0].academicPeriodStorage;
    this.unitEdicationalService.changeStateSubjectUnitEducational(
      this.unitEducational,
      subject,
      this.academicPeriodStorage[0].academic_year_name
    );
  }

  /**
   * Obtenemos todos los Subniveles del sistema
   */
  private getDataSubLevel() {
    this.arraySubLevels = [];
    for (const level of this.arrayLevels) {
      const dataSubLevel: Promise<QuerySnapshot<DocumentData>> =
        this.sublevelService.getAllSubLevelsNoRealTime(level.level_id);
      dataSubLevel
        .then((doc) => {
          if (!doc.empty) {
            doc.forEach((aux) => {
              if (
                !this.arraySubLevels.find(
                  (data) => data.sublevel_id === aux.data().sublevel_id
                )
              ) {
                const obj: SubLevels = aux.data() as SubLevels;
                obj.level_name = level.level_name;
                obj.level_id = level.level_id;
                this.arraySubLevels.push(obj);
              }
              this.getDataGrades();
              this.getDataAcademyArea();
            });
          } else {
            console.log("DATA ARRAY SUB LEVELS NOT FOUND");
          }
        })
        .catch(function (error) {
          console.log("ERROR GETTING DOCUMENT SUB LEVELS:", error);
        });
    }
  }

  public clearUnitEducational() {
    this.isEdit = false;
  }

  initDataTable() {
    let aaa = this.tablaunitEducationals;
    $("#datatablesUnitEducational").DataTable().destroy();
    setTimeout(function () {
      aaa = $("#datatablesUnitEducational").DataTable({
        dom: "Bfrtip",
        buttons: ["copy", "csv", "excel", "pdf", "print"],
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

  /**
   * OBTENER LISTADO DE PAISES.
   */
  public getCountries() {
    this.unitEdicationalService.getCountries().subscribe((data) => {
      this.listCountries = data;
    });
  }

  /**
   * OBTENER LISTADO DE CIUDADES.
   */
  public getCities() {
    this.unitEdicationalService.getCities().subscribe((data) => {
      this.listCities = data;
    });
  }

  /**
   * EVENTO CARGA DE IMAGEN.
   * @param event.
   */
  public onChangeImage(event) {
    const files = event.srcElement.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    }
    this.upload(event);
  }

  public upload(event): void {
    const file = event.target.files[0];
    this.imageFile = file;
  }

  /**
   * Acciones a realizar en caso de seleccionar la imagen y cerrar la ventana antes de guardar.
   */
  public cancelFile() {
    this.imageSrc = null;
    this.imageFile = null;
    if (!this.isEdit) {
      this.unitEducational.unit_educational_logo = "";
    }
  }

  /**
   * EVENTOS PARA CAMBIAR ESTADO DE BOTONOS.
   */
  public saveFile() {
    this.loadedImage = true;
  }

  public addFile() {
    this.loadedImage = false;
  }

  /***
   * ENABLE DATA VALIDATION
   * **/

  public enableLevel(level: Level): boolean {
    return !!this.arrayLevelsAux.find(
      (data) => data.level_id === level.level_id
    );
  }

  public enableSubLevel(subLevel: SubLevels): boolean {
    return !!this.arraySubLevelsAux.find(
      (data) => data.sublevel_id === subLevel.sublevel_id
    );
  }

  public enableGrade(grade: SchoolGrade): boolean {
    return !!this.arrayGradesAux.find(
      (data) => data.grade_id === grade.grade_id
    );
  }

  public enableParallel(parallel: Parallels): boolean {
    return !!this.arrayParallelsAux.find(
      (data) => data.parallel_id === parallel.parallel_id
    );
  }

  public enableAcademyArea(academy_area: Academyareadocum): boolean {
    return !!this.arrayAcademy_areaAux.find(
      (data) => data.academyarea_id === academy_area.academyarea_id
    );
  }

  public enableSubject(subject: Subject): boolean {
    return !!this.arraySubjectsAux.find(
      (data) => data.subject_id === subject.subject_id
    );
  }
}
