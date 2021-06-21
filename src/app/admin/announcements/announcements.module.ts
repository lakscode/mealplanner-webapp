import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementsRoutingModule } from './announcements-routing.module';
import { AnnouncementsComponent } from './announcements.component';
import { ModalModule } from '../../shared/modules/modal/modal.module';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    AnnouncementsRoutingModule,
    FormsModule, ReactiveFormsModule , ModalModule,AgGridModule
  ],
  declarations: [AnnouncementsComponent]
})
export class AnnouncementsModule { }
