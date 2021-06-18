import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlancreateComponent } from './plancreate.component';

const routes: Routes = [
  { 
    path: 'plancreate', 
    component: PlancreateComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlancreateRoutingModule { }
