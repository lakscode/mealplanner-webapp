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
import { FeaturesModule } from './features/features.module'; 


import { LandingModule } from './landing/landing.module'; 

import { RecipesModule } from './recipes/recipes/recipes.module'; 
import { MyRecipesModule } from './recipes/myrecipes/myrecipes.module'; 
import { FavouritesModule } from './favourites/favourites.module'; 
import { RecipedetailsModule } from './recipes/recipedetails/recipedetails.module'; 
import { RecipesubmitModule } from './recipes/recipesubmit/recipesubmit.module'; 
import { TestimonialsModule } from './testimonials/testimonials.module'; 
import { PlannerlistModule } from './planner/plannerlist/plannerlist.module'; 
import { PlannercreateModule } from './planner/plannercreate/plannercreate.module'; 
import { ScheduleModule } from './planner/schedule/schedule.module'; 
import { TrendingModule } from './planner/trending/trending.module'; 


import { PricingModule } from './pricing/pricing.module'; 
import { OurteamModule } from './ourteam/ourteam.module'; 
import { MyinfoModule } from './myinfo/myinfo.module'; 
import { AutherizeModule } from './autherize/autherize.module'; 
import { BenefitsModule } from './benefits/benefits.module'; 

import { PasslostModule } from './password/passlost/passlost.module';

import { ResetpassModule } from './password/resetpass/resetpass.module';

import { NgxSpinnerModule } from "ngx-spinner";

import { ModalModule } from './shared/modules'; 
import { AdminModule } from './admin/admin.module'; 


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
    BenefitsModule,
	LandingModule,
	ToastrModule.forRoot({
		timeOut: 1000,
	}),

	AngularFontAwesomeModule,
	HttpClientModule,
	NgbModule.forRoot(),	
	NgxSpinnerModule,
	DragDropModule,
	CollapseModule.forRoot(),
	NgMultiSelectDropDownModule.forRoot(),
	HighchartsChartModule,
	HomeModule,
	FeaturesModule,
	RecipesModule,
	MyRecipesModule,
	FavouritesModule,
	RecipedetailsModule,
	RecipesubmitModule,
	TestimonialsModule,
	PlannerlistModule,
	PlannercreateModule,
	ScheduleModule,
	TrendingModule,
	PricingModule,
	OurteamModule,
	ModalModule,
	MyinfoModule,
	AutherizeModule,
	PasslostModule, 
	ResetpassModule,
	AdminModule,
	HighchartsChartModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }



