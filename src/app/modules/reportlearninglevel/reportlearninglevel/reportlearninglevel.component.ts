import { Subscription } from 'rxjs';
import { Subject } from '../../../models/class/classdocumentSubject';
import { Teacher } from '../../../models/teacher/teacher.model';
import { SchoolGrade } from '../../../models/class/class.documentschoolGrade';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TeacherSubjectsService } from '../../../services/teacher-subjects/teacher-subjects.service';
import { Parallels } from '../../../models/class/classdocument-parallels';
import { StudentSubjectsService } from '../../../services/student-subjects/student-subjects.service';
import { map, take } from 'rxjs/operators';
import { AdminEducationalUnitService } from '../../../services/adminEducationalUnit/admin-educational-unit.service';
import { Student } from '../../../models/student/student.model';
import { AdminEvaluationService } from '../../../services/adminEvaluation/admin-evaluation.service';
import { async } from '@angular/core/testing';
import * as xlsx from 'xlsx';
@Component({
  selector: 'app-reportlearninglevel',
  templateUrl: './reportlearninglevel.component.html',
  styleUrls: ['./reportlearninglevel.component.css']
})
export class ReportlearninglevelComponent implements OnInit {
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
  public academicPeriodStorage;
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
    this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'))
    this.gradeName = '';
    this.unitName = '';
    this.seccionName = '';
    this.subjectName = '';
    this.getParallelsFromTeacher();

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
    // this.teacherSubjectService.getSubjectUnits(this.infoUser, this.activeSubject).subscribe(subjects => {
    //   this.arrayUnits = subjects;
    // })
  }

}
