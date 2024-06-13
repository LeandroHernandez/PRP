import { Component, OnInit, OnDestroy } from '@angular/core';
import swal from 'sweetalert2';
import { take, map } from 'rxjs/operators';

/** SERVICE */
import { AdminPracticeService } from '../../../services/adminPractice/admin-practice.service';
import { TeacherSubjectsService } from 'app/services/teacher-subjects/teacher-subjects.service';
import { AdminEssayService } from 'app/services/adminEssay/admin-essay.service';
import { AdminEvaluationService } from 'app/services/adminEvaluation/admin-evaluation.service'
/** MODELS */
import { TypePractice, OptionOfItem } from '../../../models/class/class.documenttype-practice';
import { Adminpractices } from '../../../models/class/class.documentadminpractices';
import { Subject } from 'app/models/class/classdocumentSubject';
import { SchoolGrade } from 'app/models/class/class.documentschoolGrade'
import { Teacher } from 'app/models/teacher/teacher.model';
import { Subscription } from 'rxjs';
import { Parallels } from 'app/models/class/classdocument-parallels';


declare var $: any;


@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit, OnDestroy {

  public practiceId: String;

  public arraySubjects: Array<Subject>;
  public arrayGrades: Array<SchoolGrade> = [];
  public subjectName: String;
  public subjectId: String;
  public gradeId: String;
  public gradeName: String;
  public infoUser: Teacher;
  public arrayPractices: Adminpractices[];
  public arrayEssays: Adminpractices[];
  public arrayTeacher: any;
  public isNewPractice = false;
  public isNewEvaluation = false;
  public isNewActivity = false;
  public showNewActivity = false;
  public shownewPractice = false;
  public showViewPractice = false;
  public showViewEssay = false;
  public arrayPractice: Adminpractices[];
  public practiceCopy: Adminpractices;
  public newId: String;
  public optionId: String;
  public arrayOptions = [];
  public arraySubjectsOrigin: Array<Subject> = [];
  public subjectColor: String;
  public arrayTypeOfTest: Array<String>;
  public showNewEvaluation = false;
  public evaluationId: String;
  public essayId: String;
  public arrayEvaluations: Adminpractices[];
  public showViewEvaluation = false;
  public arrayCantOptions: any[];
  public arrayCantOptionsEvaluation: any[];
  public arrayEvaluation:Adminpractices[];
  public evaluationCopy:Adminpractices;
  /** Subscription */
  private practicesSubscription: Subscription;
  private parallelsSubscription: Subscription;
  private subjectSubscription: Subscription;
  private essaysSubscription: Subscription;
  private evaluationsSubscription: Subscription;
  public academicPeriodStorage;


  constructor(private adminPracticeService: AdminPracticeService,
    private adminEssayService: AdminEssayService,
    private teacherSubjectService: TeacherSubjectsService,
    private evaluationsService: AdminEvaluationService) {
  }

  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'))
    this.gradeName = '';
    this.subjectName = '';
    this.getParallelsFromTeacher()
    this.arrayTypeOfTest = ['Práctica', 'Evaluación', 'Actividad']
  }

  ngOnDestroy() {
    if (this.practicesSubscription) {
      this.practicesSubscription.unsubscribe();
    }
    if (this.parallelsSubscription) {
      this.parallelsSubscription.unsubscribe();
    }
    if (this.subjectSubscription) {
      this.subjectSubscription.unsubscribe();
    }
    if (this.essaysSubscription) {
      this.essaysSubscription.unsubscribe();
    }
    if (this.evaluationsSubscription) {
      this.evaluationsSubscription.unsubscribe();
    }
  }

  /** OBTIENE PARALELOS DE DOCENTE */
  public getParallelsFromTeacher() {
    this.arraySubjects = []
    const unitEducationalId = this.infoUser.teacher_unit_educational[0]
    this.parallelsSubscription = this.teacherSubjectService.getParallelsFromTeacherId(this.infoUser.teacher_id, unitEducationalId, this.academicPeriodStorage[0].academic_year_name).subscribe(parallelsId => {
      const parallelId = parallelsId.map((p: Parallels) => p.parallel_id)

      parallelId.forEach(parallel => {
        this.getSubjectsFromTeacher(parallel)
      })
    })
  }

  /** OBTIENE ASIGNATURAS DE DOCENTE */
  public getSubjectsFromTeacher(parallel) {
    const unitEducationalId = this.infoUser.teacher_unit_educational
    this.subjectSubscription = this.teacherSubjectService.getSubjectsFromParallelIid(this.infoUser.teacher_id, unitEducationalId, parallel, this.academicPeriodStorage[0].academic_year_name).subscribe(subjects => {
      subjects.forEach(subject => {
        this.arraySubjectsOrigin.push(subject)
        //  console.log(this.arraySubjects)
        this.arraySubjects = this.arraySubjects
        if (this.arraySubjects.some(a => a.subject_id === subject.subject_id)) {
          this.arraySubjects = this.arraySubjects
        } else {
          this.arraySubjects.push(subject)
        }
      })
    })
  }

  /** CAMBIO DE SELECCIÓN DE ASIGNATURA */
  public OnChangeSubject(e) {
    this.arrayEvaluations = []
    this.arrayPractices = [];
    this.gradeName = '';
    this.arrayGrades = []
    this.subjectId = e.target.value;
    this.arraySubjectsOrigin.forEach(sub => {
      if (sub.subject_id === this.subjectId) {
        this.subjectName = sub.subject_name;
        this.subjectColor = sub.color;
        if (this.arrayGrades.some(a => a.grade_id === sub.grade_id)) {
          this.arrayGrades = this.arrayGrades
        } else {
          this.arrayGrades.push(sub)
        }
      }
    })
  }

  /** CAMBIO DE SELECCIÓN DE GRADO */
  public onChangeGrade(e) {
    this.arrayPractices = []
    this.gradeId = e.target.value;
    this.arrayGrades.forEach(grade => {
      if (grade.grade_id === this.gradeId) {
        this.gradeName = grade.grade_name;
        this.getPractice();
        this.getEssays();
        this.getEvaluations()
      }

    })
  }
 
  /** SE OBTIENEN PRACTICAS */
  public getPractice() {
    this.practicesSubscription = this.adminPracticeService.getPracticeFromTeacherIdAndGradeId(this.infoUser.teacher_unit_educational[0])
      .pipe(map((practice: Adminpractices[]) => practice.filter(p => p.grade_id === this.gradeId &&  p.subject_id === this.subjectId 
        && p.public_status_practice === true)))
      .subscribe(data => {
        this.arrayPractices = data;
        console.log(this.arrayPractices)
        if (this.arrayPractices && this.arrayPractices.length > 0) {
          this.getCountOptionsFromPractice()
        }

      })
  }
  /** SE OBTIENEN Evaluaciones */
  public getEvaluations() {
    this.evaluationsSubscription = this.evaluationsService.getEvaluationsFromSubjectAndGradeId(this.infoUser.teacher_unit_educational[0])
      .pipe(map((evaluations: Adminpractices[]) => evaluations.filter(e => e.grade_id === this.gradeId &&  e.subject_id === this.subjectId
        && e.public_status_practice === true)))
      .subscribe(data => {
        this.arrayEvaluations = data;
        if (this.arrayEvaluations && this.arrayEvaluations.length > 0) {
          this.getCountOptionsFromEvaluations()
        }

      })
  }
  /* Se obtienen las actividades */
  public getEssays() {
    this.essaysSubscription = this.adminEssayService.getEssayFromTeacherIdAndGradeId(this.infoUser.teacher_unit_educational[0])
      .pipe(map((essay: Adminpractices[]) => essay.filter(p => p.grade_id === this.gradeId &&  p.subject_id === this.subjectId
        && p.public_status_practice === true)))
      .subscribe(data => {
        this.arrayEssays = data;
      })
  }

  /** SE OBTIENEN LONGITUD DE EJERCICIOS POR PRACTICA */
  public async getCountOptionsFromPractice() {
    this.arrayCantOptions = [];
    // tslint:disable-next-line: max-line-length
    this.arrayPractices.forEach(p => {
      this.adminPracticeService.getOptionsFromPractice(p.practice_id).subscribe(options => {
        if (options && options.length >= 0) {
          this.arrayCantOptions.push(options.length)
        }
      })
    })
  }
  /** SE OBTIENEN LONGITUD DE EJERCICIOS POR PRACTICA */
  public async getCountOptionsFromEvaluations() {
    this.arrayCantOptionsEvaluation = [];
    // tslint:disable-next-line: max-line-length
    this.arrayEvaluations.forEach(e => {
      this.evaluationsService.getOptionsFromEvaluations(e.evaluation_id).subscribe(options => {
        if (options && options.length >= 0) {
          this.arrayCantOptionsEvaluation.push(options.length)
        }
      })
    })
  }

  public viewPractice(practice_id: String) {
    this.practiceId = practice_id;
    this.showViewPractice = true;
  }

  public viewEssay(essay_id: string) {
    this.essayId = essay_id;
    this.showViewEssay = true;
  }

  public viewEvaluationId(evaluation_id: String) {
    this.showViewEvaluation = true;
    this.evaluationId = evaluation_id;
  }
  public newTest(type: String) {
    if (type === 'Práctica') {
      this.shownewPractice = true;
      this.isNewPractice = true;
    }
    if (type === 'Evaluación') {
      this.showNewEvaluation = true;
      this.isNewEvaluation = true
    }
    if (type === 'Actividad') {
      this.showNewActivity = true;
      this.isNewActivity = true;
    }
  }

  /** ACTIVA EL METODO COPIAR PRACTICA */
  public copyAndEditPractice(practiceId: String) {
    // this.evaluationId = practiceId;
    // this.shownewPractice = true;
    // this.isNewPractice = false;
    this.copyPractice(practiceId)
  }

  /** FUNCIÓN PARA RETORNAR DE COMPONENTES EXTERNOS */
  public return() {
    this.shownewPractice = false;
    this.showNewEvaluation = false;
    this.showNewActivity = false;
    this.showViewPractice = false;
    this.showViewEssay = false;
    this.showViewEvaluation = false;
    this.getPractice()
    this.getEvaluations()
  }

  /** METODO PARA COPIAR PRACTICA */
  public async copyPractice(practiceId) {
    let count = 0;
    const newId = new Date().getTime().toString();
    this.arrayPractice = await this.adminPracticeService.getPractice(practiceId).pipe(take(1)).toPromise();
    /** SE CREA  NUEVA PRACTICA */
    this.arrayPractice.map((practice) => this.practiceCopy = practice)
    this.practiceCopy.practice_id = newId;
    this.practiceCopy.teacher_id = this.infoUser.teacher_id;
    this.adminPracticeService.createPractice(this.practiceCopy, true)
    /** CONSULTO OPCIONES DE PRACTICA A COPIAR  */
    this.adminPracticeService.getOptionPracticeId(practiceId).subscribe(async options => {
      this.arrayOptions = options
      options.forEach(async option => {
        /** CONSULTO ITEMS */
        count++;
        this.adminPracticeService.getAllOptionsFromOption(practiceId, option).subscribe(async allOptions => {
          /** SE CREAN  OPCIONES */
          //  option.option_id = new Date().getTime().toString();
          this.adminPracticeService.createOptionPractice(newId, option, true);
          /** SE CREAN ITEMS DE OPCIONES */
          await this.adminPracticeService.createOptionItem(newId, option, allOptions)
          if (count === this.arrayOptions.length) {
            swal({
              title: 'La práctica se duplico correctamente',
              text: '¿Desea editar la práctica?',
              type: 'success',
              showCancelButton: true,
              confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
              cancelButtonClass: 'btn btn-fill btn-danger',
              confirmButtonText: 'Sí, editar!',
              buttonsStyling: false,
            }).then((result) => {
              if (result.value) {
                this.shownewPractice = true;
                this.isNewPractice = false;
                this.practiceId = newId;
                this.shownewPractice = true
              }
            })
          }
        })
      })

    })
  }

  public async  copyAndEditEvaluation(evaluationIid) {
    let count = 0;
    const newId = new Date().getTime().toString();
    this.arrayEvaluation = await this.evaluationsService.getEvaluation(evaluationIid).pipe(take(1)).toPromise();
    /** SE CREA  NUEVA PRACTICA */
    this.arrayEvaluation.map((evaluation) => this.evaluationCopy = evaluation)
    this.evaluationCopy.evaluation_id = newId;
    this.evaluationCopy.teacher_id = this.infoUser.teacher_id;
    this.evaluationsService.createEvaluation(this.evaluationCopy, true)
    /** CONSULTO OPCIONES DE PRACTICA A COPIAR  */
    this.evaluationsService.getOptionsFromEvaluations(evaluationIid).subscribe(async options => {
      this.arrayOptions = options
      options.forEach(async option => {
        /** CONSULTO ITEMS */
        count++;
        this.evaluationsService.getAllOptionsFromOption(evaluationIid, option).subscribe(async allOptions => {
          /** SE CREAN  OPCIONES */
          //  option.option_id = new Date().getTime().toString();
          this.evaluationsService.createOptionEvaluation(newId, option, true);
          /** SE CREAN ITEMS DE OPCIONES */
          await this.evaluationsService.createOptionItemEvaluation(newId, option, allOptions)
          if (count === this.arrayOptions.length) {
            swal({
              title: 'La Evaluación se duplico correctamente',
              text: '¿Desea editar la evaluación?',
              type: 'success',
              showCancelButton: true,
              confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
              cancelButtonClass: 'btn btn-fill btn-danger',
              confirmButtonText: 'Sí, editar!',
              buttonsStyling: false,
            }).then((result) => {
              if (result.value) {
                this.showNewEvaluation = true;
                this.isNewEvaluation = false;
                this.evaluationId = newId;
               
              }
            })
          }
        })
      })

    })

  }
  public editPractice(practice_id){
    console.log(practice_id)
    this.shownewPractice = true;
    this.isNewPractice = false;
    this.practiceId = practice_id;
  }

  editEssay (eassy_id) {
    console.log(eassy_id)
    this.showNewActivity = true;
    this.isNewActivity = false;
    this.essayId = eassy_id;
  }

  public editEvaluation(evaluation_id) {
    this.evaluationId = evaluation_id;
    this.showNewEvaluation = true;
    this.isNewEvaluation = false;
  }
    /** Elimina de manera logica la asignatura
   * @param subject
  */
 async deletePractice(resource, type) {
  let resource_name = '';
  switch (type) {
    case 'practice': {
      resource_name = resource.practice_name; break;
    }
    case 'evaluation': {
      resource_name = resource.evaluation_name; break;
    }
    case 'essay' : {
      resource_name = resource.essay_name; break;
    }
  }
  swal({
    title: 'Desea eliminar el recurso?',
    text: resource_name,
    type: 'warning',
    showCancelButton: true,
    confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
    cancelButtonClass: 'btn btn-fill btn-danger',
    confirmButtonText: 'Sí, eliminar!',
    buttonsStyling: false,
  }).then((result) => {
    if (result.value) {
      switch (type) {
        case 'practice': {
           this.adminPracticeService.deletePractice(resource.practice_id);
           break;
        }
        case 'evaluation': {
           this.evaluationsService.deleteEvaluation(resource.evaluation_id);
           break;
        }
        case 'essay' : {
           this.adminEssayService.deleteEssay(resource.essay_id);
           break;
        }
     }
      swal({
        title: 'Ok',
        text: 'Se inactivó el recurso! ' + resource_name,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-fill btn-success',
        type: 'success'
      }).catch(swal.noop)
    }
  })
}

}

