import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovecollectionsRoutingModule } from './approvecollections-routing.module';
import { ApprovecollectionsComponent } from './approvecollections.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../../shared/modules"
@NgModule({
  imports: [
    CommonModule,
   ApprovecollectionsRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule
  ],
  declarations: [ApprovecollectionsComponent]
})
export class ApprovecollectionsModule { }
