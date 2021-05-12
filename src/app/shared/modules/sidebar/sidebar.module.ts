import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar.component';

 import { Routes, RouterModule } from '@angular/router';
@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule,  RouterModule.forRoot([])],
    declarations: [SidebarComponent],
    exports: [SidebarComponent]
})
export class SidebarModule { }