import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loginForm: FormGroup;

  constructor( private fb: FormBuilder) {
    this.create_login_form();
  }

  /* Validators */
  get email_not_valid() {
    return this.loginForm.get('email').invalid && this.loginForm.get('email').touched;
  }

  get pass_not_valid() {
    return this.loginForm.get('pass').invalid && this.loginForm.get('pass').touched;
  }
  /* !Validators */

  /* Nuevo formulario reactivo
  *  New Reactive Form
  * */
  create_login_form() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login() {
    console.log(this.loginForm.value);

    if (this.loginForm.invalid) {
      console.log('Error en la información');
      return;
        /*return Object.values(this.registerForm.controls).forEach(control => {
            control.markAsTouched();
        });*/
    }
  }

  ngOnInit(): void {
  }

}
