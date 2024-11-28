import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalsComponent } from "./modals.component";
import { MaterialdesingModule } from "app/libraries/materialdesing/materialdesing.module";

@NgModule({
  declarations: [ModalsComponent],
  imports: [CommonModule, MaterialdesingModule],
})
export class ModalsModule {}
