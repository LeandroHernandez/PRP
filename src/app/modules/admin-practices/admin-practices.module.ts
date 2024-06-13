import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'environments/environment';
import { Routes, RouterModule } from '@angular/router';
/** COMPONENT  */
import { CreatePracticeComponent } from './create-practice/create-practice.component';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { ViewPracticeComponent } from './view-practice/view-practice.component';
import { CreateEvaluationComponent } from './create-evaluation/create-evaluation.component';
import { CreateEssayComponent } from './create-essay/create-essay.component';
import { ViewEssayComponent } from './view-essay/view-essay.component';
import { ViewEvaluationComponent } from './view-evaluation/view-evaluation.component';


const routes: Routes = [
   { path: '', component: PracticeListComponent },
   ];


@NgModule({
  declarations: [CreatePracticeComponent, PracticeListComponent, ViewPracticeComponent, CreateEvaluationComponent, CreateEssayComponent, ViewEssayComponent, ViewEvaluationComponent],
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
export class AdminPracticesModule { }
