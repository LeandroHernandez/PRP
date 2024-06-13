import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListroleComponent } from './listrole/listrole.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from '../../libraries/materialdesing/materialdesing.module';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: "", component: ListroleComponent }
];

@NgModule({
  declarations: [ListroleComponent],
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
export class RoleModule { }
