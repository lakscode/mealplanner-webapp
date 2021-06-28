import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApproverecipesComponent } from './approverecipes.component';

const routes: Routes = [
  { 
    path: 'approverecipes', 
    component: ApproverecipesComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApproverecipesRoutingModule { }
