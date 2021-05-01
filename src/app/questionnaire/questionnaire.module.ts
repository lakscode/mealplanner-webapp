import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { QuestionnaireComponent } from './questionnaire.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    QuestionnaireRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [QuestionnaireComponent]
})
export class  QuestionnaireModule { }
