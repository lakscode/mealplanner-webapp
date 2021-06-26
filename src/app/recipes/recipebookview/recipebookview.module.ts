import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipebookviewRoutingModule } from './recipebookview-routing.module';
import { RecipebookviewComponent } from './recipebookview.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules";
import { ModalModule } from '../../shared/modules/modal/modal.module';
import { ToastrService } from 'ngx-toastr';
@NgModule({
  imports: [
    CommonModule,
    RecipebookviewRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule
  ],
  declarations: [RecipebookviewComponent]
})
export class RecipebookviewModule { }
