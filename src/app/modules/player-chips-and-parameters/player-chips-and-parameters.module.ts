import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayerChipsAndParametersComponent } from "./player-chips-and-parameters/player-chips-and-parameters.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialdesingModule } from "app/libraries/materialdesing/materialdesing.module";
import { AngularFireModule } from "@angular/fire";
import { environment } from "environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { NzModalModule } from 'ng-zorro-antd/modal';

const routes: Routes = [
  { path: "", component: PlayerChipsAndParametersComponent },
];

@NgModule({
  declarations: [PlayerChipsAndParametersComponent],
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
    NzModalModule,
  ],
})
export class PlayerChipsAndParametersModule {}
