import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/login/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

declare var $;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public infoUser: any;
  passForm: FormGroup;

  constructor(public auth: AuthService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.passForm = this.fb.group({
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
    }, {
      validators: this.passwordsIguales('pass1', 'pass2')
    });
  }

  get pass2NoValido() {
    const pass1 = this.passForm.get('pass1').value;
    const pass2 = this.passForm.get('pass2').value;
    return ( pass1 === pass2) ? false: true;
  }

  passwordsIguales(pass1: string, pass2: string) {
    return ( formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1];
      const pass2Control = formGroup.controls[pass2];
      if ( pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({noEsIgual: true});
      }
    }
  }

  showModal() {
    $('#modalChange').modal('show');
  }

  hashPassword(password: string) {
    return '*'.repeat(password.length)
  }

  get pass1() {
    return this.passForm.get('pass1');
  }

  get pass2() {
    return this.passForm.get('pass2');
  }

  changePass() {
    console.log('INICIO DE METODO.')
    if (!this.passForm.invalid) {
      console.log('INICIO DE ACTUALIZACION DE DATOS..')
      this.auth.changePass(this.pass1.value);
    } else {
      return Object.keys(this.passForm.controls)
          .forEach((control) => {
            this.passForm.controls[control].markAsTouched();
          });
    }

  }

}
