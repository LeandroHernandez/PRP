import { Routes } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { LandingpageComponent } from "./pages/landingpage/landingpage.component";
import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";
import { PlanComponent } from "./pages/plan/plan.component";
import { RoutesApp } from "constants/routes-app";

export const AppRoutes: Routes = [
  {
    path: RoutesApp.root,
    // redirectTo: "login",
    redirectTo: RoutesApp.login,
    pathMatch: "full",
  },
  {
    // path: "inicio",
    path: RoutesApp.init,
    component: LandingpageComponent,
  },
  {
    // path: "index",
    path: RoutesApp.index,
    component: LandingpageComponent,
  },
  {
    // path: "plan",
    path: RoutesApp.plan,
    component: PlanComponent,
  },
  /* routing a registro para pruebas */
  {
    // path: "register/:type/:id",
    path: `${RoutesApp.register}/:${RoutesApp.type}/:${RoutesApp.id}`,
    component: RegisterComponent,
  },
  {
    // path: "register/:type",
    path: `${RoutesApp.register}/:${RoutesApp.type}`,
    component: RegisterComponent,
  },
  {
    path: RoutesApp.login,
    component: LoginComponent,
  },

  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      // {
      //   path: "listuniteducational",
      //   loadChildren:
      //     "./modules/uniteducational/uniteducational.module#UniteducationalModule",
      // },
      {
        path: "listuniteducational",
        loadChildren:
          "./modules/educationalunit/educationalunit.module#EducationalunitModule",
      },
      {
        path: "menu",
        loadChildren: "./modules/menu/menu.module#MenuModule",
      },
      {
        path: RoutesApp.playerChipsAndParameters,
        loadChildren:
          "./modules/player-chips-and-parameters/player-chips-and-parameters.module#PlayerChipsAndParametersModule",
      },
      {
        path: "role",
        loadChildren: "./modules/role/role.module#RoleModule",
      },
      {
        path: RoutesApp.levels,
        // loadChildren: "./modules/levels/levels.module#LevelsModule",
        loadChildren:
          "./modules/admin-educational-unit/admin-educational-unit.module#AdminEducationalUnitModule",
      },
      {
        path: "sublevels",
        loadChildren: "./modules/sub-levels/sublevels.module#SubLevelsModule",
      },
      {
        path: "grades",
        loadChildren: "./modules/grades/grades.module#GradesModule",
      },
      {
        path: "parallels",
        loadChildren: "./modules/parallels/parallels.module#ParallelsModule",
      },
      {
        path: "academyarea",
        loadChildren:
          "./modules/academyarea/academyarea.module#AcademyareaModule",
      },
      {
        path: "subject",
        loadChildren: "./modules/subject/subject.module#SubjectModule",
      },
      {
        path: RoutesApp.teachers,
        loadChildren: "./modules/teachers/teachers.module#TeachersModule",
      },
      {
        path: "representative",
        loadChildren:
          "./modules/representative/representative.module#RepresentativeModule",
      },
      {
        path: RoutesApp.students,
        loadChildren: "./modules/student/student.module#StudentModule",
      },
      {
        path: "academicyear",
        loadChildren:
          "./modules/academic-year/academic-year.module#AcademicYearModule",
      },
      {
        path: "teacherunit",
        loadChildren:
          "./modules/teacher-unit/teacher-unit.module#TeacherUnitModule",
      },
      {
        path: "admineducationalunit",
        loadChildren:
          "./modules/admin-educational-unit/admin-educational-unit.module#AdminEducationalUnitModule",
      },
      {
        path: "representativehome",
        loadChildren:
          "./modules/representative-role/representative-role.module#RepresentativeRoleModule",
      },
      {
        path: "representativecalendar",
        loadChildren:
          "./modules/representative-role/representative-calendar.module#RepresentativeCalendarModule",
      },
      {
        path: "subjectshome",
        loadChildren:
          "./modules/representative-role/subject.module#SubjectModule",
      },
      {
        path: "subjectsdetail",
        loadChildren:
          "./modules/representative-role/list-detail-subject.module#ListDetailSubjectModule",
      },
      {
        path: "studentsubjects",
        loadChildren:
          "./modules/student-subjects/student-subjects.module#StudentSubjectsModule",
      },
      {
        path: "teachersubjects",
        loadChildren:
          "./modules/teacher-subjects/teacher-subjects.module#TeacherSubjectsModule",
      },
      {
        path: "practiclist",
        loadChildren:
          "./modules/practic-list/practic-list.module#PracticListModule",
      },
      {
        path: "adminpractice",
        loadChildren:
          "./modules/admin-practices/admin-practices.module#AdminPracticesModule",
      },
      {
        path: "uploadfiles",
        loadChildren:
          "./modules/upload-resources/upload-resources.module#UploadResourcesModule",
      },
      {
        path: "board",
        loadChildren:
          "./modules/virtual-whiteboard/virtual-whiteboard.module#VirtualWhiteboardModule",
      },
      {
        path: "report",
        loadChildren: "./modules/report/report.module#ReportModule",
      },
      {
        path: "reportlearninglevel",
        loadChildren:
          "./modules/reportlearninglevel/reportlearninglevel.module#ReportlearninglevelModule",
      },
      {
        path: "calendar",
        loadChildren:
          "./modules/calendar/calendar.module#CalendarStudentModule",
      },
      {
        path: "studentadmin",
        loadChildren:
          "./modules/student-admin/student-admin.module#StudentAdminModule",
      },
      {
        path: "weighmodule",
        loadChildren:
          "./modules/weigh-module/weigh-module-routing.module#WeighModuleRoutingModule",
      },
      // {
      //     path: 'teachersubjectslist',
      //     loadChildren: './modules/teacher-subjects/list-teacher-subjects.module#ListTeacherSubjectsModule'
      // },
      {
        path: "athletes",
        loadChildren:
          "./modules/modules-admin/athletes/athletes.module#AthletesModule",
      },
      {
        path: "athletes/add-athletes",
        loadChildren:
          "./modules/modules-admin/athletes/athletes.module#AthletesModule",
      },
      {
        path: "users",
        loadChildren: "./modules/users/users.module#UsersModule",
      },
    ],
  },

  {
    path: "**",
    // redirectTo: "login",
    redirectTo: RoutesApp.root,
    pathMatch: "full",
  },
];
