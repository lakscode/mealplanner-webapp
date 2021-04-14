import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasslostComponent } from './passlost.component';

const routes: Routes = [
  { path: 'forgot-password', component: PasslostComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasslostRoutingModule { }
