import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRoutingModule } from './privacy-routing.module';
import { PrivacyComponent } from './privacy.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    PrivacyRoutingModule,
	FormsModule,
  ReactiveFormsModule,
  NgbModule
  ],
  declarations: [PrivacyComponent]
})
export class PrivacyModule { }
