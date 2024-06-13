import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Component */
import { SubLevelsComponent } from './sublevels/sublevels.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'environments/environment';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: SubLevelsComponent }
];

@NgModule({
  declarations: [SubLevelsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ]
})
export class SubLevelsModule { }
