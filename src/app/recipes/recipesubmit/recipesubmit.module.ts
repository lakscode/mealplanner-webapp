import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesubmitRoutingModule } from './recipesubmit-routing.module';
import { RecipesubmitComponent } from './recipesubmit.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    RecipesubmitRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule
  ],
  declarations: [RecipesubmitComponent]
})
export class RecipesubmitModule { }
