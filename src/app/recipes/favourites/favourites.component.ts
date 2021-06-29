import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { constants } from '../../jsonfiles/constants';
//declare var $: any;

@Component({
	selector: 'app-favourites',
	templateUrl: './favourites.component.html',
	styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
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
	page_num: any = 0;
	totalPage: any = 0;
	page_length: any = 9;
	displayList: Array<any> = [];
	showpopupflag: boolean = false;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}
	toggleMore() {
		this.searchmorebar = !this.searchmorebar;
		if (this.searchmorebar)
			this.animClass = "searchbaranim";
	}
	ngOnInit() {
		this.searchmorebar = false;
	//	this.dietLabelsList = constants.dietLabels;
		this.dietLabelsList= [];
		for(let d=0; d < constants.dietLabels.length; d++)
		{
			this.dietLabelsList.push({"name":constants.dietLabels[d], "selected":false})
		}

		//this.healthlabelsList = constants.healthLabels;
		this.healthlabelsList= [];
		for(let h=0; h < constants.healthLabels.length; h++)
		{
			this.healthlabelsList.push({"name":constants.healthLabels[h], "selected":false})
		}

		//this.mineralsLabelsList = constants.minerals;
		this.mineralsLabelsList= [];
		for(let m=0; m <constants.minerals.length; m++)
		{
			this.mineralsLabelsList.push({"name":constants.minerals[m], "selected":false})
		}


		this.listorgrid = {"menu":"grid", "panel":"listing-grid"}
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
		this.loadRecipes();
	  this.totalPage = 1;
	 this.page_num = 0;
	 this.page_length = 9;
	 
	
	}

	

	loadRecipes()
	{
	  this.recipesList1 = [];
	  this.recipesList2 = [];
	 var params = {};
 
	 
	  params["query"] = "select id, label, image, healthLabels, s_instructions, dietLabels, calories,s_instructions  from recipes  where id in (select recipeid from favourites where userid ='" + this.currentUser["id"] + "')";
	
	  console.log(JSON.stringify(params));
	 var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
  
	  console.log(invData);
		this.ratingIds = "";
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
		  this.recipesList1 = [];

		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			this.recipesList1.push(invData["body"][i]);
			this.ratingIds += invData["body"][i]["id"] + ",";
		  }
		  this.totalPage = this.recipesList1["length"] /this.page_length;
		  if(this.recipesList1["length"] > (this.totalPage * this.page_length))
		  this.totalPage = this.totalPage+1;
		  this.counter(this.totalPage);
		  console.log(this.recipesList1);
		 
		  this.getDisplayList();
		  this.loadRatings();
		}
	  }
	
	 ));
  
	}

	counter(i: number) {
	
		var num = Math.ceil(i);
		return new Array(num);
	}
	prevPage()
	{
		if(this.page_num > 0)
		{
			this.page_num -= 1;
		}
		this.getDisplayList();
	}
	nextPage()
	{
		
		if(this.page_num > 0 && this.page_num < this.totalPage-1)
		{
			this.page_num += 1;
		}
		this.getDisplayList();
	}
	currentPage(pagenum)
	{
		console.log(pagenum);
		this.page_num = parseInt(pagenum);
		this.getDisplayList();
	}

	getDisplayList()
	{
		
		this.displayList=[];
		var startIndex= this.page_num*this.page_length;
		var endIndex = this.page_length;

		if(startIndex + endIndex > this.recipesList1["length"])
		{
			endIndex = this.recipesList1["length"]-startIndex;
		}

		
		endIndex = startIndex+ endIndex;
		for(let i=startIndex; i < endIndex; i++)
		{
		this.displayList.push(this.recipesList1[i]);
		
		}
	
		window.scrollTo(0, 0);
	}

	loadRatings()
	{
	  if(typeof(this.ratingIds ) !== "undefined" && this.ratingIds !== "")
	  {			
	   this.ratingIds = this.ratingIds.substring(0, this.ratingIds.length-1);
	  }
	 
		var params = {"limit": 100};
	   
		params["query"] = "SELECT count(rating) as totalcount, sum(rating) as totalrating, recipeid FROM `rating` where recipeid in (" + this.ratingIds + ") group by recipeid";
		//console.log(params);
		var res =   this.dbService.getDatabyTablebyQuery("rating", params).subscribe(invData => setTimeout(() => {
	
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
				//  console.log(temp[i]);
				  var recIndex = this.recipesList1.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				//  console.log(recIndex);
				  if(recIndex > -1)
				  {
					this.recipesList1[recIndex]["totalcount"] = temp[i]["totalcount"];
					this.recipesList1[recIndex]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList1[recIndex]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));
					 }
  
				  }
  

  
				}
			//	console.log(this.ratingsArr);
		
			  }
			}
	
		  }
		}));
	 
	  
	  
	}


	limitTo(str, num)
	{
		var retVal = str;
		if(typeof(str) !== "undefined" && str !== "")
		retVal = this.helpService.limitTo(str, num) + "...";
		return retVal;
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

	

	showhidecontent(recipe)
{
	recipe.showpopup = !recipe.showpopup
	for(let r = 0; r < this.displayList.length; r++)
	{
		if(recipe.id !== this.displayList[r]["id"])
		{
			this.displayList[r]["showpopup"] = false;
		}
	}
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


  
	gotoRecipeDetails(id){
	this.router.navigate(['recipedetails', id]);
	}
}

	