import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderpanelComponent } from './sliderpanel.component';
import { LazyLoadImageModule } from 'ng-lazyload-image'; 
@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule, LazyLoadImageModule],
    declarations: [SliderpanelComponent],
    exports: [SliderpanelComponent]
})
export class SliderpanelModule { }