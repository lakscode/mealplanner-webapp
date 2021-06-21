import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerequestsRoutingModule } from './managerequests-routing.module';
import { ManagerequestsComponent } from './managerequests.component';
import { ModalModule } from '../../shared/modules/modal/modal.module';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    ManagerequestsRoutingModule,
    FormsModule, ReactiveFormsModule , AgGridModule,ModalModule
  ],
  declarations: [ManagerequestsComponent]
})
export class ManagerequestsModule { }
