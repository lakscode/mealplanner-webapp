import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproverecipesRoutingModule } from './approverecipes-routing.module';
import { ApproverecipesComponent } from './approverecipes.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    ApproverecipesRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule
  ],
  declarations: [ApproverecipesComponent]
})
export class ApproverecipesModule { }
