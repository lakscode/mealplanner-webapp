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
	mealTypeList: Array<any> = [];
	searchmorebar: boolean = false;
	animClass: any = "";
	page_num: any = 0;
	page_length: any = 10;
	totalPage: any = 0;
	displayList: Array<any> = [];
	nutrientDbFields : Array<any> = [];
	role: any = {};
	showNutrientsFlag: boolean = false;
	cuisineTypeList : Array<any> = [];
	noResult: boolean = false;

	searchFilterLabels: Array<any> = [];
	splitcontent : boolean = false;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}
	toggleMore() {
		this.searchmorebar = !this.searchmorebar;
		if (this.searchmorebar)
			this.animClass = "searchbaranim";
	}
	showLabels(label)
	{
		for(let l=0; l < this.searchFilterLabels.length; l++)
		{
			if( this.searchFilterLabels[l]["label"] == label.label)
			this.searchFilterLabels[l]['selected'] = true;
			else
			this.searchFilterLabels[l]['selected'] = false;
		}
	}
	ngOnInit() {
		console.log("ngOnInit");
		this.searchmorebar = false;
	//	this.dietLabelsList = constants.dietLabels;
		this.getNutrientsMaxMin(); 

		this.searchFilterLabels = [];
		this.searchFilterLabels.push({"label":"Health Labels", "selected":false});
		this.searchFilterLabels.push({"label":"Diet Labels", "selected":false});
		this.searchFilterLabels.push({"label":"Cuisine Type", "selected":false});
		this.searchFilterLabels.push({"label":"Meal Type", "selected":false});
		this.searchFilterLabels.push({"label":"Nutrients", "selected":false});
		this.searchFilterLabels.push({"label":"Calories", "selected":false});

		this.cuisineTypeList = [];
		for(let c=0; c < constants.cusineTypeList.length; c++)
		{
			this.cuisineTypeList.push({"name":constants.cusineTypeList[c], "selected":false})
		}

		this.dietLabelsList= [];
		for(let d=0; d < constants.dietLabels.length; d++)
		{
			this.dietLabelsList.push({"name":constants.dietLabels[d], "selected":false})
		}

		
		this.mealTypeList= [];
		for(let d=0; d < constants.mealTypeList.length; d++)
		{
			this.mealTypeList.push({"name":constants.mealTypeList[d], "selected":false})
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
		  this.role = this.helpService.getRoleStatus(this.currentUser);

		  this.showNutrientsFlag = this.helpService.showorhideNutritions(this.role);
  
		  console.log(this.showNutrientsFlag);
		}
		
	
	  this.totalPage = 1;
	 this.page_num = 0;
	 this.page_length= 12;
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
		this.splitcontent = false;
	  this.searchProps();
	 }); 

//this.loadRecipes()
	
	}

