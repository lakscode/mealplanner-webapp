import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomizeComponent } from './customize.component';

@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule],
    declarations: [CustomizeComponent],
    exports: [CustomizeComponent]
})
export class CustomizeModule { }