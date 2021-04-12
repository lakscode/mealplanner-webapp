import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyinfoRoutingModule } from './myinfo-routing.module';
import { MyinfoComponent } from './myinfo.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MyinfoRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [MyinfoComponent]
})
export class MyinfoModule { }
