import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TeacherSubjectsComponent} from './teacher-subjects/teacher-subjects.component';
import {ListSubjectsTeacherComponent} from './list-subjects-teacher/list-subjects-teacher.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialdesingModule} from '../../libraries/materialdesing/materialdesing.module';
import {environment} from 'environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SafeDomPipe} from '../../pipes/safeDom/safe-dom.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgDropFilesDirective} from '../../directives/ng-drop-files.directive';
import { ViewStatisticsStudentComponent } from './view-statistics/view-statistics-student.component'
import {YouTubePlayerModule} from '@angular/youtube-player';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {ViewEssayComponent} from './view-essay/view-essay.component';
import {ActivitiesSimulatorModule} from '../activities-simulator/activities-simulator.module';

const routes: Routes = [
  {path: '', component: TeacherSubjectsComponent}
];

@NgModule({
  declarations: [TeacherSubjectsComponent, ListSubjectsTeacherComponent, SafeDomPipe, NgDropFilesDirective, ViewStatisticsStudentComponent, ViewEssayComponent],
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
    DragDropModule,
    YouTubePlayerModule,
    PdfViewerModule,
    HttpClientModule,
    AngularEditorModule,
    ActivitiesSimulatorModule
  ]
})
export class TeacherSubjectsModule {
}
