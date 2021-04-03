import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from '../shared/modules/modal/modal.module';
import { TestimonialsRoutingModule } from './testimonials-routing.module';
import { TestimonialsComponent } from './testimonials.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    TestimonialsRoutingModule,
	FormsModule,
  ReactiveFormsModule,
  ModalModule
  ],
  declarations: [TestimonialsComponent]
})
export class TestimonialsModule { }
