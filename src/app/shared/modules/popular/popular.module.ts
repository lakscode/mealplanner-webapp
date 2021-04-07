import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopularComponent } from './popular.component';
 import { Routes, RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule, RouterModule.forRoot([])],
    declarations: [PopularComponent],
    exports: [PopularComponent]
})
export class PopularModule { }