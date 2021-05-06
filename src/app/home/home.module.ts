import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SliderpanelModule, QuestionsModule, ModalModule } from "../shared/modules"

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
	FormsModule,
  ReactiveFormsModule,
  NgbModule,
  SliderpanelModule,
  QuestionsModule,
  ModalModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
