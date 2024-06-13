import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Subject} from 'app/models/class/classdocumentSubject';
import {take, map} from 'rxjs/operators';

/** SERVICES */
import {TeacherSubjectsService} from 'app/services/teacher-subjects/teacher-subjects.service';
import {AdminEducationalUnitService} from 'app/services/adminEducationalUnit/admin-educational-unit.service';
import {AdminEvaluationService} from 'app/services/adminEvaluation/admin-evaluation.service'
/** MODALS */
import {Student} from 'app/models/student/student.model';
import {Teacher} from 'app/models/teacher/teacher.model';
import {DataTable} from 'app/models/interfaces/data-table';
import {StudentSubjectsService} from '../../../services/student-subjects/student-subjects.service';
import {Resource} from '../../../models/dto/class.resource';
import {StudentService} from '../../../services/student/student.service';
import {Entry} from '../../../models/dto/class.entry';
import {ForumDocument} from 'app/models/class/class.documentforo';
import {ForumServiceService} from 'app/services/forum-service/forum-service.service';
import {ForumQuestionDocument} from 'app/models/class/class.documentforumquestion';
import {DocumentForumAnswer} from 'app/models/class/class.documentforoanswer';
import {ForumQuestionDTO} from '../../../models/dto/ForumQuestionDTO';
import {Subscription} from 'rxjs';
import {InformationEvaluationQuestion} from 'app/models/class/class.document-informationPracticeQuestion';
import {EvaluationSummary} from 'app/models/class/evaluation-summary'
import swal from 'sweetalert2';
import * as xlsx from 'xlsx';
import {MatTabGroup} from '@angular/material/tabs';

declare var $: any;

interface StudentClass {
  class_id: string;
  student_total_attempts: 0,
  student_total_time: any,
  class_resources: any[],
  student_resources: any[],
  student_total_resources_in_true: number,
  student_porcentage_resources: any,
  student_porcentage_evaluation: any
}

interface StudentSubject {
  student_id: string;
  student_name: string;
  student_lastname: string;
  student_total_time: string;
  student_classes: StudentClass[];
}


@Component({
  selector: 'app-view-statistics-student',
  templateUrl: './view-statistics-student.component.html',
  styleUrls: ['./view-statistics-student.component.css']
})
export class ViewStatisticsStudentComponent implements OnInit, OnDestroy {

  @ViewChild('datatablesEvaluation', {static: false}) datatablesEvaluation: ElementRef;
  @ViewChild('datatablesPractice', {static: false}) datatablesPractice: ElementRef;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @Input() subjectSelect: Subject;
  @Output() isReturn = new EventEmitter();
  public units: any = [];
  public activeUnit: any;
  public arrayClasses: Array<any> = [];
  public arrayStudents: any[];
  public arrayStudentsFromGrade: Student[];
  public studentClassResources: StudentSubject[] = [];
  public infoUser: Teacher;
  public tableStudent;
  public dataTable: DataTable;
  public showDetails: boolean;
  public showHome: boolean;
  public showSubjects;
  public resourceList = [];
  public attemptDetailsList = []
  private student_id: string;
  public subject_id: string;
  public unit_id: string;
  public classId: string;
  public studentSelect: Student;
  public spentTimeVar: string;

  private enabledListForum = [];
  private classIdSelected: string;
  private unitIdSelected: string;
  public isShowForum = false;
  public forumDocumentSelected: ForumDocument;
  public forumQuestionDocumentList: ForumQuestionDTO[];
  public documentForumAnswerList: DocumentForumAnswer[];
  public documentForumBestAnswer: DocumentForumAnswer;
  public forumQuestionDocumentSave: ForumQuestionDocument;
  public documentForumAnswerSave: DocumentForumAnswer;
  public timeout = null;
  public itemsInTrue = [];
  public showEssayDetail: boolean;
  public essayId = '';
  public activeClass: any;
  public isCountPercentage = false;
  private resourcesSubscription: Subscription;
  public resourcesNumber = 0;
  public arrayQuestionsFromEvaluation: Array<InformationEvaluationQuestion>;
  public arrayQuestionsFromPractices: Array<any>;
  public totalSessions: number;
  public selectedUnitTab = 1; // Deja seleccionada una unidad al cambiar de tab
  private activeUnitIndex = 0;
  public academicPeriodAcademic;

  constructor(public ts: TeacherSubjectsService,
              public sS: StudentSubjectsService,
              private studentService: StudentService,
              public adminEducationalService: AdminEducationalUnitService,
              private forumService: ForumServiceService,
              public adminEvaluationService: AdminEvaluationService) {
  }

  ngOnInit(): void {

    this.showDetails = false;
    this.showHome = true;
    this.forumDocumentSelected = new ForumDocument;
    this.documentForumBestAnswer = new DocumentForumAnswer();
    this.forumQuestionDocumentSave = new ForumQuestionDocument();
    this.documentForumAnswerSave = new DocumentForumAnswer();
    this.enabledListForum = [];
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.academicPeriodAcademic = JSON.parse(localStorage.getItem('academic_period'));

    if (this.subjectSelect) {
      this.getSubjectUnits();
      this.getStudentsFromGrade().then(() => '');
    }
    this.tableStudent = $('#datatablesStudents').DataTable({});
  }

  ngOnDestroy() {
    if (this.resourcesSubscription) {
      this.resourcesSubscription.unsubscribe()
    }
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet =
        xlsx.utils.table_to_sheet(this.datatablesEvaluation.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Modulares');
    xlsx.writeFile(wb, 'detalleDeEvaluacion.xlsx');
  }

  exportToExcelPractices() {
    const ws: xlsx.WorkSheet =
        xlsx.utils.table_to_sheet(this.datatablesPractice.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Modulares');
    xlsx.writeFile(wb, 'detalleDePractica.xlsx');
  }

  /* Get all units from active subject */
  async getSubjectUnits() {
    const subjects = await this.ts.getUnitsNoRealTimeQuery(this.infoUser, this.subjectSelect, this.academicPeriodAcademic[0].academic_year_name);
    subjects.docs.forEach( unit => {
      this.units.push(unit.data());
    });
    this.activeUnit = this.units[this.activeUnitIndex];
    this.getClassFromUnit(this.activeUnit, this.subjectSelect);
  }


  /* Get all clases from active unit*/
  private async getClassFromUnit(unit, subject) {
    this.arrayClasses = [];
    this.arrayClasses = await this.ts.getClassFromUnitTrue(this.infoUser, unit, subject, this.academicPeriodAcademic[0].academic_year_name)
        .pipe(take(1), map((clase) => clase.filter(c => c.class_status === true)))
        .toPromise();


    // OBTENER LOS NOMBRES DE LAS SESIONES
    this.ts.getClassFromUnitTrueNoRealTimeQuery(this.infoUser, unit, subject, this.academicPeriodAcademic[0].academic_year_name)
        .then(doc => {
          if (!doc.empty) {
            doc.forEach(aux => {
              for (const x of this.arrayClasses) {
                if (aux.data().class_id === x.class_id) {
                  x.className = aux.data().className;
                }
              }
            })
          } else {
            // console.log('DATA NOT FOUND')
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error);
        });
    // OBTENER LOS NOMBRES DE LAS SESIONES

    this.forumEnabledList(this.arrayClasses, unit.unit_id)
    let count = 0
    this.arrayClasses.forEach(unitClass => {
      count++;
      this.ts.getClassResources(this.infoUser, unit, subject, unitClass, this.academicPeriodAcademic[0].academic_year_name).subscribe(resources => {
        unitClass.class_resources = resources;
        this.getStudentResources();
      })
      if (count === this.arrayClasses.length) {
        this.isCountPercentage = true;
      }
    });
  }

  /* Get all students from grade and parallel */
  public async getStudentsFromGrade() {
    this.arrayStudents = await this.adminEducationalService.getStudentsAssignedToGrade(this.infoUser.teacher_unit_educational[0])
        .pipe(take(1)).toPromise();
    this.arrayStudentsFromGrade = this.arrayStudents
        .filter(student => student.student_grade_id === this.subjectSelect.grade_id &&
            student.student_parallel_id === this.subjectSelect.parallel_id);
    this.arrayStudentsFromGrade
        .sort((a, b) => (a.student_lastname > b.student_lastname) ? 1 : ((b.student_lastname > a.student_lastname) ? -1 : 0));
  }

  private getPreviousClass() {
    this.ts.getPreviousClass(this.infoUser, this.activeUnit, this.subjectSelect, this.arrayClasses[this.arrayClasses.length - 1].class_id,
        this.academicPeriodAcademic[0].academic_year_name)
        .subscribe(data => {
          if (data.length > 0) {
            this.arrayClasses.push(data[0]);
            this.getStudentResources();
          } else {
            swal({
              title: 'No existen más sesiones',
              type: 'error',
              confirmButtonClass: 'btn btn-fill btn-danger',
              buttonsStyling: false,
            })
          }
        })
  }

  // /* Get all students from grade and parallel */
  // public async getStudentsFromGrade() {
  //   this.arrayStudents = await this.adminEducationalService.getStudentsAssignedToGrade(this.infoUser.teacher_unit_educational[0])
  //     .pipe(take(1)).toPromise();
  //   this.arrayStudentsFromGrade = this.arrayStudents
  //     .filter(student => student.student_grade_id === this.subjectSelect.grade_id &&
  //       student.student_parallel_id === this.subjectSelect.parallel_id);
  //   //  this.initDataTable();
  // }

  public async getStudentResources() {
    this.studentClassResources = [];
    if (this.arrayStudentsFromGrade === undefined) {
      this.getStudentsFromGrade();
      const contexto = this;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        contexto.getClassFromUnit(contexto.activeUnit, contexto.subjectSelect);
      }, 600);
    } else {
      this.arrayStudentsFromGrade.forEach(student => {

        this.studentClassResources.push({
          student_id: student.student_id,
          student_name: student.student_name,
          student_lastname: student.student_lastname,
          student_total_time: '0s',
          student_classes: [],
        })
      })
      let count = 0
      this.studentClassResources.forEach(student => {
        count++
        this.arrayClasses.forEach((unitClass, i) => {

          if (unitClass.class_evaluation !== undefined) {
            if (unitClass.class_evaluation.length > 0 && count === 1) {
              if (unitClass.class_resources.find(data => data.evaluation_name)) {
                return;
              } else {
                unitClass.class_resources.push(unitClass.class_evaluation[0])
              }
            }
          }
          student.student_classes.push({
            student_total_resources_in_true: 0,
            student_total_attempts: 0,
            class_resources: [],
            student_resources: [],
            class_id: unitClass.class_id,
            student_porcentage_resources: 0,
            student_porcentage_evaluation: 0,
            student_total_time: 0,
          });
          this.resourcesSubscription = this.ts.getStudentResources(student.student_id, this.subjectSelect.subject_id, this.activeUnit.unit_id, unitClass.class_id).pipe(take(1))
              .subscribe(resources => {
                this.ts.getStudentEvaluation(student.student_id, this.subjectSelect.subject_id, this.activeUnit.unit_id, unitClass.class_id).pipe(take(1)).subscribe((evaluation: any) => {
                  evaluation.forEach(element => {
                    if (element !== undefined) {

                      if (element.evaluationStatus === true || element.evaluationId === undefined) {
                        // console.log(evaluation.length )
                        element.intents = evaluation.length;
                        element.time_spend = element.totalTime
                        resources.push(element)
                      } else {
                        return;
                      }
                    }
                  });
                  if (student.student_classes[i] !== undefined && unitClass.class_resources !== undefined) {
                    student.student_classes[i].class_resources = unitClass.class_resources;
                    student.student_classes[i].student_resources = resources;
                    const arrayTime = [];
                    resources.forEach((r: any) => {
                      /*arrayTime.push(r.time_spend.split(':'))
                      console.log(arrayTime)
                      arrayTime.forEach(t => {
                        parseInt(t[0].toString() )/ 60
                        parseInt(t[1].toString() )/ 60
                        t[2]
                        console.log(t)
                      })*/
                      // console.log('tiempo del recurso',arrayTime)
                      student.student_classes[i].student_total_time = r.time_spend
                      if (r.totalScore !== undefined) {
                        r.intents = r.intents
                      }
                      student.student_classes[i].student_total_attempts += r.intents;
                      if (r.resource_status === true || r.totalScore !== undefined) {
                        student.student_classes[i].student_total_resources_in_true += 1;
                        if (resources.length !== undefined) {
                          //  console.log(student.student_classes[i].student_total_resources_in_true , student.student_classes[i].class_resources.length)
                          const prueba = student.student_classes[i].student_total_resources_in_true / student.student_classes[i].class_resources.length
                          student.student_classes[i].student_porcentage_resources = Math.floor(prueba * 100)
                        }
                      }
                    })
                  }

                })
              })
        })
      })
    }
  }


  /* Set active unit for queries */
  setActiveUnit(index) {
    this.activeUnit = this.units[index];
    this.activeUnitIndex = index;
    this.studentClassResources = [];
    this.getClassFromUnit(this.activeUnit, this.subjectSelect);
  }

  setActiveClass(index) {
    this.activeClass = this.arrayClasses[index];
    this.findResources()
  }

  /**
   * Inicializa la datatable
   */
  initDataTable() {
    let aaa = this.tableStudent;
    $('#datatablesStudents').DataTable().destroy();
    setTimeout(function () {
      /***
       * Opciones del datatable
       ***/
      aaa = $('#datatablesStudents').DataTable({
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

  /* Regresa a pantalla anterior */
  public returnShowSubjects() {
    this.isReturn.emit(true);
  }

  async showDetail(student_id: string, subject_id: string, unit_id: string) {
    this.showDetails = true;
    this.showHome = false;
    this.student_id = student_id;
    this.subject_id = subject_id;
    this.unit_id = unit_id;
    //  this.classId = classId;
    this.activeClass = this.arrayClasses[0]
    this.studentSelect = await this.studentService.getstudent(student_id).pipe(take(1)).toPromise();
    this.findResources()

  }


  private async findResources() {
    if (this.arrayClasses.length > 0) {
      const responseResources = await this
          .studentService
          .getClass(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id);
      responseResources
          .subscribe(resourcesResponseList => {
            this.resourceList = resourcesResponseList as Array<Resource>
            this.ts.getStudentEvaluation(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id).pipe(take(1)).subscribe((evaluations: EvaluationSummary[]) => {

              if (evaluations[0] !== undefined) {
                const indice = evaluations.length;
                const lastAttemp = indice - 1;
                // console.log(indice - 1)
                // console.log(evaluations.length)
                evaluations[lastAttemp].intents = evaluations.length;
                this.resourceList.push(evaluations[lastAttemp])

                // console.log('LISTA DE RECURSOS',this.resourceList)
              }
            })
          });
    }
  }

  public async showEvaluation(resource) {
    this.adminEvaluationService.getDetailsEvaluation(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id, resource).subscribe(evaluation => {
      this.arrayQuestionsFromEvaluation = evaluation
    })
  }

  public async showPractice(resource) {
    this.arrayQuestionsFromPractices = [];
    this.adminEvaluationService.getPracticeDetails(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id, resource).subscribe(practiceAttempts => {
      console.log(practiceAttempts);
      if (practiceAttempts != null && practiceAttempts.length > 0) {
        this.adminEvaluationService.getpracticeAttempts(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id, resource, practiceAttempts[0].payload.doc.id).subscribe(attemptsDetaills => {
          console.log(attemptsDetaills);
          this.arrayQuestionsFromPractices = attemptsDetaills;
        });
      }
    });
  }

  public newAttempEvaluation(evaluation) {
    //  console.log(evaluation)
    swal({
      title: '¿Confirma que desea activar nuevamente la evaluación al estudiante?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, Activar!',
      cancelButtonText: 'No, Cancelar',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        swal('Ok!', 'Se ha activado nuevamente la evaluación para el estudiante.', 'success');
        this.adminEvaluationService.activeEvaluation(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id, evaluation)
      }
    })


  }

  hideDetail() {
    this.showDetails = false;
    this.showHome = true;
    this.resourceList = [];
    this.attemptDetailsList = [];
    this.student_id = '';
    this.subject_id = '';
    this.unit_id = '';
    this.classId = '';
    this.units = [];
    this.activeUnit = this.units[this.activeUnitIndex];
    this.getSubjectUnits().then(() => {
      setTimeout(() => {
        this.tabGroup.selectedIndex = this.activeUnitIndex;
      }, 600);
    });
  }

  getColor() {
    return 'rgb( 46, 116, 190 )';
  }

  public async showTryDetail(resource: Resource) {
    if (resource.evaluationData === undefined) {
      const responseEntry = await this
          .studentService
          .getEntrySnapshot(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id, resource.resource_id);

      responseEntry
          .subscribe(entryResponseList => {
            console.log(entryResponseList);
            //console.log(entryResponseList[0].id);
            this.attemptDetailsList = [];
            entryResponseList.map(a => {
              console.log(a);
              if (a.payload != null && a.payload.doc != null) {
                var aux = a.payload.doc.data() as Entry;
                aux.id = a.payload.doc.id;
                this.attemptDetailsList.push(aux);
              }
            });
            //this.attemptDetailsList = entryResponseList as Array<Entry>
          });
    } else {
      this.ts.getStudentEvaluation(this.student_id, this.subject_id, this.unit_id, this.activeClass.class_id).subscribe((evaluation: any) => {
        //  console.log(evaluation)
        this.attemptDetailsList = evaluation;
      })
    }
    // console.log(resource)

  }

  /**
   * Obtener la Lista de Foros para poder analizarlos mas adelante
   * @param classList
   * @param unitId
   * @private
   */
  private forumEnabledList(classList, unitId: string) {
    for (const classObject of classList) {
      let forumDoc: ForumDocument;
      this.forumService
          .findForumClass(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
              this.subjectSelect.subject_id, unitId, classObject.class_id)
          .subscribe(forum => {
            forumDoc = forum as ForumDocument
            const codeString = this.getCodeString(classObject.class_id, unitId);
            this.enabledListForum.push({codeStringState: codeString, resultForum: forumDoc})
            this.validateMessages(classObject.class_id, unitId);
          });
    }
  }

  /**
   * muestra el boton para las clases que tienen foro
   * @param classId
   * @param unitId
   */
  public forumEnableValidation(classId: string, unitId: string): boolean {
    const codeString = this.getCodeString(classId, unitId);
    for (const forumE of this.enabledListForum) {
      if (codeString === forumE.codeStringState) {
        const forumDoc: ForumDocument = forumE.resultForum as ForumDocument;
        if (forumDoc !== undefined) {
          return true;
        } else {
          return false;
        }
      }
    }
  }


  /** Validacion Foro */
  public showDataForum(classId: string, unitId: string) {
    this.classIdSelected = classId;
    this.unitIdSelected = unitId;
    this.isShowForum = true;
    this.forumService
        .getAllQuestionsForum(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
            this.subjectSelect.subject_id, this.unitIdSelected, this.classIdSelected)
        .subscribe(questionList => {
          this.forumQuestionDocumentList = this.sortListquestion(questionList as Array<ForumQuestionDTO>);
          for (const forumQuestion of this.forumQuestionDocumentList) {
            this.showAnswers(forumQuestion);
            if (!this.validateExistence(forumQuestion.question_id)) {
              forumQuestion.studentAnswersList.push(this.infoUser.teacher_id);
              this.forumService.addView(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
                  this.subjectSelect.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestion);
            }
          }
        });
  }


  private getCodeString(classId: string, unitId: string) {
    return this.infoUser.teacher_unit_educational
        + ';' + this.subjectSelect.parallel_id
        + ';' + this.subjectSelect.subject_id
        + ';' + unitId
        + ';' + classId;
  }

  public hideDataForum() {
    this.isShowForum = false;
    this.classIdSelected = '';
    this.unitIdSelected = '';
  }

  public saveContribution(forumQuestionDocument: ForumQuestionDocument, index: number) {
    this.documentForumAnswerSave.answer_id = String(new Date().getTime().valueOf());
    this.documentForumAnswerSave.answer_user_id = this.infoUser.teacher_id;
    this.documentForumAnswerSave.answer = $('#questionId' + index).val();
    this.documentForumAnswerSave.answer_user_name = this.infoUser.teacher_name + ' ' + this.infoUser.teacher_surname;
    this.documentForumAnswerSave.answer_user_type = 'profesor';
    this.documentForumAnswerSave.answer_status = true;
    this.documentForumAnswerSave.answer_count_like = [];
    this.forumService
        .saveContribution(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
            this.subjectSelect.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestionDocument, this.documentForumAnswerSave);
    this.documentForumAnswerSave = new DocumentForumAnswer();
    $('#questionId' + index).val('');
  }

  public validateExistence(questionCOde: string): boolean {
    for (const x of this.forumQuestionDocumentList) {
      if (x.question_id === questionCOde) {
        return (x.studentAnswersList as string[]).indexOf(this.infoUser.teacher_id) !== -1;
      }
    }
  }

  public showAnswers(forumQuestionDocument: ForumQuestionDocument) {
    this.documentForumAnswerList = [];
    this.documentForumBestAnswer = new DocumentForumAnswer();
    this.forumService
        .getAllAnswer(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
            this.subjectSelect.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestionDocument)
        .subscribe(answersLIst => {
          let cont = 0;
          for (const forumQuestion of this.forumQuestionDocumentList) {
            if (forumQuestion.question_id === forumQuestionDocument.question_id) {
              this.forumQuestionDocumentList[cont].documentForumAnswerList = new Array<DocumentForumAnswer>();
              this.forumQuestionDocumentList[cont]
                  .documentForumAnswerList = this.sortList(answersLIst as Array<DocumentForumAnswer>);
              let maxSize = 0;
              this.forumQuestionDocumentList[cont].documentForumBestAnswer = new DocumentForumAnswer();
              for (const x of this.forumQuestionDocumentList[cont].documentForumAnswerList) {
                if (x.answer_count_like.length > maxSize) {
                  this.forumQuestionDocumentList[cont].documentForumBestAnswer = x;
                  maxSize = x.answer_count_like.length;
                }
              }
              break;
            }
            cont = cont + 1;
          }
        });
  }

  public likeAnswer(forumQuestionDocument: ForumQuestionDocument, documentForumAnswer: DocumentForumAnswer) {
    this.forumService
        .addLikeContribution(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
            this.subjectSelect.subject_id, this.unitIdSelected, this.classIdSelected, forumQuestionDocument,
            documentForumAnswer, this.infoUser.teacher_id);
  }

  public getUserLikedAnswer(documentForumAnswerList: DocumentForumAnswer): boolean {
    return documentForumAnswerList.answer_count_like.indexOf(this.infoUser.teacher_id) !== -1;
  }

  public getBestAnswer(answerForumID: string): boolean {
    for (const x of this.documentForumAnswerList) {
      if (x.answer_id === answerForumID) {
        return x.answer_count_like.indexOf(this.infoUser.teacher_id) !== -1;
      }
    }
  }

  /**
   * guarda una nueva pregunta del foro
   */

  saveNewQuestion() {
    if (this.forumQuestionDocumentSave !== null) {
      const date = new Date();
      this.forumQuestionDocumentSave.question_id = new Date().getTime().toString();
      this.forumQuestionDocumentSave.id_user_creator = this.infoUser.teacher_id;
      this.forumQuestionDocumentSave.question_date = this.getDate(date);
      this.forumQuestionDocumentSave.question_time = this.getTime(date);
      this.forumQuestionDocumentSave.user_type = 'profesor';
      this.forumQuestionDocumentSave.question_status = true;
      this.forumQuestionDocumentSave.studentAnswersList = [];
      this.forumService.createForumQuestionStudent(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
          this.subjectSelect.subject_id, this.activeUnit.unit_id, this.classIdSelected, this.forumQuestionDocumentSave).then(r => {
        this.forumQuestionDocumentSave = new ForumQuestionDocument()
      });
    }
  }

  sortList(documentForumAnswerList: DocumentForumAnswer[]) {
    return documentForumAnswerList.sort(function (a, b) {
      if (a.answer_id > b.answer_id) {
        return -1;
      }
      if (a.answer_id < b.answer_id) {
        return 1;
      }
      return 0;
    });
  }

  sortListquestion(documentForumAnswerList: ForumQuestionDTO[]) {
    return documentForumAnswerList.sort(function (a, b) {
      if (a.question_id > b.question_id) {
        return -1;
      }
      if (a.question_id < b.question_id) {
        return 1;
      }
      return 0;
    });
  }

  private getDate(date: Date) {
    return date.getFullYear() + '/' + ((date.getMonth() + 1) > 12 ? 12 : (date.getMonth() + 1)) + '/' + date.getDate();
  }

  private getTime(date: Date) {
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  getDateAnswer(date: string) {
    const dat = new Date(Number(date));
    return this.getDate(dat) + ' - ' + this.getTime(dat)
  }

  /**
   * busca y retorna una lista ordenada segun el criterio de busqueda
   * @param question
   */
  searchQuestion(question: string) {
    if (question !== '') {
      this.forumService
          .getFilterQuestionsForum(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
              this.subjectSelect.subject_id, this.unitIdSelected, this.classIdSelected, question)
          .subscribe(questionList => {
            this.forumQuestionDocumentList = questionList as Array<ForumQuestionDTO>;
            for (const forumQuestion of this.forumQuestionDocumentList) {
              this.showAnswers(forumQuestion);
            }
          });
    } else if (question === '') {
      this.showDataForum(this.classIdSelected, this.unitIdSelected);
    }
  }

  showEssay(essay) {
    //  console.log(essay);
    this.classId = essay.class_id;
    this.essayId = essay;
    this.showEssayDetail = true;
  }

  // searchQuestion(question: string) {
  //   if (question !== '') {
  //     this.forumService
  //         .getFilterQuestionsForum(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
  //             this.subjectSelect.subject_id, this.unitIdSelected, this.classIdSelected, question)
  //         .subscribe(questionList => {
  //           this.forumQuestionDocumentList = questionList as Array<ForumQuestionDTO>;
  //           for (const forumQuestion of this.forumQuestionDocumentList) {
  //             this.showAnswers(forumQuestion);
  //           }
  //         });
  //   } else if (question === '') {
  //     this.showDataForum(this.classIdSelected, this.unitIdSelected);
  //   }
  // }

  keyUpTimeout(question: string) {
    const timeoutFilter = 600;
    const contexto = this;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(function () {
      contexto.searchQuestion(question);
    }, timeoutFilter);
  }

  private validateMessages(classId: string, unitId: string) {
    this.forumService
        .getAllQuestionsForum(this.infoUser.teacher_unit_educational[0], this.subjectSelect.parallel_id,
            this.subjectSelect.subject_id, unitId, classId)
        .subscribe(questionList => {
          let cont = 0
          for (const forumQuestion of questionList as Array<ForumQuestionDocument>) {
            if (forumQuestion.studentAnswersList.indexOf(this.infoUser.teacher_id) === -1) {
              cont = cont + 1;
            }
          }
          let cont2 = 0
          for (const x of this.enabledListForum) {
            if (x.codeStringState === this.getCodeString(classId, unitId)) {
              this.enabledListForum[cont2].messages = cont;
            }
            cont2 = cont2 + 1;
          }
        });
  }

  public getMessagesNumber(classId: string, unitId: string): number {
    for (const x of this.enabledListForum) {
      if (x.codeStringState === this.getCodeString(classId, unitId)) {
        return x.messages;
      }
    }
    return 0;
  }

  /**
   * alterna el color de las tarjetas del foro
   * @param index
   */
  getCardColor(index) {
    const position = index + 1;
    if (position % 2 === 0) {
      return '#EDFAFF';
    } else {
      return '#FFFFFF';
    }
  }

  public return() {
    this.showEssayDetail = false;
  }

}
