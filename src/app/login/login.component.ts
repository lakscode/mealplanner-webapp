import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';

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
	errorMessage: any = false;
	routeParams: any = {};
	userDatadetail: any = {};
	loginForm: FormGroup;
	submitted = false;
	userObj:any;
	users: any;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
		this.userName = ""; this.passWord = "";

		this.userObj={"username":"","password":""};
	}

	ngOnInit() {
		this.rememberMe = true;
		this.users = JSON.parse(sessionStorage.getItem("user"));
		this.redirecturl = "";
		//	let token = this.route.params
		if (typeof (this.users) !== "undefined" && this.users !== null) {
			if (typeof (this.users["_id"]) !== "undefined") {
				if (this.users["_id"] != "") {
					this.router.navigate(['dashboard']);
				}
			}
		}
		if (typeof (this.route.params["_value"]) !== "undefined") {
			this.routeParams = this.route.params["_value"];
			if (typeof (this.routeParams.redirectUrl) !== "undefined") {
				this.redirecturl = decodeURI(this.routeParams.redirectUrl);
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
		console.log("in login");
		this.submitted = true;
		// stop here if form is invalid
	//	if (this.loginForm.invalid) {
	//		return;
	//	}
		if (this.rememberMe === true) {
			localStorage.setItem('rememberEmail', this.loginForm.value.username);
		} else {
			localStorage.setItem('rememberEmail', "");
			this.rememberMe = false;
		}
	
		var params = {'username':  this.userObj.username, 'emailphone':this.userObj.username}
		console.log(params);
		this.dbService.checkIfExists("users", params).subscribe(userDataObj => setTimeout(() => {
			
			console.log(userDataObj);
			if (userDataObj['body']['length'] > 0) {
				var userData = userDataObj['body'][0];
				console.log(userData);
				var pass = this.helpService.decryptPass(userData["password"]);  //this.loginForm.value.passWord 
				console.log(pass);
				console.log( userData["password"]);
				console.log(this.userObj.password.trim() );
				if(pass == this.userObj.password.trim() || userData["password"] == this.userObj.password.trim() )
				{
					delete userData["password"];
					sessionStorage.setItem("currentUser", JSON.stringify(userData));
					let username = this.userService.setUser(userData);
				}	
				else 
				{
					this.router.navigate(['login']);
					this.errorMessage = "Invalid Username and Password";
					return;
				}
			}
			else {
				this.router.navigate(['login']);
				this.errorMessage = "Invalid Username and Password";
				return;
			}
			
			if (this.redirecturl == "")
			{
				this.router.navigate(['landing1']);
			}
			else {
				this.router.navigate([this.redirecturl]);;
			}
		}));
		
	}
	closeerror()
	{
		this.errorMessage = "";
		this.loginForm.patchValue({ passWord: ""});
	}
	forgot() {
		this.router.navigate(['forgot-password']);

	}
	signup()
	{
		this.router.navigate(['register']);
	}
}