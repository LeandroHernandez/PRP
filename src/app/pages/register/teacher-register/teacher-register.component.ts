import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterService} from '../../../services/register/register.service';
import {Teacher} from '../../../models/teacher/teacher.model';
import swal from 'sweetalert2';
import {AuthService} from '../../../services/login/auth.service';

@Component({
  selector: 'app-teacher-register',
  templateUrl: './teacher-register.component.html',
  styleUrls: ['./teacher-register.component.css']
})
export class TeacherRegisterComponent implements OnInit, OnDestroy {

  private sub: any;
  teacherForm: FormGroup;
  teacherD: Teacher = new Teacher({});
  input_enabled: boolean;
  submitted = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public registerService: RegisterService,
              public auth: AuthService,
              private fb: FormBuilder) {

    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.get_teacher_by_id(params['id']);
      } else {
        this.input_enabled = false;
      }
    });
  }

  async get_teacher_by_id(teacher_id: string) {
    swal({
      title: 'Espera',
      text: 'Actualizando información',
      allowEscapeKey: false,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    await this.registerService.get_teacher_by_id(teacher_id)
        .subscribe((resp: Teacher) => {
              if (!resp) {
                swal({
                  title: 'Error',
                  text: 'No existe información asociada al id',
                  type: 'error',
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  onBeforeOpen: () => {
                    swal.hideLoading()
                  }
                })
                return;
              }
              swal({
                title: 'Ok!',
                text: 'Actualice la información registrada',
                type: 'success',
                allowEscapeKey: false,
                allowOutsideClick: false,
                onBeforeOpen: () => {
                  swal.hideLoading()
                }
              })
              this.input_enabled = true;
              this.submitted = true;
              this.teacherD = new Teacher({
                teacher_id: teacher_id,
                ...resp
              });
            },
            error => {
              console.log(error);
            });
  }

  /* Revisa campos no válidos */
  checkForm() {

    if (this.teacherForm.invalid) {
      return Object.keys(this.teacherForm.controls).forEach((control) => {
        this.teacherForm.controls[control].markAsTouched();
      });
    }

  }

  /* Actualiza información en Firestore */
  saveInfo() {

    swal({
      title: 'Espera',
      text: 'Actualizando información',
      allowEscapeKey: false,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    });

    this.auth.SignUp(this.teacherD.teacher_email, this.teacherD.teacher_pass)
        .then((user) => {
          const aux = {
            ...user.user,
            password: this.teacherD.teacher_pass,
            identification: this.teacherD.teacher_identification,
            role: '1595275695924',
            user_type: 'profesor'
          }
          this.auth.SetUserData(aux);
          this.registerService.update_teacher(this.teacherD.teacher_id, this.teacherD)
              .then(() => {
                swal.hideLoading();
                swal({
                  text: 'El registro se ha completado exitosamente! ' +
                      'Ya podrás ingresar a tu cuenta. Se ha enviado un correo para facilitarte el acceso',
                  type: 'success',
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  if (result.value) {
                    this.teacherForm.reset();
                    this.router.navigate(['/login']);
                  }
                })
              });
        }).catch(e => {
          this.auth.ManageErrors(e);
        });
  }

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      teacher_name: ['', [Validators.required, Validators.minLength(1)]],
      teacher_surname: ['', [Validators.required, Validators.minLength(1)]],
      teacher_identification: ['', [Validators.required]],
      teacher_phone: ['', [Validators.required, Validators.pattern(this.registerService.phone_regex), Validators.minLength(1)]],
      teacher_email: ['', [Validators.pattern(this.registerService.mail_regex), Validators.required]],
      teacher_email1: ['', [Validators.pattern(this.registerService.mail_regex), Validators.required]],
      teacher_pass: ['', [Validators.required]],
      teacher_pass1: ['', [Validators.required]],
      teacher_terms: ['', [Validators.required]]
    }, {
      validators: this.registerService.passwordsIguales('teacher_pass', 'teacher_pass1')
    });
  }

  /* Teacher Form Validators */
  get teacher_name() {
    return this.teacherForm.get('teacher_name');
  }

  get teacher_surname() {
    return this.teacherForm.get('teacher_surname');
  }

  get teacher_identification() {
    return this.teacherForm.get('teacher_identification');
  }

  get teacher_email() {
    return this.teacherForm.get('teacher_email');
  }

  get teacher_pass() {
    return this.teacherForm.get('teacher_pass');
  }

  get teacher_phone() {
    return this.teacherForm.get('teacher_phone');
  }

  get teacher_mail2_not_valid() {
    const mail1 = this.teacherForm.get('teacher_email').value;
    const mail2 = this.teacherForm.get('teacher_email1').value;
    return (mail1 !== mail2);
  }

  get teacher_pass2_not_valid() {
    const pass1 = this.teacherForm.get('teacher_pass').value;
    const pass2 = this.teacherForm.get('teacher_pass1').value;
    return (pass1 !== pass2);
  }

  /* !Teacher Form Validators */

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
