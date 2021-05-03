import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressRoutingModule } from './progress-routing.module';
import { ProgressComponent } from './progress.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
@NgModule({
  imports: [
    CommonModule,
    ProgressRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  HighchartsChartModule
  ],
  declarations: [ProgressComponent]
})
export class ProgressModule { }
