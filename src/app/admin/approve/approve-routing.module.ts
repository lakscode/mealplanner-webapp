import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApproveComponent } from './approve.component';

const routes: Routes = [
  { 
    path: 'approve', 
    component: ApproveComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproveRoutingModule { }
