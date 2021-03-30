import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqChatComponent } from './faq-chat.component';

@NgModule({
    imports: [CommonModule, NgbModule,  FormsModule, ReactiveFormsModule],
    declarations: [FaqChatComponent],
    exports: [FaqChatComponent]
})
export class FaqChatModule { }