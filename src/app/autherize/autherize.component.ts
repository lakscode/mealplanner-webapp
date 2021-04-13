import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';


@Component({
	selector: 'app-autherize',
	templateUrl: './autherize.component.html',
	styleUrls: ['./autherize.component.scss']

})
export class AutherizeComponent implements OnInit {
	teamList: Array<any> = [];
	client_id: any = "22CD3C";
	client_secret: any = "7a6589aacf59d40e7dfbb6442e57336b";
	redirect_url: any = "http://localhost:4200/autherize";
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.loadDataCode();
	}

	loadData()
	{
		var url = window.location.href;
		//getting the access token from url 
		var access_token = url.split("#")[1].split("=")[1].split("&")[0]; 
		// get the userid 
		var userId = url.split("#")[1].split("=")[2].split("&")[0]; 
		console.log(access_token); 
		console.log(userId);
		this.refreshToken(access_token)
	}
	loadDataCode()
	{
		var url = window.location.href;
		//getting the access token from url 
		var access_token = url.split("?")[1].split("=")[1].split("&")[0]; 
		// get the userid 
	//	var userId = url.split("#")[1].split("=")[2].split("&")[0]; 
		console.log(access_token); 
	//	console.log(userId);
		this.refreshToken(access_token)
	}
	refreshToken(access_token)
	{
		var url = "https://api.fitbit.com/oauth2/token";

        var strBody = "client_id=" + this.client_id + "&grant_type=authorization_code&redirect_uri=" + this.redirect_url + "&code=" + access_token;
        console.log(strBody);

        fetch(url, {
            method: "POST",
            body: strBody,
            headers: {
            'Authorization': 'Basic ' + "MjJDRDNDOjdhNjU4OWFhY2Y1OWQ0MGU3ZGZiYjY0NDJlNTczMzZi",
            "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json));
	}
}

	