import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyRecipesRoutingModule } from './myrecipes-routing.module';
import { MyRecipesComponent } from './myrecipes.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    MyRecipesRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule
  ],
  declarations: [MyRecipesComponent]
})
export class MyRecipesModule { }
