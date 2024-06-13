import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterService} from '../../../services/register/register.service';
import {Student} from '../../../models/student/student.model';
import swal from 'sweetalert2';
import {take} from 'rxjs/operators';
import {AuthService} from '../../../services/login/auth.service';
import {RepresentativeService} from "../../../services/representative/representative.service";
import {Representativedocum} from "../../../models/class/class.documentRepresentative";
import { AdminEducationalUnitService } from 'app/services/adminEducationalUnit/admin-educational-unit.service';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent implements OnInit, OnDestroy {

  existParent=false;

  private sub: any;
  studentForm: FormGroup;
  studentD: Student = new Student({});
  input_enabled = false;

  student_code: string;
  school_code: string;
  representativeForm: FormGroup;
  submitted = false;
  public advisor_name;
  public advisor_surname;
  public advisor_phone;
  public advisor_pass1;
  public advisor_pass2;
  public representative_emaill;
  public representative: Representativedocum;
  public exist;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminEducationalUnitService: AdminEducationalUnitService,
              private registerService: RegisterService,
              public auth: AuthService,
              private fb: FormBuilder,
              private representativeService: RepresentativeService) {
    /* URL para enviar los datos localhost:4200/register/CODIGO
    *  formato CODESTUDIANTE_CODCOLEGIO (UB010101_001)
    * */
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.get_student_by_id(params['id']);
      } else {
        this.input_enabled = false;
      }
    });
  }

  splitCode(code: string): void {
    this.student_code = code.substr(0, code.indexOf('_'));
    this.school_code = code.substr(code.indexOf('_') + 1, code.length);
  }

  /* Obtiene información del estudiante */
  async get_student_by_id(code: string) {
    this.splitCode(code);


    // tslint:disable-next-line: max-line-length
 /*
    this.adminEducationalUnitService.getPadre(this.unitEducationalId)
      .pipe(map((t: Teacher[]) => t.filter((teacher) => teacher.teacher_status === true))).subscribe(dataTeachers => {
        this.arrayTeachers = dataTeachers;
        this.initDataTableTeacher()
      })
*/

    swal({
      title: 'Espera',
      text: 'Actualizando información',
      allowEscapeKey: false,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
    await this.registerService.get_student_by_id(code)
        .subscribe((resp: Student) => {
          console.log(resp);
          this.exist = resp;
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
              this.submitted = true;
              this.input_enabled = true;
              this.studentD = new Student({
                ...resp
              });

             if(this.studentD.student_representant != null && this.studentD.student_representant != ''){
              console.log('Hay representante');
              this.existParent=true;

              const response = this.representativeService.getrepresentative(this.studentD.student_representant);
             
              response.subscribe(representative => {
                console.log(representative)
                this.advisor_name = representative.representative_name;
                this.advisor_surname = representative.representative_surname;
                this.advisor_phone = representative.representative_phone;
                this.advisor_pass1 = representative.representative_pass1;
                this.advisor_pass2 = representative.representative_pass2;
                this.representative_emaill = representative.representative_email;
                this.studentD.student_representant = representative.representative_id;
              });

             }else{
              console.log('No hay representante');
              this.existParent=false;
             }


              // this.representativeForm.value.representative_email = this.studentD.student_email;
              // this.representative_emaill = this.studentD.student_email;
              this.studentD.student_email = this.studentD.student_email;
            },
            error => {
              console.log(error);
            });
  }

  /* Revisa campos no válidos */
  checkForm(form: FormGroup) {

    if (form.invalid) {
      return Object.keys(form.controls).forEach((control) => {
        form.controls[control].markAsTouched();
      });
    }
  }

  /* Actualiza la información de representative y estudiante */
  async saveInfo()  {
    let userAux;
    let repAux;
    this.studentD.student_status = true;


    if (this.representativeForm.value.representative_email === this.studentForm.value.student_email) {
      swal({
        title: 'Error',
        text: 'Los correos de estudiante y representante no pueden ser iguales',
        type: 'error'
      });
      return;
    }
     
    const data = await this.auth.findUserEmail(this.representativeForm.value.representative_email).pipe(take(1)).toPromise();

  
    swal({
      title: 'Espere',
      text: 'Actualizando información',
      allowEscapeKey: false,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    });
    
  
  
    if (!this.exist) {

      const student_representant = new Date().getTime().toString();
      this.studentD.student_representant = student_representant;

      this.auth.SignUp(this.studentD.student_email, this.studentD.student_pass)
          .then((user) => {
            userAux = {
              ...user.user,
              password: this.studentD.student_pass,
              identification: this.studentD.student_identification,
              role: '1595275706678',
              user_type: 'estudiante'
            }

            this.auth.SetUserData(userAux).then(() => {

              this.registerService.update_student(this.studentD).then(() => {

                this.auth.SignUp(this.representativeForm.value.representative_email, this.representativeForm.value.representative_pass1)
                    .then((userR) => {
                      repAux = {
                        ...userR.user,
                        password: this.representativeForm.value.representative_pass1,
                        identification: '',
                        role: '1595275716690',
                        user_type: 'representante'
                      }

                      this.auth.SetUserData(repAux).then(() => {

                        this.registerService.update_representative(student_representant, this.representativeForm.value, this.studentD)
                            .then(() => {
                              
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
                      });
                    }).catch(e => {
                  this.auth.ManageErrors(e, this.representativeForm.value.representative_email);
                });
              });
            });
          })
          .catch(e => {
            this.auth.ManageErrors(e, this.studentD.student_email);
          });
    } else { 
      
      if(this.existParent){

        this.registerService.update_student(this.studentD);
        this.registerService.update_representative(this.studentD.student_representant, this.representativeForm.value, this.studentD)
            .then(() => {
              
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

      }else{
           console.log('No existe el representante');

          if(data.length>0){

            console.log('Correo ya existe');

            swal.hideLoading();
            swal({
              text: 'Error! ' + 'Usuario ya tiene una cuenta agregue al estudiante desde la cuenta con el ID.',
              type: 'error',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/login']);
              }
            })
         
          }else{

            const student_representant = new Date().getTime().toString();
            this.studentD.student_representant = student_representant;
      
            this.auth.SignUp(this.studentD.student_email, this.studentD.student_pass)
                .then((user) => {
                  userAux = {
                    ...user.user,
                    password: this.studentD.student_pass,
                    identification: this.studentD.student_identification,
                    role: '1595275706678',
                    user_type: 'estudiante'
                  }
      
                  this.auth.SetUserData(userAux).then(() => {
      
                    this.registerService.update_student(this.studentD).then(() => {
      
                      this.auth.SignUp(this.representativeForm.value.representative_email, this.representativeForm.value.representative_pass1)
                          .then((userR) => {
                            repAux = {
                              ...userR.user,
                              password: this.representativeForm.value.representative_pass1,
                              identification: '',
                              role: '1595275716690',
                              user_type: 'representante'
                            }
      
                            this.auth.SetUserData(repAux).then(() => {
      
                              this.registerService.update_representative(student_representant, this.representativeForm.value, this.studentD)
                                  .then(() => {
                                    
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
                            });
                          }).catch(e => {
                        this.auth.ManageErrors(e, this.representativeForm.value.representative_email);
                      });
                    });
                  });
                })
                .catch(e => {
                  this.auth.ManageErrors(e, this.studentD.student_email);
                });
          }         
      }

    }
    
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
