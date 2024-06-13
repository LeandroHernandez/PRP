import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportlearninglevelComponent } from './reportlearninglevel/reportlearninglevel.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialdesingModule} from '../../libraries/materialdesing/materialdesing.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';

const routes: Routes = [
  { path: '', component: ReportlearninglevelComponent }
];

@NgModule({
  declarations: [ReportlearninglevelComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ]
})
export class ReportlearninglevelModule { }
