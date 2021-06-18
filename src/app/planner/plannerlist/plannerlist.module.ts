import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlannerlistRoutingModule } from './plannerlist-routing.module';
import { PlannerlistComponent } from './plannerlist.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules";
import { ModalModule } from '../../shared/modules/modal/modal.module';
@NgModule({
  imports: [
    CommonModule,
    PlannerlistRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule
  ],
  declarations: [PlannerlistComponent]
})
export class PlannerlistModule { }
