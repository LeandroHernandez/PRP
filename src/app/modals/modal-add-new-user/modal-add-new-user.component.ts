import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from 'app/services/users/users.service';
import { RoleService } from 'app/services/role/role.service';
import { DocumentRole } from 'app/models/class/class.documentrole';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-new-user',
  templateUrl: './modal-add-new-user.component.html',
  styleUrls: ['./modal-add-new-user.component.css']
})
export class ModalAddNewUserComponent implements OnInit {
  form: FormGroup
  public roles: DocumentRole[] = [];
  user_type: string = ''; // Variable para almacenar el nombre del rol seleccionado

  constructor(
    private userService: UsersService,
    private roleService: RoleService,
   private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      identificacion:['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.getRoles();

  }
  getRoles() {
    this.roleService.get_all_role().subscribe(
      data => {
        this.roles = data.filter(role => role.role_state);
      },
      error => {
        console.error('Error fetching roles', error);
        this.roles = [];
      }
    );
  }
  save() {
    if (this.form.valid) {
      const userData = this.form.value;
      userData.user_type = this.user_type;
      userData.emailVerified = false
      this.userService.addUser(userData)
        .then(() => {
          this.form.reset();

          swal({
            title: 'Ok',
            text:'Datos guardado correctamente',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-fill btn-success',
            type: 'success',
          }).catch(swal.noop);
        })
        .catch((error) => {
          console.error('Error al registrar usuario:', error);
          // Muestra un mensaje de error
          alert('Error al registrar usuario: ' + error.message);
        });
    } else {
      // Marcar todos los campos como tocados para mostrar errores si el formulario no es válido
      this.form.markAllAsTouched();
    }
  }

  onRoleSelectionChange(event: any) {
    const selectedRoleId = event.value;
    const selectedRole = this.roles.find(role => role.role_uid === selectedRoleId);
    if (selectedRole) {
      this.user_type = selectedRole.role_name; // Actualizar user_type con el nombre del rol seleccionado
    }
  }

}
