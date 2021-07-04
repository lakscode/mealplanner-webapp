import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Add2collectionComponent } from './add2collection.component';

 import { Routes, RouterModule } from '@angular/router';
@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule,  RouterModule.forRoot([])],
    declarations: [Add2collectionComponent],
    exports: [Add2collectionComponent]
})
export class Add2collectionModule { }