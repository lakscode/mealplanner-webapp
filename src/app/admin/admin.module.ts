import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminleftmenuComponent } from './adminleftmenu/adminleftmenu.component';
import { ManageUsersModule } from './manage-users/manage-users.module';

import { TestimonialsModule } from './testimonials/testimonials.module';

import { ApproverecipesModule } from './approve/recipes/approverecipes.module';
import { ApprovecollectionsModule } from './approve/collections/approvecollections.module';


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
	TestimonialsModule,
	ApproverecipesModule,
	ApprovecollectionsModule

  ],
  declarations: [AdminComponent, 
	
		AdminleftmenuComponent,
	
		]
})
export class AdminModule { }
