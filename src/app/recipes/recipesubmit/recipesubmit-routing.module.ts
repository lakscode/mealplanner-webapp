import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesubmitComponent } from './recipesubmit.component';

const routes: Routes = [
  { 
    path: 'recipesubmit', 
    component: RecipesubmitComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesubmitRoutingModule { }
