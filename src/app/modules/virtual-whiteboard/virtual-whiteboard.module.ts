import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board/board.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: "", component: BoardComponent }
];
@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class VirtualWhiteboardModule { }
