import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlannercreateComponent } from './plannercreate.component';

const routes: Routes = [
  { 
    path: 'plan-create', 
    component: PlannercreateComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannercreateRoutingModule { }
