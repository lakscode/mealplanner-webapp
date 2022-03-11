import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UtilityComponent } from './utility.component';

const routes: Routes = [
  { path: 'utility', component: UtilityComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilityRoutingModule { }
