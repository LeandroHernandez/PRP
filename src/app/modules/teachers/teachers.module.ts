import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {  AngularFireStorageModule } from '@angular/fire/storage'

import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'environments/environment';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireAuthModule } from '@angular/fire/auth';

/**Component */
import { TeachersComponent } from './teachers/teachers.component';
import { ImportTeachersComponent } from './import-teachers/import-teachers.component';

const routes: Routes = [
  { path: '', component: TeachersComponent }
];


@NgModule({
  declarations: [TeachersComponent, ImportTeachersComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ]
})
export class TeachersModule { }
