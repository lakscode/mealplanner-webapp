import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncementsComponent } from './announcements.component';

const routes: Routes = [
  { path: 'admin/announcements', component: AnnouncementsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementsRoutingModule { }
