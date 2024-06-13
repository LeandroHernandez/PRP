import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedPluginComponent } from './admin/fixedplugin/fixedplugin.component';
import { FooterComponent } from './admin/footer/footer.component';
import { NavbarComponent } from './admin/navbar/navbar.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { SidebarModule } from './admin/sidebar/sidebar.module';

@NgModule({
  declarations: [
    FixedPluginComponent,
    FooterComponent,
    NavbarComponent,
    // SidebarComponent
  ],
  imports: [
    CommonModule,
    SidebarModule
  ],
  exports: [
    FixedPluginComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class LayoutsModule { }
