import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
declare var $: any;


@Component({
	selector: 'app-benefits',
	templateUrl: './benefits.component.html',
	styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent implements OnInit {
	stepsList: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {

	this.stepsList = [];

		this.stepsList.push({"label":"Features", "subtitle":"Recipe Suggestions", "image":"assets/images/temp-images/main-recipe3.jpg", "description":"With over 50 thousand recipes available, we assure you that you won’t run out of options to choose from. Even more, dieticians from across the world continue to add recipes to this bundle."});

		this.stepsList.push({"label":"Choose", "subtitle":"Calculators","image":"assets/images/temp-images/new-var2.jpg", "description":"Easily calculate and save your BMI (Body Mass Index), BMR (Basal Metabolic Rate), BFP (Body Fat Percentage) using our app. Moreover, the calorie counter automatically calculates your calorie intake of the day and makes changes to the above."});

		this.stepsList.push({"label":"Design", "subtitle":"Progress Tracker","image":"assets/images/temp-images/steps-tab1.jpg", "description":"Progress graphs show number of steps taken, calories burned, distance covered, weight changes, blood pressure and BMI fluctuations calculated per day. The tracker allows you to compare this data for 15 days in one sight."});

		/*this.stepsList.push({"label":"Design", "subtitle":"Image Transformation","image":"assets/images/temp-images/Meal-Planning.jpg", "description":"Just take a snapshot of your face and have us detect your current BMI. From here, the image transformation feature allows you to look at a future, healthier version of you with the desired BMI."});*/





	
	}
}

	