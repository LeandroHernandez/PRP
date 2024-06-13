import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListmenuComponent } from './listmenu/listmenu.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialdesingModule } from '../../libraries/materialdesing/materialdesing.module';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';


const routes: Routes = [
  { path: "", component: ListmenuComponent }
];

@NgModule({
  declarations: [ListmenuComponent],
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
  ],
  providers : []
})
export class MenuModule { }
