import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
declare var $: any;

@Component({
	selector: 'app-pricing',
	templateUrl: './pricing.component.html',
	styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
	packages: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.packages.push({"name":"Standard","duration":"7 Days","payment":"FREE", "currency":"","selected":false, "options":["Try it for 7 Days", "At the end subscribe for", "either <b>Premium</b> or <b>Professional</b> Plan", "to Continue to avail the features."]});
		this.packages.push({"name":"Premium","duration":"Monthly","payment":"9.95", "currency":"dollar","selected":false, "options":[
			"1000 Recipes", 
			"Suggested Meal Plans",
			"Nutrition Details",
			"Calorie Counter",
			"Top up Recipes",
			"Custom Recipe Creation",
			"Activity Tracker"
		]});
		this.packages.push({"name":"Professional","duration":"Monthly","payment":"59.95", "currency":"dollar","selected":false, 
		"options":[
			"Unlimited Recipes ", 
			"Suggested Meal Plans",
			"Nutrition Details",
			"Calorie Counter",
			"Custom Recipe Creation",
			"Client Organiser", 
			"PDF Export of Meal Plan",
			"Activity Tracker"
			]});
		
	
	}

	gotopage(page)
	{
		this.router.navigate([page]);
	//this.router.navigate(["questionnaire"]);
	}
}

	