import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionsComponent } from './collections.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules";
import { ModalModule } from '../../shared/modules/modal/modal.module';
@NgModule({
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule
  ],
  declarations: [CollectionsComponent]
})
export class CollectionsModule { }
