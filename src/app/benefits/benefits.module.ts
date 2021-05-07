import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenefitsRoutingModule } from './benefits-routing.module';
import { BenefitsComponent } from './benefits.component';
import {SidebarModule } from "../shared/modules";
@NgModule({
  imports: [
    CommonModule,
    BenefitsRoutingModule,
	SidebarModule
  ],
  declarations: [BenefitsComponent]
})
export class BenefitsModule { }
