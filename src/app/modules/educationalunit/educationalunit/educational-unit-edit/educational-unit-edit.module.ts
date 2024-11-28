import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialdesingModule } from "app/libraries/materialdesing/materialdesing.module";

import { EducationalUnitEditComponent } from "./educational-unit-edit.component";
import { GeneralInfoComponent } from "./general-info/general-info.component";
import { LevelsComponent } from "./levels/levels.component";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { AddLevelComponent } from './levels/add-level/add-level.component';

@NgModule({
  declarations: [
    EducationalUnitEditComponent,
    GeneralInfoComponent,
    LevelsComponent,
    AddLevelComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    JwBootstrapSwitchNg2Module,
    MaterialdesingModule,
  ],
  exports: [
    EducationalUnitEditComponent,
    GeneralInfoComponent,
    LevelsComponent,
  ],
})
export class EducationalUnitEditModule {}
