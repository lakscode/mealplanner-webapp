import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { FeaturesComponent } from './features.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule,
	FormsModule,
  ReactiveFormsModule,
  NgbModule
  ],
  declarations: [FeaturesComponent]
})
export class FeaturesModule { }
