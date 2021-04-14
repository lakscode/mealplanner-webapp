import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetpassRoutingModule } from './resetpass-routing.module';
import { ResetpassComponent } from './resetpass.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ResetpassRoutingModule,
	FormsModule,
  ReactiveFormsModule
  ],
  declarations: [ResetpassComponent]
})
export class ResetpassModule { }
