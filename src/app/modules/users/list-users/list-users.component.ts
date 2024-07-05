import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddNewUEComponent } from 'app/modals/modal-add-new-ue/modal-add-new-ue.component';
import { ModalAddNewUserComponent } from 'app/modals/modal-add-new-user/modal-add-new-user.component';
import { DocumentRole } from 'app/models/class/class.documentrole';
import { User } from 'app/models/interfaces/user';
import { ShareDataService } from 'app/services/ShareData/share-data.service';
import { RoleService } from 'app/services/role/role.service';
import { UsersService } from 'app/services/users/users.service';
import swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  users: User[] = [];
  loading = true;
  error: string | null = null;
  public roles: DocumentRole[] = [];

  constructor(
    private userService: UsersService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private shareDataService: ShareDataService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
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
  loadUsers() {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data;
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );
  }

  editUser(user: User) {
    console.log('Editar usuario:', user);
  }

  deleteUser2(user: User) {
    console.log('Eliminar usuario:', user);
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${user.email}?`)) {
      this.userService.deleteUser(user.uid).subscribe(
        () => {
          console.log('Usuario eliminado con éxito');
          this.users = this.users.filter(u => u.uid !== user.uid);
        },
        error => {
          console.error('Error al eliminar usuario:', error);
          this.error = 'No se pudo eliminar el usuario. Por favor, intenta de nuevo.';
        }
      );
    }
  }




  question_user(user: User) {
    const mensaje = user.status_u ? 'inhabilitar' : 'habilitar';
    swal({
      title: 'Aviso',
      text: `¿Estás seguro que deseas ${mensaje} el usuario: ${user.email}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, ' + mensaje,
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.toggleUserStatus(user);
      }
    })
  }


  question_add_role(user: User, role: DocumentRole) {

    swal({
      title: 'Aviso',
      text: `¿Estás seguro que deseas asignar el rol ${role.role_name} a ${user.email}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-fill btn-success btn-mr-5',
      cancelButtonClass: 'btn btn-fill btn-danger',
      confirmButtonText: 'Sí, asignar',
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.assignRoleToUser(user, role);
      }
    })
  }
  
  toggleUserStatus(user: User) {
    const newStatus = !user.status_u;
    this.userService.updateUserStatus(user.uid, newStatus).subscribe(
      () => {
        console.log(`Estado del usuario actualizado a ${newStatus ? 'Habilitado' : 'Inhabilitado'}`);
        user.status_u = newStatus;
      },
      error => {
        console.error('Error al actualizar el estado del usuario:', error);
        this.error = 'No se pudo actualizar el estado del usuario. Por favor, intenta de nuevo.';
      }
    );
  }
  assignRoleToUser(user: User, role: DocumentRole) {
    this.userService.assignRoleToUser(user.uid, role).subscribe(
      () => {
        swal('Aviso', `Rol ${role.role_name} asignado a ${user.email}`, 'success');
        console.log(`Asignar rol ${role.role_name} a usuario ${user.email}`);
      },
      error => {
        console.error('Error al asignar rol al usuario:', error);
        this.error = 'No se pudo asignar el rol al usuario. Por favor, intenta de nuevo.';
      }
    );
  }
  openModalAddUser(): void {
    const dialogRef = this.dialog.open(ModalAddNewUserComponent, {
        width: '',
        disableClose: true // Esto deshabilita el cierre automático
    });

    dialogRef.afterClosed().subscribe(result => {
        this.shareDataService.setFile(null);
    });
}

}
