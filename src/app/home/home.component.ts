import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
userName: any;
labels:any;
healthLabels: Array<any> = [];
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private helpService: HelpService, private dbService: DBService) {
	this.labels={"companyName":this.helpService.getConstants("companyName")};
	}

  ngOnInit() {
	  this.loadHealthLabels();
    this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			if (userdata !== null && typeof (userdata['loggedIn']) !== "undefined") {
				if (userdata['loggedIn'] == false) {
				//	this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
				else if (userdata['loggedIn'] == true) {
					this.userName = userdata;
				}
				else {
				//	this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
			}
		}, 0));
  
}
loadHealthLabels()
{
this.healthLabels = [];

this.healthLabels.push({"label":"7 Week Meal Plan", "image":"assets/images/temp-images/listing-1.jpg"});
this.healthLabels.push({"label":"Low-Carb", "image":"assets/images/temp-images/listing-2.jpg"});
this.healthLabels.push({"label":"Gluten-Free", "image":"assets/images/temp-images/listing-3.jpg"});
this.healthLabels.push({"label":"Pescatarian", "image":"assets/images/temp-images/listing-1.jpg"});
this.healthLabels.push({"label":"Vegetarian", "image":"assets/images/temp-images/listing-2.jpg"});
this.healthLabels.push({"label":"Vegan", "image":"assets/images/temp-images/listing-3.jpg"});

}
}


