import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyinfoComponent } from './myinfo.component';

const routes: Routes = [
  { 
    path: 'myinfo', 
    component: MyinfoComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyinfoRoutingModule { }
