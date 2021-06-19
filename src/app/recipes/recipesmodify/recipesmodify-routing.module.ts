import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesmodifyComponent } from './recipesmodify.component';

const routes: Routes = [
  { 
    path: 'recipesmodify', 
    component: RecipesmodifyComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesmodifyRoutingModule { }
