import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionnaireComponent } from './questionnaire.component';

const routes: Routes = [
  { 
    path: 'questionnaire', 
    component:  QuestionnaireComponent,
    data: { showSidebar: false } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  QuestionnaireRoutingModule { }
