import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateTimeComponent } from './datetime.component';

@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule],
    declarations: [DateTimeComponent],
    exports: [DateTimeComponent]
})
export class DateTimeModule { }