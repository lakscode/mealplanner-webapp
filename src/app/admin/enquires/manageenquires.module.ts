import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageenquiresRoutingModule } from './manageenquires-routing.module';
import { ManageenquiresComponent } from './manageenquires.component';
import { ModalModule } from '../../shared/modules/modal/modal.module';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    ManageenquiresRoutingModule,
    FormsModule, ReactiveFormsModule , AgGridModule
  ],
  declarations: [ManageenquiresComponent]
})
export class ManageenquiresModule { }
