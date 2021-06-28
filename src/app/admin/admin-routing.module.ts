import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminleftmenuComponent } from './adminleftmenu/adminleftmenu.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManagerequestsComponent } from './requests/managerequests.component';
import { ManageenquiresComponent } from './enquires/manageenquires.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';


import { AnnouncementsComponent } from './announcements/announcements.component';

import { NewsComponent } from './news/news.component';

import { BannersComponent } from './banners/banners.component';
import { ApproverecipesComponent } from './approve/recipes/approverecipes.component';
import { ApprovecollectionsComponent } from './approve/collections/approvecollections.component';
const routes: Routes = [
	{
		path: '', component: AdminComponent, children: [
			{  path: 'admin/adminleftmenu', component: AdminleftmenuComponent },
			{  path: 'admin/users', component: ManageUsersComponent },
			{  path: 'admin/requests', component: ManagerequestsComponent },
			{  path: 'admin/testimonials', component: TestimonialsComponent },

			{  path: 'admin/announcements', component: AnnouncementsComponent }	,	


			{  path: 'admin/news', component: NewsComponent },

			{  path: 'admin/requests', component: ManagerequestsComponent },
			{  path: 'admin/enquires', component: ManageenquiresComponent },
			{  path: 'admin/banners', component: BannersComponent },
			{  path: 'admin/approverecipes', component: ApproverecipesComponent },			
			{  path: 'admin/approvecollections', component: ApprovecollectionsComponent },		
		]
	}
];
	
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
