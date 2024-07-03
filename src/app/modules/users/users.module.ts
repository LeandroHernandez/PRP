import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from '../../libraries/materialdesing/materialdesing.module';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ListUsersComponent } from './list-users/list-users.component';

const routes: Routes = [
  { path: "", component: ListUsersComponent }
];

@NgModule({
  declarations: [ListUsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers : [NgbActiveModal]
})
export class UsersModule { }
