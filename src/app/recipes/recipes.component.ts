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
	page_num: any = 0;
	totalPage: any = 0;
	displayList: Array<any> = [];
	nutrientDbFields : Array<any> = [];
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
		this.getNutrientsMaxMin(); 

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
			this.mineralsLabelsList.push({"name":constants.minerals[m], "selected":false,  "unit":"",  "min":"", "max":"", "t_min":"", "t_max":""})
		}

		this.loadNutrientsMaxMin();
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
	  this.totalPage = 1;
	 this.page_num = 0;
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
	  this.searchProps();
	 }); 


	
	}



	loadRecipes(limitstart = 0, limitCount = 10)
	{
	  this.recipesList1 = [];
	
	  
	// this.recipes = recipesList;
	 var params = {"limit": "10"};
   //  params["caloriesfrom"] = this.searchparam.range.lower;
	// params["caloriesto"] = this.searchparam.range.upper;
	 console.log(this.searchparam);
		if( limitstart !== 0)
		{
		params["limitfrom"] = limitstart;
		delete params["limit"];
		}
		if( limitCount !== 10)
		{
			params["limitto"] = limitCount;
			delete params["limit"];
		}

	  if(typeof(this.routeParams["dietLabels"]) !== "undefined" && this.routeParams["dietLabels"] !== null && this.routeParams["dietLabels"] !== "")
	  {
		params["content"] = this.routeParams["dietLabels"];
	  }
  
	  params["instructions"] = "notempty";
	  params["returnfields"] = " id, label, image, healthLabels, s_instructions, dietLabels, calories,s_instructions ";
	  console.log(JSON.stringify(params));
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	  console.log(invData);
	  this.ratingIds ="";
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
		  this.recipesList1 = [];
		  this.displayList =[];
		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			this.recipesList1.push(invData["body"][i]);
			this.displayList.push(invData["body"][i]);
			this.ratingIds += invData["body"][i]["id"] + ",";
		  }
		  this.totalPage = this.recipesList1["length"] /10;
		  this.counter(this.totalPage);
		  console.log(this.recipesList1);
		 
		  //this.getDisplayList();
		  window.scrollTo(0, 0);
		  this.loadRatings();
		}
	  }
	
	 ));
  
	}
	counter(i: number) {
		console.log(i);
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
		
		if(this.page_num > 0 && this.page_num < 9)
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
		console.log(this.recipesList1);
		console.log(this.page_num);
	//	this.displayList=[];
		var startIndex= this.page_num*10;
		var endIndex = 10;

	/*	if(startIndex + endIndex > this.recipesList1["length"])
		{
			endIndex = this.recipesList1["length"]-startIndex;
		}
	*/
		console.log(startIndex);
		console.log(endIndex);
//endIndex = startIndex+ endIndex;
		this.loadRecipes(startIndex, endIndex);
	/*
		for(let i=startIndex; i < endIndex; i++)
		{
		this.displayList.push(this.recipesList1[i]);
		
		}
		*/
		console.log(this.displayList);
	//
	}

	loadRatings()
	{
	  if(typeof(this.ratingIds ) !== "undefined" && this.ratingIds !== "")
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
  

  
				}
				console.log(this.ratingsArr);
		
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


  /******** recipes api serach */

	searchProps()
	{

	console.log('searchProps');
 

   var params = {}
   if(this.searchparam.q)
   {
   params["content"] = this.searchparam.q;
   }
   if(typeof(this.searchparam.range) !== "undefined")
   {
    if(typeof(this.searchparam.range.lower) !== "undefined")
    {
      params["caloriesfrom"] = this.searchparam.range.lower;
    }
    if(typeof(this.searchparam.range.upper) !== "undefined")
    {
      params["caloriesto"] = this.searchparam.range.upper;
    }
    params["instructions"]="notempty";
   }

   params["returnfields"] = " id, label, image, healthLabels, s_instructions, dietLabels, calories";

	 var dietlabels = "";
	 for(let m=0; m <this.dietLabelsList.length; m++)
	 {
		 if(this.dietLabelsList[m]["selected"])
		 dietlabels += this.dietLabelsList[m]["name"] + "~";
	 }
	 if( dietlabels !== "")
	 {
		dietlabels=  dietlabels.slice(0, -1);
	 }

	 var healthlabels = "";
	 for(let m=0; m <this.healthlabelsList.length; m++)
	 {
		 if(this.healthlabelsList[m]["selected"])
		 healthlabels += this.healthlabelsList[m]["name"] + "~";
	 }
	 if( healthlabels !== "")
	 {
		healthlabels=  healthlabels.slice(0, -1);
	 }
	
	 var minerals = "";
	 var mQuery = "";
	 for(let m=0; m <this.mineralsLabelsList.length; m++)
	 {
		 var item = this.mineralsLabelsList[m];
		 if(this.mineralsLabelsList[m]["selected"])
		 minerals += this.mineralsLabelsList[m]["name"] + "~";
		 if(typeof(item["min"]) !== "undefined" && item["min"] !== "" && item["min"] >0)
              {
                mQuery += " " + item["name"]['label'].toLowerCase() + " >= " + item["min"] + " AND ";
              }
              if(typeof(item["max"]) !== "undefined" && item["max"] !== "" && item["max"] >0)
              {
                mQuery += " " + item["name"]['label'].toLowerCase() + " <= " + item["max"] + " AND ";
              }

	 }
	 if( minerals !== "")
	 {
		minerals=  minerals.slice(0, -1);
	 }
	 console.log("mQuery");
	 console.log(mQuery);
	var checkMinerals = false;
 
   if(typeof(dietlabels) !== "undefined" && dietlabels  !== "")
   {
    params["dietLabels"] = dietlabels
   } 

   if(typeof(healthlabels ) !== "undefined" && healthlabels !== "")
   {
    params["healthLabels"] = healthlabels
   } 
   if(typeof(minerals ) !== "undefined" && minerals  !== "")
   {
    params["totalNutrientsne"]="notempty";
    params["digestne"]="notempty";
    checkMinerals = true;
	console.log(minerals);

   } 
  
   console.log(params);
  
    var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {

      console.log(invData);

      if(invData !== null)
      {
        if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
        {
          this.recipesList1 = [];
		  this.ratingIds="";
          var temp = invData["body"];
          if(temp["length"] > 0)
          {
            for(let i=0; i< temp["length"] ; i++)
            {
                this.recipesList1.push(temp[i]);          
				this.ratingIds += temp[i]["id"] + ",";
            }
			this.totalPage = this.recipesList1["length"] /10;
			this.counter(this.totalPage);
          }
         console.log("totalPage " + this.totalPage);
        }
       
		this.getDisplayList();
		this.loadRatings();

      }

    

    }));

		
	}


	gotoRecipeDetails(id){
	this.router.navigate(['recipedetails', id]);
	}

	loadNutrientsMaxMin()
  {
    console.log("loadNutrientsMaxMin");
    console.log(this.mineralsLabelsList);
    console.log(this.nutrientDbFields);

    if(this.mineralsLabelsList["length"] > 0 && this.nutrientDbFields["length"] > 0)
    {
      console.log(this.mineralsLabelsList);
      console.log(this.nutrientDbFields);
      for(let m =0; m < this.mineralsLabelsList["length"]; m++)
      {
        var lbl = this.mineralsLabelsList[m]["name"].toLowerCase();
        if(lbl.indexOf(" ") > -1)
        {
          lbl = lbl.replace(" ", "_");
        }
        
        if(typeof(this.nutrientDbFields[0]["min"+lbl]) !== "undefined" && this.nutrientDbFields[0]["min"+lbl] !== "")
        {
          this.mineralsLabelsList[m]["t_min"] = this.nutrientDbFields[0]["min"+lbl];
        }

        if(typeof(this.nutrientDbFields[0]["max"+lbl]) !== "undefined" && this.nutrientDbFields[0]["max"+lbl] !== "")
        {
          this.mineralsLabelsList[m]["t_max"] = this.nutrientDbFields[0]["max"+lbl];
        }

      }
      console.log(this.mineralsLabelsList);
    }
    else
    {
      setTimeout(() => {
        
        this.loadNutrientsMaxMin();

      },1000);
    }
  }

  getNutrientsMaxMin()
  {
    console.log("getNutrientsMaxMin");
    var params1 = {};
    var nutrientFields = constants.nutrientDbFields;
  //  console.log( params1["query"])
    var query = "";
    for(let i=0; i < nutrientFields.length; i++)
    {
      var lbl = nutrientFields[i];
     
      query += " min(" + lbl + ") min" + lbl +", ";
      query += " max(" + lbl + ") max" + lbl + ", ";
    }
  //  console.log(query);
    query = query.slice(0, -2);
    params1["query"] = "Select " + query + " from nutrients";
    console.log(params1);
   var res =   this.dbService.getDatabyQuery("recipes", params1).subscribe(invData => setTimeout(() => {

	console.log(invData);
    if(invData["body"]["length"] > 0)
    {
      this.nutrientDbFields = invData["body"];
      console.log(this.nutrientDbFields);
    }
   }))
  
  }
  formatVal(str)
  {
	var retVal = str;
	if(str !== "")
	{
	  retVal = Math.ceil(parseFloat(str));
	}
	return retVal;
  }
}

	