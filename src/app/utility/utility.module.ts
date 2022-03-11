import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilityRoutingModule } from './utility-routing.module';
import { UtilityComponent } from './utility.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    UtilityRoutingModule,
	FormsModule,
  ReactiveFormsModule,
  NgbModule
  ],
  declarations: [UtilityComponent]
})
export class UtilityModule { }
