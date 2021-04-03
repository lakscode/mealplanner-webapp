import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipedetailsRoutingModule } from './recipedetails-routing.module';
import { RecipedetailsComponent } from './recipedetails.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RecipedetailsRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [RecipedetailsComponent]
})
export class RecipedetailsModule { }
