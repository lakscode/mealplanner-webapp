import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetpassComponent } from './resetpass.component';

const routes: Routes = [
  { path: 'resetpassword', component: ResetpassComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetpassRoutingModule { }
