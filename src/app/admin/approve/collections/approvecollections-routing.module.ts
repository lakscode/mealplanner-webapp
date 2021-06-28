import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovecollectionsComponent } from './approvecollections.component';

const routes: Routes = [
  { 
    path: 'approvecollections', 
    component: ApprovecollectionsComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovecollectionsRoutingModule { }
