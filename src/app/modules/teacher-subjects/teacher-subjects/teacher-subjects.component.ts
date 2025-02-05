import { Component, OnDestroy, OnInit } from "@angular/core";
import { TeacherSubjectsService } from "../../../services/teacher-subjects/teacher-subjects.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
/** MODELS */
import { Teacher } from "../../../models/teacher/teacher.model";
import { Parallels } from "../../../models/class/classdocument-parallels";
import { Subject } from "app/models/class/classdocumentSubject";

@Component({
  selector: "app-teacher-subjects",
  templateUrl: "./teacher-subjects.component.html",
  styleUrls: ["./teacher-subjects.component.css"],
})
export class TeacherSubjectsComponent implements OnInit, OnDestroy {
  selectedTeacher: Teacher;
  selectedSubjects = [];
  auxSubjects = [];
  selectedGrades = [];
  selectedSubject: any;
  showTeacherList = false;
  public subjectSelect: Subject;
  public showTracking = false;
  private parallelsSubscription: Subscription;
  private subjectSubscription: Subscription;
  public academicPeriodStorage;

  constructor(public ts: TeacherSubjectsService) {}

  ngOnInit(): void {
    this.selectedTeacher = JSON.parse(localStorage.getItem("infoUser"));
    this.academicPeriodStorage = JSON.parse(
      localStorage.getItem("academic_period")
    );
    this.getTeacher();
  }

  /**
   * Obtiene los datos del profesor (provisional, error en localstorage al iniciar sesión (undefined))
   */
  getTeacher() {
    this.ts.getTeacher(this.selectedTeacher.teacher_id).subscribe((teacher) => {
      if (teacher !== undefined) {
        this.selectedTeacher = teacher;
        this.getParallelsFromTeacher(this.selectedTeacher);
      }
    });
  }

  /* Redirecciona a componente de detalle de materia*/
  showDetail(subject) {
    this.selectedSubject = subject;
    this.showTeacherList = true;
  }

  receiveMessage($event) {
    this.showTeacherList = $event;
  }

  /* OBTIENE PARALELOS DE DOCENTE */
  public getParallelsFromTeacher(teacher: Teacher) {
    this.selectedSubjects = [];
    const unitEducationalId = teacher.teacher_unit_educational[0];
    this.parallelsSubscription = this.ts
      .getParallelsFromTeacherId(
        this.selectedTeacher.teacher_id,
        unitEducationalId,
        this.academicPeriodStorage[0].academic_year_name
      )
      .subscribe((parallelsId) => {
        const parallelId = parallelsId.map((p: Parallels) => p.parallel_id);
        parallelId.forEach((parallel) => {
          this.getSubjectsFromTeacher(parallel);
        });
      });
  }

  /* OBTIENE ASIGNATURAS DE DOCENTE */
  public getSubjectsFromTeacher(parallel) {
    this.selectedSubjects = [];
    const unitEducationalId = this.selectedTeacher.teacher_unit_educational;
    this.subjectSubscription = this.ts
      .getSubjectsFromParallelIid(
        this.selectedTeacher.teacher_id,
        unitEducationalId,
        parallel,
        this.academicPeriodStorage[0].academic_year_name
      )
      .subscribe((subjects) => {
        subjects.forEach((subject) => {
          this.selectedSubjects.push(subject);
        });
      });
  }

  ngOnDestroy() {
    if (this.parallelsSubscription) {
      this.parallelsSubscription.unsubscribe();
    }
    if (this.subjectSubscription) {
      this.subjectSubscription.unsubscribe();
    }
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  public seeTracking(subject: Subject) {
    this.showTracking = true;
    this.subjectSelect = subject;
  }

  public return() {
    this.showTracking = false;
  }
}
