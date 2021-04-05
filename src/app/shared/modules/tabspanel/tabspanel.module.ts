import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabspanelComponent } from './tabspanel.component';

@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule],
    declarations: [TabspanelComponent],
    exports: [TabspanelComponent]
})
export class TabspanelModule { }