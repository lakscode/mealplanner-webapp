import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminleftmenuComponent } from './adminleftmenu/adminleftmenu.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

import { TestimonialsComponent } from './testimonials/testimonials.component';

import { ApproverecipesComponent } from './approve/recipes/approverecipes.component';
import { ApprovecollectionsComponent } from './approve/collections/approvecollections.component';
const routes: Routes = [
	{
		path: '', component: AdminComponent, children: [
			{  path: 'admin/adminleftmenu', component: AdminleftmenuComponent },
			{  path: 'admin/users', component: ManageUsersComponent },
			{  path: 'admin/testimonials', component: TestimonialsComponent },
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
