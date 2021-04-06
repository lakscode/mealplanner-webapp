import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipedetailsComponent } from './recipedetails.component';

const routes: Routes = [
  { 
    path: 'recipedetails/:id', 
    component: RecipedetailsComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipedetailsRoutingModule { }
