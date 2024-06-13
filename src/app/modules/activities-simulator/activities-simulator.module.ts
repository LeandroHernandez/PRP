import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSimulatorComponent } from './modal-simulator/modal-simulator.component';
import { EssaySimulatorComponent } from './modal-simulator/essay-simulator/essay-simulator.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {FormsModule} from '@angular/forms';
import { PracticeSimulatorComponent } from './modal-simulator/practice-simulator/practice-simulator.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { EvaluationSimulatorComponent } from './modal-simulator/evaluation-simulator/evaluation-simulator.component';
import {MaterialdesingModule} from '../../libraries/materialdesing/materialdesing.module';

@NgModule({
  declarations: [ModalSimulatorComponent, EssaySimulatorComponent, PracticeSimulatorComponent, EvaluationSimulatorComponent],
  imports: [
    CommonModule,
    AngularEditorModule,
    FormsModule,
    YouTubePlayerModule,
    MaterialdesingModule
  ],
  exports: [
    ModalSimulatorComponent
  ]
})
export class ActivitiesSimulatorModule { }
