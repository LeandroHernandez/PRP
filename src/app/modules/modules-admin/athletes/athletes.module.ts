import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAthletesComponent } from './list-athletes/list-athletes.component';


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
import { AddAthletesComponent } from './add-athletes/add-athletes.component';


const routes: Routes = [
    { path: "", component: ListAthletesComponent},
    { path: "add-athletes", component: AddAthletesComponent }
  ];
  
  @NgModule({
    declarations: [ListAthletesComponent, AddAthletesComponent],
    imports: [
      JwBootstrapSwitchNg2Module,
      CommonModule,
      RouterModule.forChild(routes),
      AngularFireModule.initializeApp(environment.firebase),
      FormsModule,
      NgbModule,
      ReactiveFormsModule,
      MaterialdesingModule,
      AngularFirestoreModule,
      AngularFireStorageModule,
      AngularFireAuthModule
    ]
  })
  export class AthletesModule { }