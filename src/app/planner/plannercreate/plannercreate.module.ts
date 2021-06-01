import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlannercreateRoutingModule } from './plannercreate-routing.module';
import { PlannercreateComponent } from './plannercreate.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule, ModalModule } from "../../shared/modules"
import {ToastrModule } from 'ngx-toastr';
@NgModule({
  imports: [
    CommonModule,
    PlannercreateRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule,
  ToastrModule
  ],
  declarations: [PlannercreateComponent]
})
export class PlannercreateModule { }
