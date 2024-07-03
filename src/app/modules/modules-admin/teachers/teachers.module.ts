import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTeachersComponent } from './list-teachers/list-teachers.component';


import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';


const routes: Routes = [
    { path: "", component: ListTeachersComponent }
  ];
  
  @NgModule({
    declarations: [ListTeachersComponent],
    imports: [
      RouterModule.forChild(routes),
      AngularFireModule.initializeApp(environment.firebase),
    ]
  })
  export class TeachersModule { }