import { BrowserModule } from '@angular/platform-browser';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

/*import { AngularFontAwesomeModule } from 'angular-font-awesome';*/

import { HttpClientModule } from '@angular/common/http';

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
import { FavouritesModule } from './recipes/favourites/favourites.module'; 
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

import { ModalModule } from './shared/modules'; 

import { QuestionnaireModule } from './questionnaire/questionnaire.module'; 
import { ProgressModule } from './progress/progress.module'; 
import { RecipebooksModule } from './recipes/recipebooks/recipebooks.module'; 
import { RecipebookModule } from './recipes/recipebook/recipebook.module';
import { FaqsModule } from './faqs/faqs.module';  


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
		timeOut:1000,
		positionClass: 'toast-top-full-width',
		preventDuplicates: true,
	}),

//	AngularFontAwesomeModule,
	HttpClientModule,
	NgbModule.forRoot(),	
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
	HighchartsChartModule,
	QuestionnaireModule,
	ProgressModule,
	RecipebooksModule,
	RecipebookModule,
	FaqsModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



