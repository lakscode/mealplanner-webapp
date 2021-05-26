import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlancreatemComponent } from './plancreatem.component';

const routes: Routes = [
  { 
    path: 'plan-createm', 
    component: PlancreatemComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlancreatemRoutingModule { }
