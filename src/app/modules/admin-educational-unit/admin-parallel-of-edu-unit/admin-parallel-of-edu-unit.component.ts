// import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
// import { take, map } from 'rxjs/operators';
// import { Subscription } from 'rxjs';

// /**SERVICE */
// import { AdminEducationalUnitService } from 'app/services/adminEducationalUnit/admin-educational-unit.service';
// import { TeachersService } from 'app/services/teachers/teachers.service';
// import { StudentService } from 'app/services/student/student.service'

// /**MODELS */
// import { Parallels } from 'app/models/class/classdocument-parallels';
// import { SchoolGrade } from 'app/models/class/class.documentschoolGrade';
// import { Subject } from 'app/models/class/classdocumentSubject'
// import { DataTable } from 'app/models/interfaces/datatable';
// import { Student } from 'app/models/student/student.model';
// import { Teacher } from 'app/models/teacher/teacher.model'
// import swal from 'sweetalert2';
// import { UnitEducational } from '../../../models/class/class.documentUnitEducational';
// import {TeacherSubjectsService} from '../../../services/teacher-subjects/teacher-subjects.service';

// declare var $: any;

// @Component({
//   selector: 'app-admin-parallel-of-edu-unit',
//   templateUrl: './admin-parallel-of-edu-unit.component.html',
//   styleUrls: ['./admin-parallel-of-edu-unit.component.css'],
// })
// export class AdminParallelOfEduUnitComponent implements OnInit, OnDestroy {
//   public infoUser: UnitEducational;

//   @Input() isAdminParallel: boolean;
//   @Input() grade_id: string;
//   @Input() parallel_id: string;
//   @Input() unitEducationalId: string;
//   @Output() isReturn = new EventEmitter();

//   public parallel: Parallels;
//   public grade: SchoolGrade;
//   public dataTable: DataTable;
//   public toAssign: boolean;
//   public isTeacherSelect: boolean = false;
//   public isActivePanel: boolean
//   /** ARRAYS  */
//   public arrayStudents: Array<Student>;
//   public arrayStudentAssign: Array<Student> = [];
//   public arrayStudentsOfGradeandParallel: Array<Student>;
//   public arraySubjects: Array<Subject>;
//   public arrayNDoc: any;
//   public arrayTeachers: Array<Teacher>
//   public arrayTeachersAssign: Array<Teacher> = [];
//   public selectSubjectToAddTeacher: Subject;
//   public arraySubjectTeachers: Array<Teacher> = [];
//   public arrayParallelsFromGrade: Array<Parallels>;

//   tablaStudent: any;
//   showDetails: boolean;
//   selectedSubject: Subject;

//   /** subscriptions */
//   private studentSusbcription: Subscription;
//   private teachersSubscription: Subscription;
//   private subjectsSubscription: Subscription;
//   private studentsOfGgradeSubscription: Subscription;
//   private subjectFromTeacherSubscription: Subscription;
//   private subjectsFromUESubscription: Subscription;
//   private teacherSubscription: Subscription;
//   tablaTeacher: any;
//   public tableListStudent: any;
//   private academicPeriodStorage;

//   constructor(private adminEducationalUnitService: AdminEducationalUnitService,
//     private teacherService: TeachersService,
//     private studentService: StudentService,
//     public ts: TeacherSubjectsService) {
//   }

//   ngOnInit(): void {
//     this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
//     this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'));
//     this.tablaStudent = $('#datatablesStudent').DataTable({});
//     this.tablaTeacher = $('#datatablesTeacherList').DataTable({});
//     this.tableListStudent = $('#datatablesListStudent').DataTable({});
//     this.dataTable = {
//       headerRow: ['', 'NOMBRE', 'APELLIDO', 'EMAIL', 'IDENTIFICACIÓN', 'ASIGNAR'],
//       footerRow: ['', 'NOMBRE', 'APELLIDO', 'EMAIL', 'IDENTIFICACIÓN', 'ASIGNAR'],
//       dataRows: []
//     };
//     if (this.isAdminParallel) {
//       this.getGradeDataFromGradeId(this.grade_id)
//       this.getParallelDataFromParallelId(this.parallel_id)
//     }

//     this.getStudentsData();
//     this.getStudentsOfGradeandParallel();
//     this.getTeachersFromUnitEducational();
//     this.showDetails = false;

//   }
//   ngOnDestroy(): void {
//     if (this.studentSusbcription) {
//       this.studentSusbcription.unsubscribe();
//     }
//     if (this.teachersSubscription) {
//       this.teachersSubscription.unsubscribe();
//     }
//     if (this.subjectsSubscription) {
//       this.subjectsSubscription.unsubscribe();
//     }
//     if (this.studentsOfGgradeSubscription) {
//       this.studentsOfGgradeSubscription.unsubscribe();
//     }
//     if (this.subjectFromTeacherSubscription) {
//       this.subjectFromTeacherSubscription.unsubscribe();
//     }
//     if (this.subjectsFromUESubscription) {
//       this.subjectsFromUESubscription.unsubscribe();
//     }
//     if (this.teacherSubscription) {
//       this.teacherSubscription.unsubscribe()
//     }

//   }
//   /** OBTENER DATOS DE ESTUDIANTE */
//   public getStudentsData() {
//     this.studentSusbcription = this.adminEducationalUnitService.getStudentsFromEducationalUnit(this.unitEducationalId).pipe(
//       map((students: Student[]) => students.filter((student) => student.student_status === true && !student.student_grade_id)))
//       .subscribe(dataStudent => {
//         this.arrayStudents = dataStudent;
//         this.initDataTable()
//       })
//   }
//   /** OBTENER DATOS DE GRADO INGRESADO  */
//   public async getGradeDataFromGradeId(gradeId: string): Promise<void> {
//     this.grade = await this.adminEducationalUnitService.getGradeByGradeId(gradeId, this.unitEducationalId, this.academicPeriodStorage[0].academic_year_name).pipe(take(1)).toPromise();
//     this.getSubjectsFromUnitEducational(this.grade.sublevel_id)
//   }
//   /** OTENER DATOS DE PARALELO INGRESADO */
//   public async getParallelDataFromParallelId(parallel_id: string): Promise<void> {
//     this.parallel = await this.adminEducationalUnitService.getParallelByParallelId(parallel_id, this.unitEducationalId, this.academicPeriodStorage[0].academic_year_name)
//       .pipe(take(1)).toPromise();
//   }

//   /**
//  * Inicializa la datatable student
//  */
//   initDataTable() {
//     let aaa = this.tablaStudent;
//     $('#datatablesStudent').DataTable().destroy();
//     setTimeout(function () {
//       /***
//        * Opciones del datatable
//        ***/
//       aaa = $('#datatablesStudent').DataTable({
//         'paging': true,
//         'ordering': true,
//         'info': true,
//         'retrieve': true,
//         'pagingType': 'full_numbers',
//         'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
//         rowReorder: {
//           selector: 'td:nth-child(2)'
//         },
//         responsive: true,
//         language: {
//           search: '_INPUT_',
//           searchPlaceholder: 'Buscar',
//           "sProcessing": "Procesando...",
//           "sLengthMenu": "Mostrar _MENU_ registros",
//           "sZeroRecords": "No se encontraron resultados",
//           "sEmptyTable": "Ningún dato disponible",
//           "sInfo": "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
//           "sInfoEmpty": "Registros del 0 al 0 de un total de 0 registros",
//           "sInfoFiltered": "(Total de _MAX_ registros)",
//           "sInfoPostFix": "",
//           "sSearch": "Buscar:",
//           "sUrl": "",
//           "sInfoThousands": ",",
//           "sLoadingRecords": "Cargando...",
//           "oPaginate": {
//             "sFirst": "Primero",
//             "sLast": "Último",
//             "sNext": "Siguiente",
//             "sPrevious": "Anterior"
//           },
//           "oAria": {
//             "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
//             "sSortDescending": ": Activar para ordenar la columna de manera descendente"
//           },
//           "buttons": {
//             "copy": "Copiar",
//             "colvis": "Visibilidad"
//           }
//         },
//       });
//     }, 10)
//   }

//   /**
// * Inicializa la datatable student
// */
//   initDataTableListStudents() {
//     let aaa = this.tableListStudent;
//     $('#datatablesListStudent').DataTable().destroy();
//     setTimeout(function () {
//       /***
//        * Opciones del datatable
//        ***/
//       aaa = $('#datatablesListStudent').DataTable({
//         'paging': true,
//         'retrieve': true,
//         'ordering': true,
//         'info': true,
//         'pagingType': 'full_numbers',
//         'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
//         rowReorder: {
//           selector: 'td:nth-child(2)'
//         },
//         responsive: true,
//         language: {
//           search: '_INPUT_',
//           searchPlaceholder: 'Buscar',
//           "sProcessing": "Procesando...",
//           "sLengthMenu": "Mostrar _MENU_ registros",
//           "sZeroRecords": "No se encontraron resultados",
//           "sEmptyTable": "Ningún dato disponible",
//           "sInfo": "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
//           "sInfoEmpty": "Registros del 0 al 0 de un total de 0 registros",
//           "sInfoFiltered": "(Total de _MAX_ registros)",
//           "sInfoPostFix": "",
//           "sSearch": "Buscar:",
//           "sUrl": "",
//           "sInfoThousands": ",",
//           "sLoadingRecords": "Cargando...",
//           "oPaginate": {
//             "sFirst": "Primero",
//             "sLast": "Último",
//             "sNext": "Siguiente",
//             "sPrevious": "Anterior"
//           },
//           "oAria": {
//             "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
//             "sSortDescending": ": Activar para ordenar la columna de manera descendente"
//           },
//           "buttons": {
//             "copy": "Copiar",
//             "colvis": "Visibilidad"
//           }
//         },
//       });
//     }, 10)
//   }
//   /**
// * Inicializa la datatable teacher
// */
//   initDataTableTeacher() {
//     let aaa = this.tablaTeacher;
//     $('#datatablesTeacherList').DataTable().destroy();
//     setTimeout(function () {
//       /***
//        * Opciones del datatable
//        ***/
//       aaa = $('#datatablesTeacherList').DataTable({
//         'paging': true,
//         'ordering': true,
//         'info': true,
//         'retrieve': true,
//         'pagingType': 'full_numbers',
//         'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'All']],
//         rowReorder: {
//           selector: 'td:nth-child(2)'
//         },
//         responsive: true,
//         language: {
//           search: '_INPUT_',
//           searchPlaceholder: 'Buscar',
//         },
//       });
//     }, 10)
//   }

//   public onChangeAssign(student: Student, event) {
//     if (event) {
//       this.arrayStudentAssign.push(student);
//     } else {
//       this.arrayStudentAssign = this.arrayStudentAssign.filter(s => s !== student);
//     }
//   }

//   public saveAssignStudent() {
//     const addData = {
//       student_grade_id: this.grade_id,
//       student_parallel_id: this.parallel_id
//     }
//     console.log(addData);
//     swal({
//       title: '¿Confirma que desea continuar?',
//       type: 'warning',
//       showCancelButton: true,
//       confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
//       cancelButtonClass: 'btn btn-fill btn-danger',
//       confirmButtonText: 'Sí, guardar!',
//       buttonsStyling: false,
//     }).then((result) => {
//       if (result.value) {
//         this.arrayStudentAssign.forEach(student => {
//           this.adminEducationalUnitService.updateStudent(student, addData);
//         });
//         swal({
//           title: 'Ok',
//           text: 'Se asignaron los estudiantes correctamente! ',
//           buttonsStyling: false,
//           confirmButtonClass: 'btn btn-fill btn-info',
//           type: 'success',
//         }).catch(swal.noop)
//       }
//       $('#ModalAddStudents').modal('hide');
//     })
//     this.getStudentsOfGradeandParallel();
//     //  this.getStudentsData();
//   }

//   public getStudentsOfGradeandParallel(): void {
//     // tslint:disable-next-line: max-line-length
//     this.studentsOfGgradeSubscription = this.adminEducationalUnitService.getStudentsAssignedToGrade(this.unitEducationalId)
//       .pipe(map((student: Student[]) => student.filter(studentId => studentId.student_grade_id === this.grade_id
//         && studentId.student_parallel_id === this.parallel_id))).subscribe(dataStudent => {
//           this.arrayStudentsOfGradeandParallel = dataStudent;
//           this.initDataTableListStudents()
//         })

//   }

//   public changeIsAdminParallel() {
//     this.isReturn.emit(true);
//   }

//   public getSubjectsFromUnitEducational(sublevelId: string) {
//     this.arrayNDoc = [];
//     // tslint:disable-next-line: max-line-length
//     this.subjectsSubscription = this.adminEducationalUnitService.getSubjectsFromEducationalUnit(this.unitEducationalId, sublevelId, this.academicPeriodStorage[0].academic_year_name)
//       .subscribe(dataSubjects => {
//         dataSubjects.forEach(subject => {
//           const index = dataSubjects.lastIndexOf(subject);
//           if (this.arrayTeachers.length > 0) {
//             this.arrayTeachers.forEach(teacher => {
//               // tslint:disable-next-line: max-line-length
//               this.arrayNDoc[index] = 0
//               this.subjectsFromUESubscription = this.adminEducationalUnitService.getSubjectTeachers
//                 (teacher.teacher_id, this.unitEducationalId, this.parallel_id, subject.subject_id, this.academicPeriodStorage[0].academic_year_name)
//                 .subscribe(dataSubjectTeacher => {
//                   if (dataSubjectTeacher && dataSubjectTeacher.length > 0) {
//                     this.arrayNDoc[index] = this.arrayNDoc[index] + 1
//                   }
//                 })
//             }
//             )
//           }

//         });

//         this.arraySubjects = dataSubjects;
//         this.arraySubjects.filter(subjects => subjects.subject_status === true);
//         this.arraySubjects.forEach( sub => {
//           this.getSubjectUnits(sub);
//         })
//       })
//   }

//   public getTeachersFromUnitEducational() {
//     // tslint:disable-next-line: max-line-length
//     this.adminEducationalUnitService.getTeachersFromUnitEducational(this.unitEducationalId)
//       .pipe(map((t: Teacher[]) => t.filter((teacher) => teacher.teacher_status === true))).subscribe(dataTeachers => {
//         this.arrayTeachers = dataTeachers;
//         this.initDataTableTeacher()
//       })
//   }

//   public selectSubject(subject: Subject, isAdd: boolean) {
//     if (isAdd) {
//       this.arrayTeachersAssign = []
//       this.isTeacherSelect = false;
//       subject.parallel_id = this.parallel_id;
//       subject.grade_id = this.grade_id;
//       subject.grade_name = this.grade.grade_name;
//       subject.parallel_name = this.parallel.parallel_name;
//       this.selectSubjectToAddTeacher = subject;
//     } else {
//       this.selectSubjectToAddTeacher = subject;
//       this.getSubjectTeachers(subject)
//     }
//   }

//   public onChangeAssignTeacher(teacher: Teacher, event) {
//     if (event) {
//       this.arrayTeachersAssign.push(teacher);
//     } else {
//       this.arrayTeachersAssign = this.arrayTeachersAssign.filter(s => s !== teacher);
//     }
//   }

//   public saveAssignTeacher() {
//     swal({
//       title: '¿Confirma que desea continuar?',
//       type: 'warning',
//       showCancelButton: true,
//       confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
//       cancelButtonClass: 'btn btn-fill btn-danger',
//       confirmButtonText: 'Sí, guardar!',
//       buttonsStyling: false,
//     }).then((result) => {
//       if (result.value) {
//         this.arrayTeachersAssign.forEach(teacher => {
//           this.adminEducationalUnitService.addParallelIdInTeacherCollection(teacher, this.parallel, this.unitEducationalId,
//               this.academicPeriodStorage[0].academic_year_name);
//           this.adminEducationalUnitService.saveTeacherAssignSubject(teacher, this.unitEducationalId,
//             this.selectSubjectToAddTeacher, this.parallel, this.academicPeriodStorage[0].academic_year_name)
//         });
//         swal({
//           title: 'Ok',
//           text: 'Se asignaron los docentes correctamente! ',
//           buttonsStyling: false,
//           confirmButtonClass: 'btn btn-fill btn-info',
//           type: 'success',
//         }).catch(swal.noop)
//       }
//       this.getSubjectTeachers(this.selectSubjectToAddTeacher)
//       this.getSubjectsFromUnitEducational(this.grade.sublevel_id)
//       $('#ModalAddTeacher').modal('hide');
//       this.getTeachersFromUnitEducational()
//     })
//   }

//   public getSubjectTeachers(subject: Subject) {
//     this.arrayTeachers.forEach(teacher => {
//       // tslint:disable-next-line: max-line-length
//       this.subjectFromTeacherSubscription = this.adminEducationalUnitService.getSubjectTeachers(teacher.teacher_id, this.unitEducationalId, this.parallel_id, subject.subject_id, this.academicPeriodStorage[0].academic_year_name)
//         .subscribe(dataSubjectTeacher => {
//           this.arraySubjectTeachers = []
//           if (dataSubjectTeacher && dataSubjectTeacher.length > 0) {
//             this.teacherSubscription = this.teacherService.getTeacherById(teacher.teacher_id).pipe(take(1)).subscribe(dataTeacher => {
//               if (dataSubjectTeacher[0].subject_name === subject.subject_name) {
//                 if (this.arraySubjectTeachers.find(data => data.teacher_id === teacher.teacher_id)) {
//                   return;
//                 } else {
//                   this.arraySubjectTeachers.push(dataTeacher)
//                 }
//               }  else {
//                 this.arraySubjectTeachers = [dataTeacher]
//               }
//             })
//           } else {
//             this.arraySubjectTeachers = [];
//           }
//         })
//     })
//   }
//   /** ELIMINAR ASIGNATURA DE DOCENTE */
//   public removeTeacherFromSubject(teacher: Teacher) {
//     swal({
//       title: '¿Confirma que desea continuar?',
//       text: 'Docente seleccionado: ' + teacher.teacher_name,
//       type: 'warning',
//       showCancelButton: true,
//       confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
//       cancelButtonClass: 'btn btn-fill btn-danger',
//       confirmButtonText: 'Sí, eliminar!',
//       buttonsStyling: false,
//     }).then((result) => {
//       if (result.value) {
//         // tslint:disable-next-line: max-line-length
//         this.adminEducationalUnitService.deleteTeacherFromSubject(teacher, this.unitEducationalId, this.parallel, this.selectSubjectToAddTeacher, this.academicPeriodStorage[0].academic_year_name);
//         swal({
//           title: 'Ok',
//           text: 'Se elimino el docente ' + teacher.teacher_name + ' correctamente!',
//           buttonsStyling: false,
//           confirmButtonClass: 'btn btn-fill btn-success',
//           type: 'success'
//         }).catch(swal.noop)
//       }
//       this.getSubjectsFromUnitEducational(this.grade.sublevel_id)
//     })
//   }
//   /** ELIMINAR GRADO Y PARALELO DE ESTUDIANTE */
//   public removeStudentFromGrade(student: Student) {
//     swal({
//       title: '¿Confirma que desea continuar?',
//       text: 'Estudiante seleccionado: ' + student.student_name,
//       type: 'warning',
//       showCancelButton: true,
//       confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
//       cancelButtonClass: 'btn btn-fill btn-danger',
//       confirmButtonText: 'Sí, eliminar!',
//       buttonsStyling: false,
//     }).then((result) => {
//       if (result.value) {
//         this.adminEducationalUnitService.deleteStudentFromSubject(student);
//         swal({
//           title: 'Ok',
//           text: 'Se elimino el estudiante ' + student.student_name + ' correctamente! ',
//           buttonsStyling: false,
//           confirmButtonClass: 'btn btn-fill btn-success',
//           type: 'success'
//         }).catch(swal.noop)
//       }
//     })

//   }

//   public showPlanification(subject) {
//     this.selectedSubject = {
//       grade_id: this.grade.grade_id,
//       grade_name: this.grade.grade_name,
//       parallel_id: this.parallel.parallel_id,
//       parallel_name: this.parallel.parallel_name,
//       ...subject
//     };
//     this.showDetails = true;
//   }

//   receiveMessage($event: boolean) {
//     this.showDetails = $event
//   }

//   /* Obtien unidades por materia*/
//   getSubjectUnits(subject) {
//     this.adminEducationalUnitService.unitsFromUE(this.infoUser.unit_educational_id, this.parallel.parallel_id, subject.subject_id, this.academicPeriodStorage[0].academic_year_name)
//         .then( units => {
//           subject['units'] = units.size;
//           subject['classes'] = 0;
//           units.forEach( unit => {
//             this.adminEducationalUnitService.sessionsFromUnit(this.infoUser.unit_educational_id, this.parallel.parallel_id, subject.subject_id, unit.data().unit_id, this.academicPeriodStorage[0].academic_year_name)
//                 .then( classes => {
//                   subject['classes'] += classes.size;
//                   subject['evaluations'] = 0;
//                   classes.forEach( session => {
//                     this.adminEducationalUnitService.evaluationsFromSession(this.infoUser.unit_educational_id, this.parallel.parallel_id, subject.subject_id, unit.data().unit_id, session.data().class_id, this.academicPeriodStorage[0].academic_year_name)
//                         .then( evaluations => {
//                           subject['evaluations'] += evaluations.size;
//                         })
//                   })
//                 })
//           })
//         });
//   }
// }

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { take, map } from "rxjs/operators";
import { Subscription } from "rxjs";

/**SERVICE */
import { AdminEducationalUnitService } from "app/services/adminEducationalUnit/admin-educational-unit.service";
import { TeachersService } from "app/services/teachers/teachers.service";
import { StudentService } from "app/services/student/student.service";

/**MODELS */
import { Parallels } from "app/models/class/classdocument-parallels";
import { SchoolGrade } from "app/models/class/class.documentschoolGrade";
import { Subject } from "app/models/class/classdocumentSubject";
import { DataTable } from "app/models/interfaces/datatable";
import { Student } from "app/models/student/student.model";
import { Teacher } from "app/models/teacher/teacher.model";
import swal from "sweetalert2";
import { UnitEducational } from "../../../models/class/class.documentUnitEducational";
import { TeacherSubjectsService } from "../../../services/teacher-subjects/teacher-subjects.service";

declare var $: any;

@Component({
  selector: "app-admin-parallel-of-edu-unit",
  templateUrl: "./admin-parallel-of-edu-unit.component.html",
  styleUrls: ["./admin-parallel-of-edu-unit.component.css"],
})
export class AdminParallelOfEduUnitComponent implements OnInit, OnDestroy {
  public infoUser: UnitEducational;

  @Input() isAdminParallel: boolean;
  @Input() grade_id: string;
  @Input() parallel_id: string;
  @Input() unitEducationalId: string;
  @Output() isReturn = new EventEmitter();

  public parallel: Parallels;
  public grade: SchoolGrade;
  public dataTable: DataTable;
  public toAssign: boolean;
  public isTeacherSelect: boolean = false;
  public isActivePanel: boolean;
  /** ARRAYS  */
  public arrayStudents: Array<Student>;
  public arrayStudentAssign: Array<Student> = [];
  public arrayStudentsOfGradeandParallel: Array<Student>;
  public arraySubjects: Array<Subject>;
  public arrayNDoc: any;
  public arrayTeachers: Array<Teacher>;
  public arrayTeachersAssign: Array<Teacher> = [];
  public selectSubjectToAddTeacher: Subject;
  public arraySubjectTeachers: Array<Teacher> = [];
  public arrayParallelsFromGrade: Array<Parallels>;

