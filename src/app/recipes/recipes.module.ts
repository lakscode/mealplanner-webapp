import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RecipesRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [RecipesComponent]
})
export class RecipesModule { }
