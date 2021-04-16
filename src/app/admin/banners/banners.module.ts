import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannersRoutingModule } from './banners-routing.module';
import { BannersComponent } from './banners.component';

import { ModalModule } from '../../shared/modules/modal/modal.module';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    BannersRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 

    ModalModule,
    AgGridModule
  ],
  declarations: [BannersComponent]
})

export class BannersModule { }
