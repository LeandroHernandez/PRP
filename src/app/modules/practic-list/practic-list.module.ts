import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticListComponent } from './practic-list/practic-list.component';
import {RouterModule, Routes} from '@angular/router';
import {ParallelsComponent} from '../parallels/parallels/parallels.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialdesingModule} from '../../libraries/materialdesing/materialdesing.module';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';

const routes: Routes = [
  { path: '', component: PracticListComponent }
];

@NgModule({
  declarations: [PracticListComponent],
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
export class PracticListModule { }
