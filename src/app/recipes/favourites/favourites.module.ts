import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavouritesRoutingModule } from './favourites-routing.module';
import { FavouritesComponent } from './favourites.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SidebarModule } from "../../shared/modules";
import { Add2planModule } from '../../shared/modules/';
@NgModule({
  imports: [
    CommonModule,
    FavouritesRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
  SidebarModule,
  Add2planModule
  ],
  declarations: [FavouritesComponent]
})
export class FavouritesModule { }
