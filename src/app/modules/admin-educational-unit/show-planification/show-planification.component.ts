import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Teacher} from '../../../models/teacher/teacher.model';
import {Subject} from '../../../models/class/classdocumentSubject';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import {Evaluation, Resource} from '../../../models/class/class.resource';
import {map, take} from 'rxjs/operators';
import {TeacherSubjectsService} from '../../../services/teacher-subjects/teacher-subjects.service';
import {FormBuilder} from '@angular/forms';
import {LoadDataService} from '../../../services/teacher-subjects/load-data.service';
import {ForumServiceService} from '../../../services/forum-service/forum-service.service';
import {AdminEducationalUnitService} from '../../../services/adminEducationalUnit/admin-educational-unit.service';
import {Subscription} from 'rxjs';
import {TeachersService} from '../../../services/teachers/teachers.service';
import {Adminpractices} from '../../../models/class/class.documentadminpractices';
import {DataTable} from '../../../models/interfaces/data-table';
import swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-show-planification',
  templateUrl: './show-planification.component.html',
  styleUrls: ['./show-planification.component.css']
})
export class ShowPlanificationComponent implements OnInit {

  @Input() subjectInput;
  @Output() messageEvent = new EventEmitter<boolean>();
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public userInfo: any;
  public classes: any[];
  public activeSubject: Subject; // active subject
  public units: any = []; // array of all units
  public activeUnit: any; // active unit selected
  public activeClass: any; // active class selected
  public selectedResource: Resource; // selected resource to add to class
  tablaResource: any;
  tableResourceVideos: any;
  tableResourcePractices: any;
  tableResourceEssays: any;
  tableResourceEvaluations: any;
  arrayPorcentaje: number[];
  totalEvaluation: number;
  totalUnits: number;
  public id = '';
  public dat = {controls: 0, showinfo: 0};
  private player: any;
  public isEdit = false;
  public unitEdit: any;
  public editButton: boolean;
  public editRow: number;
  public selectedVideo: string;
  public selectedPdf: string;
  public arrayTeachers: Array<Teacher>
  public arraySubjectTeachers: Array<Teacher> = [];
  public arrayEvaluations: Array<Adminpractices> = [];
  public selectedEvaluation: Evaluation;
  public typeNote: string;
  /* External resources */
  public externalResources: any = {};
  public practices: any[] = [];
  public essays: Adminpractices[] = [];
  public unitResources: any = {};
  public dataTable: DataTable;
  public forumsArray: any = [];
  /* Simulator*/
  public showViewSimulation = false;
  public simClass: any;

  /* subscriptions*/
  private subjectFromTeacherSubscription: Subscription;
  private teacherSubscription: Subscription;
  public academicPeriodStorage;

  constructor(public ts: TeacherSubjectsService,
              private adminEducationalUnitService: AdminEducationalUnitService,
              private teacherService: TeachersService,
              private fb: FormBuilder,
              public carga: LoadDataService,
              private forumService: ForumServiceService) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('infoUser'));
    this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'));
    this.activeUnit = {}
    this.arrayPorcentaje = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    this.activeSubject = this.subjectInput;
    this.tablaResource = $('#datatablesResource').DataTable({});
    this.tableResourceVideos = $('#datatablesResourceVideos').DataTable({})
    this.tableResourcePractices = $('#datatablesResourcePractices').DataTable({})
    this.tableResourceEssays = $('#datatablesResourceEssays').DataTable({})
    this.tableResourceEvaluations = $('#datatablesResourceEvaluations').DataTable({})
    this.activeClass = {};
    this.editButton = false;
    this.editRow = 0;
    this.dataTable = {
      headerRow: ['Seleccionar', 'Nombre', 'Ver'],
      footerRow: ['Seleccionar', 'Nombre', 'Ver'],
      dataRows: []
    };
    this.getTeachersFromUnitEducational();
    this.getExternalResources();
  }

  getSubjectUnits(teacher, subject) {
    this.units = [];
    this.ts.getUnitsNoRealTimeQuery(teacher, subject, this.academicPeriodStorage[0].academic_year_name)
        .then(doc => {
          if (!doc.empty) {
            doc.forEach(x => {
              this.units.push(x.data())
            })
            this.activeUnit = this.units[0];
            this.getTotalFromUnit();
            this.getClassFromUnit(this.activeUnit, this.activeSubject);
            this.getUnitResources(this.activeUnit, this.activeSubject);
          } else {
            this.units = [];
            console.log('DATA NOT FOUND')
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
        });
  }

  /* Get unit resources */
  getUnitResources(unit, subject) {
    this.arraySubjectTeachers.forEach( teacher => {
      if (unit !== undefined) {
        this.ts.getUnitResources(teacher, unit, subject, this.academicPeriodStorage[0].academic_year_name).subscribe(unitResouce => {
          this.unitResources.text = unitResouce;
        });
        this.ts.getExternalFiles(this.activeSubject).pipe(map((resource: any) =>
            resource.filter(r => r.id_grade === this.activeSubject.grade_id && r.unit_id === unit.unit_id))).subscribe(files => {
          this.externalResources.files = files;
        })
        this.ts.getURLS(this.activeSubject).pipe(map((resource: any) =>
            resource.filter(r => r.id_grade === this.activeSubject.grade_id && r.unit_id === unit.unit_id))).subscribe(urls => {
          this.externalResources.urls = urls;
        })
      }
    })
  }

  /* Get external resources */
  getExternalResources() {
    this.ts.getExternalVideos(this.activeSubject).subscribe(videos => {
      this.externalResources.videos = videos;
      this.initDataTableVideos()
    });
    this.ts.getExternalTexts(this.activeSubject).subscribe(text => {
      this.externalResources.text = text;
      this.initDataTable()
    });
    this.ts.getExternalFiles(this.activeSubject).pipe(map((resource: any) =>
        resource.filter(r => r.id_grade === this.activeSubject.grade_id))).subscribe(files => {
      this.externalResources.files = files;
    })
    this.ts.getURLS(this.activeSubject).pipe(map((resource: any) =>
        resource.filter(r => r.id_grade === this.activeSubject.grade_id))).subscribe(urls => {
      this.externalResources.urls = urls;
    })
    this.arraySubjectTeachers.forEach( teacher => {
      this.ts.getPractices(teacher.teacher_unit_educational[0]).pipe(map((practice: Adminpractices[]) =>
          practice.filter(p => p.subject_id === this.activeSubject.subject_id && p.grade_id === this.activeSubject.grade_id
              && p.public_status_practice === true))).subscribe(practices => {
        this.practices = practices;
        this.initDataTablePractices();
      })
      this.ts.getEssays(teacher.teacher_unit_educational[0]).pipe(map((essays: Adminpractices[]) =>
          essays.filter(e => e.subject_id === this.activeSubject.subject_id && e.grade_id === this.activeSubject.grade_id
              && e.public_status_practice === true))).subscribe(essays => {
        this.essays = essays;
        this.initDataTableEssays();
      })
      this.ts.getEvaluationsFromUnitEducationalId(teacher.teacher_unit_educational[0]).pipe(
          map((evaluations: Adminpractices[]) => evaluations.filter(e => e.subject_id === this.activeSubject.subject_id
              && e.grade_id === this.activeSubject.grade_id && e.public_status_practice === true))).subscribe(evaluations => {
        this.arrayEvaluations = evaluations;
        this.initDataTableEvaluations();
      })
    })
  }

  /**
   * Inicializa la datatable student
   */
  initDataTable() {
    let aaa = this.tablaResource;
    $('#datatablesResource').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResource').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTableVideos() {
    let aaa = this.tableResourceVideos;
    $('#datatablesResourceVideos').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResourceVideos').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTablePractices() {
    let aaa = this.tableResourcePractices;
    $('#datatablesResourcePractices').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResourcePractices').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTableEvaluations() {
    let a = this.tableResourceEvaluations;
    $('#datatablesResourceEvaluations').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/

      a = $('#datatablesResourceEvaluations').DataTable({

        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }

  initDataTableEssays() {
    let aaa = this.tableResourceEssays;
    $('#datatablesResourceEssays').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesResourceEssays').DataTable({
        'paging': true,
        'ordering': true,
        'info': true,
        'retrieve': true,
        'pagingType': 'full_numbers',
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
        rowReorder: {
          selector: 'td:nth-child(2)'
        },
        responsive: true,
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Buscar',
          'sProcessing': 'Procesando...',
          'sLengthMenu': 'Mostrar _MENU_ registros',
          'sZeroRecords': 'No se encontraron resultados',
          'sEmptyTable': 'Ningún dato disponible',
          'sInfo': 'Registros del _START_ al _END_ de un total de _TOTAL_ registros',
          'sInfoEmpty': 'Registros del 0 al 0 de un total de 0 registros',
          'sInfoFiltered': '(Total de _MAX_ registros)',
          'sInfoPostFix': '',
          'sSearch': 'Buscar:',
          'sUrl': '',
          'sInfoThousands': ',',
          'sLoadingRecords': 'Cargando...',
          'oPaginate': {
            'sFirst': 'Primero',
            'sLast': 'Último',
            'sNext': 'Siguiente',
            'sPrevious': 'Anterior'
          },
          'oAria': {
            'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
            'sSortDescending': ': Activar para ordenar la columna de manera descendente'
          },
          'buttons': {
            'copy': 'Copiar',
            'colvis': 'Visibilidad'
          }
        },
      });
    }, 10)
  }


  public getTeachersFromUnitEducational() {
    // tslint:disable-next-line: max-line-length
    this.adminEducationalUnitService.getTeachersFromUnitEducational(this.userInfo.unit_educational_id)
        .pipe(map((t: Teacher[]) => t.filter((teacher) => teacher.teacher_status === true))).subscribe(dataTeachers => {
      this.arrayTeachers = dataTeachers;
      this.getSubjectTeachers(this.activeSubject);
    })
  }

  public getSubjectTeachers(subject: Subject) {
    this.arrayTeachers.forEach(teacher => {
      // tslint:disable-next-line: max-line-length
      this.subjectFromTeacherSubscription = this.adminEducationalUnitService.getSubjectTeachers(teacher.teacher_id, this.userInfo.unit_educational_id, this.activeSubject.parallel_id, subject.subject_id, this.academicPeriodStorage[0].academic_year_name)
          .subscribe(dataSubjectTeacher => {
            this.arraySubjectTeachers = []
            if (dataSubjectTeacher && dataSubjectTeacher.length > 0) {
              this.teacherSubscription = this.teacherService.getTeacherById(teacher.teacher_id).pipe(take(1)).subscribe(dataTeacher => {
                if (dataSubjectTeacher[0].subject_name === subject.subject_name) {
                  if (this.arraySubjectTeachers.find(data => data.teacher_id === teacher.teacher_id)) {
                    return;
                  } else {
                    this.arraySubjectTeachers.push(dataTeacher);
                  }
                }  else {
                  this.arraySubjectTeachers = [dataTeacher]
                }
              })
            } else {
              this.arraySubjectTeachers = [];
            }
          })
    });
    this.getSubjectUnits(this.arrayTeachers[0], this.activeSubject);
  }

  /* Redirect to parent component */
  showSubject() {
    this.messageEvent.emit(false)
  }

  setActiveUnit(index) {
    this.activeUnit = this.units[index];
    this.getClassFromUnit(this.activeUnit, this.activeSubject);
    // this.getUnitResources(this.activeUnit, this.activeSubject);
  }

  getTotalFromUnit() {
    this.totalUnits = 0
    this.units.forEach(u => {
      this.totalUnits = this.totalUnits + u.pUnit;
    })
  }

  /* Get all clases from active unit*/
  getClassFromUnit(unit, subject) {
    this.totalEvaluation = 0;
    this.arraySubjectTeachers.forEach( teacher => {
      if (unit !== undefined) {
        this.ts.getClassFromUnit(teacher, unit, subject, this.academicPeriodStorage[0].academic_year_name).subscribe(resp => {
          this.classes = resp;
          this.classes.forEach(async item => {
            await this.ts.getClassResources(teacher, this.activeUnit, this.activeSubject, item, this.academicPeriodStorage[0].academic_year_name).subscribe(resource => {
              item.class_resources = resource
            })
            await this.ts.getClassEvaluations(teacher, this.activeUnit, this.activeSubject, item, this.academicPeriodStorage[0].academic_year_name).subscribe(evaluation => {
              item.class_evaluation = evaluation;
              this.getTotalEvaluation();
            })
          })
          // this.getforums(unit, subject, this.classes);
        });
      }
    })
  }

  async getTotalEvaluation() {
    this.totalEvaluation = 0;
    this.classes.forEach(c => {
      if (c.class_evaluation) {
        c.class_evaluation.forEach(cl => {
          if (cl.evaluation_peso !== undefined) {
            this.totalEvaluation = this.totalEvaluation + cl.evaluation_peso;
          }
        });
      }
    })
  }

  /* delete resource*/
  deleteResource(resource, selectedClass) {
    if (selectedClass.class_status === true) {
      swal({
        title: 'Error',
        text: 'Debe inactivar la clase para poder eliminar el recurso!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      swal({
        title: 'Atención',
        text: 'Seguro que desea borrar el recurso',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar'
      }).then((result) => {
        /*if (result.value) {
          this.ts.deleteResourceFromClass(this.activeTeacher, this.activeSubject, this.activeUnit, selectedClass, resource)
          swal({
            title: 'OK',
            text: 'Se elimino el recurso correctamente',
            type: 'success',
          })
        }*/
      })
    }

  }

  enableUnit(statusUnit: boolean): boolean {
    if (statusUnit === undefined) {
      return false;
    }
    return statusUnit === true;
  }

  /* set forrums of each class*/
  getforums(unit, subject, clases) {
    this.forumsArray = [];
    this.arraySubjectTeachers.forEach( teacher => {
      clases.forEach(async element => {
        await this.forumService.findForumClass(teacher.teacher_unit_educational[0],
            subject.parallel_id, subject.subject_id, unit.unit_id, element.class_id)
            .subscribe(forums => {
              if (forums !== undefined) {
                this.forumsArray.push(forums);
              }
            });
      });
    })
  }

  /* Show video preview */
  previewVideo(video) {
    this.selectedVideo = video.subject_name + ' : ' + video.textbook_title;
    this.id = video.url.replace('https://youtu.be/', '');
  }

  savePlayer(player) {
    this.player = player.target;
  }

  public stopVideo() {
    this.player.stopVideo();
  }

  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  onStateChange(event) {
    console.log('player state', event.data);
  }

  OpenPopupCenter(pageURL, title, w, h) {
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
    const targetWin = window.open(pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      this.practices;
      this.initDataTablePractices()
    }
    if (tabChangeEvent.index === 1) {
      this.arrayEvaluations;
      this.initDataTableEvaluations()
    }
    if (tabChangeEvent.index === 2) {
      this.essays;
      this.initDataTableEssays()
    }
  }

  /* Iniciar simulador */
  public showSimulator(unitClass) {
    this.simClass = unitClass;
    this.showViewSimulation = true;
  }

  /** Cierra el modal de Practicas */
  public return() {
    this.showViewSimulation = false;
  }

}