  tablaStudent: any;
  showDetails: boolean;
  selectedSubject: Subject;

  /** subscriptions */
  private studentSusbcription: Subscription;
  private teachersSubscription: Subscription;
  private subjectsSubscription: Subscription;
  private studentsOfGgradeSubscription: Subscription;
  private subjectFromTeacherSubscription: Subscription;
  private subjectsFromUESubscription: Subscription;
  private teacherSubscription: Subscription;
  tablaTeacher: any;
  public tableListStudent: any;

  constructor(
    private adminEducationalUnitService: AdminEducationalUnitService,
    private teacherService: TeachersService,
    private studentService: StudentService,
    public ts: TeacherSubjectsService
  ) {}

  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    this.tablaStudent = $("#datatablesStudent").DataTable({});
    this.tablaTeacher = $("#datatablesTeacherList").DataTable({});
    this.tableListStudent = $("#datatablesListStudent").DataTable({});
    this.dataTable = {
      headerRow: [
        "",
        "NOMBRE",
        "APELLIDO",
        "EMAIL",
        "IDENTIFICACIÓN",
        "ASIGNAR",
      ],
      footerRow: [
        "",
        "NOMBRE",
        "APELLIDO",
        "EMAIL",
        "IDENTIFICACIÓN",
        "ASIGNAR",
      ],
      dataRows: [],
    };
    if (this.isAdminParallel) {
      this.getGradeDataFromGradeId(this.grade_id);
      this.getParallelDataFromParallelId(this.parallel_id);
    }

