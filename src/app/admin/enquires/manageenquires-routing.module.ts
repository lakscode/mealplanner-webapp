import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageenquiresComponent } from './manageenquires.component';

const routes: Routes = [
  { path: 'manage-enquires', component: ManageenquiresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageenquiresRoutingModule { }
