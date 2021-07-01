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
import { ToastrService } from 'ngx-toastr';
import { ModalService } from './../../shared/modules/modal/modal.service';
import { type } from 'jquery';
import { throws } from 'assert';
@Component({
	selector: 'app-plancreate',
	templateUrl: './plancreate.component.html',
	styleUrls: ['./plancreate.component.scss']
})
export class PlancreateComponent implements OnInit {

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
	showNutrientsFlag: boolean = false;
	
	showNutrientsPServing: boolean = false;
	showhidenutrientsFlag: boolean = false;
	role: any = {};
	searchFilterLabels: Array<any> = [];
	cuisineTypeList : Array<any> = [];
	showpopupflag: boolean = false;

	/*********** new variables  */
	recipesList1: Array<any> = [];
	recipesList2: Array<any> = [];
	listorgrid: any = {};
	searchmorebar: boolean = false;
	animClass: any = "";
	splitcontent : boolean = false;


	constructor(private router: Router, private toastr: ToastrService,  private route: ActivatedRoute, private modalService: ModalService, private pdfService: PDFService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	showLabels(label)
	{
		
		for(let l=0; l < this.searchFilterLabels.length; l++)
		{
			if( this.searchFilterLabels[l]["label"] == label.label)
			this.searchFilterLabels[l]['selected'] = !this.searchFilterLabels[l]['selected'];
			else
			this.searchFilterLabels[l]['selected'] = false;
		}
	}

	
	ngOnInit() {
			 this.totalPage = 1;
			 this.pageCount= 5;
			 this.filtersOpt = false;
			 this.showNutrients= false;
	 this.page_num = 1;
this.loadedPlan = false;

this.searchFilterLabels = [];
		this.searchFilterLabels.push({"label":"Health Labels", "selected":false});
		this.searchFilterLabels.push({"label":"Diet Labels", "selected":false});
		this.searchFilterLabels.push({"label":"Cuisine Type", "selected":false});
		this.searchFilterLabels.push({"label":"Meal Type", "selected":false});
		this.searchFilterLabels.push({"label":"Nutrients", "selected":false});
		this.searchFilterLabels.push({"label":"Calories", "selected":false});
/*
		this.cuisineTypeList = [];
		for(let c=0; c < constants.cuisineTypeList.length; c++)
		{
			this.cuisineTypeList.push({"name":constants.cuisineTypeList[c], "selected":false})
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
		for(let h=0; h < constants.healthLabelsNew.length; h++)
		{
			this.healthlabelsList.push({"name":constants.healthLabelsNew[h], "selected":false})
		}

		//this.mineralsLabelsList = constants.minerals;
		this.mineralsLabelsList= [];
		for(let m=0; m <constants.minerals.length; m++)
		{
			this.mineralsLabelsList.push({"name":constants.minerals[m], "selected":false,  "unit":"",  "min":"", "max":"", "t_min":"", "t_max":""})
		}
		*/
		this.loadFilterLabels();
		this.loadNutrientsMaxMin();
	
	//	window.addEventListener("scroll", this.scrollFunc);
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
		this.role = this.helpService.getRoleStatus(this.currentUser);

		this.showNutrientsFlag = this.helpService.showorhideNutritions(this.role);

		console.log(this.showNutrientsFlag);

		//this.mealTypeList = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
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
		this.plan["days"][0]["expand"]= true;
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
			this.plan["maxcaloryperday"] = mpData["body"][0]["maxcaloryperday"];
            this.plan["mealplanid"] = mpData["body"][0]["id"];
            this.oldName =  this.plan["name"];

			this.maxcaloryperday =  mpData["body"][0]["maxcaloryperday"];
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

	clearFilters(){
	this.filtersOpt = false;
	this.filtersParams = [];
	this.loadRecipes();

	}
	noResult: boolean = false;
	loopCount: any = 0;
	recipesloading: boolean = false;
	loadRecipes(idslist = "", allFlag = true)
	{
		console.log("in Loadrecipes");
		if(this.recipesloading == false)
		{
	  this.recipesloading = true;
		this.ratingIds = "";
	// this.recipes = recipesList;
	  var params = {"limit": "30"}; //{"limit": "10"};
   //  params["caloriesfrom"] = this.searchparam.range.lower;
	// params["caloriesto"] = this.searchparam.range.upper;
	 console.log(this.searchparam);

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
		//params["content"] = this.searchparam["q"];
	//	this.helpService.saveSearchHistory(this.searchparam["q"], "content", "plan", this.currentUser["id"]);

	//	console.log(" this.splitcontent " + this.splitcontent);
	/*   if(this.splitcontent)
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
*/
	   if (this.splitcontent) {
		params["content"] = this.searchparam.q.split(" ").join(",");
		console.log(params['content']);
		this.helpService.saveSearchHistory(this.searchparam.q, "text", "plancreate", this.currentUser["id"]);

	}
	else {
		this.loopCount = 0;
		var words = this.searchparam.q.replaceAll(" ", "~");
		params["words"] = words;
		this.helpService.saveSearchHistory(this.searchparam.q, "text", "plancreate", this.currentUser["id"]);

	}
	console.log(this.searchparam);
console.log(params);
	  }
  
	 

	  params["instructions"] = "notempty";
	console.log(this.filtersParams);
	 params["returnfields"] = " id, label, image, cuisineType, mealType, healthLabels,ingredients,  dietLabels, totalNutrients, digest,calories, yield ";
	 if(typeof(this.filtersParams.dietlabels) !== "undefined" && this.filtersParams.dietlabels  !== "")
	 {
	  params["dietLabels"] = this.filtersParams.dietlabels;
	 } 
  
	 if(typeof(this.filtersParams.healthlabels ) !== "undefined" && this.filtersParams.healthlabels !== "")
	 {
	  params["healthLabels"] = this.filtersParams.healthlabels;
	 } 
	 if(typeof(this.filtersParams.mealtypes ) !== "undefined" && this.filtersParams.mealtypes !== "")
	 {
	  params["mealType"] = this.filtersParams.mealtypes;
	 } 
	 if(typeof(this.filtersParams.cuisinetypes ) !== "undefined" && this.filtersParams.cuisinetypes !== "")
	 {
	  params["cuisineType"] = this.filtersParams.cuisinetypes;
	 } 
	 if(typeof(this.filtersParams.mineralsquery ) !== "undefined" && this.filtersParams.mineralsquery !== "")
	 {
	  params["nutrients"] = this.filtersParams.mineralsquery;
	 }

	 if(typeof(this.filtersParams.calories ) !== "undefined" && this.filtersParams.calories !== "")
	 {
	  params["calories"] = this.filtersParams.calories;
	 }  
	
	  
	  console.log(JSON.stringify(params));
	  this.calculateCaloryFlag = false;

	
	  
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
		this.recipesloading = false;
	 console.log(invData);
 var count = 0;

	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
 			this.loadCustom = false;
			if(allFlag)
			this.recipesList = [];
			
	
			this.splitcontent = false;
			this.formatResult(invData);
		
		}
		else
		{
			if(typeof(this.searchparam["q"]) !== "undefined" && this.searchparam["q"] !== null && this.searchparam["q"] !== "")
			{
			this.splitcontent = true;

			if(this.loopCount < 1){
				this.loopCount++;
				this.loadRecipes();
	 
			}
			} else {
			this.recipesList = [];
			}
				
		}
		 
	  }
	
	 ));
			
	}
	else
	{
		
		setTimeout(() => {
			this.loadRecipes(idslist, allFlag)
		}, 200);
		
	}
	}

	formatResult(invData)
	{
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
	
			  var pItem = this.plan['days'][p]['meals'][q];
			  if(pItem["recipe"] !== null  && pItem["recipe"]["id"] !== null)
			  {
				  var recIndex = this.recipesList.findIndex(x1 => (x1.id === pItem["recipe"]["id"]));
		
				  if(recIndex > -1)
				  {
					  this.plan['days'][p]['meals'][q]["recipe"] = JSON.parse(JSON.stringify(this.formatRecipe(this.recipesList[recIndex])));
				  }
			  }
		  }
		}
		this.CheckStatus();
		this.calculateCaloryFlag = true;
	
	   this.clearFilterValues();
		this.page_num = 1;
   this.totalPage = this.recipesList["length"] /this.pageCount;
   console.log(this.totalPage);
		this.getDisplayList();
		this.counter();
	}
	counter() {
	//	console.log("pagenum " + this.page_num);
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
	//	console.log(this.pageNosList);
		return this.pageNosList;
	}
	prevPage()
	{
	//	console.log("prevPage");
		if(this.page_num > 1)
		{
			this.page_num -= 1;
		}
		this.counter();
		this.getDisplayList();
	}
	nextPage()
	{
	//	console.log("nextPage");
		if(this.page_num >= 0 && this.page_num < this.totalPage-1)
		{
			this.page_num += 1;
		}
		this.counter();
		this.getDisplayList();
	}
	currentPage(pagenum)
	{
	//	console.log("currentPage");

	//	console.log("pagenum " + pagenum);
		this.page_num = parseInt(pagenum);
		this.counter();
		this.getDisplayList();
	}

	getDisplayList()
	{
	//	console.log(this.page_num);
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
	 
		var params = {"limit": 30};
	   
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


	formatImage(recipe, type)
	{

		var image = recipe.image;
	//  console.log(image);
	  var retImage = image;
	  if(!this.loadCustom )
	  {
		  if(recipe.created_by == -1)
	  if(image !== "" && type !== "")
	  {
		retImage = this.helpService.formatImage(image, type);
		
	  }
	}
	//  console.log(retImage);
	  return retImage;
	}
	toggleMoreMenu(meal, row, col)
{

		for(let i =0; i < this.plan['days'].length;i++)
		{
			for(let j= 0; j < this.plan['days'][i]['meals']['length']; j++)
			{
				if(this.plan["days"][i]["meals"][j]["recipe"] !== null)
				{
				if(this.plan["days"][i]["meals"][j]["recipe"]["id"] !== meal.recipe["id"])
				{
					this.plan["days"][i]["meals"][j]["recipe"]["expand"] = false;
				}
				}
			}
		}	
	
	meal.recipe["expand"] = !meal.recipe["expand"];	

}
	removeRecipe(r, c)
	{
		this.plan["days"][r]["meals"][c]["recipe"] =  null;
		this.SavePlanData(r, c);
		this.CheckStatus();
	}
	viewRecipe(r, c)
	{
		var recipe = this.plan["days"][r]["meals"][c]["recipe"];
		window.open("/recipedetails/" + recipe.id)
	}

	gotoRecipeDetails(id)
	{
		window.open("/recipedetails/" + id)
	}
	maxcaloryperday: any = 0;
	drop(ev, r, c) {
	
		console.log(this.maxcaloryperday);

		
		ev.preventDefault();
		var index = sessionStorage.getItem("dragstartindex");
		//var recipeItem = this.displayList[index];
		var recipeItem = this.recipesList[index];
		console.log(recipeItem);
		var totalCals = 0;
		for(let i=0; i <this.plan["days"][r]["meals"]["length"]; i++)
		{
			console.log(this.plan["days"][r]["meals"][i]);
			if(typeof(this.plan["days"][r]["meals"][i]["recipe"]) !== "undefined" && this.plan["days"][r]["meals"][i]["recipe"] !== null)
			{
				if(typeof(this.plan["days"][r]["meals"][i]["recipe"]["calories"]) !== "undefined")
				{
					console.log( parseInt(this.plan["days"][r]["meals"][i]["recipe"]));
					totalCals += parseInt(this.plan["days"][r]["meals"][i]["recipe"]["calories"]) / parseInt(this.plan["days"][r]["meals"][i]["recipe"]["yield"]);
				}
			}
		}

		totalCals += parseInt(recipeItem["calories"])/parseInt(recipeItem["yield"]);
		console.log("totalCals " + totalCals);

		if(this.maxcaloryperday > 0 && totalCals > this.maxcaloryperday  )
		{
			//alert("Per day calories is more than your maximum calorie consumption for the day");
			this.toastr.warning('Per day calories is more than your maximum calories consumption for the day');
		}
		else
		{
		

		var data = ev.dataTransfer.getData("text");
this.plan["days"][r]["meals"][c]["recipe"] =  this.formatRecipe(recipeItem);
	
		var panelObj = document.getElementById("imagep_" + index);
		console.log(panelObj);
		var img = document.createElement('img');
            img.src = this.formatImage(recipeItem["image"], 's');
			img.style.width = "50px";
			img.style.height = "50px";
			img.style.position = "absolute";
			img.id = "picture_" + index;
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
		this.CheckStatus();
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
	
		  var totalCalories = 0;
		  if(mealtype !== "")
		  {
				  for(let r =0; r < this.plan['days'].length; r++)
			  {
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

		var params ={};

		params["query"] = "select id, label, image, healthLabels, ingredients, dietLabels, calories, yield from recipes  where id in (select recipeid from favourites where userid ='" + this.currentUser["id"] + "')";
		 var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
	  	
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

	
		}));
	  }


	  loadDaysData()
  {

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
			//	console.log(item);
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
				if(idslist.indexOf(item["dinner"] + ",") > -1)
					{

					}
					else
					{
						idslist += item["dinner"] + ",";
					}

				}

            }
		  this.loadedPlan = true;
          }
          else{

          }
        }
        else{

        }
     //   console.log(this.plan);
		if(idslist !== "")
		{			
		  idslist = idslist.substring(0, idslist.length-1);
		  this.loadRecipes(idslist, false);
		}
       // this.loadRecipesToDays();
      }))
    }
 
  }
 saveMealPlanStatus()
 {
	this.toastr.success('Meal Plan has been saved!!!', 'Meal Plan!');
	//this.toastr.error('Meal Plan has been saved!!!', 'Meal Plan!');
		 this.updatingFlag = true;
		var params = {};
		params["status"] = "0";
		if(this.CheckStatus())
		params["status"] = "1";
		if(typeof(this.plan["mealplanid"]) !== "undefined" && this.plan["mealplanid"] !== "")
		{
		params["id"]  =  this.plan["mealplanid"] 

		console.log(params);
		try
		{
			var res =   this.dbService.updateDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {
				console.log(invData);
				if(invData !== null)
				{
					this.updatingFlag = false;
				//	this.toastr.success('Meal Plan has been saved!!!', 'Meal Plan!');
				}

			}));
		}
		catch(error)
		{
			
		}
		}

			
 }

limitTo(str, num)
	{
		var retVal = str;
		
		if(typeof(str) !== "undefined" && str !== null && str !== "")
		retVal = this.helpService.limitTo(str, num) + "...";
		return retVal;
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
			try
			{
				var res =   this.dbService.updateDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

					if(invData !== null)
					{
						this.updatingFlag = false;
					}

				}));
			}
			catch(error)
			{
				
			}
		}
		else
		{

		var res =   this.dbService.postDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

			if(invData !== null)
			{
			if(typeof(invData["inserted_id"]) !== "undefined") 
			{
				var insertedid = invData["inserted_id"];
				console.log(insertedid)
			
				this.plan["id"]=insertedid;
				this.plan["mealplanid"]=insertedid;
				this.updatingFlag = false;
				this.createDays();
			}
			}
		}));
		}
	}
	} else {
	this.errorMessage = "Plan Name is required";
	}

  }

  insertR: any =0;
  createDays()
  {
	if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    {
		var r =  this.insertR;
	
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
	
	 
		
			var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {
	
	  
			  if(dData !== null)
			  {
				if(dData["result"] !== null && dData["result"] !== "")
				{
				  this.plan["days"][r]["meals"]= rowItem;
				  this.plan["days"][r]['id']= dData['inserted_id'];
				  this.plan["days"][r]['dayid']= dData['inserted_id'];
				  this.insertR++;
				  setTimeout(() => {
				  if(this.insertR < 7)
				  {
					  this.createDays();
				  }
				  },100);
				}
			
			  }
	
	
			}));
		 
		 
		  
	}

  }

  planCompleteStatus : boolean = false;
  CheckStatus()
  {
//	  console.log("Check Status");
//	console.log(this.plan);
	var retvalue = 0;
	var mealcount = 0;
	var recipecount = 0;
	this.planCompleteStatus = false;
	if(this.plan)
	{
		if(this.plan["days"] && this.plan["days"]["length"] > 0)
		{
			for(let i=0; i < this.plan["days"]["length"]; i++)
			{
				if(this.plan["days"][i]["meals"] && this.plan["days"][i]["meals"]["length"] > 0)
				{
					for(let j=0; j < this.plan["days"][i]["meals"]["length"]; j++)
					{
						mealcount++;
						if(this.plan["days"][i]["meals"][j] && this.plan["days"][i]["meals"][j]["recipe"] !== null)
						{
							recipecount++
						}
					}
				}
			}
		}
	}
//	console.log("mealcount " + mealcount);
//	console.log("recipecount " +  recipecount);
	if(mealcount == recipecount)
	{
		this.planCompleteStatus = true;
	retvalue = 1;
	}
	  return retvalue;

  }
  SavePlanData(r, c)
  {

	
    if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    {
		var rowItem = this.plan["days"][r]["meals"];

      var params = {};

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

        params["status"] = this.CheckStatus();

 
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
		try
		{
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
		catch(error)
		{
			
		}
      }
    }  
  }
  loadColorCodes()
  {
	this.colorCodes ={};
	this.colorCodes["calcium"] ="#FF0000"; //light gray
	this.colorCodes["magnesium"] ="#00FFFF"; //pink
	this.colorCodes["iron"] ="#0000FF"; //orange
	this.colorCodes["sodium"] ="#808080"; //dark blue
	this.colorCodes["potassium"] ="#0000A0"; //violet
	this.colorCodes["phosphorus"] ="#000000";
	this.colorCodes["chloride"] ="#ADD8E6";
	this.colorCodes["zinc"] ="#FFA500";
	this.colorCodes["iodine"] ="#800080";
	this.colorCodes["manganese"] ="#A52A2A";
	this.colorCodes["fat"] ="#FFFF00";
	this.colorCodes["protein"] ="#800000";
	this.colorCodes["carbs"] ="#008000";
	this.colorCodes["fiber"] ="#006000";
	this.colorCodes["cholesterol"] ="#616000";
  }

  showhidenutrients()
  {
	if(!this.showhidenutrientsFlag)
	{
		this.showNutrientsPServing = false;
		this.showNutrients = false;

	}
	if(this.showhidenutrientsFlag)
	{
		this.showNutrientsPServing = true;
	}
  }
  toggleNutrients(opt)
  {
  //  if(opt == "total" && this.showNutrients)
  //  this.showNutrientsPServing = false;    
    /*
    if(opt == "perserving" && this.showNutrientsPServing)
    this.showNutrients = false;
	*/
	if(this.showNutrientsPServing)
    this.showNutrients = false;
	else
	this.showNutrients = true;
	console.log(this.showNutrients);
	
  }
  getColorCode(param)
  {

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

	formatweight(num)
	{
		var ret = 0;
		var pound = 0.00220462;
		var onekg = 2.2046; 
		var onegram = 2.2046/1000;
		if(num !== "" && num > 0)
		{
			ret = num * pound;

		}
		return ret.toFixed(2);
	}
	formatNumber(num)
	{
	var retVal = num;
		if(num %1 ==0)
		{
			retVal= num;
		}
		else
		{
			retVal =num.toFixed(2);
		}
		return retVal;
	}
	checkData(item)
	{
		var retValue = false;

		if(item["meals"]["length"] > 0)
		{
			for(let m=0; m < item["meals"]["length"]; m++)
			{
				if(item["meals"][m]["recipe"] !== null)
				retValue = true;
			}
		}

		return retValue;
	}



	 scrollFunc(){
		console.log("in scrollfunct");
		console.log(document.documentElement.scrollTop);
		console.log(document.body.scrollTop);
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		//	mybutton.style.display = "block";
		  } else {
		//	mybutton.style.display = "none";
		  }
		  var checkVal  = 950;

		  var showhidenut = document.getElementById('showhidenut');
	//	  console.log("showhidenut " );
	//	  console.log(showhidenut);
		  if(showhidenut !== null)
		  {
			  if(showhidenut["checked"])
			  {
				checkVal = 2000;
			  }
		  }


		  console.log("checkVal " + checkVal)
		  var btncalculateCaloryFlag = document.getElementById('calculateCaloryFlag');
		  if(btncalculateCaloryFlag !== null)
		  {
		//  console.log(btncalculateCaloryFlag.offsetTop);
		  if(typeof(btncalculateCaloryFlag.offsetTop) !== "undefined" && btncalculateCaloryFlag.offsetTop !== null && btncalculateCaloryFlag.offsetTop)
		  {
			checkVal = btncalculateCaloryFlag.offsetTop - 300;
		  }
		  }
		//  console.log(document.documentElement.scrollTop);
		  var btnsaveplan= document.getElementById('btnsaveplan');
		  if(btnsaveplan !== null)
		  { 
		  if(document.documentElement.scrollTop > checkVal )
		  {
			btnsaveplan.setAttribute("class", "saveplan ")
		  }
		  else
		  {
			btnsaveplan.setAttribute("class", "saveplan floatbtn")
		//	btnsaveplan.setAttribute("class", "saveplan")
		  }
		  }

		  var recipelistpnael = document.getElementById('recipelistpnael');
		//  console.log(recipelistpnael.offsetTop);
		// console.log(recipelistpnael.offsetLeft);
		  var w = window.innerWidth;
		  console.log("w " + w);
		  var btnsaveplan1= document.getElementById('recipes-container');
		  console.log(btnsaveplan1);
		  if(btnsaveplan1 !== null)
		  { 
		  if(document.documentElement.scrollTop > 100 && document.documentElement.scrollTop < (checkVal))
		  {
			
			  var leftP = (w - 1275)/2;
			  if(leftP > 0)
			  btnsaveplan1.style.left = leftP + "px";
			  else 
			  btnsaveplan1.style.left = "10px";

			btnsaveplan1.setAttribute("class", "container-fluid side-recipes floatpanel")
		//	btnsaveplan1.setAttribute("class", "container-fluid side-recipes")
		  }
		  else
		  {
			btnsaveplan1.setAttribute("class", "container-fluid side-recipes ")
		  }
		  }
	  }

	  downloadplan()
	  {
		if(!this.planCompleteStatus)
		{
			this.toastr.warning('Plan is not yet completed.', 'Meal Plan');
		}
		else
		{
			if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
			{
			//	var path = "https://dentavacation.com/mobileapp/api/generate_pdf.php?id=" + this.plan["id"];
				this.pdfService.createpdf(this.plan["id"]).subscribe(dData => setTimeout(() => {
					if(dData !== null )
					{
					var mealPlan ={};
					mealPlan["mealplan"] = this.plan["name"];
					mealPlan["link"] = environment.apiUrl + "/" + dData["filename"];
					var link = document.createElement('a');
					link.href = mealPlan["link"];
					link.target = "_blank";
					link.click();

					}
				}));
			}
		}
	}
	calculateTotalNutrient(col)
	{

		var mMacro1 = [];

		if(this.loadedPlan)
		{
		for(let i=0; i < this.plan["days"][col]["meals"]["length"]; i++)
		{
			var dItem = this.plan["days"][col]["meals"][i];
			
			if(typeof(dItem["recipe"]) !== "undefined" && dItem["recipe"] !== null)
			{

				var fIndex1s = mMacro1.findIndex(x1=>(x1.name == "calories"));
				if(fIndex1s > -1)
				mMacro1[fIndex1s]["value"] = parseFloat(mMacro1[fIndex1s]["value"]) +parseFloat(dItem["recipe"]["calories"]);
				else
				mMacro1.push({"name" : "calories", "value" : parseFloat(dItem["recipe"]["calories"]), "unit" : "cal"});
		
				if(typeof(dItem["recipe"]["minerals"]) !== "undefined")
				{
				for(let j=0; j < dItem["recipe"]["minerals"]["length"]; j++)
				{
					var dmItem1 = dItem["recipe"]["minerals"][j];
			
					var lbl1 = dmItem1["name"].toLowerCase();

					var fIndex1 = mMacro1.findIndex(x1=>(x1.name.toLowerCase() == lbl1));
					if(fIndex1 > -1)
					mMacro1[fIndex1]["value"] = parseFloat(mMacro1[fIndex1]["value"]) + dmItem1["value"];
					else
					mMacro1.push({"name" : lbl1, "value" : dmItem1["value"], "unit" : dmItem1["unit"]});

				}
				}
				
			}
		}
	}
	
	return mMacro1;
	}


	calculateTotalNutrientPServing(col)
	{

		var mMacro = [];

		if(this.loadedPlan)
		{
		for(let i=0; i < this.plan["days"][col]["meals"]["length"]; i++)
		{
			var dItem = this.plan["days"][col]["meals"][i];

			if(dItem["recipe"] !== null)
			{
			
				var servings = 1;
				if(typeof(dItem["recipe"]["yield"]) !== "undefined" && dItem["recipe"]["yield"] !== null && dItem["recipe"]["yield"] !== "" && dItem["recipe"]["yield"] !== "0" && dItem["recipe"]["yield"] !== 0)
				servings = parseInt(dItem["recipe"]["yield"]);
				var fIndex1s = mMacro.findIndex(x1=>(x1.name == "calories"));
					if(fIndex1s > -1)
					mMacro[fIndex1s]["value"] = parseFloat(mMacro[fIndex1s]["value"]) +parseFloat(dItem["recipe"]["calories"])/ servings;
					else
					mMacro.push({"name" : "calories", "value" : parseFloat(dItem["recipe"]["calories"])/ servings, "unit" : "cal", "yield":servings});
			
				if(typeof(dItem["recipe"]["minerals"]) !== "undefined")
				{
				for(let j=0; j < dItem["recipe"]["minerals"]["length"]; j++)
				{
					var dmItem1 = dItem["recipe"]["minerals"][j];

					var lbl1 = dmItem1["name"].toLowerCase();

					var fIndex1 = mMacro.findIndex(x1=>(x1.name == lbl1));
					if(fIndex1 > -1)
					mMacro[fIndex1]["value"] = parseFloat(mMacro[fIndex1]["value"]) +parseFloat(dmItem1["value"])/ servings;
					else
					mMacro.push({"name" : lbl1, "value" : parseFloat(dmItem1["value"])/ servings, "unit" : dmItem1["unit"], "yield":dItem["recipe"]["yield"]});
				}
				}
				
			}
		}
	}
	

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
		console.log(" in getIngredientsList");
	  var ingredientsList = [];

	  var consList = [];
	  for(let i=0; i < this.plan["days"]["length"]; i++)
	  {

		var itemday = this.plan["days"][i];
		for(let j=0; j < this.plan["days"][i]["meals"].length; j++)
		{
			var itemmeal = this.plan["days"][i]["meals"][j];
			console.log(itemmeal);
		  if(typeof(itemday) !== "undefined" && typeof(itemmeal["recipe"]) !== "undefined" && itemmeal["recipe"] !== null)
		  {
		
			if(typeof(itemmeal["recipe"]["ingredients"]) !== "undefined" && itemmeal["recipe"]["ingredients"] !== "")
		   {
		
			  if(itemmeal["recipe"]["ingredients"].length  < 4999)
			  {
				  try{
					var tempA = JSON.parse(itemmeal["recipe"]["ingredients"]);
			
					for(let k=0; k < tempA.length; k++)
					{
					  ingredientsList.push(tempA[k]['text'])
					  var t1 = this.formatText(tempA[k]['text']);
						var t = tempA[k]['food']

					  	var fIndex = consList.findIndex(x=>(x.name.toLowerCase().trim() ===  t.toLowerCase().trim()));
						  if(fIndex > -1)
						  {
							consList[fIndex]['quantity'] =  parseFloat(consList[fIndex]['quantity' ] ) +  tempA[k]['quantity'];
							consList[fIndex]['weight'] =  parseFloat(consList[fIndex]['weight' ] ) +  tempA[k]['weight'];

						  }
						  else
						  {
							  var unit = "";
							  if( tempA[k]['measure'] !== "<unit>")
							  unit = tempA[k]['measure'];

							consList.push({"name": tempA[k]['food'].toLowerCase(), 'quantity':  tempA[k]['quantity'], 'weight': tempA[k]['weight'], 'unit': unit})
						  }
						 
						  

					}
					
				  }
				  catch(error)
				  {
					  console.log("Error");
					  console.log(error);
				  }
			
		}
		  }
	
		  }
		}
	  }

		consList = consList.sort(this.sortArraybyIndex);
	  this.shoppingList = consList
	  console.log(this.shoppingList);
	  this.openModal("popuppanel");
	}

	sortArraybyIndex(a, b) {
		if ( a['name'] < b['name'] ){
			return -1;
		  }
		  if ( a['name'] > b['name'] ){
			return 1;
		  }
		  return 0;
	}

	formatText(str)
	{
		var retStr = str;
		if(str !== "")
		{
		
			retStr = this.helpService.formatText(str);
		}
		return retStr;
	}
	openModal(id)
	{
		console.log(id);
		this.modalService.open(id);
	}
	closeModal(id)
	{
		this.modalService.close(id);
	}

	loadFilterLabels()
	{
		this.cuisineTypeList = [];
		for(let c=0; c < constants.cuisineTypeList.length; c++)
		{
			this.cuisineTypeList.push({"name":constants.cuisineTypeList[c], "selected":false})
		}

		
		this.mealTypeList= [];
		for(let d=0; d < constants.mealTypeList.length; d++)
		{
			this.mealTypeList.push({"name":constants.mealTypeList[d], "selected":false})
		}


		this.dietLabelsList= [];
		for(let d=0; d < constants.dietLabels.length; d++)
		{
			this.dietLabelsList.push({"name":constants.dietLabels[d], "selected":false})
		}

		
		this.healthlabelsList= [];
		for(let h=0; h < constants.healthLabelsNew.length; h++)
		{
			this.healthlabelsList.push({"name":constants.healthLabelsNew[h], "selected":false})
		}

	
		this.mineralsLabelsList= [];
		for(let m=0; m <constants.minerals_new.length; m++)
		{
		
			this.mineralsLabelsList.push({"name":constants.minerals_new[m]["name"], "selected":false, "unit":constants.minerals_new[m]["unit"],  "min":"", "max":"", "t_min":"", "t_max":""})
		}
		this.loadNutrientsMaxMin();
	}
	maxcalories: any = "";
	searchFilters()
	{
		console.log("in searchFilters");
		var dietlabels = "";
	
		if(typeof(this.maxcalories) !== "undefined" && this.maxcalories !== ""){
		 this.filtersParams["calories"] = this.maxcalories;
		}
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

		var cuisinetypes = "";
		console.log(this.cuisineTypeList);
	 for(let c=0; c <this.cuisineTypeList.length; c++)
	 {
		 if(this.cuisineTypeList[c]["selected"])
		 cuisinetypes = this.cuisineTypeList[c]["name"] + "~";
	 }

	 if( cuisinetypes !== "")
	 {
		cuisinetypes=  cuisinetypes.slice(0, -1);
		 this.filtersParams["cuisinetypes"] = cuisinetypes;
	 }
	   
	 var mealtypes = "";
	 for(let c=0; c <this.mealTypeList.length; c++)
	 {
		 if(this.mealTypeList[c]["selected"])
		 mealtypes = this.mealTypeList[c]["name"] + "~";
	 }

	 if( mealtypes !== "")
	 {
		mealtypes=  mealtypes.slice(0, -1);
		 this.filtersParams["mealtypes"] = mealtypes;
	 }


		var mQuery = "";
		for(let m=0; m <this.mineralsLabelsList.length; m++)
		{
			if(this.mineralsLabelsList[m]["selected"])
			{
	
			var item = this.mineralsLabelsList[m];
            if(item["selected"])
            {
              console.log(item);
              if(typeof(item["min"]) !== "undefined" && item["min"] !== "" && item["min"] >0)
              {
                mQuery += " " + item["name"].toLowerCase() + " >= " + item["min"] + " AND ";
              }
              if(typeof(item["max"]) !== "undefined" && item["max"] !== "" && item["max"] >0)
              {
                mQuery += " " + item["name"].toLowerCase() + " <= " + item["max"] + " AND ";
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

	
		this.loadRecipes('', true);
		//this.closeModal('searchFiltersPopup');
		//this.clearFilterValues();
	}


	
	loadNutrientsMaxMin()
  {
   
    if(this.mineralsLabelsList["length"] > 0 && this.nutrientDbFields["length"] > 0)
    {
    
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

    var params1 = {};
    var nutrientFields = constants.nutrientDbFields;
 
    var query = "";
    for(let i=0; i < nutrientFields.length; i++)
    {
      var lbl = nutrientFields[i];
     
      query += " min(" + lbl + ") min" + lbl +", ";
      query += " max(" + lbl + ") max" + lbl + ", ";
    }

    query = query.slice(0, -2);
    params1["query"] = "Select " + query + " from nutrients";

   var res =   this.dbService.getDatabyQuery("recipes", params1).subscribe(invData => setTimeout(() => {


    if(invData["body"]["length"] > 0)
    {
      this.nutrientDbFields = invData["body"];

    }
   }))
  
  }
  formatVal(str, limit = 0)
  {
	var retVal = str;
	if(str !== "")
	{
	if(limit == 0)
	  retVal = Math.ceil(parseFloat(str));
	  else
	  retVal = parseFloat(str).toFixed(limit);
	}
	return retVal;
  }

  formatValPServing(str, serving)
  {
	
	var retVal = this.helpService.formatValuePServing(str, serving);
	return retVal;
  }

  clearFilterValues(){

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
	
	this.maxcalories = "";
	
}

/********** new plan  */


showhidecontent(recipe)
{
	recipe.showpopup = !recipe.showpopup
/*	for(let r = 0; r < this.displayList.length; r++)
	{
		if(recipe.id !== this.displayList[r]["id"])
		{
			this.displayList[r]["showpopup"] = false;
		}
	}
*/
	for(let i = 0; i < this.recipesList.length;i++)
	{
		if(this.recipesList[i]["id"] !== recipe.id)
		{
			this.recipesList[i]["showpopup"] = false;
			this.recipesList[i]["showAdd2MP"] = false;
		}
	}

}

showDayData(rowindex)
{
	for(let i = 0; i < this.plan['days']["length"] ; i++)
	{
		if(i !== rowindex)
		{
			this.plan['days'][i]["expand"] = false;
		}
	}
	this.plan['days'][rowindex]["expand"] = true;
}

 /********* Add to collections  */
 selectedRecipe2Add2Collection: any;
 addCollectionsPopup(recipe)
 {


   this.loadCollectionNames();
this.selectedRecipe2Add2Collection= recipe;
recipe.showAdd2C = !recipe.showAdd2C; 

}
collectionsList:Array<any>=[];
collection: any = {"id":'', "day":"", "mealType":""};
showAdd2C: boolean = false;
loadCollectionNames()
{
   if(this.currentUser && this.currentUser["id"])
   {
   this.collectionsList = [];

   var params = {};
   console.log(params);
   params ['query'] = "select id, collection_name from collection where created_by = " + this.currentUser["id"];
   var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {

	 console.log(invData);
	 if(invData !== null)
	 {
	   var obj = invData["body"]["length"];
	   this.collectionsList = invData["body"];
	 }
	
   }));
   }
}

add2Collection(recipe)
{

   console.log(this.plan);

   var paramsr = {};
   paramsr["collection_id"] = this.collection["id"];
   paramsr["recipe_id"] = recipe["id"];
   paramsr["created_by"] = this.currentUser["id"];

   var res =   this.dbService.getDataByTable("recipe_mapping", paramsr).subscribe(invData => setTimeout(() => {
	
	 if(invData !== null && invData["body"]["length"] > 0)
	 {
	   this.toastr.success("Recipe has been already added to the collection.","Add Recipe to Collection");
	 }
	 else
	 {
	   var res =   this.dbService.postDataByTable("recipe_mapping", paramsr).subscribe(invData => setTimeout(() => {
		   this.toastr.success("Recipe has been added to the collection.","Add Recipe to Collection");
	   }));
	 }
	 recipe.showAdd2C = false;
   }));

}
daysList: Array<any>=[];
loadOptions()
{

	this.daysList = [];
	for(let d=0; d < 7; d++)
	{
		this.daysList.push({"id":d, "name":"Day " + (d+1)});
	}



}
selectedRecipe2Add2plan: any;
addtoplan: any;
addtoMealPlan(recipe)
{
	this.addtoplan = {};

	
	this.loadOptions();
this.selectedRecipe2Add2plan= recipe;
recipe.showAdd2MP = !recipe.showAdd2MP; 

}
add2Plan()
{
	console.log(this.selectedRecipe2Add2plan);
	console.log(this.addtoplan);
	console.log(this.mealTypeList);
	var r = this.addtoplan["day"];
	var c = this.addtoplan["mealType"];
	var mtype = this.mealTypeList.findIndex(x=>(x.name == this.selectedRecipe2Add2plan.mealType));
	console.log(mtype);


	var recipeItem = this.selectedRecipe2Add2plan;
	console.log(recipeItem);
	var totalCals = 0;
	for(let i=0; i <this.plan["days"][r]["meals"]["length"]; i++)
	{
		console.log(this.plan["days"][r]["meals"][i]);
		if(typeof(this.plan["days"][r]["meals"][i]["calories"]) !== "undefined")
		{
			console.log( parseInt(this.plan["days"][r]["meals"][i]));
			totalCals += parseInt(this.plan["days"][r]["meals"][i]["calories"]) / parseInt(this.plan["days"][r]["meals"][i]["yield"]);
		}
	}

	totalCals += parseInt(recipeItem["calories"])/parseInt(recipeItem["yield"]);
	console.log("totalCals " + totalCals);

	if(this.maxcaloryperday > 0 && totalCals > this.maxcaloryperday  )
	{
		//alert("Per day calories is more than your maximum calorie consumption for the day");
		this.toastr.warning('Per day calories is more than your maximum calories consumption for the day');
	}
	else
	{
	

this.plan["days"][r]["meals"][c]["recipe"] =  this.formatRecipe(recipeItem);

	
		if(this.plan["id"] !== "" )
		{
			this.SavePlanData(r, c);
		}
		
	}

	this.CheckStatus();
}

loadCustom:boolean = false;
loadCustomRecipes()
{
	var params = {};
	console.log(this.filtersParams);
	params["returnfields"] = " id, label, image, cuisineType, mealType, healthLabels,ingredients,  dietLabels, totalNutrients, digest,calories, yield ";

	 params["created_by"] = this.currentUser["id"];

	 this.recipesloading = true;
	var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
	   this.recipesloading = false;
		console.log(invData);
	 if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	   {		 
		  this.loadCustom = true;
			this.recipesList = [];
			   this.formatResult(invData);
		   
	   }
	}));
}

