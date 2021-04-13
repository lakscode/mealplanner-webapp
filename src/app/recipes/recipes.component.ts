import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { constants } from '../jsonfiles/constants';
//declare var $: any;

@Component({
	selector: 'app-recipes',
	templateUrl: './recipes.component.html',
	styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
	recipesList: Array<any> = [];
	recipesList1: Array<any> = [];
	recipesList2: Array<any> = [];
	routeParams: any;
	currentUser: any;
	searchparam: any ; 
	ratingIds: any;
	ratingsArr: Array<any> = [];
	listorgrid: any = {};
	private onDestroy$: Subject<void> = new Subject<void>();
	dietLabelsList: Array<any> = [];
	healthlabelsList: Array<any> = [];
	mineralsLabelsList: Array<any> = [];
	searchmorebar: boolean = false;
	animClass: any = "";
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}
	toggleMore() {
		this.searchmorebar = !this.searchmorebar;
		if (this.searchmorebar)
			this.animClass = "searchbaranim";
	}
	ngOnInit() {
		this.searchmorebar = false;
		this.dietLabelsList = constants.dietLabels;
		this.healthlabelsList = constants.healthLabels;
		this.mineralsLabelsList = constants.minerals;
		this.listorgrid = {"menu":"list", "panel":"listing-list"}
	 $('.listing-buttons span').on("click",function(){
        $('.listing-buttons span').removeClass("current");
        if( $(this).hasClass("grid")){
            $(this).addClass("current");
            if($(".recipe-listing").hasClass("listing-list")){
                $(".recipe-listing").removeClass("listing-list").addClass("listing-grid");
            }

        }
        if( $(this).hasClass("list")){
            $(this).addClass("current");
            $(".recipe-listing").removeClass("listing-grid").addClass("listing-list");

        }
    });


		this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
		

		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
		  console.log( this.currentUser["displayname"]);
		}
	  
	 
	  this.searchparam = {"q":"", "range":{}}
	
  
	  this.routeParams = {};
	 	this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	  //  console.log(params);   
		this.routeParams = params;     
		if (typeof (this.routeParams.details) !== "undefined") {
		  console.log(this.routeParams.details);
		}    
		 if (typeof (this.routeParams.dietLabels) !== "undefined" && this.routeParams.dietLabels !== "") {
		  this.searchparam["q"] = this.routeParams.dietLabels;
		}   
		console.log(this.routeParams);
	  this.loadRecipes();
	 }); 

//this.loadRecipes()
	
	}

	loadTempRecipes()
    {
      this.recipesList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/listing-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

      this.recipesList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/listing-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});



      this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});


	  this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-4.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

	  this.recipesList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/listing-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

      this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

    }

	loadRecipes()
	{
	  this.recipesList1 = [];
	  this.recipesList2 = [];
	// this.recipes = recipesList;
	 var params = {"limit": "30"};
   //  params["caloriesfrom"] = this.searchparam.range.lower;
	// params["caloriesto"] = this.searchparam.range.upper;
	 console.log(this.searchparam);
	
  
	  if(typeof(this.routeParams["dietLabels"]) !== "undefined" && this.routeParams["dietLabels"] !== null && this.routeParams["dietLabels"] !== "")
	  {
		params["content"] = this.routeParams["dietLabels"];
	  }
  
	  params["instructions"] = "notempty";
  
	  console.log(JSON.stringify(params));
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	  console.log(invData);
  
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
		  this.recipesList1 = [];
		  this.recipesList2 = [];

		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			  if(i < invData["body"]["length"]/2)
			this.recipesList1.push(invData["body"][i]);
			else 
			this.recipesList2.push(invData["body"][i]);

			this.ratingIds += invData["body"][i]["id"] + ",";
		  }
		  console.log(this.recipesList1);
		  console.log(this.recipesList2);
		  this.loadRatings();
		}
	  }
	
	 ));
  
	}



	loadRatings()
	{
	  if(this.ratingIds !== "")
	  {			
	   this.ratingIds = this.ratingIds.substring(0, this.ratingIds.length-1);
	  }
	 
		var params = {"limit": 100};
	   
		params["query"] = "SELECT count(rating) as totalcount, sum(rating) as totalrating, recipeid FROM `rating` where recipeid in (" + this.ratingIds + ") group by recipeid";
		var res =   this.dbService.getDatabyTablebyQuery("rating", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		  if(invData !== null)
		  {
			if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
			{
			  var temp = invData["body"];
			  if(temp["length"] > 0)
			  {
				this.ratingsArr = [];
				for(let i=0; i< temp["length"] ; i++)
				{
				  this.ratingsArr.push(temp[i])
				  console.log(temp[i]);
				  var recIndex = this.recipesList1.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				  console.log(recIndex);
				  if(recIndex > -1)
				  {
					this.recipesList1[recIndex]["totalcount"] = temp[i]["totalcount"];
					this.recipesList1[recIndex]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList1[recIndex]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));
					 }
  
				  }
  
				  var rec1Index = this.recipesList2.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				  console.log(rec1Index);
				  if(rec1Index > -1)
				  {
					this.recipesList2[rec1Index]["totalcount"] = temp[i]["totalcount"];
					this.recipesList2[rec1Index]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList2[rec1Index]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));
					 }
  
				  }
  
				}
				console.log(this.ratingsArr);
				console.log(  this.recipesList2);
			  }
			}
	
		  }
		}));
	 
	  
	  
	}


	limitTo(str, num)
	{
		return this.helpService.limitTo(str, num) + "...";
	}

	formatImage(image, type)
	{
	//  console.log(image);
	  var retImage = image;
	  if(image !== "" && type !== "")
	  {
		retImage = this.helpService.formatImage(image, type);
		
	  }
	//  console.log(retImage);
	  return retImage;
	}

	setListorGrid(opt)
	{
		//		this.listorgrid = {"menu":"", "panel":"listing-grid"}
		console.log(this.listorgrid);
		this.listorgrid["menu"] = opt;
		this.listorgrid["panel"] = "listing-" + opt;
	}

	searchPanelDisplay(){
	 var searchId = document.getElementById('searchPanel');
       if(searchId.style.display == 'block')
          searchId.style.display = 'none';
       else
          searchId.style.display = 'block';
	}
	setFLU(str)
	{
		var retValue = str;
		if(str !== "")
		{
			retValue = this.helpService.setInputFirstToUppercase(str);
		}
		return retValue;
	}
	searchProps()
	{
		
	}
}

	