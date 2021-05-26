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

		this.loadSteps(); 

		this.isMobile = this.helpService.isMobile();

		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
			this.userName = this.currentUser;
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
		}

	}

	loadSteps()
	{
		this.stepsList = [];

		this.stepsList.push({"label":"Select", "subtitle":"Healthy Recipes", "image":"assets/new/search_recipes.jpg", "description":"We've got hundreds of delicious recipes for every taste and dietary preference. Browse them all using our search and filter tools. Choose the ones that are right for you."});

		this.stepsList.push({"label":"Design", "subtitle":"Meal Plan","image":"assets/new/meal_plan.jpg", "description":"Use our meal planning tool to add recipes to your weekly meal plan. It's as simple as drag and drop (or select and place on mobile). You can add as many recipes to your calendar as you want."});

		this.stepsList.push({"label":"Gather and Cook", "subtitle":"Prepare","image":"assets/new/prepare.jpg", "description":"For the meal plan of your choice, get a customized grocery shopping list. Gather the ingredients and prepare your healthy happy meal. Enjoy the delicacy while we help to keep a track of your daily calorie intake."});

	}

	gotopage(page)
	{
		this.router.navigate([page]);	
	}

	openModal(id)
	{
		this.popupforquestions  = true;
	}

	closeModal(id)
	{
		this.modalService.close(id);
	}
}


