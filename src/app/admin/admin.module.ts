import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminleftmenuComponent } from './adminleftmenu/adminleftmenu.component';
import { ManageUsersModule } from './manage-users/manage-users.module';
import { ManagerequestsModule } from './requests/managerequests.module';
import { ManageenquiresModule } from './enquires/manageenquires.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { BannersModule } from './banners/banners.module';
import { ApproverecipesModule } from './approve/recipes/approverecipes.module';
import { ApprovecollectionsModule } from './approve/collections/approvecollections.module';
import { NewsModule } from './news/news.module';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
	ReactiveFormsModule,
	NgbModule,
    AdminRoutingModule,
	DragDropModule,
	AgGridModule.withComponents([]),
	ManageUsersModule,
	ManagerequestsModule,
	TestimonialsModule,


	AnnouncementsModule,

	ManageenquiresModule,
	NewsModule,

	BannersModule,
	ApproverecipesModule,
	ApprovecollectionsModule

  ],
  declarations: [AdminComponent, 
	
		AdminleftmenuComponent,
	
		]
})
export class AdminModule { }
