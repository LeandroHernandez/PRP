import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { ListChampionshipsComponent } from './list-championships/list-championships.component';

const routes: Routes = [
  { path: "", component: ListChampionshipsComponent }
];

@NgModule({
  declarations: [ListChampionshipsComponent],
  imports: [
    JwBootstrapSwitchNg2Module,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ]
})
export class ChampionshipsModule { }
