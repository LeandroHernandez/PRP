import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'environments/environment';

/** Component */
import { AdminUEComponent } from './admin-ue/admin-ue.component';
import { AdminParallelOfEduUnitComponent } from './admin-parallel-of-edu-unit/admin-parallel-of-edu-unit.component';
import { ShowPlanificationComponent } from './show-planification/show-planification.component'
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {ActivitiesSimulatorModule} from '../activities-simulator/activities-simulator.module';


const routes: Routes = [
   { path: '', component: AdminUEComponent},
   { path: '/parallelFromUnitEduc', component: AdminParallelOfEduUnitComponent }
 ];
@NgModule({
  declarations: [ AdminUEComponent, AdminParallelOfEduUnitComponent, ShowPlanificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    DragDropModule,
    PdfViewerModule,
    YouTubePlayerModule,
    ActivitiesSimulatorModule,
  ]
})
export class AdminEducationalUnitModule { }
