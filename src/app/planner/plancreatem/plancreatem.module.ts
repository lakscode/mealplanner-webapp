import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlancreatemRoutingModule } from './plancreatem-routing.module';
import { PlancreatemComponent } from './plancreatem.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule, ModalModule } from "../../shared/modules"

@NgModule({
  imports: [
    CommonModule,
    PlancreatemRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule
  ],
  declarations: [PlancreatemComponent]
})
export class PlancreatemModule { }
