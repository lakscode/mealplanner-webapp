import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionComponent } from './collection.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule, Add2planModule } from "../../shared/modules";
import { ModalModule} from '../../shared/modules/modal/modal.module';
@NgModule({
  imports: [
    CommonModule,
    CollectionRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule,
  Add2planModule
  ],
  declarations: [CollectionComponent]
})
export class CollectionModule { }
