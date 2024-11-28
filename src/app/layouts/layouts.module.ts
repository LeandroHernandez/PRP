import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FixedPluginComponent } from "./admin/fixedplugin/fixedplugin.component";
import { FooterComponent } from "./admin/footer/footer.component";
import { NavbarComponent } from "./admin/navbar/navbar.component";
import { SidebarComponent } from "./admin/sidebar/sidebar.component";
import { SidebarModule } from "./admin/sidebar/sidebar.module";
import { ModalComponent } from "./admin/modal/modal.component";
import { ParametersComponent } from "./admin/modal/parameters/parameters.component";
import { ChipsComponent } from "./admin/modal/chips/chips.component";
import { ParameterRegisterComponent } from "./admin/modal/parameters/parameter-register/parameter-register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzCheckboxModule  } from "ng-zorro-antd/checkbox";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzInputModule  } from "ng-zorro-antd/input";
import { NzInputNumberModule  } from "ng-zorro-antd/input-number";
import { NzSwitchModule  } from "ng-zorro-antd/switch";
import { NzCollapseModule  } from "ng-zorro-antd/collapse";
import { NzButtonModule  } from "ng-zorro-antd/button";
import { NzMessageModule  } from "ng-zorro-antd/message";

@NgModule({
  declarations: [
    FixedPluginComponent,
    FooterComponent,
    NavbarComponent,
    ModalComponent,
    ParametersComponent,
    // SidebarComponent
    ChipsComponent,
    ParameterRegisterComponent,
  ],
  imports: [
    CommonModule, 
    SidebarModule, 
    ReactiveFormsModule, 
    FormsModule, 
    NzModalModule, 
    NzCardModule, 
    NzDropDownModule,
    NzIconModule,
    NzSelectModule,
    NzInputNumberModule, 
    NzInputModule, 
    NzSwitchModule, 
    NzCollapseModule,
    NzButtonModule,
    NzMessageModule,
  ],
  exports: [
    FixedPluginComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ModalComponent,
    ParametersComponent,
    ChipsComponent,
    ParameterRegisterComponent,
    NzCheckboxModule, 
  ],
})
export class LayoutsModule {}
