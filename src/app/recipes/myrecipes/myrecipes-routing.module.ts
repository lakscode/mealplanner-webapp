import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyRecipesComponent } from './myrecipes.component';

const routes: Routes = [
  { 
    path: 'myrecipes', 
    component: MyRecipesComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRecipesRoutingModule { }
