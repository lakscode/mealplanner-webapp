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

		this.stepsList.push({"label":"Features", "subtitle":"Recipe Suggestions", "image":"assets/new/food_collection.jpg", "description":"With over 50 thousand recipes available, we assure you that you won’t run out of options to choose from. Even more, dieticians from across the world continue to add recipes to this bundle."});

		this.stepsList.push({"label":"Choose", "subtitle":"Calculators","image":"assets/new/calculator.jpg", "description":"Easily calculate and save your BMI (Body Mass Index), BMR (Basal Metabolic Rate), BFP (Body Fat Percentage) using our app. Moreover, the calorie counter automatically calculates your calorie intake of the day and makes changes to the above."});

		this.stepsList.push({"label":"Design", "subtitle":"Progress Tracker","image":"assets/new/progress_tracker.jpg", "description":"Progress graphs show number of steps taken, calories burned, distance covered, weight changes, blood pressure and BMI fluctuations calculated per day. The tracker allows you to compare this data for 15 days in one sight."});

		/*this.stepsList.push({"label":"Design", "subtitle":"Image Transformation","image":"assets/new/salad.jpg", "description":"Just take a snapshot of your face and have us detect your current BMI. From here, the image transformation feature allows you to look at a future, healthier version of you with the desired BMI."});*/


	}

/*	loadTestimonials()
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
	}*/

	gotopage(page)
	{
		this.router.navigate([page]);	
	}
}


