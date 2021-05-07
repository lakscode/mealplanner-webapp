import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../shared/modules/modal/modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
userName: any;
labels:any;
currentUser: any;
stepsList: Array<any> = [];
testimonialsList: Array<any> = [];

popupforquestions: boolean =false;


  constructor(private router: Router, private modalService: ModalService, private route: ActivatedRoute, private userService: UserService, private helpService: HelpService, private dbService: DBService, private config: NgbCarouselConfig) {
	this.labels={"companyName":this.helpService.getConstants("companyName")};
	config.interval = 8000;
	config.showNavigationIndicators = true;
	config.showNavigationArrows = true; 
	}

  	ngOnInit() {

		this.loadSteps(); 
		this.loadTestimonials();

		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
			this.userName = this.currentUser;
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
		//  console.log(this.currentUser["displayname"]);
		}

		/*
    	this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			if (userdata !== null && typeof (userdata['loggedIn']) !== "undefined") {
				if (userdata['loggedIn'] == false) {
				//	this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
				else if (userdata['loggedIn'] == true) {
					this.userName = userdata;
					this.currentUser = userdata;
					//window.location.href="/landing1";
				}
				else {
				//	this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
			}
		}, 0));
		*/
	}


	loadSteps()
	{
		this.stepsList = [];

		this.stepsList.push({"label":"Select", "subtitle":"Healthy Recipes", "image":"assets/images/listing-1.jpg", "description":"We've got hundreds of delicious recipes for every taste and dietary preference. Browse them all using our search and filter tools. Choose the ones that are right for you."});

		this.stepsList.push({"label":"Design", "subtitle":"Meal Plan","image":"assets/images/balance-meals-z.jpg", "description":"Use our meal planning tool to add recipes to your weekly meal plan. It's as simple as drag and drop (or select and place on mobile). You can add as many recipes to your calendar as you want."});

		this.stepsList.push({"label":"Gather and Cook", "subtitle":"Meal Plan","image":"assets/images/meal-planning1.jpg", "description":"For the meal plan of your choice, get a customized grocery shopping list. Gather the ingredients and prepare your healthy happy meal. Enjoy the delicacy while we help to keep a track of your daily calorie intake."});


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

	openModal(id)
	{

		this.popupforquestions  = true;
		console.log(this.popupforquestions);
	}

	closeModal(id)
	{
		this.modalService.close(id);
	}
}


