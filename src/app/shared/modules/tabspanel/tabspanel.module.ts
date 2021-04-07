import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabspanelComponent } from './tabspanel.component';
import { NgxSpinnerModule } from "ngx-spinner";
 import { Routes, RouterModule } from '@angular/router';
@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule, NgxSpinnerModule, RouterModule.forRoot([])],
    declarations: [TabspanelComponent],
    exports: [TabspanelComponent]
})
export class TabspanelModule { }