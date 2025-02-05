import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/login/auth.service";
import swal from "sweetalert2";
import { take } from "rxjs/operators";
import { SendEmailService } from "../../services/sendEmail/send-email.service";
import { User } from "../../models/interfaces/user";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerClicked = false;
  user: User;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public auth: AuthService,
    public emailService: SendEmailService
  ) {}

  login() {
    if (this.loginForm.invalid) {
      return Object.keys(this.loginForm.controls).forEach((control) => {
        this.loginForm.controls[control].markAsTouched();
      });
    }
    this.auth.SignIn(
      this.loginForm.value.login_email,
      this.loginForm.value.login_pass
    );
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login_email: [
        "",
        [
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
          Validators.required,
        ],
      ],
      login_pass: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  async showForgotPassModal() {
    const { value: email } = await swal({
      type: "info",
      text: "Ingrese el correo vinculado a tu cuenta",
      input: "email",
      inputPlaceholder: "correo",
    });

    if (email) {
      const data = await this.auth
        .findUserEmail(email)
        .pipe(take(1))
        .toPromise();
      if (data.length > 0) {
        this.user = data[0] as User;
        swal({
          title: "Ok!",
          type: "info",
          text:
            "Se enviará un correo a " +
            this.hideMail(this.user.email) +
            ". ¿Desea recibir la contraseña?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.value) {
            this.emailService.sendEmailForgotPassword(this.user);
            swal({
              title: "Ok!",
              type: "success",
              text: "Correo enviado, revise su bandeja de entrada",
            });
          } else {
            swal({
              title: "Operación cancelada",
              type: "error",
              text: "Por favor comunicarse con la Unidad Educativa",
            });
          }
        });
      } else {
        swal({
          title: "Error",
          type: "error",
          text: "No existe una cuenta vinculada a este correo. ¿Desea buscar por cédula?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Buscar",
        }).then((result) => {
          if (result.value) {
            this.showForgotPassModalCI();
          }
        });
      }
    }
  }

  async showForgotPassModalCI() {
    const { value: identification } = await swal({
      type: "info",
      text: "Ingrese la cédula vinculada al correo",
      input: "text",
      inputPlaceholder: "cédula",
    });

    if (identification) {
      const data = await this.auth
        .findUserIdentification(identification)
        .pipe(take(1))
        .toPromise();
      if (data.length > 0) {
        this.user = data[0] as User;
        swal({
          title: "Ok!",
          type: "info",
          text:
            "Se enviará un correo a " +
            this.hideMail(this.user.email) +
            ". ¿Desea recibir la contraseña?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.value) {
            this.emailService.sendEmailForgotPassword(this.user);
            swal({
              title: "Ok!",
              type: "success",
              text: "Correo enviado, revise su bandeja de entrada",
            });
          } else {
            swal({
              title: "Operación cancelada",
              type: "error",
              text: "Por favor comunicarse con la Unidad Educativa",
            });
          }
        });
      } else {
        swal({
          title: "Error",
          type: "error",
          text: "No existe una cuenta vinculada a este correo. Por favor comunicarse con la Unidad Educativa",
        });
      }
    }
  }

  /* Validators */
  get login_email() {
    return this.loginForm.get("login_email");
  }

  get login_pass() {
    return this.loginForm.get("login_pass");
  }

  /* !Validators */

  hideMail(email: string) {
    let auxEmail = email.split("@");
    const off = auxEmail[0].slice(2, auxEmail[0].length - 2).toString();
    let auxOff = "";
    for (let i = 0; i < off.length; i++) {
      auxOff += "*";
    }
    const final =
      auxEmail[0].slice(0, 2) +
      auxOff +
      auxEmail[0].slice(auxEmail[0].length - 2, auxEmail[0].length) +
      "@" +
      auxEmail[1];
    return final;
  }
}
