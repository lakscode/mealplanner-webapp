import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderpanelModule } from "../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SliderpanelModule,
  //TabspanelModule
  ],
  declarations: [LandingComponent]
})
export class LandingModule { }
