import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Landing1RoutingModule } from './landing1-routing.module';
import { Landing1Component } from './landing1.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SearchbarModule, SliderpanelModule, TabspanelModule } from "../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    Landing1RoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SearchbarModule,
  SliderpanelModule,
  TabspanelModule
  ],
  declarations: [Landing1Component]
})
export class Landing1Module { }
