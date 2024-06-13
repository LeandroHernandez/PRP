import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ParallelsComponent} from '../parallels/parallels/parallels.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialdesingModule} from '../../libraries/materialdesing/materialdesing.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { ReportEvaluationComponent } from './report-evaluation/report-evaluation.component';

const routes: Routes = [
  { path: '', component: ReportEvaluationComponent }
];

@NgModule({
  declarations: [ReportEvaluationComponent],
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
export class ReportModule { }