/*

	loadRecipes()
	{
	  this.recipesList1 = [];
	  this.recipesList2 = [];
	// this.recipes = recipesList;
	 var params = {"limit": "100"};
   //  params["caloriesfrom"] = this.searchparam.range.lower;
	// params["caloriesto"] = this.searchparam.range.upper;
	 console.log(this.searchparam);
	
	  if(typeof(this.routeParams["dietLabels"]) !== "undefined" && this.routeParams["dietLabels"] !== null && this.routeParams["dietLabels"] !== "")
	  {
		params["content"] = this.routeParams["dietLabels"];
		this.helpService.saveSearchHistory(params["content"], "text", "recipes", this.currentUser["id"]);
	  }
  
	  params["instructions"] = "notempty";

	 // params["cuisineType"] = "american";
	  params["returnfields"] = " id, label, image, healthLabels,  dietLabels, calories ";
	  console.log(JSON.stringify(params));
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	  console.log(invData);
  
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
		  this.recipesList1 = [];

		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			this.recipesList1.push(invData["body"][i]);
			this.ratingIds += invData["body"][i]["id"] + ",";
		  }
		  this.totalPage = this.recipesList1["length"] / this.page_length;
		  this.counter(this.totalPage);
		  console.log(this.recipesList1);
		 
		  this.getDisplayList();
		  this.loadRatings();
		}
	  }
	
	 ));
  
	}
	*/
	counter(i: number) {
	//	console.log(i);
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
	//	console.log(pagenum);
		this.page_num = parseInt(pagenum);
		this.getDisplayList();
	}

	getDisplayList()
	{
	//	console.log(this.recipesList1);
	//	console.log(this.page_num);
		this.displayList=[];
		var startIndex= this.page_num*this.page_length;
		var endIndex = this.page_length;

		if(startIndex + endIndex > this.recipesList1["length"])
		{
			endIndex = this.recipesList1["length"]-startIndex;
		}

	//	console.log(startIndex);
	//	console.log(endIndex);
endIndex = startIndex+ endIndex;
		for(let i=startIndex; i < endIndex; i++)
		{
		this.displayList.push(this.recipesList1[i]);
		
		}
	//	console.log(this.displayList);
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
		var res =   this.dbService.getDatabyTablebyQuery("rating", params).subscribe(invData => setTimeout(() => {
	//	console.log(invData);
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
  maxcalories: any = "";
  loopCount: any = 0;
	searchProps()
	{

	console.log('searchProps');
 

   var params = {}
   if(this.searchparam.q)
   {
	   console.log(" this.splitcontent " + this.splitcontent);
	   if(this.splitcontent)
	   {
		params["content"] = this.searchparam.q.split(" ").join(",");
		console.log(params['content']);
		this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipes", this.currentUser["id"]);

	   }
	   else
	   {
	   this.loopCount = 0;
		params["content"] = this.searchparam.q;
		this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipes", this.currentUser["id"]);
	   }

   }
   if(typeof(this.searchparam.range) !== "undefined")
   {
    if(typeof(this.searchparam.range.lower) !== "undefined")
    {
      params["caloriesfrom"] = this.searchparam.range.lower;
    }
    if(typeof(this.maxcalories) !== "undefined" && this.maxcalories > 0)
    {
      params["caloriesto"] = this.maxcalories;
    }
    params["instructions"]="notempty";
   }
   
  // params["cuisineType"] = "american";
   params["returnfields"] = " id, label, image, cuisineType, healthLabels, dietLabels, calories, yield";

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
	
	 var cuisinetypes = "";
	 for(let c=0; c <this.cuisineTypeList.length; c++)
	 {
		 if(this.cuisineTypeList[c]["selected"])
		 cuisinetypes += this.cuisineTypeList[c]["name"] + "~";
	 }

	 if( cuisinetypes !== "")
	 {
		cuisinetypes=  cuisinetypes.slice(0, -1);
	 }
	 

	 var minerals = "";
	 var mQuery = "";
	 for(let m=0; m <this.mineralsLabelsList.length; m++)
	 {
		 var item = this.mineralsLabelsList[m];
		// console.log(item);
		 if(this.mineralsLabelsList[m]["selected"])
		 minerals += this.mineralsLabelsList[m]["name"] + "~";
		 if(typeof(item["min"]) !== "undefined" && item["min"] !== "" && item["min"] >0)
              {
                mQuery += " " + item["name"].toLowerCase() + " >= " + item["min"] + " AND ";
              }
              if(typeof(item["max"]) !== "undefined" && item["max"] !== "" && item["max"] >0)
              {
                mQuery += " " + item["name"].toLowerCase() + " <= " + item["max"] + " AND ";
              }

	 }
	 if( minerals !== "")
	 {
		minerals=  minerals.slice(0, -1);
	 }

	 if( mQuery !== "")
	 {
		mQuery=  mQuery.slice(0, -4);
		this.helpService.saveSearchHistory(mQuery, "nutrients", "recipes", this.currentUser["id"]);
	 }
//	 console.log("mQuery");
//	 console.log(mQuery);
	var checkMinerals = false;
 
   if(typeof(dietlabels) !== "undefined" && dietlabels  !== "")
   {
    params["dietLabels"] = dietlabels
	this.helpService.saveSearchHistory(dietlabels, "dietLabels", "recipes", this.currentUser["id"]);
   } 

   if(typeof(healthlabels ) !== "undefined" && healthlabels !== "")
   {
    params["healthLabels"] = healthlabels
	this.helpService.saveSearchHistory(healthlabels, "healthLabels", "recipes", this.currentUser["id"]);
   } 

   if(typeof(cuisinetypes ) !== "undefined" && cuisinetypes !== "")
   {
    params["cuisineType"] = cuisinetypes
	this.helpService.saveSearchHistory(cuisinetypes, "cuisineType", "recipes", this.currentUser["id"]);
   } 

   


   if(typeof(minerals ) !== "undefined" && minerals  !== "")
   {
    params["totalNutrientsne"]="notempty";
    params["digestne"]="notempty";
    checkMinerals = true;
	console.log(minerals);

   } 
     // console.log(params);
   if(mQuery !== "")
	  {

  
	  var params1 = {};

	  var query = "select id, label, image, cuisineType, healthLabels, dietLabels, calories, yield from recipes ";
	  var where = " where status = 1 AND totalNutrients != '' AND digest != ''  AND s_instructions != '' " ;
	  if(this.maxcalories > 0)
	  where +=  " AND calories >= " + this.maxcalories;

	  if(params["content"])
	  {
		  var temp = params["content"].split(",");
		  var tempc= "";
		  for(let t=0; t < temp.length; t++)
		  {
			tempc += " label LIKE '%" + temp[t] + "%' OR ingredientLines LIKE '%" +temp[t] + "%' OR healthLabels LIKE '%" + temp[t] +  "%' OR dietLabels LIKE '%" + temp[t] + "%' OR";
		  }
		  if(tempc !== "")
		  {
			tempc=  tempc.slice(0, -2);
			where +=  " AND ( " + tempc + ")";
		  }
		 
	  }
 
	  if(dietlabels !== "")
	  {
		  var t = dietlabels.split("~");
		  for(let i=0; i < t.length; i++)
		  {
			  where +=  " AND dietLabels LIKE '%" + t[i] + "%'" 
		  }
	  }
	  if(healthlabels !== "")
	  {
		  var t1 = healthlabels.split("~");
		  for(let i=0; i < t1.length; i++)
		  {
			  where +=  " AND healthLabels LIKE '%" + t1[i] + "%'" 
		  }
	  }
	 
	  where += " AND id in (select recipeid from nutrients where " + mQuery +  ")";

	  params1["query"] = query + where + " limit 0, 15";
	  console.log(params1);
    var res =   this.dbService.getDatabyTablebyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
		console.log(invData);
		console.log(invData["body"]["length"]);
		if(invData["body"]["length"] == 0)
		{
			console.log("calling again searchprops");
			this.splitcontent = true;
			this.searchProps();			
		}
		else
		{
			this.splitcontent = false;
			this.formatResult(invData);
		}
	  }));

	  }
  else
  {
	  console.log(params);
	  params['status'] = "1";
	var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		if( invData["body"]["length"] == 0)
		{
			this.splitcontent = true;
			if(this.loopCount < 1){
			this.loopCount++;
			this.searchProps();

			}
			this.noResult =  true;
		}
		else
		{
			this.splitcontent = false;
			this.formatResult(invData);
		}
	  }));
  }

		
	}

	formatResult(invData)
	{
	console.log(invData.count);
		if(invData.count > 0)
		{
		this.noResult =  false;
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
  
		} else {
			this.recipesList1 = [];
			this.noResult =  true;
		}
	}

	gotoRecipeDetails(id){
	this.router.navigate(['recipedetails', id]);
	}

	loadNutrientsMaxMin()
  {
 //   console.log("loadNutrientsMaxMin");
//    console.log(this.mineralsLabelsList);
 //   console.log(this.nutrientDbFields);

    if(this.mineralsLabelsList["length"] > 0 && this.nutrientDbFields["length"] > 0)
    {
  //    console.log(this.mineralsLabelsList);
  //    console.log(this.nutrientDbFields);
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
   ////   console.log(this.mineralsLabelsList);
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
 //   console.log(params1);
   var res =   this.dbService.getDatabyQuery("recipes", params1).subscribe(invData => setTimeout(() => {

//	console.log(invData);
    if(invData["body"]["length"] > 0)
    {
      this.nutrientDbFields = invData["body"];
  //    console.log(this.nutrientDbFields);
    }
   }))
  
  }
  formatVal(str)
  {
	return this.helpService.formatValue(str);
  }

 
	formatValuePServing(str, servings)
  {

    var retVal = this.helpService.formatValuePServing(str, servings);
    return retVal;
  }
  formatlabels(str)
  {
	  var ret = str;
	  if(str !== "")
	  ret = str.replaceAll("~", ", ");

	  return ret;
  }


clearFilters(){
	this.noResult =  false;

	for(let l=0; l < this.searchFilterLabels.length; l++){
		this.searchFilterLabels[l]['selected'] = false;
	}
	
	for(let m=0; m < this.mealTypeList.length; m++){
		this.mealTypeList[m]['selected'] = false;
	}

	for(let m=0; m < this.healthlabelsList.length; m++){
		this.healthlabelsList[m]['selected'] = false;
	}

	for(let m=0; m < this.dietLabelsList.length; m++){
		this.dietLabelsList[m]['selected'] = false;
	}

	for(let m=0; m < this.cuisineTypeList.length; m++){
		this.cuisineTypeList[m]['selected'] = false;
	}

	for(let m=0; m < this.mineralsLabelsList.length; m++){
		this.mineralsLabelsList[m]['selected'] = false;
	}
	this.searchProps();
	this.maxcalories = "";
	this.searchparam = {"q":""};
}

}

	