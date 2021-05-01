import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
@NgModule({
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  HighchartsChartModule
  ],
  declarations: [ScheduleComponent]
})
export class ScheduleModule { }