    this.getStudentsData();
    this.getStudentsOfGradeandParallel();
    this.getTeachersFromUnitEducational();
    this.showDetails = false;
  }
  ngOnDestroy(): void {
    if (this.studentSusbcription) {
      this.studentSusbcription.unsubscribe();
    }
    if (this.teachersSubscription) {
      this.teachersSubscription.unsubscribe();
    }
    if (this.subjectsSubscription) {
      this.subjectsSubscription.unsubscribe();
    }
    if (this.studentsOfGgradeSubscription) {
      this.studentsOfGgradeSubscription.unsubscribe();
    }
    if (this.subjectFromTeacherSubscription) {
      this.subjectFromTeacherSubscription.unsubscribe();
    }
    if (this.subjectsFromUESubscription) {
      this.subjectsFromUESubscription.unsubscribe();
    }
    if (this.teacherSubscription) {
      this.teacherSubscription.unsubscribe();
    }
  }
  /** OBTENER DATOS DE ESTUDIANTE */
  public getStudentsData() {
    this.studentSusbcription = this.adminEducationalUnitService
      .getStudentsFromEducationalUnit(this.unitEducationalId)
      .pipe(
        map((students: Student[]) =>
          students.filter(
            (student) =>
              student.student_status === true && !student.student_grade_id
          )
        )
      )
      .subscribe((dataStudent) => {
        this.arrayStudents = dataStudent;
        this.initDataTable();
      });
  }
  /** OBTENER DATOS DE GRADO INGRESADO  */
  public async getGradeDataFromGradeId(gradeId: string): Promise<void> {
    this.grade = await this.adminEducationalUnitService
      .getGradeByGradeId(gradeId, this.unitEducationalId)
      .pipe(take(1))
      .toPromise();
    this.getSubjectsFromUnitEducational(this.grade.sublevel_id);
  }
  /** OTENER DATOS DE PARALELO INGRESADO */
  public async getParallelDataFromParallelId(
    parallel_id: string
  ): Promise<void> {
    this.parallel = await this.adminEducationalUnitService
      .getParallelByParallelId(parallel_id, this.unitEducationalId)
      .pipe(take(1))
      .toPromise();
  }

  /**
   * Inicializa la datatable student
   */
  initDataTable() {
    let aaa = this.tablaStudent;
    $("#datatablesStudent").DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $("#datatablesStudent").DataTable({
        paging: true,
        ordering: true,
        info: true,
        retrieve: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        rowReorder: {
          selector: "td:nth-child(2)",
        },
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
   * Inicializa la datatable student
   */
  initDataTableListStudents() {
    let aaa = this.tableListStudent;
    $("#datatablesListStudent").DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $("#datatablesListStudent").DataTable({
        paging: true,
        retrieve: true,
        ordering: true,
        info: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        rowReorder: {
          selector: "td:nth-child(2)",
        },
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
   * Inicializa la datatable teacher
   */
  initDataTableTeacher() {
    let aaa = this.tablaTeacher;
    $("#datatablesTeacherList").DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $("#datatablesTeacherList").DataTable({
        paging: true,
        ordering: true,
        info: true,
        retrieve: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        rowReorder: {
          selector: "td:nth-child(2)",
        },
        responsive: true,
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Buscar",
        },
      });
    }, 10);
  }

  public onChangeAssign(student: Student, event) {
    if (event) {
      this.arrayStudentAssign.push(student);
    } else {
      this.arrayStudentAssign = this.arrayStudentAssign.filter(
        (s) => s !== student
      );
    }
  }

  public saveAssignStudent() {
    const addData = {
      student_grade_id: this.grade_id,
      student_parallel_id: this.parallel_id,
    };
    swal({
      title: "¿Confirma que desea continuar?",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, guardar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.arrayStudentAssign.forEach((student) => {
          this.adminEducationalUnitService.updateStudent(student, addData);
        });
        swal({
          title: "Ok",
          text: "Se asignaron los estudiantes correctamente! ",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-info",
          type: "success",
        }).catch(swal.noop);
      }
      $("#ModalAddStudents").modal("hide");
    });
    this.getStudentsOfGradeandParallel();
    //  this.getStudentsData();
  }

  public getStudentsOfGradeandParallel(): void {
    // tslint:disable-next-line: max-line-length
    this.studentsOfGgradeSubscription = this.adminEducationalUnitService
      .getStudentsAssignedToGrade(this.unitEducationalId)
      .pipe(
        map((student: Student[]) =>
          student.filter(
            (studentId) =>
              studentId.student_grade_id === this.grade_id &&
              studentId.student_parallel_id === this.parallel_id
          )
        )
      )
      .subscribe((dataStudent) => {
        this.arrayStudentsOfGradeandParallel = dataStudent;
        this.initDataTableListStudents();
      });
  }

  public changeIsAdminParallel() {
    this.isReturn.emit(true);
  }

  public getSubjectsFromUnitEducational(sublevelId: string) {
    this.arrayNDoc = [];
    // tslint:disable-next-line: max-line-length
    this.subjectsSubscription = this.adminEducationalUnitService
      .getSubjectsFromEducationalUnit(this.unitEducationalId, sublevelId)
      .subscribe((dataSubjects) => {
        dataSubjects.forEach((subject) => {
          const index = dataSubjects.lastIndexOf(subject);
          if (this.arrayTeachers.length > 0) {
            this.arrayTeachers.forEach((teacher) => {
              // tslint:disable-next-line: max-line-length
              this.arrayNDoc[index] = 0;
              this.subjectsFromUESubscription = this.adminEducationalUnitService
                .getSubjectTeachers(
                  teacher.teacher_id,
                  this.unitEducationalId,
                  this.parallel_id,
                  subject.subject_id
                )
                .subscribe((dataSubjectTeacher) => {
                  if (dataSubjectTeacher && dataSubjectTeacher.length > 0) {
                    this.arrayNDoc[index] = this.arrayNDoc[index] + 1;
                  }
                });
            });
          }
        });

        this.arraySubjects = dataSubjects;
        this.arraySubjects.filter(
          (subjects) => subjects.subject_status === true
        );
        this.arraySubjects.forEach((sub) => {
          this.getSubjectUnits(sub);
        });
      });
  }

  public getTeachersFromUnitEducational() {
    // tslint:disable-next-line: max-line-length
    this.adminEducationalUnitService
      .getTeachersFromUnitEducational(this.unitEducationalId)
      .pipe(
        map((t: Teacher[]) =>
          t.filter((teacher) => teacher.teacher_status === true)
        )
      )
      .subscribe((dataTeachers) => {
        this.arrayTeachers = dataTeachers;
        this.initDataTableTeacher();
      });
  }

  public selectSubject(subject: Subject, isAdd: boolean) {
    if (isAdd) {
      this.arrayTeachersAssign = [];
      this.isTeacherSelect = false;
      subject.parallel_id = this.parallel_id;
      subject.grade_id = this.grade_id;
      subject.grade_name = this.grade.grade_name;
      subject.parallel_name = this.parallel.parallel_name;
      this.selectSubjectToAddTeacher = subject;
    } else {
      this.selectSubjectToAddTeacher = subject;
      this.getSubjectTeachers(subject);
    }
  }

  public onChangeAssignTeacher(teacher: Teacher, event) {
    if (event) {
      this.arrayTeachersAssign.push(teacher);
    } else {
      this.arrayTeachersAssign = this.arrayTeachersAssign.filter(
        (s) => s !== teacher
      );
    }
  }

  public saveAssignTeacher() {
    swal({
      title: "¿Confirma que desea continuar?",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, guardar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.arrayTeachersAssign.forEach((teacher) => {
          this.adminEducationalUnitService.addParallelIdInTeacherCollection(
            teacher,
            this.parallel,
            this.unitEducationalId
          );
          this.adminEducationalUnitService.saveTeacherAssignSubject(
            teacher,
            this.unitEducationalId,
            this.selectSubjectToAddTeacher,
            this.parallel
          );
        });
        swal({
          title: "Ok",
          text: "Se asignaron los docentes correctamente! ",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-info",
          type: "success",
        }).catch(swal.noop);
      }
      this.getSubjectTeachers(this.selectSubjectToAddTeacher);
      this.getSubjectsFromUnitEducational(this.grade.sublevel_id);
      $("#ModalAddTeacher").modal("hide");
      this.getTeachersFromUnitEducational();
    });
  }

  public getSubjectTeachers(subject: Subject) {
    this.arrayTeachers.forEach((teacher) => {
      // tslint:disable-next-line: max-line-length
      this.subjectFromTeacherSubscription = this.adminEducationalUnitService
        .getSubjectTeachers(
          teacher.teacher_id,
          this.unitEducationalId,
          this.parallel_id,
          subject.subject_id
        )
        .subscribe((dataSubjectTeacher) => {
          this.arraySubjectTeachers = [];
          if (dataSubjectTeacher && dataSubjectTeacher.length > 0) {
            this.teacherSubscription = this.teacherService
              .getTeacherById(teacher.teacher_id)
              .pipe(take(1))
              .subscribe((dataTeacher) => {
                if (
                  dataSubjectTeacher[0].subject_name === subject.subject_name
                ) {
                  if (
                    this.arraySubjectTeachers.find(
                      (data) => data.teacher_id === teacher.teacher_id
                    )
                  ) {
                    return;
                  } else {
                    this.arraySubjectTeachers.push(dataTeacher);
                  }
                } else {
                  this.arraySubjectTeachers = [dataTeacher];
                }
              });
          } else {
            this.arraySubjectTeachers = [];
          }
        });
    });
  }
  /** ELIMINAR ASIGNATURA DE DOCENTE */
  public removeTeacherFromSubject(teacher: Teacher) {
    swal({
      title: "¿Confirma que desea continuar?",
      text: "Docente seleccionado: " + teacher.teacher_name,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, eliminar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        // tslint:disable-next-line: max-line-length
        this.adminEducationalUnitService.deleteTeacherFromSubject(
          teacher,
          this.unitEducationalId,
          this.parallel,
          this.selectSubjectToAddTeacher
        );
        swal({
          title: "Ok",
          text:
            "Se elimino el docente " + teacher.teacher_name + " correctamente!",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
        }).catch(swal.noop);
      }
      this.getSubjectsFromUnitEducational(this.grade.sublevel_id);
    });
  }
  /** ELIMINAR GRADO Y PARALELO DE ESTUDIANTE */
  public removeStudentFromGrade(student: Student) {
    swal({
      title: "¿Confirma que desea continuar?",
      text: "Estudiante seleccionado: " + student.student_name,
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, eliminar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.adminEducationalUnitService.deleteStudentFromSubject(student);
        swal({
          title: "Ok",
          text:
            "Se elimino el estudiante " +
            student.student_name +
            " correctamente! ",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "success",
        }).catch(swal.noop);
      }
    });
  }

  public showPlanification(subject) {
    this.selectedSubject = {
      grade_id: this.grade.grade_id,
      grade_name: this.grade.grade_name,
      parallel_id: this.parallel.parallel_id,
      parallel_name: this.parallel.parallel_name,
      ...subject,
    };
    this.showDetails = true;
  }

  receiveMessage($event: boolean) {
    this.showDetails = $event;
  }

  /* Obtien unidades por materia*/
  getSubjectUnits(subject) {
    this.adminEducationalUnitService
      .unitsFromUE(
        this.infoUser.unit_educational_id,
        this.parallel.parallel_id,
        subject.subject_id
      )
      .then((units) => {
        subject["units"] = units.size;
        subject["classes"] = 0;
        units.forEach((unit) => {
          this.adminEducationalUnitService
            .sessionsFromUnit(
              this.infoUser.unit_educational_id,
              this.parallel.parallel_id,
              subject.subject_id,
              unit.data().unit_id
            )
            .then((classes) => {
              subject["classes"] += classes.size;
              subject["evaluations"] = 0;
              classes.forEach((session) => {
                this.adminEducationalUnitService
                  .evaluationsFromSession(
                    this.infoUser.unit_educational_id,
                    this.parallel.parallel_id,
                    subject.subject_id,
                    unit.data().unit_id,
                    session.data().class_id
                  )
                  .then((evaluations) => {
                    subject["evaluations"] += evaluations.size;
                  });
              });
            });
        });
      });
  }
}
