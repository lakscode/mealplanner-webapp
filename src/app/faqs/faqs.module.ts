import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqsComponent } from './faqs.component';

import {SidebarModule } from "../shared/modules";
@NgModule({
  imports: [
    CommonModule,
    FaqsRoutingModule,
	SidebarModule
  ],
  declarations: [FaqsComponent]
})
export class FaqsModule { }
