import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
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




  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private helpService: HelpService, private dbService: DBService, private config: NgbCarouselConfig) {
	this.labels={"companyName":this.helpService.getConstants("companyName")};
	config.interval = 8000;
	config.showNavigationIndicators = true;
	config.showNavigationArrows = true; 
	}

  	ngOnInit() {

		this.loadSteps(); 
		this.loadTestimonials();
    	this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			if (userdata !== null && typeof (userdata['loggedIn']) !== "undefined") {
				if (userdata['loggedIn'] == false) {
				//	this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
				else if (userdata['loggedIn'] == true) {
					this.userName = userdata;
					//window.location.href="/landing1";
				}
				else {
				//	this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
			}
		}, 0));
  
	}


	loadSteps()
	{
		this.stepsList = [];

		this.stepsList.push({"label":"Features", "subtitle":"Recipe Suggestions", "image":"assets/images/temp-images/main-recipe3.jpg", "description":"With over 50 thousand recipes available, we assure you that you won’t run out of options to choose from. Even more, dieticians from across the world continue to add recipes to this bundle."});

		this.stepsList.push({"label":"Choose", "subtitle":"Calculators","image":"assets/images/temp-images/new-var2.jpg", "description":"Easily calculate and save your BMI (Body Mass Index), BMR (Basal Metabolic Rate), BFP (Body Fat Percentage) using our app. Moreover, the calorie counter automatically calculates your calorie intake of the day and makes changes to the above."});

		this.stepsList.push({"label":"Design", "subtitle":"Progress Tracker","image":"assets/images/temp-images/steps-tab1.jpg", "description":"Progress graphs show number of steps taken, calories burned, distance covered, weight changes, blood pressure and BMI fluctuations calculated per day. The tracker allows you to compare this data for 15 days in one sight."});

		/*this.stepsList.push({"label":"Design", "subtitle":"Image Transformation","image":"assets/images/temp-images/Meal-Planning.jpg", "description":"Just take a snapshot of your face and have us detect your current BMI. From here, the image transformation feature allows you to look at a future, healthier version of you with the desired BMI."});*/


	}

	loadTestimonials()
	{
		this.testimonialsList = [];
		var count = 0;
		var child = [];
		for(let i=0; i < 10; i++)
		{
			
			if(count < 3)
			{
				child.push({"id":i, 
				"name":"Andrew Neel " + i, 
				"image":"assets/images/temp-images/white-bg.jpg",
				"testimonial":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore " + i,
				"location":"Bangalore",
				"created_at":""})
				count++;
			}
			else
			{
				var temp = JSON.parse(JSON.stringify(child));
				this.testimonialsList.push({"id":i,"child": temp});
				child = [];
				count = 0;
			}
		
		}
		console.log(this.testimonialsList);
	}

	gotopage(page)
	{
		this.router.navigate([page]);	
	}
}


