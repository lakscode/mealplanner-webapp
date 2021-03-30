import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelperService } from '../services/common';

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
	users: any;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelperService, private formBuilder: FormBuilder) {
		this.userName = ""; this.passWord = "";
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
		this.submitted = true;
		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}
		if (this.rememberMe === true) {
			localStorage.setItem('rememberEmail', this.loginForm.value.username);
		} else {
			localStorage.setItem('rememberEmail', "");
			this.rememberMe = false;
		}
		var params = { "email": this.loginForm.value.username};
		
		console.log(params);
		this.dbService.getDatabyParam("users", params).subscribe(userData => setTimeout(() => {
			console.log(userData);
			if (userData['length'] > 0) {
			var pass;
				//var pass = this.helpService.decrypt(userData[0]["password"]);  //this.loginForm.value.passWord 
				console.log(pass);
				if(pass == this.loginForm.value.passWord.trim() || userData[0]["password"] == this.loginForm.value.passWord.trim() )
				{
					sessionStorage.setItem("currentUser", JSON.stringify(userData[0]));
					let username = this.userService.setUser(userData[0]);
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
				if(typeof(userData[0]["role"]) !== "undefined" && userData[0]["role"] == "DM")
				this.router.navigate(['request']);
				else
				this.router.navigate(['home']);
			}
			else {
				if(typeof(userData[0]["role"]) !== "undefined" && userData[0]["role"] == "DM")
				this.router.navigate(['request']);;
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