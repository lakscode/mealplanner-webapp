import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListpanelComponent } from './listpanel.component';
 import { Routes, RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule, RouterModule.forRoot([])],
    declarations: [ListpanelComponent],
    exports: [ListpanelComponent]
})
export class ListpanelModule { }