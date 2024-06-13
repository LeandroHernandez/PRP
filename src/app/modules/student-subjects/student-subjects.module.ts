import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsubjectsComponent } from './studentsubjects/studentsubjects.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from '../../libraries/materialdesing/materialdesing.module';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewPracticeComponent } from '../admin-practices/view-practice/view-practice.component';
import { AdminPracticesModule } from '../admin-practices/admin-practices.module';
import { DoStudentPracticeComponent } from './do-student-practice/do-student-practice.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { DoStudentEssayComponent } from './do-student-essay/do-student-essay.component';
import { DoStudentEvaluationComponent } from './do-student-evaluation/do-student-evaluation.component';
const routes: Routes = [
  { path: '', component: StudentsubjectsComponent}
];

@NgModule({
  declarations: [StudentsubjectsComponent, DoStudentPracticeComponent, DoStudentEssayComponent, DoStudentEvaluationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialdesingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        YouTubePlayerModule,
        AngularEditorModule,
        HttpClientModule
        // AdminPracticesModule
    ]
})
export class StudentSubjectsModule { }
