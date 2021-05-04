import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipebooksRoutingModule } from './recipebooks-routing.module';
import { RecipebooksComponent } from './recipebooks.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules"
@NgModule({
  imports: [
    CommonModule,
    RecipebooksRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule
  ],
  declarations: [RecipebooksComponent]
})
export class RecipebooksModule { }
