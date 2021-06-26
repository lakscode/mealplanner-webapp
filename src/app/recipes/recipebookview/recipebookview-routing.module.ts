import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipebookviewComponent } from './recipebookview.component';

const routes: Routes = [
  { 
    path: 'recipebookview', 
    component: RecipebookviewComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipebookviewRoutingModule { }
