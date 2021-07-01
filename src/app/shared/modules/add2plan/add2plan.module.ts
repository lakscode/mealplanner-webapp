import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Add2planComponent } from './add2plan.component';

 import { Routes, RouterModule } from '@angular/router';
@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule,  RouterModule.forRoot([])],
    declarations: [Add2planComponent],
    exports: [Add2planComponent]
})
export class Add2planModule { }