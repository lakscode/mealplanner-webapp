import { BrowserModule } from '@angular/platform-browser';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { HttpClientModule } from '@angular/common/http';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import {ToastrModule } from 'ngx-toastr';

import { LayoutModule } from './layout/layout.module';

import { AppRoutingModule } from './app-routing.module';

import { LoginModule } from './login/login.module';



import { UserService } from './services/user.service';





import { HighchartsChartModule } from 'highcharts-angular';

import { FaqChatModule } from './shared';

import { HomeModule } from './home/home.module'; 
import { LandingModule } from './landing/landing.module'; 

@NgModule({
  declarations: [
		AppComponent
  ],
  imports: [
    BrowserModule,	
	BrowserAnimationsModule,
	FormsModule,
	ReactiveFormsModule,
	RouterModule.forRoot([]),
    AppRoutingModule,
	FlexLayoutModule,
	LayoutModule,
    LoginModule,
    LandingModule,
	ToastrModule.forRoot({
		timeOut: 1000,
	}),

	AngularFontAwesomeModule,
	HttpClientModule,
	NgbModule.forRoot(),	
	
	DragDropModule,
	CollapseModule.forRoot(),
	NgMultiSelectDropDownModule.forRoot(),
	HighchartsChartModule,

	FaqChatModule,
	HomeModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }



