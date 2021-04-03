import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListpanelComponent } from './listpanel.component';

@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule],
    declarations: [ListpanelComponent],
    exports: [ListpanelComponent]
})
export class ListpanelModule { }