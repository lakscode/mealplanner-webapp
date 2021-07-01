import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
	pathMatch: 'full' 
  },
  {
    path: 'home',
    component: HomeComponent
  }
];

@NgModule({
  imports: [FormsModule, RouterModule.forRoot(routes,{ useHash: true, enableTracing: false, onSameUrlNavigation:"reload"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

/* 
scrollPositionRestoration: 'enabled',
*/