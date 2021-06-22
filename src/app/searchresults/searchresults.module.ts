import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchresultsRoutingModule } from './searchresults-routing.module';
import { SearchresultsComponent } from './searchresults.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../shared/modules"
import { ModalModule } from '../shared/modules/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    SearchresultsRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule
  ],
  declarations: [SearchresultsComponent]
})
export class SearchresultsModule { }
