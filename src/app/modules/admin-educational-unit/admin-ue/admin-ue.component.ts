import { Component, OnInit, OnDestroy } from '@angular/core';

/** Services */
import { AdminEducationalUnitService } from 'app/services/adminEducationalUnit/admin-educational-unit.service';
import { StudentService } from 'app/services/student/student.service'

/**Models */
import { SchoolGrade } from 'app/models/class/class.documentschoolGrade';
import { Parallels } from 'app/models/class/classdocument-parallels';
import { Student } from 'app/models/student/student.model';
import { map, take } from 'rxjs/operators';
import { UnitEducational } from 'app/models/class/class.documentUnitEducational';
import { Subscription } from 'rxjs';
import {PeriodAcademic} from '../../../models/class/period-academic';
import {logger} from 'codelyzer/util/logger';
import swal from 'sweetalert2';
import {Studentdocum} from '../../../models/class/class.documentstudent';
import {AuthService} from '../../../services/login/auth.service';
declare var $: any;

@Component({
  selector: 'app-admin-ue',
  templateUrl: './admin-ue.component.html',
  styleUrls: ['./admin-ue.component.css']
})
export class AdminUEComponent implements OnInit, OnDestroy {

  public arrayGrades: Array<SchoolGrade>;
  public arrayPeriodic: Array<PeriodAcademic>;
  public arrayParallels: Array<Parallels>;
  public arrayParallelsActive: Array<Parallels> = [];
  public arrayStudent: Array<Student> = []
  public grade_id: string;
  public periodic_id = '0';
  public parallel_id: string;
  public isAdminParallel = false;
  public arrayGradesP;
  public uid: string;
  public infoUser: UnitEducational;
  private datos: Array<Student> = [];
  /** subscriptions */
  private studentSusbcription: Subscription;
  private gradesSubscription: Subscription;
  private periodicSubscription: Subscription;
  private parallelsSubscription: Subscription;
  private studentsOfGgradeSubscription: Subscription;
  private academicPeriodStorage;
  
  constructor(private adminEducationalUnitService: AdminEducationalUnitService,
    private studentService: StudentService, public authService: AuthService) { }


  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.academicPeriodStorage = JSON.parse(localStorage.getItem('academic_period'));
    this.arrayGradesP = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    this.getGradesByEducationalUnit();
    this.getAcademicPeriodic();
  }

  ngOnDestroy(): void {
    if (this.studentSusbcription) {
      this.studentSusbcription.unsubscribe();
    }
    if (this.gradesSubscription) {
      this.gradesSubscription.unsubscribe();
    }
    if (this.parallelsSubscription) {
      this.parallelsSubscription.unsubscribe();
    }

  }
  public   getGradesByEducationalUnit() {
     this.gradesSubscription = this.adminEducationalUnitService.getGradesFromUnitEducational(this.infoUser.unit_educational_id, this.academicPeriodStorage[0].academic_year_name)
     .subscribe(dataGrades => {
       // console.log(dataGrades);
       this.arrayGrades  = dataGrades
     })
  }

  public getAcademicPeriodic() {
    this.periodicSubscription = this.adminEducationalUnitService.getAcademicPeriodic()
        .subscribe(response => {
          this.arrayPeriodic = response as Array<PeriodAcademic>;
        });
  }

  public selectGrade(grade) {
    this.getParallelsContainingStudents(grade)
    this.grade_id = grade;
    this.parallelsSubscription = this.adminEducationalUnitService.getParallelsFromUnitEducational(grade, this.infoUser.unit_educational_id, this.academicPeriodStorage[0].academic_year_name)
    .pipe(map((p: Parallels[]) => p.filter(parallel => parallel.grade_id === grade)))
      .subscribe(data => {
        // console.log(data);
        this.arrayParallels = data});
  }

  public getParallelsContainingStudents(grade) {
    this.arrayParallelsActive = []
    this.studentSusbcription =  this.adminEducationalUnitService.getParallelsFromStudent(this.infoUser.unit_educational_id)
    .pipe(map((student: Student[]) => 
    student.filter(s => s.student_grade_id === grade && s.student_parallel_id !== '')))
    .subscribe(dataStudent => {
      this.arrayStudent = dataStudent;
      this.arrayStudent.forEach(student => {
        if (student.student_parallel_id) {
        this.parallelsSubscription = this.adminEducationalUnitService.getParallelByParallelId(student.student_parallel_id , this.infoUser.unit_educational_id, this.academicPeriodStorage[0].academic_year_name)
          .subscribe(dataP => {
            if (this.arrayParallelsActive.find(data => data.parallel_id === student.student_parallel_id)) {
              return;
            } else {
              if ([dataP] && [dataP].length > 0) {
                this.arrayParallelsActive.push(dataP)
              }
            }
          })
        }
      })
    })
  }

  public selectParallel(parallel) {
    this.isAdminParallel = true;
    this.parallel_id = parallel;
    this.grade_id = this.grade_id
  }

  public OnChangeGradeAdmin(e, isSelectList: boolean) {
    if (isSelectList) {
      this.grade_id = e.target.value;
    } else {
      this.grade_id = e;
    }
    this.selectGrade(this.grade_id)
  }

  public OnChangePeriodicAdmin(e, isSelectList: boolean) {
    if (isSelectList) {
      this.periodic_id = e.target.value;
    } else {
      this.periodic_id = e;
    }
    // this.selectGrade(this.grade_id)
  }

  public async adminParalelo(parallel_id: string) {
    this.isAdminParallel = true;
    this.parallel_id = parallel_id;
    this.grade_id = this.grade_id;
    $('#ModalAdminParallel').modal('hide');
  }

  public adminPeriodic(periodo: string) {
    console.log(periodo)
    swal({
      title: 'Aviso',
      text: '¿Desea Generar el nuevo Periodo Lectivo?',
      type: 'info',
      showCancelButton: true,
      cancelButtonColor: 'red'
    }).then(result => {
      if (result.value) {
        this.adminEducationalUnitService.getStudents().subscribe(resultado => {
          this.datos = resultado as Array<Student>;
          for (const i of this.datos) {
            this.adminEducationalUnitService.updateStudents(i.student_id);
            break;
          }
        this.adminEducationalUnitService.getAcademicPeriodicActive().subscribe( response => {
          const obj = response as Array<PeriodAcademic>;
          const id = obj[0].academic_year_id
          this.adminEducationalUnitService.updatePeriodActive(id);
          this.adminEducationalUnitService.updatePeriod(periodo, true);
          swal('Correcto', 'Periodo Académico Generado', 'success');
          this.authService.SignOut();
        })
        })
      }
    });
    $('#ModalAdminAcademic').modal('hide');
  }

  public return() {
    this.isAdminParallel = false;
  }
}
