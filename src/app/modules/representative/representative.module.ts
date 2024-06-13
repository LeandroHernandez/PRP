import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListrepresentativeComponent } from './listrepresentative/listrepresentative.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from '../../libraries/materialdesing/materialdesing.module';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: "", component: ListrepresentativeComponent }
];

@NgModule({
  declarations: [ListrepresentativeComponent],
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
    AngularFireAuthModule
  ],
  providers : [NgbActiveModal]
})
export class RepresentativeModule { }
