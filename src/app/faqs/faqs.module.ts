import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqsComponent } from './faqs.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../shared/modules";
@NgModule({
  imports: [
    CommonModule,
    FaqsRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
	SidebarModule
  ],
  declarations: [FaqsComponent]
})
export class FaqsModule { }
