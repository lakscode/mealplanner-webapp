import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Landing1Component } from './landing1.component';

const routes: Routes = [
  { 
    path: 'landing1', 
    component: Landing1Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Landing1RoutingModule { }
