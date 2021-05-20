import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    TermsRoutingModule,
	FormsModule,
  ReactiveFormsModule,
  NgbModule
  ],
  declarations: [TermsComponent]
})
export class TermsModule { }
