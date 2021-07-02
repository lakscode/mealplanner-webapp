import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlancreateRoutingModule } from './plancreate-routing.module';
import { PlancreateComponent } from './plancreate.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule, ModalModule, SearchModule } from "../../shared/modules"
import {ToastrModule } from 'ngx-toastr';
@NgModule({
  imports: [
    CommonModule,
    PlancreateRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule,
  ToastrModule,
  SearchModule
  ],
  declarations: [PlancreateComponent]
})
export class PlancreateModule { }
