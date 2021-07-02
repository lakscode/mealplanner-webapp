import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
	pathMatch: 'full' 
  },
 {
    path: 'home',
    component: HomeComponent
  }, 
  {
    path: "home",
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  /*{ 
    path: 'autherize', 
    loadChildren: './autherize/autherize.module#AutherizeModule'
  }, */
  { 
    path: 'benefits',   
    //loadChildren: './benefits/benefits.module#BenefitsModule'
    loadChildren: () => import('./benefits/benefits.module').then(m => m.BenefitsModule)
  },
   { 
    path: 'faqs', 
   // loadChildren: './faqs/faqs.module#FaqsModule',
    loadChildren: () => import('./faqs/faqs.module').then(m => m.FaqsModule)

  },
  /*  { path: 'features', 
loadChildren: './features/features.module#FeaturesModule'
},
{ 
    path: 'landing', 
    loadChildren: './landing/landing.module#LandingModule'
  },
   { 
    path: 'login',   
    loadChildren: './login/login.module#LoginModule'
  },
   { 
    path: 'myinfo',   
    loadChildren:'./myinfo/myinfo.module#MyinfoModule'
  },
   { 
    path: 'ourteam', 
    loadChildren: './ourteam/ourteam.module#OurteamModule'
  },
  { path: 'forgot-password',
   loadChildren: './password/passlost/passlost.module#PasslostModule'
   },
    { path: 'resetpassword', 

  loadChildren: './password/resetpass/resetpass.module#ResetpassModule'
 },
  { 
    path: 'plancreate', 
    loadChildren: './planner/plancreate/plancreate.module#PlancreateModule'
    
  },
  { 
    path: 'plan-createm', 
    loadChildren: './planner/plancreatem/plancreatem.module#PlancreatemModule'
    
  },  
   { 
    path: 'plan-list', 
    loadChildren:'./planner/plannerlist/plannerlist.module#PlannerlistModule'
  },
    { 
    path: 'schedule', 
    loadChildren: './planner/schedule/schedule.module#ScheduleModule'
    },
    { 
    path: 'trending/:id', 
    loadChildren:'./planner/trending/trending.module#TrendingModule'
  },
   { 
    path: 'pricing', 
    loadChildren:'./pricing/pricing.module#PricingModule'
  },
   { 
    path: 'progress', 
    loadChildren: './progress/progress.module#ProgressModule'
  },
   { 
    path: 'questionnaire', 
    loadChildren: './questionnaire/questionnaire.module#QuestionnaireModule'
  },
   { 
    path: 'collections', 
    loadChildren: './groups/collections/collections.module#CollectionsModule'
  },
   { 
    path: 'collection', 
    loadChildren: './groups/collection/collection.module#CollectionModule'
  },
   { 
    path: 'favourites', 
    loadChildren: './recipes/favourites/favourites.module#FavouritesModule'
  },
   { 
    path: 'myrecipes', 
    loadChildren: './recipes/myrecipes/myrecipes.module#MyRecipesModule'
  },
    { 
    path: 'recipebook', 
    loadChildren: './recipes/recipebook/recipebook.module#RecipebookModule'
  },
   { 
    path: 'recipebooks', 
    loadChildren: './recipes/recipebooks/recipebooks.module#RecipebooksModule'
  },
   { 
    path: 'recipedetails/:id', 
    loadChildren: './recipes/recipedetails/recipedetails.module#RecipedetailsModule'
  },
  { 
    path: 'recipes', 
    loadChildren:'./recipes/recipes/recipes.module#RecipesModule'
  },
   { 
    path: 'recipesubmit', 
    loadChildren:'./recipes/recipesubmit/recipesubmit.module#RecipesubmitModule'
  },
  {
    path: 'signup',
    loadChildren:'./signup/signup.module#SignupModule'
  },
    { path: 'testimonials', 
  loadChildren: './testimonials/testimonials.module#TestimonialsModule'
} */
];

@NgModule({
  imports: [FormsModule, RouterModule.forRoot(routes,{ useHash: true,scrollPositionRestoration: 'top', enableTracing: false, onSameUrlNavigation:"reload"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

/* 
scrollPositionRestoration: 'enabled',
*/