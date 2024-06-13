import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage'

import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'environments/environment';
import { MaterialdesingModule } from 'app/libraries/materialdesing/materialdesing.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UploadResourcesComponent } from './upload-resources/upload-resources.component';
import { ImportFilesComponent } from './import-files/import-files.component';

const routes: Routes = [
  { path: '', component: UploadResourcesComponent }
];

@NgModule({
  declarations: [UploadResourcesComponent, ImportFilesComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MaterialdesingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ]
})
export class UploadResourcesModule { }
