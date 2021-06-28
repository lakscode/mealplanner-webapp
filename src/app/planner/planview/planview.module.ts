import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanviewRoutingModule } from './planview-routing.module';
import { PlanviewComponent } from './planview.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule, ModalModule } from "../../shared/modules"
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  imports: [
    CommonModule,
    PlanviewRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  ModalModule,
  ToastrModule
  ],
  declarations: [PlanviewComponent]
})
export class PlanviewModule { }
