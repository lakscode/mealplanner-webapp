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

/*import { HighchartsChartModule } from 'highcharts-angular';*/

import { HomeModule } from './home/home.module'; 
import { FeaturesModule } from './features/features.module'; 


import { LandingModule } from './landing/landing.module'; 

import { RecipesModule } from './recipes/recipes/recipes.module'; 
import { MyRecipesModule } from './recipes/myrecipes/myrecipes.module'; 
import { FavouritesModule } from './recipes/favourites/favourites.module'; 
import { RecipedetailsModule } from './recipes/recipedetails/recipedetails.module'; 
import { RecipesubmitModule } from './recipes/recipesubmit/recipesubmit.module'; 
import { RecipesmodifyModule } from './recipes/recipesmodify/recipesmodify.module'; 
import { SearchresultsModule } from './searchresults/searchresults.module'; 

import { TestimonialsModule } from './testimonials/testimonials.module'; 

import { PlannerlistModule } from './planner/plannerlist/plannerlist.module'; 
import { PlannercreateModule } from './planner/plannercreate/plannercreate.module'; 
import { PlancreateModule } from './planner/plancreate/plancreate.module'; 
import { PlancreatemModule } from './planner/plancreatem/plancreatem.module'; 
import { PlanviewModule } from './planner/planview/planview.module';

import { ScheduleModule } from './planner/schedule/schedule.module'; 
import { TrendingModule } from './planner/trending/trending.module'; 


import { PricingModule } from './pricing/pricing.module'; 
import { OurteamModule } from './ourteam/ourteam.module'; 
import { MyinfoModule } from './myinfo/myinfo.module'; 
import { PreferencesModule } from './preferences/preferences.module'; 

import { AutherizeModule } from './autherize/autherize.module'; 
import { BenefitsModule } from './benefits/benefits.module'; 
import { CalculateModule } from './calculate/calculate.module'; 
import { PasslostModule } from './password/passlost/passlost.module';

import { ResetpassModule } from './password/resetpass/resetpass.module';

import { ModalModule } from './shared/modules'; 

import { QuestionnaireModule } from './questionnaire/questionnaire.module'; 
import { ProgressModule } from './progress/progress.module'; 
import { RecipebooksModule } from './recipes/recipebooks/recipebooks.module'; 
import { RecipebookModule } from './recipes/recipebook/recipebook.module';
import { RecipebookviewModule } from './recipes/recipebookview/recipebookview.module';
import { FaqsModule } from './faqs/faqs.module';  


import { CollectionsModule } from './groups/collections/collections.module'; 
import { CollectionModule } from './groups/collection/collection.module';

import { GroupsModule } from './groups/groups/groups.module'; 
import { GroupModule } from './groups/group/group.module';


import { PrivacyModule } from './privacy/privacy.module';
import { TermsModule } from './terms/terms.module';


import { LazyLoadImageModule } from 'ng-lazyload-image'; 

import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import {environment} from "../environments/environment";

import { AdminModule } from './admin/admin.module'; 


//import { HashLocationStrategy, LocationStrategy } from '@angular/common';
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
		timeOut:5000,
		positionClass: 'toast-top-full-width',
		preventDuplicates: true,
		closeButton: true
	}),

//	AngularFontAwesomeModule,
	HttpClientModule,
	NgbModule.forRoot(),	
	//HighchartsChartModule,
	HomeModule,
	FeaturesModule,
	RecipesModule,
	RecipesmodifyModule,
//	ApproveModule,
	MyRecipesModule,
	FavouritesModule,
	RecipedetailsModule,
	RecipesubmitModule,
	TestimonialsModule,
	PlannerlistModule,
	PlannercreateModule,
	PlancreateModule,
	PlancreatemModule,
	PlanviewModule,
	ScheduleModule,
	TrendingModule,
	PricingModule,
	OurteamModule,
	ModalModule,
	MyinfoModule,
	AutherizeModule,
	PasslostModule, 
	ResetpassModule,
	//HighchartsChartModule,
	QuestionnaireModule,
	ProgressModule,
	RecipebooksModule,
	RecipebookModule,
	RecipebookviewModule,
	FaqsModule,
	LazyLoadImageModule,
	SocialLoginModule,
	CollectionsModule,
	CollectionModule,
	GroupsModule,
	GroupModule,
	PrivacyModule,
	TermsModule,
	CalculateModule,
	AdminModule,
	PreferencesModule,
	SearchresultsModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.google_clientId
            //  '933469234487-bqim9o4ts1ce5lujmpthvd370qhe7iir.apps.googleusercontent.com'
            )
          },
           {
    		id: FacebookLoginProvider.PROVIDER_ID,
			provider: new FacebookLoginProvider(environment.facebook_appid)
    		//provider: new FacebookLoginProvider('286839523118020')
    		//provider: new FacebookLoginProvider('541089030229736')
    		
  			}
        ]
      } as SocialAuthServiceConfig,
    }    ],
  bootstrap: [AppComponent]
})
export class AppModule { }