loadFavourites()
{
	var params = {};
	console.log(this.filtersParams);
	params["query"] = "select id, label, image, cuisineType, mealType, healthLabels,ingredients,  dietLabels, totalNutrients, digest,calories, yield from recipes where id in (select recipeid from favourites where userid = " + this.currentUser["id"] + ")";

	// params["created_by"] = this.currentUser["id"];

	 this.recipesloading = true;
	var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
	   this.recipesloading = false;
		console.log(invData);
	 if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	   {		 
		this.loadCustom = true;
			this.recipesList = [];
			   this.formatResult(invData);
		   
	   }
	}));
}


startPlan()
	{
		if(this.planCompleteStatus)
		{
		console.log("start Plan");
	  var params = {};
	  if(this.currentUser !== null && this.currentUser["id"] !== "")
	  {
		params["userid"] = this.currentUser["id"];
		params["mealplanid"] = this.routeParams.id;
		params["startdate"] = new Date();
		params["status"] = 1;
		console.log(params);
		var res =   this.dbService.postDataByTable("mealplan_user_mapping", params).subscribe(invData => setTimeout(() => {
			console.log(invData);
		if(invData !== null)
		{
			this.router.navigate(["schedule", {id:this.routeParams.id, mum_id:invData["inserted_id"], userid: this.currentUser["id"]}]);
		
		}
		}));
	  }
	}
	else
	{
		this.toastr.warning('Plan is not yet completed.', 'Meal Plan');
		
	}
}

}

	