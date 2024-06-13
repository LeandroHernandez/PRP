import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeducationalunitComponent } from './listeducationalunit/listeducationalunit.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MaterialdesingModule } from '../../libraries/materialdesing/materialdesing.module';

const routes: Routes = [
  { path: "", component: ListeducationalunitComponent }
];

@NgModule({
  declarations: [
    ListeducationalunitComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ]
})
export class EducationalunitModule { }
