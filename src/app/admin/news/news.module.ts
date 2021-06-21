import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';

import { ModalModule } from '../../shared/modules/modal/modal.module';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    NewsRoutingModule,
    FormsModule, ReactiveFormsModule ,  ModalModule, AgGridModule
  ],
  declarations: [NewsComponent]
})
export class NewsModule { }
