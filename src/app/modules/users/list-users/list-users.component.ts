import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/interfaces/user';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();

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

}
