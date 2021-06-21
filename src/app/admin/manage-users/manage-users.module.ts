import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { ManageUsersComponent } from './manage-users.component';

import { ModalModule } from '../../shared/modules/modal/modal.module';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 

    ModalModule,
    AgGridModule
  ],
  declarations: [ManageUsersComponent]
})

export class ManageUsersModule { }
