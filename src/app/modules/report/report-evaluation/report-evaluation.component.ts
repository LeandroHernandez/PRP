import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from '../../../models/class/classdocumentSubject';
import { Teacher } from '../../../models/teacher/teacher.model';
import { Subscription } from 'rxjs';
import { TeacherSubjectsService } from '../../../services/teacher-subjects/teacher-subjects.service';
import { Parallels } from '../../../models/class/classdocument-parallels';
import { SchoolGrade } from '../../../models/class/class.documentschoolGrade';
import { StudentSubjectsService } from '../../../services/student-subjects/student-subjects.service';
import { map, take } from 'rxjs/operators';
import { AdminEducationalUnitService } from '../../../services/adminEducationalUnit/admin-educational-unit.service';
import { Student } from '../../../models/student/student.model';
import { AdminEvaluationService } from '../../../services/adminEvaluation/admin-evaluation.service';
import { async } from '@angular/core/testing';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-report-evaluation',
  templateUrl: './report-evaluation.component.html',
  styleUrls: ['./report-evaluation.component.css']
})
export class ReportEvaluationComponent implements OnInit {
  @ViewChild('datatablesEvaluation', { static: false }) datatablesEvaluation: ElementRef;

  public arraySubjects: Array<Subject>;
  public arraySubjectsOrigin: Array<Subject> = [];

  public infoUser: Teacher;
  public arrayGrades: Array<SchoolGrade> = [];

  public gradeName: String;
  public unitName: String;
  public seccionName: String;
  // public gradeName: String;
  public subjectId: String;

  public subjectName: String;
  public subjectColor: String;

  private parallelsSubscription: Subscription;
  private subjectSubscription: Subscription;
  public arrayStudentsOfGradeandParallel: Array<any>;

  public activeSubject: any; // active subject
  public arrayUnits: Subject[];
  public activeUnit: any;
  public arrayClass: any;
  public classActive: any;
  typeReport: any;
  activeGrade: Subject;
  public studentsOfGgradeSubscription: Subscription;
  public evaluation: any;
  questionsFromEvaluation: any;
  public arrayDatailsForEstudent: any;
  public arrayDatailsForEstudentAux: any;
  public arrayForItem: any;
  public porcentaje = 100;
  public academicPeriodStorage;

  constructor(
    private teacherSubjectService: TeacherSubjectsService,
    private studenSubjectService: StudentSubjectsService,
    private adminEducationalUnitService: AdminEducationalUnitService,
    private evaluationService: AdminEvaluationService,
    public adminEvaluationService: AdminEvaluationService,
  ) { }

  ngOnInit(): void {
    this.arrayStudentsOfGradeandParallel = [];
    this.evaluation = [];
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'));
    this.gradeName = '';
    this.unitName = '';
    this.seccionName = '';
    this.subjectName = '';
    this.getParallelsFromTeacher();

  }

  ngOnDestroy() {
    // if (this.practicesSubscription) {
    //   this.practicesSubscription.unsubscribe();
    // }
    if (this.parallelsSubscription) {
      this.parallelsSubscription.unsubscribe();
    }
    if (this.subjectSubscription) {
      this.subjectSubscription.unsubscribe();
    }
    // if (this.essaysSubscription) {
    //   this.essaysSubscription.unsubscribe();
    // }
    // if (this.evaluationsSubscription) {
    //   this.evaluationsSubscription.unsubscribe();
    // }
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.datatablesEvaluation.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Modulares');
    xlsx.writeFile(wb, 'detalleDeEvaluacion.xlsx');
  }

  /** OBTIENE PARALELOS DE DOCENTE */
  public getParallelsFromTeacher() {
    this.arraySubjects = []
    const unitEducationalId = this.infoUser.teacher_unit_educational[0]
    this.parallelsSubscription = this.teacherSubjectService.getParallelsFromTeacherId(this.infoUser.teacher_id, unitEducationalId, this.academicPeriodStorage[0].academic_year_name).subscribe(parallelsId => {
      const parallelId = parallelsId.map((p: Parallels) => p.parallel_id)
      // console.log(parallelId);
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
    this.activeSubject = this.arraySubjects[e.target.value];
    this.gradeName = '';
    this.arrayGrades = []
    this.arrayUnits = []
    this.arrayClass = []
    this.arrayGrades = []
    this.subjectId = this.activeSubject.subject_id;
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

  getSubjectUnits(e) {
    this.activeGrade = this.arrayGrades[e.target.value];
    this.teacherSubjectService.getSubjectUnits(this.infoUser, this.activeSubject, this.academicPeriodStorage[0].academic_year_name).subscribe(subjects => {
      this.arrayUnits = subjects;
    })
  }

  onChangeClassByUnit(e) {
    this.activeUnit = this.arrayUnits[e.target.value];
    this.getClassFromUnit(this.activeUnit, this.activeSubject);
  }

  getClassFromUnit(activeUnit, subject) {
    this.studenSubjectService.getClassFromUnit(this.infoUser.teacher_unit_educational[0], subject.parallel_id,
      activeUnit, subject, this.academicPeriodStorage[0].academic_year_name)
      .subscribe(clases => {
        this.arrayClass = clases;
      });
  }

  onChangeSesion(e) {
    this.classActive = this.arrayClass[e.target.value]
  }

  onChangeType(e) {
    this.typeReport = e.target.value;
  }

  onGenerateReport() {
    this.evaluation = [];
    this.questionsFromEvaluation = [];
    this.arrayDatailsForEstudent = [];
    this.studenSubjectService.getEvaluation(this.infoUser.teacher_unit_educational[0], this.activeGrade.parallel_id,
      this.activeSubject.subject_id, this.activeUnit.unit_id, this.classActive.class_id, this.academicPeriodStorage[0].academic_year_name).subscribe(evaluations => {
        if (evaluations.length != 0) {
          const url = evaluations[0].evaluation_url.split('/');
          this.evaluation = url[2];
          this.getEvaluation();
        }
      })
  }

  public async getEvaluation() {
    this.evaluation = await this.evaluationService.getEvaluation(this.evaluation).pipe(take(1)).toPromise();
    this.evaluation = this.evaluation;
    this.getQuestionsFromEvaluation();
  }

  public async getQuestionsFromEvaluation() {
    this.questionsFromEvaluation = await this.evaluationService.getOptionsFromEvaluations(this.evaluation[0].evaluation_id).pipe(take(1)).toPromise();
    this.getStudentsOfGradeandParallel();
  }

  public async getStudentsOfGradeandParallel() {
    this.studentsOfGgradeSubscription = await this.adminEducationalUnitService.getStudentsAssignedToGrade(this.infoUser.teacher_unit_educational[0])
      .pipe(map((student: Student[]) => student.filter(studentId => studentId.student_grade_id === this.activeGrade.grade_id
        && studentId.student_parallel_id === this.activeGrade.parallel_id)))
      .subscribe(dataStudent => {
        this.arrayStudentsOfGradeandParallel = dataStudent;
        this.getDataEvaluationByStudent()
      })
  }

  async getDataEvaluationByStudent() {
    this.arrayDatailsForEstudent = [];
    this.arrayDatailsForEstudentAux = [];
    this.arrayForItem = [];
    var cont = 0;
    await this.arrayStudentsOfGradeandParallel.forEach(async element => {
      await this.adminEvaluationService.getDetailsRepEvaluation(element.student_id, this.activeSubject.subject_id, this.activeUnit.unit_id, this.classActive.class_id, this.evaluation).subscribe(async evaluation => {
        let contAux = cont;
        if (evaluation[0]) {
          await this.adminEvaluationService.getDetailsEvaluation(element.student_id, this.activeSubject.subject_id, this.activeUnit.unit_id, this.classActive.class_id, evaluation[0]).subscribe(evaluations => {
            this.arrayDatailsForEstudent[element.student_id] = evaluations;
            this.arrayDatailsForEstudent[element.student_id].totalScore = evaluation[0].totalScore;
            this.arrayDatailsForEstudentAux.push(evaluation[0].totalScore);
            if (contAux+1 == this.arrayDatailsForEstudentAux.length) {
              this.calculatePorByItem();
            }
          })
        } else {
          this.arrayDatailsForEstudentAux.push('');
          if (contAux+1 == this.arrayDatailsForEstudentAux.length) {
            this.calculatePorByItem();
          }
        }
        cont++;
      })
    });
  }

  async calculatePorByItem() {
    this.questionsFromEvaluation.forEach(element => {
      this.arrayForItem[element.option_id] = 0;
    });


    await this.arrayStudentsOfGradeandParallel.forEach(student => {
      var cont = 0;
      if (this.arrayDatailsForEstudent[student.student_id] !== undefined) {
        this.arrayDatailsForEstudent[student.student_id].forEach(element => {
          this.arrayForItem[element.questionId] = this.arrayForItem[element.questionId] + element.score;
        });
      }
      cont++;
    });
  }
}
