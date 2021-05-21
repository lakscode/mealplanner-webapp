import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlannerlistComponent } from './plannerlist.component';

const routes: Routes = [
  { 
    path: 'plans', 
    component: PlannerlistComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerlistRoutingModule { }
