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

import { SignupModule } from './signup/signup.module'; 

import { UserService } from './services/user.service';

import { HighchartsChartModule } from 'highcharts-angular';

import { HomeModule } from './home/home.module'; 
import { LandingModule } from './landing/landing.module'; 

import { Landing1Module } from './landing1/landing1.module'; 

import { RecipesModule } from './recipes/recipes.module'; 
import { RecipedetailsModule } from './recipedetails/recipedetails.module'; 
import { RecipesubmitModule } from './recipesubmit/recipesubmit.module'; 
import { TestimonialsModule } from './testimonials/testimonials.module'; 
import { PlannerlistModule } from './planner/plannerlist/plannerlist.module'; 
import { PlannercreateModule } from './planner/plannercreate/plannercreate.module'; 
import { PricingModule } from './pricing/pricing.module'; 
import { OurteamModule } from './ourteam/ourteam.module'; 
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
	SignupModule,
    LandingModule,
	Landing1Module,
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
	HomeModule,
	RecipesModule,
	RecipedetailsModule,
	RecipesubmitModule,
	TestimonialsModule,
	PlannerlistModule,
	PlannercreateModule,
	PricingModule,
	OurteamModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }



