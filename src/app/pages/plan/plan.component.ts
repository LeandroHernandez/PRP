import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Student} from '../../models/student/student.model';
import {RegisterService} from '../../services/register/register.service';
import {MatListOption} from '@angular/material/list';
import swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/login/auth.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  public grades = [];
  public planes = [
    {plan_name: 'Mensual', plan_price: 19.99, active: false},
    {plan_name: 'Anual', plan_price: 199.99, active: false}
  ];
  selectedGrade = {};
  selectedPlan = {};
  isSelectedGrade = false;
  isSelectedPlan = false;
  studentForm: FormGroup;
  representativeForm: FormGroup;
  studentD: Student = new Student({});
  input_enabled = false;
  student_code: string;
  school_code: string;
  submitted = false;
  public representative_emaill;
  isLinear = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private registerService: RegisterService,
              public auth: AuthService,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    /* Se inicializan ambos formularios */
    this.representativeForm = this.fb.group({
      representative_name: ['', [Validators.required, Validators.minLength(1)]],
      representative_surname: ['', [Validators.required, Validators.minLength(1)]],
      representative_email: ['', [Validators.pattern(this.registerService.mail_regex), Validators.required]],
      representative_pass1: ['', [Validators.required]],
      representative_pass2: ['', [Validators.required]],
      representative_phone: ['', [Validators.required, Validators.pattern(this.registerService.phone_regex), Validators.minLength(1)]],
    }, {
      validators: this.registerService.passwordsIguales('representative_pass1', 'representative_pass2')
    });
    this.studentForm = this.fb.group({
      student_name: ['', [Validators.required, Validators.minLength(1)]],
      student_lastname: ['', [Validators.required, Validators.minLength(1)]],
      student_email: ['', [Validators.pattern(this.registerService.mail_regex), Validators.required]],
      student_pass: ['', [Validators.required]],
      student_pass1: ['', [Validators.required]],
      student_phone: ['', [Validators.required, Validators.pattern(this.registerService.phone_regex), Validators.minLength(5)]],
      student_date: ['', [Validators.required, this.registerService.invalidDate]],
      student_terms: ['', [Validators.required]]
    }, {
      validators: this.registerService.passwordsIguales('student_pass', 'student_pass1')
    });

    this.registerService.getGradeInfo().then( grades => {
      grades.forEach( grade => {
        this.grades.push(grade.data());
      })
    })
  }

  setSelectedGrade(options: MatListOption[] ) {
    options.map(o => {
      this.selectedGrade = o.value;
      this.isSelectedGrade = true;
    });
  }

  setSelectedPlan(plan: any) {
    this.planes.map(p => {
      p.active = false;
    });
    plan.active = true;
    this.selectedPlan = plan;
    this.isSelectedPlan = true;
  }

  /* Revisa campos no válidos */
  checkForm(form: FormGroup) {

    if (form.invalid) {
      return Object.keys(form.controls).forEach((control) => {
        form.controls[control].markAsTouched();
      });
    }
  }

  /* representative Validators */
  get representative_name() {
    return this.representativeForm.get('representative_name');
  }

  get representative_surname() {
    return this.representativeForm.get('representative_surname');
  }

  get representative_email() {
    return this.representativeForm.get('representative_email');
  }

  get representative_phone() {
    return this.representativeForm.get('representative_phone');
  }

  get representative_pass1() {
    return this.representativeForm.get('representative_pass1');
  }

  get representative_pass2_not_valid() {
    const pass1 = this.representativeForm.get('representative_pass1').value;
    const pass2 = this.representativeForm.get('representative_pass2').value;
    return (pass1 !== pass2);
  }

  /* !Validators*/

  /* Student Validators*/
  get student_name() {
    return this.studentForm.get('student_name');
  }

  get student_lastname() {
    return this.studentForm.get('student_lastname');
  }

  get student_email() {
    return this.studentForm.get('student_email');
  }

  get student_phone() {
    return this.studentForm.get('student_phone');
  }

  get student_birth() {
    return this.studentForm.get('student_date');
  }

  get student_pass() {
    return this.studentForm.get('student_pass');
  }

  get student_pass2_not_valid() {
    const pass1 = this.studentForm.get('student_pass').value;
    const pass2 = this.studentForm.get('student_pass1').value;
    return (pass1 !== pass2);
  }

  /* !Student Validators*/

  /* Actualiza la información de representative y estudiante */
  saveInfo() {

    if (this.representativeForm.value.representative_email === this.studentForm.value.student_email) {
      swal({
        title: 'Error',
        text: 'Los correos de estudiante y representante no pueden ser iguales',
        type: 'error'
      });
      return;
    }

    swal({
      title: 'Espere',
      text: 'Actualizando información',
      allowEscapeKey: false,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    let student_representant = new Date().getTime().toString();
    this.studentD.student_representant = student_representant;

    this.auth.SignUp(this.studentD.student_email, this.studentD.student_pass)
        .then((user) => {
          const aux = {
            ...user.user,
            password: this.studentD.student_pass,
            identification: this.studentD.student_identification,
            role: '1595275706678',
            user_type: 'estudiante'
          }
          this.studentD.student_grade_id = this.selectedGrade['grade_id'];
          this.auth.SetUserData(aux).then(() => {
            this.registerService.update_student(this.studentD).then(() => {
              this.auth.SignUp(this.representativeForm.value.representative_email, this.representativeForm.value.representative_pass1)
                  .then((userR) => {
                    console.log('paso 2');
                    const auxR = {
                      ...userR.user,
                      password: this.representativeForm.value.representative_pass1,
                      identification: '',
                      role: '1595275716690',
                      user_type: 'representante'
                    }
                    console.log(student_representant);
                    console.log(this.representativeForm.value);
                    console.log(this.studentD);
                    this.registerService.update_representative(student_representant, this.representativeForm.value, this.studentD).then(() => {
                      this.auth.SetUserData(auxR)
                      console.log('paso 3');
                      swal.hideLoading();
                      swal({
                        text: 'El registro se ha completado exitosamente! ' +
                            'Ya podrás ingresar a tu cuenta.',
                        type: 'success',
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                      }).then((result) => {
                        if (result.value) {
                          this.router.navigate(['/login']);
                        }
                      })
                    });

                  })
                  .catch(e => {
                    this.auth.ManageErrors(e, this.representativeForm.value.representative_email);
                  });
            })
          });
        }).catch(e => {
      this.auth.ManageErrors(e, this.studentD.student_email);
    });
  }

}
