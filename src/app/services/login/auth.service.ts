import { Injectable, NgZone, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { UnitEducational } from "../../models/class/class.documentUnitEducational";
import { UnitEdicationalService } from "../unit-edicational/unit-edicational.service";
import swal from "sweetalert2";
import { User } from "../../models/interfaces/user";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

declare var $;

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  public arrayDataUser: any;
  private userData: any; // Save logged in user data
  private userDataChangePassword: any; // Save logged in user data
  private studentSubscription: Subscription;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    private ngZone: NgZone,
    public unitEducationalService: UnitEdicationalService
  ) {
    this.userDataChangePassword = this.afAuth.user;
  }
  PeriodActive() {
    this.GetPeriodActive().subscribe((response) => {
      const obj = response;
      console.log({
        academic_period: response,
      });
      localStorage.setItem("academic_period", JSON.stringify(obj));
    });
  }

  ngOnDestroy(): void {
    if (this.studentSubscription) {
      this.studentSubscription.unsubscribe();
    }
  }

  /**
   *  Sign in with email/password
   * @param signin_email
   * @param signin_pass
   */
  SignIn(signin_email, signin_pass) {
    this.PeriodActive();
    return this.afAuth
      .signInWithEmailAndPassword(signin_email, signin_pass)
      .then((result) => {
        this.GetUserData(result.user.email).then(async (userFB) => {
          console.log(userFB.data());
          if (userFB.data().status_u === false) {
            swal({
              title: "Atención",
              text: "SU USUARIO A SIDO INHABILITADO, POR FAVOR COMUNICARSE CON SOPORTE ",
              type: "error",
            });
            this.SignOut().then(() => "");
            return;
          }
          this.userData = userFB.data();
          localStorage.setItem("user", JSON.stringify(this.userData));
          /// *** consultamos el tipo de usuario para determinar si es ue - doc - est - rep ***
          if (this.userData.user_type === "unidad_educativa") {
            this.arrayDataUser = await this.GetUserTypeData(this.userData)
              .pipe(take(1))
              .toPromise();
            localStorage.setItem(
              "infoUser",
              JSON.stringify(this.arrayDataUser[0])
            );
            this.ngZone.run(() => {
              this.router.navigate(["admineducationalunit"]);
            });
          } else if (this.userData.user_type === "profesor") {
            this.arrayDataUser = await this.GetUserTypeData(this.userData)
              .pipe(take(1))
              .toPromise();
            localStorage.setItem(
              "infoUser",
              JSON.stringify(this.arrayDataUser[0])
            );
            this.ngZone.run(() => {
              this.router.navigate(["teachersubjects"]);
            });
          } else if (this.userData.user_type === "estudiante") {
            this.arrayDataUser = await this.GetUserTypeData(this.userData)
              .pipe(take(1))
              .toPromise();
            localStorage.setItem(
              "infoUser",
              JSON.stringify(this.arrayDataUser[0])
            );
            this.ngZone.run(() => {
              this.router.navigate(["studentsubjects"]);
            });
          } else if (this.userData.user_type === "representante") {
            this.arrayDataUser = await this.GetUserTypeData(this.userData)
              .pipe(take(1))
              .toPromise();
            localStorage.setItem(
              "infoUser",
              JSON.stringify(this.arrayDataUser[0])
            );
            this.ngZone.run(() => {
              this.router.navigate(["representativehome"]);
            });
          } else if (this.userData.user_type === "admin") {
            this.router.navigate(["athletes"]);
          } else {
            this.ngZone.run(() => {
              this.router.navigate(["listuniteducational"]);
            });
          }
        });
      })
      .catch((error) => {
        this.ManageErrors(error);
      });
  }

  /**
   *  Sign up with email/password
   * @param login_email
   * @param login_pass
   * @param role
   * @param user_type
   */
  async SignUp(login_email, login_pass) {
    return this.afAuth.createUserWithEmailAndPassword(login_email, login_pass);
  }

  // async registerUserAuth(unitEducational: UnitEducational, isEdit: boolean) {
  //   console.log("entre al auythh")
  //   // const email = unitEducational.unit_educational_email;
  //   // const password = unitEducational.unit_educational_password;
  //   const email = "roland@gmail.com";
  //   const password = 'rolando123456';
  //   try {
  //     await this.afAuth.createUserWithEmailAndPassword(email, password)
  //         .then((user) => {
  //           this.unitEducationalService.saveUnitEducational(unitEducational, isEdit);
  //           this.saveUserData(user.user, '1595275681084', 'unidad_educativa', unitEducational);
  //         }).catch((e) => {
  //           if (e.code === 'auth/user-not-found') {
  //         swal('Atención', 'No hay registro de usuario correspondiente a este email. El usuario puede haber sido eliminado', 'error');
  //       }
  //           if (e.code === 'auth/email-already-in-use') {
  //         swal('Atención', 'El email ingresado ya está en uso', 'error');
  //       }
  //           if (e.code === 'auth/wrong-password') {
  //         swal('Atención', 'La contraseña no es válida o el usuario no tiene una contraseña', 'error');
  //       }
  //           if (e.code === 'auth/too-many-requests') {
  //         swal('Atención', 'Demasiados intentos de inicio de sesión fallidos.', 'error');
  //       }
  //           if (e.code === 'auth/invalid-email') {
  //         swal('Atención', 'El email no tiene un formato válido.', 'error');
  //       }
  //         });
  //   } catch (e) {
  //     console.log('error al guardar register User');
  //     console.log(e);
  //   }
  // }

  /** Agrega un usuario a "Firestore" */
  private saveUserData(user, role, type, unitEducational: UnitEducational) {
    const userRef = this.afs.collection("users").doc(user.email);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      nombre: null,
      apellido: null,
      password: unitEducational.unit_educational_password,
      identification: unitEducational.unit_educational_id,
      displayName: unitEducational.unit_educational_name,
      emailVerified: user.emailVerified,
      role: role,
      user_type: type,
      status_u: true,
    };
    return userRef
      .set(userData)
      .then(function () {
        //console.log('User correct Creation!!!');
      })
      .catch((reason) => {
        //console.log('Error Creating User: ', reason);
      });
  }

  /** Crea un usuario en el módulo de "Authentication" y guarda el mismo en "Firestore". */
  async registerUserAuth(unitEducational: UnitEducational, isEdit: boolean) {
    const email = unitEducational.unit_educational_email;
    const password = unitEducational.unit_educational_password;

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      //console.log("Usuario creado exitosamente", userCredential.user);

      // Guardar datos en Firestore
      await this.saveUserData(
        userCredential.user,
        "0000000000000",
        "NA",
        unitEducational
      );

      //console.log("Datos de usuario guardados exitosamente");
      //swal('Éxito', 'Usuario registrado correctamente', 'success');
      return userCredential.user;
    } catch (error) {
      //console.error('Error al registrar usuario:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  /** Validar errores al crear un usuario */
  private handleAuthError(error: any) {
    let message = "Ocurrió un error al registrar el usuario: " + error.message;

    switch (error.code) {
      case "auth/email-already-in-use":
        message =
          "El email ingresado ya está en uso. Por favor, use otro email.";
        break;
      case "auth/invalid-email":
        message = "El email no tiene un formato válido";
        break;
      case "auth/weak-password":
        message =
          "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
        break;
      case "auth/operation-not-allowed":
        message = "La creación de cuentas está deshabilitada temporalmente.";
        break;
    }
    swal({
      title: "Atención",
      text: message,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ok",
      type: "error",
    });
  }

  // Returns true when user is looged in and email is verified
  /*get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false);
  }*/

  /**
   *  Set user data in Firestore
   * @param user
   */

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.email}`
    );
    const userData: User = {
      identification: user.identification || "000000000",
      nombre: user.nombre,
      apellido: user.appellido,
      password: user.password,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      role: user.role,
      user_type: user.user_type,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  /**
   *  Get user info from Firestore
   * @param email
   */
  GetUserData(email) {
    return this.afs.collection("users").doc(email).get().toPromise();
  }

  /**Academic Periodic Active*/
  GetPeriodActive() {
    return (
      this.afs
        // .collection("academic_year", (ref) => ref.where("active", "==", true))
        .collection("academic_year", (ref) =>
          ref.where("year_start", "==", "2024")
        )
        .valueChanges()
    );
  }

  GetUserTypeData(user) {
    if (user.user_type === "unidad_educativa") {
      return this.afs
        .collection("cuenca", (ref) =>
          ref.where("unit_educational_email", "==", user.email)
        )
        .valueChanges();
    } else if (user.user_type === "profesor") {
      return this.afs
        .collection("teacher", (ref) =>
          ref.where("teacher_email", "==", user.email)
        )
        .valueChanges();
    } else if (user.user_type === "estudiante") {
      return this.afs
        .collection("student", (ref) =>
          ref.where("student_email", "==", user.email)
        )
        .valueChanges();
    } else if (user.user_type === "representante") {
      return this.afs
        .collection("representative_student", (ref) =>
          ref.where("representative_email", "==", user.email)
        )
        .valueChanges();
    } else {
      return;
    }
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.clear();
      localStorage.removeItem("user");
      this.router.navigate(["login"]);
    });
  }

  /**
   *  Manejo de errores de firebase
   * @param e
   */
  ManageErrors(e: any, mail?: string) {
    if (e.code === "auth/user-not-found") {
      swal({
        title: "Atención",
        text: "No hay registro de usuario correspondiente a este email. El usuario puede haber sido eliminado",
        type: "error",
      });
    }

    if (e.code === "auth/email-already-in-use") {
      swal({
        title: "Atención",
        text: "El email ya esta en uso",
        type: "error",
      });
    }

    if (e.code === "auth/email-already-in-use" && mail) {
      swal({
        title: "Atención",
        text: `El correo ${mail} ya esta en uso`,
        type: "error",
      });
    }

    if (e.code === "auth/wrong-password") {
      swal({
        title: "Atención",
        text: "La contraseña no es válida o el usuario no tiene una contraseña",
        type: "error",
      });
    }

    if (e.code === "auth/too-many-requests") {
      swal({
        title: "Atención",
        text: "Demasiados intentos de inicio de sesión fallidos.",
        type: "error",
      });
    }
  }

  /* Recuperar contraseña */
  public findUserEmail(email) {
    return this.afs
      .collection("users", (ref) => ref.where("email", "==", email))
      .valueChanges();
  }

  public findUserIdentification(id) {
    return this.afs
      .collection("users", (ref) => ref.where("identification", "==", id))
      .valueChanges();
  }

  public changePass(pass) {
    this.userDataChangePassword.subscribe((data) => {
      data
        .updatePassword(pass)
        .then(() => {
          swal({
            title: "Atención",
            text: "SE ACTUALIZO SU CONTRASENA CORRECTAMENTE !!!!",
            type: "success",
          }).then(() => $("#modalChange").modal("hide"));
          return;
        })
        .catch((e) => {
          console.log("ERROR EN CHANGE PASS");
          console.log(e);
        })
        .finally(() => {
          this.updateStudentPassword(data.email, pass);
          console.log("TERMINA PROCESO DE ACTUALIZACION");
          return;
        });
      return;
    });
  }

  private updateStudentPassword(email: string, pass: string) {
    this.afs
      .collection("student", (ref) => ref.where("student_email", "==", email))
      .get()
      .toPromise()
      .then((data) => {
        if (!data.empty) {
          data.forEach((userData) => {
            const userDataToUpdate = this.afs
              .collection("student")
              .doc(userData.data().student_id);
            userDataToUpdate
              .update({
                student_pass: pass,
              })
              .then(function () {
                console.log("User correct update!!!");
              })
              .catch((reason) => {
                console.log("Error update User: ", reason);
              });
          });
        } else {
          console.log("USUARIO NO ENCONTRADO..!!!!");
        }
      });
  }
}
