import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanviewComponent } from './planview.component';

const routes: Routes = [
  { 
    path: 'planview', 
    component: PlanviewComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanviewRoutingModule { }
