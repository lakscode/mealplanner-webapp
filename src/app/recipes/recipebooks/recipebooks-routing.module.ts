import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipebooksComponent } from './recipebooks.component';

const routes: Routes = [
  { 
    path: 'recipebooks', 
    component: RecipebooksComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipebooksRoutingModule { }
