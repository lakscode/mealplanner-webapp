import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculateRoutingModule } from './calculate-routing.module';
import { CalculateComponent } from './calculate.component';
import {SidebarModule } from "../shared/modules";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    CalculateRoutingModule,
	SidebarModule,
  FormsModule,
	ReactiveFormsModule,
  ],
  declarations: [CalculateComponent]
})
export class CalculateModule { }
