import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferencesRoutingModule } from './preferences-routing.module';
import { PreferencesComponent } from './preferences.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    
    CommonModule,
    PreferencesRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [PreferencesComponent]
})
export class PreferencesModule { }
