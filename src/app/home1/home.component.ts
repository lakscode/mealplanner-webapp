import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HelpService } from '../services/help.service';

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
isMobile: boolean = false;
images: any;

  constructor(private router: Router, private modalService: ModalService,  private helpService: HelpService) {
	this.labels={"companyName":this.helpService.getConstants("companyName")};

	}

  	ngOnInit() {
		  this.images = {};
		  this.images["appstore"]  = "assets/app-store.png"; 
		  this.images["playstore"]  = "assets/play-store.png";
		  this.images["mobilescreens"] ="assets/mtc_s.jpg";
		  this.images['goodfood']  = "assets/images/temp-images/good-food.jpg";

		//console.log("Home NgOninit");
		this.loadSteps(); 
	//	this.loadTestimonials();
		this.isMobile = this.helpService.isMobile();
		//console.log(this.isMobile);
		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
			this.userName = this.currentUser;
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
		//  //console.log(this.currentUser["displayname"]);
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
/*
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
		//console.log(this.testimonialsList);
	}
	*/

	gotopage(page)
	{
		this.router.navigate([page]);	
	}

	openModal(id)
	{

		this.popupforquestions  = true;
		//console.log(this.popupforquestions);
	}

	closeModal(id)
	{
		this.modalService.close(id);
	}
}


