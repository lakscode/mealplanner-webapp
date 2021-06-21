import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerequestsComponent } from './managerequests.component';

const routes: Routes = [
  { path: 'manage-requests', component: ManagerequestsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerequestsRoutingModule { }
