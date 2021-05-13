import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FlexLayoutModule,
	FormsModule,
	ReactiveFormsModule,
	SocialLoginModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
