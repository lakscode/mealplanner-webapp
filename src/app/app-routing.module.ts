import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
	pathMatch: 'full' 
  }

];

@NgModule({
  imports: [FormsModule, RouterModule.forRoot(routes,{useHash: true, enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

