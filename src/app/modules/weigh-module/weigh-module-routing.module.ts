import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WeighModuleComponent} from './weigh-module/weigh-module.component';


const routes: Routes = [
    {
      path: '',
      component: WeighModuleComponent
    }
      ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeighModuleRoutingModule { }
