import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router} from "@angular/router";

import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { constants } from '../../assets/data/constants';
import { environment } from "../../environments/environment";
@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
	count: any = 0;
	sliderList: Array<any> = [];
	recommendedRecipes: Array<any> = [];
	healthLabels: Array<any> = [];
	RecipeoftheDay: Array<any> = [];
	currentUser: any ;
	showNutrientsFlag: boolean = false;
	role: any = {"isTrialExpired":false, "isPremium":false, "isProfessional":false};
	greetings: any = "";
	playstoreUrl: any = "";
	isUser: any = {};
	images: any;
	isMobile: boolean  = false;
constructor(private router: Router, private httpClient : HttpClient, private sanitizer: DomSanitizer , public dbService: DBService, public helpService: HelpService) {
	this.RecipeoftheDay = [];
	}

	ngOnInit() {
		this.isMobile = this.helpService.isMobile();
		this.images = {};
		this.images["appstore"]  = "assets/app-store.png"; 
		this.images["playstore"]  = "assets/play-store.png";
		this.images["mobilescreens"] ="assets/mtc_s.jpg";
		this.images['goodfood']  = "assets/images/temp-images/good-food.jpg";
		this.currentUser =this.helpService.getCurrentUser();
		this.playstoreUrl= environment.playstoreUrl;
		if(this.currentUser !== null)
		{
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  {
		  this.currentUser["displayname"] = this.currentUser["username"];
		  if(this.currentUser["displayname"].indexOf("@") !== -1)
		  {
			  var t = this.currentUser["displayname"].split("@");
			  this.currentUser["displayname"] = t[0];
		  }
		  }

		this.getUserPreferences();
		this.role = this.helpService.getRoleStatus(this.currentUser);
		this.showNutrientsFlag = this.helpService.showorhideNutritions(this.role);
		}

		this.isUser = this.helpService.setUserRoles(this.currentUser);

		this.greetings = this.helpService.getGreetings();
	

		this.getPlanStatus();
		this.count++;

		this.loadHealthLabels();
	
	this.loadIngredients();
	}

	defaultRecipeofTheDay()
	{
		this.httpClient.get('assets/data/recipeoftheday.json').subscribe(
			recipeoftheday => {        
			  if(recipeoftheday){
				this.RecipeoftheDay = [];
				this.RecipeoftheDay.push(recipeoftheday);

			  }else{
				this.defaultRecipeofTheDay();
			  }
			});  

	}
	loadRecommendedRecipes()
	{

	  this.recommendedRecipes = [];
  
	  var params = {};

	  var query = "select id, label, image, calories, yield, source, dietLabels, healthLabels from recipes  ";
	  var qWhere = " where s_instructions != '' AND label != '' AND image != '' ";

	/*  if(sessionStorage.getItem("healthLabels"))
	  {
		qWhere  += " AND (" + sessionStorage.getItem("healthLabels") + ") ";
	  }
	 */

	  if(sessionStorage.getItem("dietLabels"))
	  {
		qWhere  += " AND (" + sessionStorage.getItem("dietLabels") + ") ";
	  }

	  /*
	  if(typeof(this.userPref) !== "undefined" && this.userPref !== null && typeof(this.userPref["dietLabels"]) !== "undefined" && this.userPref["dietLabels"] !== null && this.userPref["dietLabels"] !== "")
	  {
		qWhere += " AND dietLabels = '" + this.userPref["dietLabels"] + "' AND dietLabels != ''  ";
	  }
	  */
	  params["query"]= query + qWhere + " order by rand() limit 0, 4";


	  var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
     
	   if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		 {
		   this.recommendedRecipes = [];
		   for(let i=0; i < invData["body"]["length"] ; i++)
		   {
			 this.recommendedRecipes.push(invData["body"][i]);
			
		   }
	//	   console.log(this.recommendedRecipes)
		 }

	   }
	 
	  ));
	
	}

	checkRecipeoftheDay()
	{
	
	  var params = {};
		  var tempDt2 =  this.helpService.todayDate();  
	  var tempDt ="";
	  tempDt = tempDt2.month + "-" + tempDt2.day + "-"  + tempDt2.year ;

	params["query"] = "select * from recipeoftheday where datetime = '" + tempDt + "'";
		////console.log(params["query"]);
	 var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
			var item = invData["body"][0];
			this.loadRecipeoftheDay(item["recipeid"]);	 
		
		}
		else
		{
			this.loadRecipeoftheDay("");
		}
   
	 }));
  
	}
	loadRecipeoftheDay(id="")
	{

	  this.RecipeoftheDay = [];
	  var params = {};
	
	if(id == "")
	params["query"] = "select id, label, image, healthLabels, dietLabels, calories, totalWeight, yield from recipes where s_instructions != '' order by rand() limit 1";
	else
	params["query"] = "select id, label, image, healthLabels, dietLabels, calories, totalWeight, yield from recipes where id= " + id + "";

	 var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
     		   		
			this.RecipeoftheDay.push(invData["body"][0]);		
		  	if(id == "") 
			  this.setRecipeoftheDay(this.RecipeoftheDay[0]);
		}

	 }));
  
	}
	
	setRecipeoftheDay(recipe)
	{
	
		var params = {};
		var d = new Date();
		var tempDt2 = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
		var tempDt ="";
		tempDt = tempDt2.month + "-" + tempDt2.day + "-"  + tempDt2.year ;
  

	  	params["query"] = "select * from recipeoftheday where datetime = '" + tempDt + "'";
		  ////console.log(params["query"]);
	   var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {

		if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		  {
			
		  
		  }
		  else
		  {
			var params1 = {};
    
			var d = new Date();
			var tempDt2 = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
			var tempDt ="";
			tempDt = tempDt2.month + "-" + tempDt2.day + "-"  + tempDt2.year ;
	  
		  params1["query"] = "INSERT into recipeoftheday (recipeid, datetime) values(" + recipe["id"] + ", '" + tempDt + "')";
			  ////console.log(params1['query']);
	  
		   var res =   this.dbService.getDatabyTablebyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
			  
				  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
				  {
		  
	  
				  }
	  
				  }));
		  }
		 ////console.log(this.RecipeoftheDay);
	   }));
	 

  
	}
	formatValuePServing(str, servings)
	{
  
	  var retVal = this.helpService.formatValuePServing(str, servings);
	  return retVal;
	}
	loadHealthLabels()
	{
	  this.healthLabels = [];
	
				 //var arrLabel = constants.healthLabelsWithImages;
				 var arrLabel = constants.hLabelsWithImages;
				 if(arrLabel.length > 0)
				 {
				   for(let l=0; l < arrLabel.length; l++)
				   {
					  this.healthLabels.push({"label":arrLabel[l]["name"], "image":arrLabel[l]["image"]});
				   }
				 }
			  
				 this.currentItem = this.healthLabels[0];
				 this.setIndexHLabel();
	}

	currentItem : any  = "";
	currentHIndex: any = 0;
	setCurrentImg(item, index)
	{
		this.currentHIndex = index;
		this.currentItem = item;	
		this.currentItem["class"] = "wow zoomIn";
	}
	setIndexHLabel()
	{
		this.currentItem = this.healthLabels[this.currentHIndex];
	//	console.log(this.currentItem);
		this.currentItem["class"] = "wow zoomIn "
		setTimeout(() => {
			this.currentHIndex++;
			if(this.currentHIndex > 7 )
			this.currentHIndex = 0;
			this.setIndexHLabel();

		},4000);
	}

	loadHealthLabelsfromDB()
	{
	  this.healthLabels = [];

	  var params = {};
	  
	  params["returnfields"]=" healthLabels ";
	
  
	  var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
   
	   if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		 {
		   this.healthLabels = [];
		   for(let i=0; i < invData["body"]["length"] ; i++)
		   {
			 var temp =invData["body"][i];
			 if(typeof(temp["healthLabels"]) !== "undefined")
			 {
			   var tempLabel = temp["healthLabels"];
			   if(tempLabel !== "")
			   {
				 var arrLabel = tempLabel.split("~");
				 if(arrLabel.length > 0)
				 {
				   for(let l=0; l < arrLabel.length; l++)
				   {
					 var indexLbl = this.healthLabels.findIndex(x=> x.label == arrLabel[l])
			   
					 if(indexLbl == -1)
					 {
						var img = "assets/menu/veg.png";
						if(arrLabel[l].toString().toLowerCase().indexOf("vegetarian") !== -1)
						{
						  img = "assets/menu/vegetarian1.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("vegan") !== -1)
						{
						  img = "assets/menu/vegan.png";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("peanut-free") !== -1)
						{
						  img = "assets/menu/peanutfree.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("sugar-conscious") !== -1)
						{
						  img = "assets/menu/sugarfree.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("alcohol-free") !== -1)
						{
						  img = "assets/menu/alcoholfree.png";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("balanced") !== -1)
						{
						  img = "assets/menu/balanced-diet.png";
						}
					  this.healthLabels.push({"label":arrLabel[l], "image":img, "count":1});
					  
					 }
					 else
					 {
					  this.healthLabels[indexLbl]["count"]=this.healthLabels[indexLbl]["count"]+1;
					 }
				   }
				 }
			   }
  
			 }
			 
		   }
		 }

	   }
   
	  ));
   
	}

	limitTo(str, num)
	{
		return this.helpService.limitTo(str, num) + "...";
	}

	formatImage(image, type)
	{

	  var retImage = image;
	  if(image !== "" && type !== "")
	  {
		retImage = this.helpService.formatImage(image, type);
		
	  }

	  return retImage;
	}

	gotoRecipeDetails(page, id){

		if(page == "collection" || page == "recipebookview")
		{
			this.router.navigate([page, {id:id}]);
		}
		else if(page == "recipedetails")
		{
			this.router.navigate([page, id]);
		}
		
	}

	gotoRecipes(type, name) {
		if(type == "healthLabels")
		this.router.navigate(['recipes', {healthLabels:name}]);
		if(type == "q")
		this.router.navigate(['recipes', {q:name}]);

	}
	gotopage(page, id = null) {
		if(id !== null)
		{
			if(page == "schedule")
			{
				this.router.navigate([page, {id:id, mum_id:this.planStatus[0]["mum_id"], userid: this.currentUser["id"]}]);
			}
			else
			{
			this.router.navigate([page, id]);
			}	
		}
		else
		{
			this.router.navigate([page]);
		}	
	}
	formatValue(str)
{

	var retValue = str;
	if(str !== "")
	{
		retValue = parseFloat(str).toFixed(2);
	}

	return retValue;
}
formatLabels(str)
{

	var retArr = [];
	retArr.push(str);
	if(str !== "")
	{
		retArr = [];
		retArr = str.split("~");
	}
	return retArr;
}



mealplans: Array<any> = [];


loadMealPlan()
  {
    this.mealplans = [];
   // this.recipes = recipesList;
    var params = {"query": "SELECT * FROM mealplan where status=1 ORDER BY RAND() LIMIT 1"};

    var res =   this.dbService.getDatabyTablebyQuery("mealplan", params).subscribe(invData => setTimeout(() => {

     if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
       {
         this.mealplans = [];
         for(let i=0; i < invData["body"]["length"] ; i++)
         {
           this.mealplans.push(invData["body"][i]);
         }
       }
     }
   
    ));
 
  }

  planStatus: Array<any>= []; 
  plan: any;
getPlanStatus()
{

  if(this.currentUser && this.currentUser["id"] !== null && this.currentUser["id"] !== "")
  {

	var params = {"query": "SELECT mum.id mum_id, mum.startdate startdate,mp.id id, mp.name mpname, mp.tags FROM mealplan_user_mapping mum, mealplan mp where mum.userid = " + this.currentUser["id"] + " AND mp.id = mum.mealplanid AND mp.status=1 AND mum.status = 1 "};


	  var res =   this.dbService.getDatabyTablebyQuery("mealplan_user_mapping", params).subscribe(invData => setTimeout(() => {


		
	if(invData !== null)
	{
	 
	  if(invData["body"]["length"] > 0)
	  {
		this.planStatus = invData["body"];

		this.plan = invData["body"][0];
		var temp = this.plan["startdate"].split("T");
		this.plan["startdate"] = temp[0];

			var Difference_In_Time = new Date().getTime() - new Date(this.plan["startdate"] ).getTime(); 
				
		var diff_days = Difference_In_Time / (1000 * 3600 * 24); 

		this.loadDaysData(diff_days);

	  }
	  else
	  {
		this.loadMealPlan();
	  }
	}
	else
	{
	  this.loadMealPlan();
	}
	}));
  }
}



userPref: any ;
user_ipaddress: any;
uniqueid: any;

getUserPreferences()
{

  this.userPref = {};
  var params ={};
  var paramFound = false;
  var qWhere = "";

  this.user_ipaddress = this.currentUser["user_ipaddress"];
  this.uniqueid = this.currentUser["uniqueid"];

  if(typeof(this.user_ipaddress) !=="undefined" && this.user_ipaddress !== null && this.user_ipaddress !== "")
  {
	params["user_ipaddress"] = this.user_ipaddress;
	paramFound = true;
	qWhere  = " user_ipaddress = '" + this.user_ipaddress  + "' ";
  }
 
  if(typeof(this.uniqueid) !=="undefined" && this.uniqueid !== null && this.uniqueid !== "")
  {
	params["uniqueid"] = this.uniqueid;
	paramFound = true;
	if(qWhere == "")
	{
	  qWhere  += " user_uniqueid = '" + this.uniqueid + "' " ;
	}
	else
	{
	  qWhere  += " OR user_uniqueid = '" + this.uniqueid  + "'  " ;
	}
  }
 

	if(paramFound)
	{
   
	  var params1 = {};
	  params1["query"] = "select * from questionnaire ";
	  if(qWhere !== "")
	  {
		params1["query"] += " where " + qWhere;
	  }
	  var res =   this.dbService.getDatabyTablebyQuery("recipes", params1 ).subscribe(qData => setTimeout(() => {

	  if(qData !== null && qData["body"] && qData["body"]["length"] > 0)
	  {
		if( qData["body"][0]["question9"] !== "")
		{
		  sessionStorage.setItem['userPref'] = qData["body"][0];
		  sessionStorage.setItem['userPref_dietLabels'] = qData["body"][0]["question9"];
		  this.userPref["dietLabels"] = qData["body"][0]["question9"];
		}
	  }
	 
	  this.loadcollections();
	  this.loadRecommendedRecipes();
	} ));

  }
  else
  {
	   
	this.loadcollections();
	this.loadRecommendedRecipes();
  }
}

transform(value: any) {

	var retvalue = this.sanitizer.bypassSecurityTrustHtml(value);

    return retvalue;
  }
  collectionsList: Array<any> = [];
  loadcollections()
  {

 
	  this.collectionsList = [];

	  var params = {"query": "SELECT c.*, COUNT(rm.id) AS recipecount, u.email, u.firstname, u.lastname FROM collection AS c LEFT JOIN recipe_mapping AS rm ON c.id = rm.collection_id LEFT JOIN users AS u ON c.created_by = u.id where c.status =1 GROUP BY c.id limit 1, 4"};

	  var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {

		if(invData !== null)
		{
		  var obj = invData["body"]["length"];

		  this.collectionsList = invData["body"];
		  for(let o=0; o <  this.collectionsList.length; o++)
		{
			this.collectionsList[o]["userjoined"] = false;
			this.collectionsList[o]["image"] =encodeURI( this.collectionsList[o]["image"]);
		}

		  this.loaduserCount();
		}


		this.loadDietRecipes();
	  }));
  
	  

  }
  
  loaduserCount()
  {

	var params = {"query": "SELECT c.id, COUNT(cj.id) AS usercount 	FROM collection AS c LEFT JOIN  collection_join AS cj ON c.id = cj.collection_id GROUP BY c.id, cj.collection_id LIMIT 0, 4"};

	var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {

	 
	  if(invData !== null)
	  {
		var obj = invData["body"];
		for(let o=0; o < obj.length; o++)
		{
			var fIndex = this.collectionsList.findIndex(x=>(x.id === obj[o]["id"]));
			
			if(fIndex > -1)
			{

				this.collectionsList[fIndex]["userscount"] = obj[o]["usercount"];

			}
		}

	  }
	  this.loaduserJoinedStatus();
	}));

  }
  loaduserJoinedStatus()
  {

	var params = {"query": "SELECT id, collection_id from collection_join where userid = " + this.currentUser["id"] };

	var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {

	 
	  if(invData !== null)
	  {
		var obj = invData["body"];
		for(let o=0; o < obj.length; o++)
		{
		
			var fIndex = this.collectionsList.findIndex(x=>(x.id === obj[o]["collection_id"]));
			
			if(fIndex > -1)
			{

				this.collectionsList[fIndex]["userjoined"] = true;

			}
		}

	  }
	}));

  }

  joincollection(id)
  {
	var params = {};

	params ['query'] = "select * from collection_join where collection_id = " + id + " AND userid = " + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("collection_join", params).subscribe(invData => setTimeout(() => {
	  if(invData !== null && invData["body"]["length"] > 0)
	  {
		
	  }
	  else
	  {
		var params = {};
		params["collection_id"] =id;
		params["userid"] =this.currentUser["id"];
		
		var res =   this.dbService.postDataByTable("collection_join", params).subscribe(dData => setTimeout(() => {
			alert("Joined collection ");
		}));

	  }
	}));
  }
  foodCategory: any = {};
  measure: any = {};
  food: any = {};
  loadIngredients()
  {
	
  }

  welcomeMessage: any = "";
  errorMessage: any = "";
  mealTypeList: Array<any> = [];
  planExpired: boolean = false;
	loadDaysData(diff_days)
	{
	//console.log(this.plan);
	this.plan["days"] = [];
	  var idslist = "";
	  var diff_days_ceil = Math.ceil(diff_days);
	  var param_day_num = 0;
	  if(diff_days_ceil > 0) 
	  param_day_num = diff_days_ceil -1;
	  this.errorMessage  = "";
	  this.welcomeMessage= "Your <b>Day " + (diff_days_ceil) + "</b> Plan";
  if(diff_days_ceil > 7)
  {
	  	this.planExpired= true;
		  this.loadMealPlan();
  }
  else
  {
	  if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
	  {
		var params = {};
		 
		  params["meal_plan_id"] = this.plan["id"];
		  params["day_num"] = param_day_num;
		  this.mealTypeList = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
//console.log(params);
		var res =   this.dbService.getDataByTable("days", params).subscribe(dData => setTimeout(() => {

		  if(dData !== null)
		  {
			if(dData["body"] !== null && dData["body"]['length'] > 0)
			{
			  for(let i=0; i < dData["body"]['length'] ; i++)
			  {
				this.plan["days"][i]= dData["body"][i];
  
				for(let j=0; j < this.mealTypeList['length']; j++)
				{
				  var t = this.plan["days"][i][this.mealTypeList[j]];
				  if(t !== "")
				  idslist += t + ",";
				}
		
				
			  }
			  
			 

			
			}
			
		  }
		  if(idslist !== "")
		  {			
			idslist = idslist.substring(0, idslist.length-1);
			this.loadRecipes(idslist);
			this.getCompleteStatus();
		  }
		 
		}))
	  }
	}
	}


	completeStatus: any ;
  mealtypes: any = [];
  getCompleteStatus()
  {
    var currentUser = this.helpService.getCurrentUser();
    var  params = {};
    params["userid"] = currentUser["id"];
    params["mealplanid"] =this.planStatus["id"];
    params["dayid"] =this.plan["days"][0]["id"];
 

   
    this.planStatus["consumedcalories"] = 0;
    var res =   this.dbService.getDataByTable("user_days_status", params).subscribe(invData => setTimeout(() => 
    {
     //   console.log(invData);
        if(invData !== null && invData["body"]["length"] > 0)
        {
          this.mealtypes = ["breakfast","snack1","lunch","snack2","dinner"];
          this.completeStatus = invData["body"][0];
 
          var idslist = "";
          for(let m=0; m < this.mealtypes.length ; m++)
          {
			this.plan["days"][0][this.mealtypes[m] + "status"] = this.completeStatus[this.mealtypes[m]];
          }
        

        }

    }));
   
  }

	loadRecipes(idslist)
	{
		var recipesList = [];

	  var params = {"limit": 100};
	  if(idslist !== "")
	  {
		params["idslist"] = idslist;
  
	  }
  
  var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	if(invData !== null)
	{
	  if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	  {
		var temp = invData["body"];
		if(temp["length"] > 0)
		{
		  recipesList = [];
		  for(let i=0; i< temp["length"] ; i++)
		  {
			recipesList.push(temp[i])
		  }
		}
	  }
	  var cals = 0;
	  for(let i=0; i < this.plan["days"]['length'] ; i++)
	  {
		var obj = this.plan["days"][i];
		for(let j=0; j < this.mealTypeList['length']; j++)
		{
		  var totalCals = 0;
		  if(this.plan["days"][i][this.mealTypeList[j]] !== "")
		  {
			

			var bIndex = recipesList.findIndex(x => (x.id === this.plan["days"][i][this.mealTypeList[j]]));
  
			if(bIndex > -1)
			{ 
			  this.plan["days"][i][this.mealTypeList[j]] = recipesList[bIndex];

			}
			var item = this.plan["days"][i][this.mealTypeList[j]];
			
			if(this.plan["days"][i][this.mealTypeList[j] + "status"] == "1")
			{
			if(typeof(item["calories"]) !== "undefined" && item["calories"] !== "" && typeof(item["yield"]) !== "undefined" && item["yield"] !== "")
            {
              if(item["calories"] !== "0" && item["yield"] !== "0")
              cals +=  parseInt(item["calories"]) / parseInt(item["yield"])
            }
			
		}
	}
}

if( cals > 0)
{
 // console.log(cals);
  this.planStatus["consumedcalories"] = cals.toFixed(2);
}

	}
}

  }));
  }



  /******** recipes api serach */
  recipebooks: Array<any> = [];
  loadRecipeBooks()
	{

		this.recipebooks = [];

		
		var params = {};
		params["query"] = "select rb.id, rb.recipebook_name, rb.image, rb.recipeslist, rb.createdby, rb.createdat, u.username, u.firstname, u.lastname, u.email from recipebook rb, users u where rb.createdby = u.id";

		var res =   this.dbService.getDatabyTablebyQuery("recipebook", params).subscribe(invData => setTimeout(() => {

		  if(invData !== null)
		  {

			this.recipebooks = invData["body"];
		  }
		}));
	
		
	}
	recipecount(recipes)
	{
		var count = 0; 
		if(recipes !== "")
		{
			var temp = recipes.split(",");
			count = temp.length;
		}
		return count;


	}
	dietRecipes: Array<any> = [];
	loadDietRecipes()
	{
	
		this.dietRecipes = [];

		this.dietRecipes.push({"name":"Delicious Soups & Purees", "q":"soup puree", "count": "9995", "image":"assets/images/temp-images/soup.jpg"});
		this.dietRecipes.push({"name":"Soft Diets", "q":"juice","count": "324", "image":"assets/images/temp-images/juice.jpg"});
		this.dietRecipes.push({"name":"For Smoothie Lovers", "q":"smoothie", "count": "1376", "image":"assets/images/temp-images/smoothie.jpg"})
		this.dietRecipes.push({"name":"Salads", "q":"salad", "count": "15184", "image":"assets/images/temp-images/steps-tab1.jpg"})
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

	getStatus(type)
	{
		var ret = false;
		if(this.plan['days'][0][type +'status'] == "1")
		ret = true;
		return ret;
	}
}

	