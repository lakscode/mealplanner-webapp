import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipebookRoutingModule } from './recipebook-routing.module';
import { RecipebookComponent } from './recipebook.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    RecipebookRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule
  ],
  declarations: [RecipebookComponent]
})
export class RecipebookModule { }
