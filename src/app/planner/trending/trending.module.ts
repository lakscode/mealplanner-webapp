import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TrendingRoutingModule } from './trending-routing.module';
import { TrendingComponent } from './trending.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    TrendingRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [TrendingComponent]
})
export class TrendingModule { }
