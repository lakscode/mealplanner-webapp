import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
userName: any;
labels:any;

stepsList: Array<any> = [];
testimonialsList: Array<any> = [];




  constructor(private router: Router, private route: ActivatedRoute, private config: NgbCarouselConfig) {
	 
	}

  	ngOnInit() {

		this.loadSteps(); 
		//this.loadTestimonials();
    	
  
	}


	loadSteps()
	{
		this.stepsList = [];

		this.stepsList.push({"label":"Features", "subtitle":"Recipe Suggestions", "image":"assets/new/food_collection.jpg", "description":"With over 50 thousand recipes available, we assure you that you won’t run out of options to choose from. Even more, Dietitians from across the world continue to add recipes to this bundle."});

		this.stepsList.push({"label":"Choose", "subtitle":"Calculators","image":"assets/new/calculator.jpg", "description":"Easily calculate and save your BMI (Body Mass Index), BMR (Basal Metabolic Rate), BFP (Body Fat Percentage) using our app. Moreover, the calorie counter automatically calculates your calorie intake of the day and makes changes to the above."});

		this.stepsList.push({"label":"Design", "subtitle":"Progress Tracker","image":"assets/new/progress_tracker.jpg", "description":"Progress graphs show number of steps taken, calories burned, distance covered, weight changes, blood pressure and BMI fluctuations calculated per day. The tracker allows you to compare this data for 15 days in one sight."});

	

	}
	gotopage(page)
	{
		this.router.navigate([page]);	
	}
}


