import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { PDFService } from '../../services/pdf.service';

import { constants } from '../../jsonfiles/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment} from "../../../environments/environment";

import { ModalService } from './../../shared/modules/modal/modal.service';
@Component({
	selector: 'app-plannercreate',
	templateUrl: './plannercreate.component.html',
	styleUrls: ['./plannercreate.component.scss']
})
export class PlannercreateComponent implements OnInit {

	recipesList: Array<any> = [];
	addRecipeImage: any;
	draggable: any;
	weekDays: Array<any> = [];
	ratingsArr: Array<any> = [];
	ratingIds: any;
	searchparam: any = {};
	mealsList: Array<any> = [];
	plan:any={};
	favouritesList: Array<any> = [];
	routeParams: any;
	private onDestroy$: Subject<void> = new Subject<void>();
	sub: any;
	mealTypeList: Array<any> = [];
	mineralsList: Array<any> = [];
	currentUser: any;
	oldName: any;
	calculateCaloryFlag: boolean = false;
	colorCodes : any = {};
	page_num: any = 0;
	totalPage: any = 0;
	displayList: Array<any> = [];
	pageNosList:  Array<any> = [];
	updatingFlag : boolean = false;
	pageCount: any = 5;
	errorMessage: any = "";
	loadedPlan: boolean  = false;
	totalNutriArr :  Array<any> = [];
	shoppingList:  Array<any> = [];
	filtersOpt: boolean = false;

	dietLabelsList: Array<any> = [];
	healthlabelsList: Array<any> = [];
	mineralsLabelsList: Array<any> = [];
	filtersParams : any = {};
	nutrientDbFields : Array<any> = [];
	showNutrients: boolean = true;
	showImages: boolean = true;
	constructor(private router: Router, private route: ActivatedRoute, private modalService: ModalService, private pdfService: PDFService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
			 this.totalPage = 1;
			 this.pageCount= 5;
			 this.filtersOpt = false;
			 this.showNutrients= true;
	 this.page_num = 1;
this.loadedPlan = false;
		window.addEventListener("scroll", this.scrollFunc);
		this.getNutrientsMaxMin(); 
		
		this.searchparam['q'] = "";
//		this.addRecipeImage = "assets/images/placement_addrecipes@2x.png"
this.addRecipeImage = "assets/images/add-recipe.png"

		this.draggable = "assets/images/icon_draggable_grey.png"
		this.mineralsList= constants.minerals;
		
		
		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
		//  console.log(this.currentUser["displayname"]);
		}
	
		this.mealTypeList = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
		this.recipesList = [];
		this.routeParams = {};
		this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
		//  console.log(params);   
		  this.routeParams = params;     
		  if (typeof (this.routeParams.id) !== "undefined") {
			console.log(this.routeParams.id);
		//	this.plan["mealplanid"] =this.routeParams.id;
			//this.loadRecipe(this.routeParams.id);
		  }   
		 
	   });  


this.loadRecipes("", true)
this.loadWeekDays();
this.loadColorCodes();
	}

	loadWeekDays()
	{
		this.mealsList = [];
		this.mealsList.push({"name":"BreakFast"})
		this.mealsList.push({"name":"Snack 1"})
		this.mealsList.push({"name":"Lunch"})
		this.mealsList.push({"name":"Snack 2"})
		this.mealsList.push({"name":"Dinner"})


		this.weekDays = [];
		/*this.weekDays.push({"name":"Sunday"})
		this.weekDays.push({"name":"Monday"})
		this.weekDays.push({"name":"Tuesday"})
		this.weekDays.push({"name":"Wednesday"})
		this.weekDays.push({"name":"Thursday"})
		this.weekDays.push({"name":"Friday"})
		this.weekDays.push({"name":"Saturday"}) */

		this.weekDays.push({"name":"Day 1"})
		this.weekDays.push({"name":"Day 2"})
		this.weekDays.push({"name":"Day 3"})
		this.weekDays.push({"name":"Day 4"})
		this.weekDays.push({"name":"Day 5"})
		this.weekDays.push({"name":"Day 6"})
		this.weekDays.push({"name":"Day 7"})

		this.loadPlan();
	}
	loadPlan()
	{
		var daysM= [];
		this.plan = {"id":"", "name":"", "tags":"", "days":[], "created_by":"", "created_at":""};
		
		for(let j=0; j< 7; j++)
		{
			daysM= [];
			for(let i=0; i < 5; i++)
			{
				daysM.push({"id":(i+1), "name":this.mealsList[i], "recipe":null});
			}
			this.plan["days"].push({"id":"row" + (j+1), "name":this.weekDays[j]["name"], "meals":daysM})
		}
	
	//	console.log(this.plan);
	
		this.setDefaults();
	}
	setDefaults()
  {
	if(typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== "")
    {
      var params = {};
      params["id"] = this.routeParams.id;
      
      var res =   this.dbService.getDataByTable("mealplan", params).subscribe(mpData => setTimeout(() => {

        console.log(mpData);
        if(mpData !== null)
        {
          if(mpData["body"] !== null && mpData["body"]['length'] > 0)
          {
            this.plan["id"] = mpData["body"][0]["id"];
            this.plan["name"] = mpData["body"][0]["name"];
            this.plan["tags"] = mpData["body"][0]["tags"];
            this.plan["status"] = mpData["body"][0]["status"];
            this.plan["totalweeks"] = mpData["body"][0]["totalweeks"];
            this.plan["mealplanid"] = mpData["body"][0]["id"];
            this.oldName =  this.plan["name"];
            this.loadDaysData();
          }
        }

      }))
    }
 
  }


	searchParam()
	{
	//	console.log(this.searchparam);
	
	}
	loadRecipes(idslist = "", allFlag = true)
	{
	  
		this.ratingIds = "";
	// this.recipes = recipesList;
	  var params = {"limit": "50"}; //{"limit": "10"};
   //  params["caloriesfrom"] = this.searchparam.range.lower;
	// params["caloriesto"] = this.searchparam.range.upper;
	// console.log(this.searchparam);

	 if(idslist == "")
	 {
//params["limit"] =  "10";

	 }
		if(idslist !== "")
		{
		params["idslist"] = idslist;

		}
		else if(typeof(this.searchparam["q"]) !== "undefined" && this.searchparam["q"] !== null && this.searchparam["q"] !== "")
	  {
		params["content"] = this.searchparam["q"];
	  }
  
	//  params["instructions"] = "notempty";
	 params["returnfields"] = " id, label, image, healthLabels,ingredients, s_instructions, dietLabels, totalNutrients, digest,calories,s_instructions ";
	 if(typeof(this.filtersParams.dietlabels) !== "undefined" && this.filtersParams.dietlabels  !== "")
	 {
	  params["dietLabels"] = this.filtersParams.dietlabels
	 } 
  
	 if(typeof(this.filtersParams.healthlabels ) !== "undefined" && this.filtersParams.healthlabels !== "")
	 {
	  params["healthLabels"] = this.filtersParams.healthlabels
	 } 
	  
	  console.log(JSON.stringify(params));
	  this.calculateCaloryFlag = false;
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	//  console.log(invData);
 var count = 0;
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{

			if(allFlag)
			this.recipesList = [];

	
		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			var recIndex = this.recipesList.findIndex(x1 => (x1.id === invData["body"][i]["id"]));
				if(recIndex == -1)
				{
					this.recipesList.push(invData["body"][i]);
				}	
		  }
		  for(let p =0 ; p < this.plan['days']['length']; p++)
		  {
			for(let q =0 ; q < this.plan['days'][p]['meals']['length']; q++)
			{
			//	console.log(this.plan['days'][p]['meals'][q])
				var pItem = this.plan['days'][p]['meals'][q];
				if(pItem["recipe"] !== null  && pItem["recipe"]["id"] !== null)
				{
					var recIndex = this.recipesList.findIndex(x1 => (x1.id === pItem["recipe"]["id"]));
				//	console.log(recIndex);
					if(recIndex > -1)
					{
						this.plan['days'][p]['meals'][q]["recipe"] = JSON.parse(JSON.stringify(this.formatRecipe(this.recipesList[recIndex])));
					}
				}
			}
		  }
		//  console.log(this.recipesList);
	
		//  console.log(this.plan);
		  this.calculateCaloryFlag = true;
		 // this.loadRatings();
	
	 this.totalPage = this.recipesList["length"] /this.pageCount;
	 console.log(this.totalPage);
		  this.getDisplayList();
		  this.counter();
		}
		 
	  }
	
	 ));
  
	}
/*
	counter(i: number) {
		return new Array(i);
	} */
	counter() {
		console.log("pagenum " + this.page_num);
		if(this.totalPage > 3)
		this.pageNosList = [1,2,3];
		else
		if(this.totalPage == 2)
		this.pageNosList = [1,2];
		if(this.page_num > 1)
		{
			this.pageNosList =[];
			if(this.page_num < this.totalPage-1)
			{
			this.pageNosList.push(this.page_num-1);
			}
			else
			{
				this.pageNosList.push(this.page_num-2);
				this.pageNosList.push(this.page_num-1);
			}
			this.pageNosList.push(this.page_num);
			if(this.page_num < this.totalPage-1)
			this.pageNosList.push(this.page_num+1);

		}
		console.log(this.pageNosList);
		return this.pageNosList;
	}
	prevPage()
	{
		console.log("prevPage");
		if(this.page_num > 1)
		{
			this.page_num -= 1;
		}
		this.counter();
		this.getDisplayList();
	}
	nextPage()
	{
		console.log("nextPage");
		if(this.page_num >= 0 && this.page_num < this.totalPage-1)
		{
			this.page_num += 1;
		}
		this.counter();
		this.getDisplayList();
	}
	currentPage(pagenum)
	{
		console.log("currentPage");

		console.log("pagenum " + pagenum);
		this.page_num = parseInt(pagenum);
		this.counter();
		this.getDisplayList();
	}

	getDisplayList()
	{
		console.log(this.page_num);
		this.displayList=[];
		var startIndex= (this.page_num-1)*this.pageCount;
		var endIndex = this.pageCount;

		if(startIndex + endIndex > this.recipesList["length"])
		{
			endIndex = this.recipesList["length"]-startIndex;
		}
		endIndex = startIndex+ endIndex;
		for(let i=startIndex; i < endIndex; i++)
		{
		this.displayList.push(this.recipesList[i]);
		
		}
		window.scrollTo(0, 0);
	}

	loadRatings()
	{
	  if(this.ratingIds !== "")
	  {			
	   this.ratingIds = this.ratingIds.substring(0, this.ratingIds.length-1);
	  }
	 
		var params = {"limit": 50};
	   
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
				  var recIndex = this.recipesList.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				  console.log(recIndex);
				  if(recIndex > -1)
				  {
					this.recipesList[recIndex]["totalcount"] = temp[i]["totalcount"];
					this.recipesList[recIndex]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList[recIndex]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));
					 }
  
				  }
  
				
  
				}
			  }
			}
	
		  }
		}));
	 
	  
	  
	}

	totalCats: any = [];
	formatRecipe(recipe)
  {
    var oRecipe;
   // console.log(recipe);
    if(recipe !== "")
    {
    oRecipe = recipe;

    if(typeof(oRecipe["digest"]) !== "undefined" && oRecipe["digest"] !== "")
    {
      
    oRecipe["digestArr"]  = JSON.parse(oRecipe["digest"]);
      if(oRecipe["digestArr"]["length"] > 0)
      {
        var paramMicro = [];
        for(let j=0; j< oRecipe["digestArr"]["length"] ; j++)
        {
          var mmicro = oRecipe["digestArr"][j];
          switch(mmicro.label.toLowerCase())
          {
            case "fat": 
            case "carbs":
            case "protein":
              if(typeof(mmicro.total) !== "undefined")
              {
                mmicro.totalP = mmicro.total.toFixed(1);
                 paramMicro.push(mmicro);
               }
             
               break

          }
                        
        }
        oRecipe["paramMicro"] = paramMicro;
      }
    }
  
    oRecipe["totalDailyArr"] = [];
    if(typeof(oRecipe["totalDaily"]) !== "undefined" && oRecipe["totalDaily"] !== "")
    {
  
      var temptotalDaily  = [];
    //  var tempObjN = JSON.parse(oRecipe["totalDaily"]);
      Object.keys(oRecipe["totalDaily"]).forEach(function(k){
        temptotalDaily.push({"name": k, "value":oRecipe["totalDaily"][k]})
  
      });
      oRecipe["totalDailyArr"]  = temptotalDaily;
    
    }
  
    oRecipe["totalNutrientsArr"] = [];
    if(typeof(oRecipe["totalNutrients"]) !== "undefined" && oRecipe["totalNutrients"] !== "")
    {
      var temptotalNutrients  = [];
      var tempObj = JSON.parse(oRecipe["totalNutrients"]);
      Object.keys(tempObj).forEach(function(k){
        temptotalNutrients.push({"name": k, "value":tempObj[k]})
  
      });
      oRecipe["totalNutrientsArr"]  = temptotalNutrients;
      if(typeof(temptotalNutrients) !== "undefined" && temptotalNutrients !== null)
      {
        var resArr = [];
  this.totalCats = [];
  for(let j=0; j < oRecipe["totalNutrientsArr"]["length"] ; j++)
  {
    var temp = oRecipe["totalNutrientsArr"][j];
   // console.log(temp["value"]);
    for(let k=0; k < this.mineralsList["length"] ; k++)
    {
      if(temp["value"]["label"].toUpperCase().indexOf(this.mineralsList[k].toUpperCase()) !== -1)
      {
        if(temp["value"]["quantity"] > 0)
        {
          if(temp["value"]["unit"].indexOf("u00b5") !== -1)
          {
            temp["value"]["unit"] = temp["value"]["unit"].replace("u00b5", "µ");
          }
          var cIndex = this.totalCats.findIndex(x => (x.name  === this.mineralsList[k]));

          if(cIndex > -1)
          {
            this.totalCats[cIndex]={"name":this.mineralsList[k], 'value' :  (parseInt(this.totalCats[cIndex]["value"]) + parseInt(temp["value"]["quantity"])), "unit":temp["value"]["unit"]}
          }
          else
          {
            this.totalCats.push({"name": this.mineralsList[k], 'value' :  parseInt( temp["value"]["quantity"]), "unit":temp["value"]["unit"]});
          }
        }
      }
    }
  
  }
  resArr = this.totalCats;

        oRecipe['minerals'] =this.totalCats;
      }
    }
  }
  //console.log(oRecipe);
    return oRecipe;
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
	removeRecipe(r, c)
	{
		this.plan["days"][r]["meals"][c]["recipe"] =  null;
		this.SavePlanData(r, c);
	}
	drop(ev, r, c) {
		console.log("Drop function");
		console.log(ev);
		console.log(r);
		console.log(c);
		ev.preventDefault();
		var index = sessionStorage.getItem("dragstartindex");
		

		var r_index = parseInt(index);
		if(this.page_num > 1)
		r_index = parseInt(index) + (this.page_num-1 * this.pageCount)
		console.log("index " + index);
		console.log("page_num " + this.page_num);
		console.log("r_index " + r_index);
		//var recipeItem = this.recipesList[r_index];
		var recipeItem = this.displayList[index];

		var data = ev.dataTransfer.getData("text");
this.plan["days"][r]["meals"][c]["recipe"] =  this.formatRecipe(recipeItem);
	
		var panelObj = document.getElementById("imagep_" + this.page_num + "_" + index);
		console.log(panelObj);
		var img = document.createElement('img');
            img.src = this.formatImage(recipeItem["image"], 's');
			img.style.width = "50px";
			img.style.height = "50px";
			img.style.position = "absolute";
			img.id = "picture_" + this.page_num + "_" + index;
			img.style.top = "0";
			img.style.left = "0";
			img.setAttribute("class","recipe-image");
			img.setAttribute("draggable","true");
			panelObj.appendChild(img);
		
			if(this.plan["id"] !== "" )
			{
				this.SavePlanData(r, c);
			}
			else
			{
				this.saveMealPlan();
				setTimeout(() => {
					this.SavePlanData(r, c);
				}, 1000);
			}
			
		
	  }
	
	  allowDrop(ev) {
		ev.preventDefault();
	  }
	
	  drag(ev, index) {
		  console.log(ev);
		  console.log("index " + index);
		  sessionStorage.setItem("dragstartindex",index);

		ev.dataTransfer.setData("text", ev.target.id);
	  }

	  calculateCalory(mealtype, index)
	  {
		//	console.log(this.plan);
			//console.log(mealtype);
		//	console.log(index);
		  var totalCalories = 0;
		  if(mealtype !== "")
		  {
				  for(let r =0; r < this.plan['days'].length; r++)
			  {
				 // console.log( this.plan["days"][r]["meals"]);
				  var item = this.plan["days"][r]["meals"][index];
				
				  if(typeof(item['recipe']) !== 'undefined' && item["recipe"] !== null)
				  {
					if(typeof(item['recipe']["calories"]) !== 'undefined' && item["recipe"]["calories"] !== null && item["recipe"]["calories"] !== "")
					{
						totalCalories += parseInt(item["recipe"]["calories"]);
					}
				  }
			  }
		  }

		  return totalCalories  + " calories";
	  }

	  getFavourites()
	  {
		  this.filtersOpt = false;
		this.favouritesList = [];
		//var params = {"limit": 100};
		var params ={};
	//	console.log(params);
		params["query"] = "select id, label, image, healthLabels, ingredients, s_instructions, dietLabels, calories,s_instructions  from recipes  where id in (select recipeid from favourites where userid ='" + this.currentUser["id"] + "')";
		 var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
	
	  console.log(invData);
	  	
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
		  this.recipesList = [];

		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			this.recipesList.push(invData["body"][i]);
		  }
		  this.totalPage = this.recipesList["length"] /10;
		  this.counter();
		  console.log(this.recipesList);
		 
		  this.getDisplayList();
		 
		}
		/*  if(invData !== null)
		  {
			var obj = invData["body"]["length"];
			this.favouritesList = invData["body"];
			var idslist = "";
			for(let i=0; i < this.favouritesList.length; i++)
			{
				if(idslist.indexOf(this.favouritesList[i]["recipeid"] + ",") > -1)
				{

				}
				else
				{
			  		idslist += this.favouritesList[i]["recipeid"] + ",";
				}
			  this.favouritesList[i]["recipe"]= null;
			}
			if(idslist !== "")
			{			
			  idslist = idslist.substring(0, idslist.length-1);
			  this.loadRecipes(idslist, false);
			}
		  }*/
	
		}));
	  }


	  /************************ from app  */

	  loadDaysData()
  {
  //  console.log("in loadDaysData");
//	console.log(this.plan);
    if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    {
      var params = {};
       
        params["meal_plan_id"] = this.plan["id"];

      var res =   this.dbService.getDataByTable("days", params).subscribe(dData => setTimeout(() => {

   		//	 console.log(dData);
        if(dData !== null)
        {
			var idslist = ""; 
          if(dData["body"] !== null && dData["body"]['length'] > 0)
          {
            for(let i=0; i < dData["body"]['length'] ; i++)
            {
				var item = dData['body'][i];
				this.plan["days"][item["day_num"]]["dayid"] = item["id"]
				if(typeof(item["breakfast"]) !== "undefined" && item["breakfast"] !== null && item["breakfast"] !== "")
				{
					this.plan["days"][item["day_num"]]["meals"][0]["recipe"] = {};
				this.plan["days"][item["day_num"]]["meals"][0]["recipe"]["id"] = item["breakfast"];
				console.log(item["breakfast"]);
				if(idslist.indexOf(item["breakfast"] + ",") > -1)
				{

				}
				else
				{
					idslist += item["breakfast"] + ",";
				}
				
				}

				if(typeof(item["snack1"]) !== "undefined" && item["snack1"] !== null && item["snack1"] !== "")
				{
					this.plan["days"][item["day_num"]]["meals"][1]["recipe"] = {};
				this.plan["days"][item["day_num"]]["meals"][1]["recipe"]["id"] = item["snack1"];
				//idslist += item["snack1"] + ",";
				if(idslist.indexOf(item["snack1"] + ",") > -1)
				{

				}
				else
				{
					idslist += item["snack1"] + ",";
				}
				}

				if(typeof(item["lunch"]) !== "undefined" && item["lunch"] !== null && item["lunch"] !== "")
				{
					this.plan["days"][item["day_num"]]["meals"][2]["recipe"] = {};
				this.plan["days"][item["day_num"]]["meals"][2]["recipe"]["id"] = item["lunch"];
				//idslist += item["lunch"] + ",";

					if(idslist.indexOf(item["lunch"] + ",") > -1)
					{

					}
					else
					{
						idslist += item["lunch"] + ",";
					}
				}

				if(typeof(item["snack2"]) !== "undefined" && item["snack2"] !== null && item["snack2"] !== "")
				{
					this.plan["days"][item["day_num"]]["meals"][3]["recipe"] = {};
				this.plan["days"][item["day_num"]]["meals"][3]["recipe"]["id"] = item["snack2"];
				//idslist += item["snack2"] + ",";

					if(idslist.indexOf(item["snack2"] + ",") > -1)
					{

					}
					else
					{
						idslist += item["snack2"] + ",";
					}
				}

				if(typeof(item["dinner"]) !== "undefined" && item["dinner"] !== null && item["dinner"] !== "")
				{
					this.plan["days"][item["day_num"]]["meals"][4]["recipe"] = {};
				this.plan["days"][item["day_num"]]["meals"][4]["recipe"]["id"] = item["dinner"];
				//idslist += item["dinner"] + ",";
				if(idslist.indexOf(item["dinner"] + ",") > -1)
					{

					}
					else
					{
						idslist += item["dinner"] + ",";
					}

				}


				
            //  this.plan["days"][i]= dData["body"][i];
            }
         //   console.log(this.selDay['day_num']);
         //   this.planDay = this.plan['days'][this.selDay['day_num']];
         ////   this.planDay['forall']= {};
          //  console.log(this.planDay);
          //  this.selDay = this.plan["days"][0];
		  this.loadedPlan = true;
          }
          else{
          //  this.initializeDays();
          //  this.createDay();
          }
        }
        else{
        //  this.initializeDays();
        //  this.createDay();
        }
        console.log(this.plan);
		if(idslist !== "")
		{			
		  idslist = idslist.substring(0, idslist.length-1);
		  this.loadRecipes(idslist, false);
		}
       // this.loadRecipesToDays();
      }))
    }
 
  }
 
  saveMealPlan()
  { 
  this.errorMessage ="";
    if(this.plan["name"] !== ""){
	if(!this.updatingFlag )
	{
		this.updatingFlag = true;
		var params = {};
		if(this.plan["name"] !== "")
		params["name"] = this.plan["name"];
		if(this.plan["tags"] !== "")
		params["tags"] = this.plan["tags"];

		if(typeof(this.plan["status"]) !== "undefined" && this.plan["status"] !== "")
		params["status"] = this.plan["status"];
		else
		params["status"] = "0";
		params["created_by"] = this.currentUser["id"];
		if(typeof(this.plan["mealplanid"]) !== "undefined" && this.plan["mealplanid"] !== "")
		{
		params["id"]  =  this.plan["mealplanid"] 

		var res =   this.dbService.updateDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

		console.log(invData);

			if(invData !== null)
			{
				this.updatingFlag = false;
			}

		}));
		}
		else
		{

		var res =   this.dbService.postDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

			console.log(invData);

			if(invData !== null)
			{
			if(typeof(invData["inserted_id"]) !== "undefined") 
			{
				var insertedid = invData["inserted_id"];
				console.log(insertedid)
			
				this.plan["id"]=insertedid;
				this.plan["mealplanid"]=insertedid;
				this.updatingFlag = false;

			}
			}
		}));
		}
	}
	} else {
	this.errorMessage = "Plan Name is required";
	}

  }
  SavePlanData(r, c)
  {


    if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    {
		var rowItem = this.plan["days"][r]["meals"];

      var params = {};
       
        params["meal_plan_id"] = this.plan["id"];
        params["day_num"] = r;
        params["name"] = "Day " + (r +1);

        params["breakfast"] = "";
        if(typeof(rowItem[0]["recipe"]) !== "undefined" && rowItem[0]["recipe"] !== null && typeof(rowItem[0]["recipe"]["id"]) !== "undefined")
        params["breakfast"] = rowItem[0]["recipe"]["id"];

        params["snack1"] = "";
        if(typeof(rowItem[1]["recipe"]) !== "undefined" && rowItem[1]["recipe"] !== null && typeof(rowItem[1]["recipe"]["id"]) !== "undefined")
        params["snack1"] = rowItem[1]["recipe"]["id"];

        params["lunch"] = "";
        if(typeof(rowItem[2]["recipe"]) !== "undefined" && rowItem[2]["recipe"] !== null && typeof(rowItem[2]["recipe"]["id"]) !== "undefined")
        params["lunch"] = rowItem[2]["recipe"]["id"];

        params["snack2"] = "";
        if(typeof(rowItem[3]["recipe"]) !== "undefined" && rowItem[3]["recipe"] !== null && typeof(rowItem[3]["recipe"]["id"]) !== "undefined")
        params["snack2"] = rowItem[3]["recipe"]["id"];

        params["dinner"] = "";
        if(typeof(rowItem[4]["recipe"]) !== "undefined" && rowItem[4]["recipe"] !== null && rowItem[4]["recipe"]["id"] !== "undefined")
        params["dinner"] = rowItem[4]["recipe"]["id"];

        params["created_by"] = "";
        params["created_at"] = new Date();
        params["status"] = 1;

 
      if(typeof(this.plan["days"][r]['dayid']) == "undefined" || this.plan["days"][r]['dayid'] == "")
      { 
	
        var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {

  
          if(dData !== null)
          {
            if(dData["result"] !== null && dData["result"] !== "")
            {
              this.plan["days"][r]["meals"]= rowItem;
              this.plan["days"][r]['id']= dData['inserted_id'];
			  this.plan["days"][r]['dayid']= dData['inserted_id'];
            }
            else{
        
            }
          }


        }));
      }
      else
      {

        params["id"] = this.plan["days"][r]['dayid'];
  
        var res =   this.dbService.updateDataByTable("days", params).subscribe(dData => setTimeout(() => {

          if(dData !== null)
          {
            if(dData["result"] !== null && dData["result"] !== "")
            {
        
            }
            else{
           
            }
          }
      
        }));
      }
    }  
  }
  loadColorCodes()
  {
	this.colorCodes ={};
	this.colorCodes["calcium"] ="#488e4f"; //light gray
	this.colorCodes["magnesium"] ="#D1d2d3"; //pink
	this.colorCodes["iron"] ="#ff6700"; //orange
	this.colorCodes["sodium"] ="#fa5a73"; //dark blue
	this.colorCodes["potassium"] ="#cb410b"; //violet
	this.colorCodes["phosphorus"] ="#2887c8";
	this.colorCodes["chloride"] ="#1e90ff";
	this.colorCodes["zinc"] ="#76d7ea";
	this.colorCodes["iodine"] ="#010b13";
	this.colorCodes["manganese"] ="#3f00ff";
	this.colorCodes["fat"] ="#a6a6a6";
	this.colorCodes["protein"] ="#02075d";
	this.colorCodes["carbs"] ="#778ba5";



  }
  getColorCode(param)
  {
	//  console.log("getColorCode")
	//  console.log(param);
	  var retVal = "#778ba5";
	  if(param !== null)
	  {
		  if(typeof(param['label']) !== "undefined" && param['label'] !== "")
		  {
		  var te = param['label'].toLowerCase();
		  retVal = this.colorCodes[te];
		  }

		  if(typeof(param['name']) !== "undefined" && param['name'] !== "")
		  {
		  var te = param['name'].toLowerCase();
		  retVal = this.colorCodes[te];
		  }

	  }
	  return retVal;
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

	checkData(item)
	{
		var retValue = false;
		//	console.log(item);
		if(item["meals"]["length"] > 0)
		{
			for(let m=0; m < item["meals"]["length"]; m++)
			{
				if(item["meals"][m]["recipe"] !== null)
				retValue = true;
			}
		}
		//	console.log("retValue " + retValue);
		return retValue;
	}



	 scrollFunc(){
	//	console.log("scrolling");
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		//	mybutton.style.display = "block";
		  } else {
		//	mybutton.style.display = "none";
		  }
		  var checkVal  = 2300;;
		  var btncalculateCaloryFlag = document.getElementById('calculateCaloryFlag');
		  if(btncalculateCaloryFlag !== null)
		  {
	//	  console.log(btncalculateCaloryFlag.offsetTop);
		  if(typeof(btncalculateCaloryFlag.offsetTop) !== "undefined" && btncalculateCaloryFlag.offsetTop !== null && btncalculateCaloryFlag.offsetTop)
		  {
			checkVal = btncalculateCaloryFlag.offsetTop - 300;
		  }
		  }
	//	  console.log(document.documentElement.scrollTop);
		  var btnsaveplan= document.getElementById('btnsaveplan');
		  if(btnsaveplan !== null)
		  { 
		  if(document.documentElement.scrollTop > checkVal)
		  {
			btnsaveplan.setAttribute("class", "saveplan ")
		  }
		  else
		  {
			btnsaveplan.setAttribute("class", "saveplan floatbtn")
		  }
		  }

		  var recipelistpnael = document.getElementById('recipelistpnael');
		//  console.log(recipelistpnael.offsetTop);
		//  console.log(recipelistpnael.offsetLeft);
		  var w = window.innerWidth;
		//  console.log("w " + w);
		  var btnsaveplan1= document.getElementById('recipes-container');
		  if(btnsaveplan1 !== null)
		  { 
		  if(document.documentElement.scrollTop > 100 && document.documentElement.scrollTop < (checkVal))
		  {
			
			  var leftP = (w - 1200)/2;
			  btnsaveplan1.style.left = leftP + "px";
			btnsaveplan1.setAttribute("class", "container-fluid side-recipes floatpanel")
		  }
		  else
		  {
			btnsaveplan1.setAttribute("class", "container-fluid side-recipes ")
		  }
		  }
	  }

	  downloadplan()
	  {
		if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
		{
		//	var path = "https://dentavacation.com/mobileapp/api/generate_pdf.php?id=" + this.plan["id"];
			this.pdfService.createpdf(this.plan["id"]).subscribe(dData => setTimeout(() => {

				console.log(dData);
				if(dData !== null )
				{
				var mealPlan ={};
				mealPlan["mealplan"] = this.plan["name"];
				mealPlan["link"] = environment.apiUrl + "/" + dData["filename"];
				var link = document.createElement('a');
				link.href = mealPlan["link"];
				link.target = "_blank";
			//	link.download = mealPlan["link"];
				link.click();
				console.log(mealPlan["link"]);
				}
			}));
	  	}
	}
	calculateTotalCalory(col)
	{
	//	console.log(this.loadedPlan);
		var mMacro = [];
	//	console.log(this.plan["days"][col]);
		if(this.loadedPlan)
		{
		for(let i=0; i < this.plan["days"][col]["meals"]["length"]; i++)
		{
			var dItem = this.plan["days"][col]["meals"][i];
		//	console.log(dItem);
			if(dItem["recipe"] !== null)
			{
				if(typeof(dItem["recipe"]["paramMicro"]) !== "undefined")
				{
				for(let j=0; j < dItem["recipe"]["paramMicro"]["length"]; j++)
				{
					var dmItem = dItem["recipe"]["paramMicro"][j];
					var lbl = dmItem["label"].toLowerCase();
					var fIndex = mMacro.findIndex(x=>(x.name == lbl));

					if(fIndex > -1)
					mMacro[fIndex]["value"] =  parseFloat(mMacro[fIndex]["value"]) + dmItem["total"];
					else
					mMacro.push({"name" : lbl, "value" : dmItem["total"], "unit" : dmItem["unit"]});
				
					
					
				}
				}
				if(typeof(dItem["recipe"]["minerals"]) !== "undefined")
				{
				for(let j=0; j < dItem["recipe"]["minerals"]["length"]; j++)
				{
					var dmItem1 = dItem["recipe"]["minerals"][j];
					//console.log(dmItem1);
					var lbl1 = dmItem1["name"].toLowerCase();

					var fIndex1 = mMacro.findIndex(x1=>(x1.name == lbl1));
					if(fIndex1 > -1)
					mMacro[fIndex1]["value"] = parseFloat(mMacro[fIndex1]["value"]) + dmItem1["value"];
					else
					mMacro.push({"name" : lbl1, "value" : dmItem1["value"], "unit" : dmItem1["unit"]});
								
					//console.log(mMacro[dmItem1["name"]]);
				}
				}
				
			}
		}
	}
	else
	{
	//	setTimeout(() => {

		//	this.calculateTotalCalory(col);
	//	},300);
	}
	//console.log ("day " + col);
	//console.log(mMacro);
	return mMacro;
	}

	formatValue(str)
	{
		var retval = str;
		if(str !== "")
		{
			retval = parseFloat(str).toFixed(2);
		}
		return retval;
	}



	getIngredientsList()
	{
	  console.log(this.plan);
	  var ingredientsList = [];
	  var shoppingList = [];
	  var consList = [];
	  for(let i=0; i < this.plan["days"]["length"]; i++)
	  {
	  //  console.log(this.plan["days"][i]);
		var itemday = this.plan["days"][i];
		for(let j=0; j < this.plan["days"][i]["meals"].length; j++)
		{
			var itemmeal = this.plan["days"][i]["meals"][j];
			console.log(itemmeal);
		  if(typeof(itemday) !== "undefined" && typeof(itemmeal["recipe"]) !== "undefined" && itemmeal["recipe"] !== null)
		  {
		  console.log(itemmeal["recipe"]["ingredients"]);
		//  console.log(itemday[this.mealTypeList[j]]["ingredientLines"]);
			if(typeof(itemmeal["recipe"]["ingredients"]) !== "undefined" && itemmeal["recipe"]["ingredients"] !== "")
		  {
			var tempA = JSON.parse(itemmeal["recipe"]["ingredients"]);
		  console.log(tempA);
		  for(let k=0; k < tempA.length; k++)
		  {
			ingredientsList.push(tempA[k]['text'])
			var t = tempA[k]['text'];
			if(t.indexOf('cups') > -1)
			{
			  var t1 = t.split('cups');
			  var cIndex = consList.findIndex(x => (x.name  === t1[1].trim()));
			  if(cIndex > -1)
			  {
				consList[cIndex]['quantity'] = parseFloat(consList[cIndex]['quantity']) +  parseFloat(t1[0].trim());
			  }
			  else
			  {
				consList.push({"name":t1[1].trim(), 'quantity': t1[0].trim(), 'measure':"cups"})
			  }
			  shoppingList.push({"name":t1[1].trim(), 'quantity': t1[0].trim() + " cups"})
			}
			else if(t.indexOf('cup') > -1)
			{
			  var t1 = t.split('cup');
			  //var cIndex = shoppingList.findIndex(x => (x.name  === t1[1]));
			  var cIndex = consList.findIndex(x => (x.name  === t1[1].trim()));
			  if(cIndex > -1)
			  {
				consList[cIndex]['quantity'] = parseFloat(consList[cIndex]['quantity']) +  parseFloat(t1[0].trim());
			  }
			  else
			  {
				consList.push({"name":t1[1].trim(), 'quantity': t1[0].trim(), 'measure':"cups"})
			  }
  
			  shoppingList.push({"name":t1[1].trim(), 'quantity': t1[0].trim() + " cup"})
			}
			else
			{
			  shoppingList.push({"name":t, 'quantity': " "})
			  consList.push({"name":t, 'quantity': '', 'measure':""})
			}
		  }
		}
		  }
		}
	  }
	//  console.log(ingredientsList);
	 // console.log(shoppingList);
	//  console.log(consList);
	  this.shoppingList = consList
	  //console.log(JSON.stringify(shoppingList));
	  console.log(JSON.stringify(consList));
	 // sessionStorage.setItem("list",JSON.stringify(consList));
	  this.openModal("popuppanel");
	}

	openModal(id)
	{
		this.modalService.open(id);
	}
	closeModal(id)
	{
		this.modalService.close(id);
	}

	loadFilterLabels()
	{
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
			this.mineralsLabelsList.push({"name":constants.minerals[m], "selected":false, "unit":"",  "min":"", "max":"", "t_min":"", "t_max":""})
		}
		this.loadNutrientsMaxMin();
	}
	searchFilters()
	{
		var dietlabels = "";
		for(let m=0; m <this.dietLabelsList.length; m++)
		{
			if(this.dietLabelsList[m]["selected"])
			dietlabels += this.dietLabelsList[m]["name"] + "~";
		}
		if( dietlabels !== "")
		{
		   dietlabels=  dietlabels.slice(0, -1);

		   this.filtersParams["dietlabels"] = dietlabels;
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
		   this.filtersParams["healthlabels"] = healthlabels;
		}
	   
		var minerals = "";
		var mQuery = "";
		for(let m=0; m <this.mineralsLabelsList.length; m++)
		{
			if(this.mineralsLabelsList[m]["selected"])
			{
			minerals += this.mineralsLabelsList[m]["name"] + "~";
			var item = this.mineralsLabelsList[m];
            if(item["selected"])
            {
              console.log(item);
              if(typeof(item["min"]) !== "undefined" && item["min"] !== "" && item["min"] >0)
              {
                mQuery += " " + item["name"]['label'].toLowerCase() + " >= " + item["min"] + " AND ";
              }
              if(typeof(item["max"]) !== "undefined" && item["max"] !== "" && item["max"] >0)
              {
                mQuery += " " + item["name"]['label'].toLowerCase() + " <= " + item["max"] + " AND ";
              }

            	this.filtersParams["minerals"] += item["name"]['label'] + "~";
            }
          
			}
			if( typeof( this.filtersParams["minerals"]) !== "undefined" && this.filtersParams["minerals"] !== "")
			{
				console.log(mQuery);
				this.filtersParams["mineralsquery"] =  mQuery.slice(0, -4);
				
				this.filtersParams["minerals"] =  this.filtersParams["minerals"].slice(0, -1);
			}
			}

		
		

		console.log(this.filtersParams);
		this.loadRecipes();
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

	