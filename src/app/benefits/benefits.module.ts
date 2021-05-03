import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenefitsRoutingModule } from './benefits-routing.module';
import { BenefitsComponent } from './benefits.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../shared/modules";
@NgModule({
  imports: [
    CommonModule,
    BenefitsRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
	SidebarModule
  ],
  declarations: [BenefitsComponent]
})
export class BenefitsModule { }
