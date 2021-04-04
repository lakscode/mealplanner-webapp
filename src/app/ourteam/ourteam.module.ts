import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OurteamRoutingModule } from './ourteam-routing.module';
import { OurteamComponent } from './ourteam.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    OurteamRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule
  ],
  declarations: [OurteamComponent]
})
export class OurteamModule { }
