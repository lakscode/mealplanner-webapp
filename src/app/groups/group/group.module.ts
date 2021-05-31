import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules";
import { ModalModule } from '../../shared/modules/modal/modal.module';
import { ToastrService } from 'ngx-toastr';
@NgModule({
  imports: [
    CommonModule,
    GroupRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule
  ],
  declarations: [GroupComponent]
})
export class GroupModule { }
