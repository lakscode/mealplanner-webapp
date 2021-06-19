import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesmodifyRoutingModule } from './recipesmodify-routing.module';
import { RecipesmodifyComponent } from './recipesmodify.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    RecipesmodifyRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule
  ],
  declarations: [RecipesmodifyComponent]
})
export class RecipesmodifyModule { }
