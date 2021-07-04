import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules"
import { ModalModule, Add2planModule, Add2collectionModule, SearchModule } from '../../shared/modules/';

@NgModule({
  imports: [
    CommonModule,
    RecipesRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule,
  Add2planModule,
  Add2collectionModule,
  SearchModule
  ],
  declarations: [RecipesComponent]
})
export class RecipesModule { }
