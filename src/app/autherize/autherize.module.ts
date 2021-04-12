import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutherizeRoutingModule } from './autherize-routing.module';
import { AutherizeComponent } from './autherize.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AutherizeRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [AutherizeComponent]
})
export class AutherizeModule { }
