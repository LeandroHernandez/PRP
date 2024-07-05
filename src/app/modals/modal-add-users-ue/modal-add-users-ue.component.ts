import { User } from 'app/models/interfaces/user';
import { UsersService } from 'app/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-users-ue',
  templateUrl: './modal-add-users-ue.component.html',
  styleUrls: ['./modal-add-users-ue.component.css']
})
export class ModalAddUsersUeComponent implements OnInit {
  
  searchControl = new FormControl();
  filteredUsers$: Observable<User[]>;
  public data_user_assing_to_UE = new Array<User>();


  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      debounceTime(150), 
      distinctUntilChanged(),
      switchMap(searchValue => this.usersService.filterUsers(searchValue))
    );
  }

  assign_user_to_UE(user: User) {
    if (this.valid_repeat_user(user) === true) {
      this.data_user_assing_to_UE.push(user);
      swal('Aviso', 'Se ha asignado correctamente.', 'success');
    } else {
      swal('Aviso', 'Ya existe el usuario.', 'warning');
    }
  }
  valid_repeat_user(user: User) {
    for (let i = 0; i < this.data_user_assing_to_UE.length; i++) {
      if (this.data_user_assing_to_UE[i].identification === user.identification) {
        return false;
      }
    }
    return true;
  }

}
