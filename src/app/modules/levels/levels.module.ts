import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

/** Components */
import { LevelsComponent } from '../levels/levels/levels.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'environments/environment';
import { LevelsRoutes } from './levels.routing';


// const routes: Routes = [
//   { path: '', component: LevelsComponent }
// ];

@NgModule({
  declarations: [ LevelsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(LevelsRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
})
export class LevelsModule { }
