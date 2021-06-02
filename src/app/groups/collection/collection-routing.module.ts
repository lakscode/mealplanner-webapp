import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CollectionComponent } from './collection.component';

const routes: Routes = [
  { 
    path: 'collection', 
    component: CollectionComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }
