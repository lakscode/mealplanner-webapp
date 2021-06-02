import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HelpService } from '../services/help.service';

import { ModalService } from '../shared/modules/modal/modal.service';
import { DBService } from '../dbservices/db.service';
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

  constructor(private router: Router, private dbService: DBService,  private modalService: ModalService,  private helpService: HelpService) {
	this.labels={"companyName":this.helpService.getConstants("companyName")};

	}

  	ngOnInit() {
		  this.images = {};
		  this.images["appstore"]  = "assets/app-store.png"; 
		  this.images["playstore"]  = "assets/play-store.png";
		  this.images["mobilescreens"] ="assets/mtc_s.jpg";
		  this.images['goodfood']  = "assets/images/temp-images/good-food.jpg";

		this.loadSteps(); 
		this.loadCommunities();
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



	communitiesList: Array<any> = [];
	loadCommunities()
	{
		 /******** recipes api serach */
  
   
		this.communitiesList = [];
	   // var params = {"limit": 100};
	   // params["createdby"] = this.currentUser["id"];
		console.log(params);
		var params = {"query": "SELECT c.*, COUNT(rm.id) AS recipecount, u.email, u.firstname, u.lastname FROM collection AS c LEFT JOIN recipe_mapping AS rm ON c.id = rm.collection_id LEFT JOIN users AS u ON c.created_by = u.id GROUP BY c.id limit 0, 4"};
  
		var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {
	
		  console.log(invData);
		  if(invData !== null)
		  {
			var obj = invData["body"]["length"];
			console.log(invData["body"]);
			this.communitiesList = invData["body"];
			for(let o=0; o <  this.communitiesList.length; o++)
		  {
			  this.communitiesList[o]["userjoined"] = false;
		  }
			console.log(this.communitiesList);
			this.loaduserCount();
		  }
		}));
	
		
  
	}
	
	loaduserCount()
	{
		/*
	  SELECT c.id, COUNT(cj.id) AS usercount
	  FROM collection AS c
	  LEFT JOIN collection_join AS cj ON c.id = cj.collection_id
	  GROUP BY c.id, cj.collection_id
  
	  */
  
	  console.log("in loadusercount");
	  var params = {"query": "SELECT c.id, COUNT(cj.id) AS usercount 	FROM collection AS c LEFT JOIN  collection_join AS cj ON c.id = cj.collection_id GROUP BY c.id, cj.collection_id LIMIT 0, 4"};
  
	  var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {
  
	   
		if(invData !== null)
		{
		  var obj = invData["body"];
		  for(let o=0; o < obj.length; o++)
		  {
				this.communitiesList[o]["image"] =encodeURI( this.communitiesList[o]["image"]);

			  var fIndex = this.communitiesList.findIndex(x=>(x.id === obj[o]["id"]));
			  
			  if(fIndex > -1)
			  {
			  //	console.log(obj[o]["usercount"])
				  this.communitiesList[fIndex]["userscount"] = obj[o]["usercount"];
				  
			  //	console.log(this.communitiesList[fIndex]["userscount"] );
			  }
		  }
  
		}
		this.loaduserJoinedStatus();
	  }));
  
	}
	loaduserJoinedStatus()
	{
		/*
	  SELECT c.id, COUNT(cj.id) AS usercount
	  FROM collection AS c
	  LEFT JOIN collection_join AS cj ON c.id = cj.collection_id
	  GROUP BY c.id, cj.collection_id
  
	  */
		if( typeof( this.currentUser) !== "undefined" && this.currentUser !== null && typeof( this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null )
		{
	  console.log("in loaduserJoinedStatus");
	  var params = {"query": "SELECT id, collection_id from collection_join where userid = " + this.currentUser["id"] };
  
	  var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {
  
	   
		if(invData !== null)
		{
		  var obj = invData["body"];
		  for(let o=0; o < obj.length; o++)
		  {
		  
			  var fIndex = this.communitiesList.findIndex(x=>(x.id === obj[o]["collection_id"]));
			  
			  if(fIndex > -1)
			  {
			  //	console.log(obj[o]["usercount"])
				  this.communitiesList[fIndex]["userjoined"] = true;
			  //	console.log(this.communitiesList[fIndex]["userscount"] );
			  }
		  }
  
		}
	  }));
	}
	}
	gotoRecipeDetails(page, id){
		if(page == "collection")
		{
		//	this.router.navigate([page, {id:id}]);
		}
		else if(page == "recipedetails")
		{
		//	this.router.navigate([page, id]);
		}
		else if( page == "signup")
		{
			this.router.navigate([page]);
		}
	}

	subscribe: any = {};
	subscribeEmail()
	{
	  console.log(this.subscribe);
	  if(this.subscribe.email)
	  {
		//this.helpService.savesubscribeemail(this.subscribe.email);
		var params={};
		params["email"] = this.subscribe.email;
  
		console.log(params);
		var res =   this.dbService.postDataByTable("subscriptions", params).subscribe(recipeData => setTimeout(() => {
		  console.log(recipeData);
		  
		
		}));	
  
	  }
	  
	}
}


