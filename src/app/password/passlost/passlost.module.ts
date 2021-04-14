import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasslostRoutingModule } from './passlost-routing.module';
import { PasslostComponent } from './passlost.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PasslostRoutingModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [PasslostComponent]
})
export class PasslostModule { }
