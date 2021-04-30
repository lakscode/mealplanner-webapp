import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SearchbarModule, SliderpanelModule, TabspanelModule } from "../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SearchbarModule,
  SliderpanelModule,
  TabspanelModule
  ],
  declarations: [LandingComponent]
})
export class LandingModule { }
