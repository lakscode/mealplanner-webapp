import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	userName: string;
	rememberMe: any = false;
	rememberName: string;
	passWord: string;
	redirecturl: any;
	errorMessage: any;
	routeParams: any = {};
	userDatadetail: any = {};
	loginForm: FormGroup;
	submitted = false;
	userObj:any;
	users: any;
	errorPassMatch: any;
	errorLogin: any;
	socialUser: SocialUser;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder,  private socialAuthService: SocialAuthService) {
		this.userName = ""; this.passWord = "";
			this.errorPassMatch = "";

		this.userObj={"username":"","password":""};
	}

	ngOnInit() {
	this.errorMessage = "";

	 this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      //this.isLoggedin = (user != null);
      console.log(this.socialUser);
        var params = {
          "username":this.socialUser.name,
          "email":this.socialUser.email,
          "social_id": this.socialUser.id,
          "social_provider": "google"

        }
        console.log(params);
        var params1 = {'email':  this.socialUser.email};

		this.dbService.checkIfExists("users", params1).subscribe(userDataObj => setTimeout(() => {
			console.log(userDataObj);
			if (userDataObj['body']['length'] > 0) {
			var userDataSocial = userDataObj['body'][0];
			if(userDataSocial["social_id"] == "") {
			 var params2 = {};
			
            params2["social_id"] = this.socialUser.id;
            params2["social_provider"] = "google";
      
           var res =   this.dbService.updateDataByTable("users", params2).subscribe(invData => setTimeout(() => 
            {
            console.log("successfully updated");

            }));
            }else {
            
            sessionStorage.setItem("currentUser", JSON.stringify(userDataSocial));
					let username = this.userService.setUser(userDataSocial);
					this.gotopage("landing");
            }
            }
            
            else {

              var res =   this.dbService.postData("users", params).subscribe(invData => setTimeout(() => 
        {
          console.log(invData);
          if(invData !== null)
          {
            if(typeof(invData["result"]) !== "undefined" && invData["result"] == "success")
            {
              console.log("user has been successfully ceated");
              var parent = this;
                setTimeout(function(){
                // sessionStorage.setItem("currentUser", JSON.stringify(invData));
					//let username = this.userService.setUser(invData); 
                 this.gotopage("landing");
                }, 3000);
            }
          }
        }));

            }
		}));

      
    });


		this.rememberMe = true;
		this.users = JSON.parse(sessionStorage.getItem("user"));
		this.redirecturl = "";
		//	let token = this.route.params
		if (typeof (this.users) !== "undefined" && this.users !== null) {
		
			if (typeof (this.users["id"]) !== "undefined") {
				if (this.users["id"] != "") {
				//	this.gotopage('landing1');
				}
			}
		}
		if (typeof (this.route.params["_value"]) !== "undefined") {
			this.routeParams = this.route.params["_value"];

			if (typeof (this.routeParams.redirecturl) !== "undefined") {
				this.redirecturl = decodeURI(this.routeParams.redirecturl);

			}
		}

		if (this.users !== null && this.users["id"] !== "") {
			if(this.redirecturl !== "")
			{
				this.gotopage(this.redirecturl);
			}
			else
			{
				this.gotopage('landing');
			}
			
		}
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			passWord: ['', Validators.required],
		});

		this.rememberName = localStorage.getItem("rememberEmail");

		if (this.rememberName != null) {
			this.loginForm.patchValue({ username: this.rememberName });
			this.rememberMe = true;
		}
	}
	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}
	isRememberChk(e) {
		this.rememberMe = e.target.checked;
	}

	login() {
		//console.log("in login");
		this.submitted = true;

		if (this.rememberMe === true) {
			localStorage.setItem('rememberEmail', this.loginForm.value.username);
		} else {
			localStorage.setItem('rememberEmail', "");
			this.rememberMe = false;
		}
	
		var params = {'username':  this.userObj.username, 'emailphone':this.userObj.username}

		this.dbService.checkIfExists("users", params).subscribe(userDataObj => setTimeout(() => {
			//console.log(userDataObj);
			if (userDataObj['body']['length'] > 0) {
				var userData = userDataObj['body'][0];
			
				var pass = this.helpService.decryptPass(userData["password"]);  //this.loginForm.value.passWord 
				
				if(pass == this.userObj.password.trim() || userData["password"] == this.userObj.password.trim() )
				{
					delete userData["password"];
					sessionStorage.setItem("currentUser", JSON.stringify(userData));
					let username = this.userService.setUser(userData);
				}	
				else 
				{
					this.gotopage("login"); 
					this.errorMessage = "Invalid Username and Password";
					return;
				}
			}
			else {
				this.gotopage("login"); 
				this.errorMessage = "Invalid Username and Password";
				return;
			}
			//console.log("navigation");
			if (this.redirecturl == "")
			{
				
				this.gotopage("landing");
				
			}
		
		}));
		
	}


  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }


	closeerror()
	{
		this.errorMessage = "";
		this.loginForm.patchValue({ passWord: ""});
	}

	matchPass()
{

	if(this.userObj.password !== this.userObj.confirmpass)
	{
	this.errorPassMatch = "Passwords doesn't match";
	}

}
	clearError(type)
	{

	//	if(type == "signup")
		//this.errorSignup = "";
	}
	forgot() {
		this.gotopage('forgot-password');

	}


gotopage(page){
	this.router.navigate([page]);
	}


}