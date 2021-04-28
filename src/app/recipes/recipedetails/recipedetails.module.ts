import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipedetailsRoutingModule } from './recipedetails-routing.module';
import { RecipedetailsComponent } from './recipedetails.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule, ListpanelModule } from "../../shared/modules";
@NgModule({
  imports: [
    CommonModule,
    RecipedetailsRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ListpanelModule
  ],
  declarations: [RecipedetailsComponent]
})
export class RecipedetailsModule { }
