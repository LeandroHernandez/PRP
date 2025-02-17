import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, ExtraOptions } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';


import {AppRoutes} from './app.routing';

/** Angular Fire*/
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

/** App modules */
import { LayoutsModule } from './layouts/layouts.module';

/** Components */
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './pages/components/navbar/navbar.component';
import { environment } from 'environments/environment';
import {LoginComponent} from './pages/login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MaterialdesingModule} from './libraries/materialdesing/materialdesing.module';
import {StudentRegisterComponent} from './pages/register/student-register/student-register.component';
import {TeacherRegisterComponent} from './pages/register/teacher-register/teacher-register.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { PlanComponent } from './pages/plan/plan.component';
import { WeighModuleComponent } from './modules/weigh-module/weigh-module/weigh-module.component';
import { ModalAddNewUEComponent } from './modals/modal-add-new-ue/modal-add-new-ue.component';
import { ModalUploadLogoComponent } from './modals/modal-upload-logo/modal-upload-logo.component';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { ToUpperCaseDirective } from './directives/to-upper-case.directive';
import { ModalAddNewUserComponent } from './modals/modal-add-new-user/modal-add-new-user.component';
import { ModalAddUsersUeComponent } from './modals/modal-add-users-ue/modal-add-users-ue.component';
import { ModalAddOrEditNewEuComponent } from './modals/modal-add-or-edit-new-eu/modal-add-or-edit-new-eu.component';
import { HttpClientModule } from '@angular/common/http';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

registerLocaleData(es);

/** Configuration options for a router module */
const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
}
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot(AppRoutes, routerOptions),
    LayoutsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,
    ReactiveFormsModule,
    MaterialdesingModule,
    YouTubePlayerModule,
    HttpClientModule,
    
  ],
    declarations: [
      AppComponent,
      AdminLayoutComponent,
      LandingpageComponent,
      NavbarComponent,
      RegisterComponent,
      LoginComponent,
      StudentRegisterComponent,
      TeacherRegisterComponent,
      PlanComponent,
      WeighModuleComponent,
      ModalAddNewUEComponent,
      ModalUploadLogoComponent,
      OnlyNumbersDirective,
      ToUpperCaseDirective,
      ModalAddNewUserComponent,
      ModalAddUsersUeComponent,
      ModalAddOrEditNewEuComponent,
      

    ],
    bootstrap: [AppComponent],
    providers: [{ provide: NZ_I18N, useValue: es_ES }]
})

export class AppModule {
}
