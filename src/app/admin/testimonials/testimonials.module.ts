import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestimonialsRoutingModule } from './testimonials-routing.module';
import { TestimonialsComponent } from './testimonials.component';

import { ModalModule } from '../../shared/modules/modal/modal.module';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    TestimonialsRoutingModule,
    FormsModule, ReactiveFormsModule ,  ModalModule, AgGridModule
  ],
  declarations: [TestimonialsComponent]
})
export class TestimonialsModule { }
