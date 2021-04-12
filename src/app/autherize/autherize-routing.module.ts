import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutherizeComponent } from './autherize.component';

const routes: Routes = [
  { 
    path: 'autherize', 
    component: AutherizeComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutherizeRoutingModule { }
