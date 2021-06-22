import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router} from "@angular/router";

import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import {constants} from "../jsonfiles/constants"
//import {ingredients} from "../jsonfiles/ingredients"
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
	

constructor(private router: Router, private httpClient : HttpClient, private sanitizer: DomSanitizer , public dbService: DBService, public helpService: HelpService) {
	this.RecipeoftheDay = [];
	}

	ngOnInit() {
		console.log("landing ngOnInit");
		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
		//  //console.log(this.currentUser["displayname"]);
		this.getUserPreferences();
		this.role = this.helpService.getRoleStatus(this.currentUser);
		this.showNutrientsFlag = this.helpService.showorhideNutritions(this.role);

		//console.log(this.showNutrientsFlag);
		}
		
	
	//	this.helpService.scrape_recipe();

		this.getPlanStatus();
		this.count++;
		this.defaultRecipeofTheDay();
		if(this.RecipeoftheDay["length"] == 0)
		this.checkRecipeoftheDay();

		this.loadHealthLabels();
	
	//	this.loadRecommendedRecipes();
	this.loadIngredients();
	}

	defaultRecipeofTheDay()
	{
		this.httpClient.get('assets/data/recipeoftheday.json').subscribe(
			recipeoftheday => {        
			  if(recipeoftheday){
				this.RecipeoftheDay = [];
				this.RecipeoftheDay.push(recipeoftheday);
				//console.log(this.RecipeoftheDay);
			  }else{
				this.defaultRecipeofTheDay();
			  }
			});  
	}
	loadRecommendedRecipes()
	{
		console.log("recommendedRecipes");
	  this.recommendedRecipes = [];
  
	  var params = {"limit": "4"};

	  var query = "select id, label, image, calories, yield, source, dietLabels, healthLabels from recipes  ";
	  var qWhere = " where s_instructions != '' AND label != '' AND image != '' ";

	  //console.log(this.userPref);
	  if(typeof(this.userPref) !== "undefined" && this.userPref !== null && typeof(this.userPref["dietLabels"]) !== "undefined" && this.userPref["dietLabels"] !== null && this.userPref["dietLabels"] !== "")
	  {
		qWhere += " AND dietLabels = '" + this.userPref["dietLabels"] + "' AND dietLabels != ''  ";
	  }
	  params["query"]= query + qWhere + "  group by healthLabels order by rand() limit 0, 4";

	  var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	  console.log(invData);
   
	   if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		 {
		   this.recommendedRecipes = [];
		   for(let i=0; i < invData["body"]["length"] ; i++)
		   {
			 this.recommendedRecipes.push(invData["body"][i]);
			
		   }
		
		 }
	//	 //console.log(this.recommendedRecipes);
	   }
	 
	  ));
	
	}
	checkRecipeoftheDay()
	{
	
	  var params = {};
	  var d = new Date();
	  var tempDt2 = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
	  var tempDt ="";
	  tempDt = tempDt2.month + "-" + tempDt2.day + "-"  + tempDt2.year ;

    //params["query"] = "select id, image, label, dietLabels, s_instructions from recipes where s_instructions != '' order by rand() limit 1";
	params["query"] = "select * from recipeoftheday where datetime = '" + tempDt + "'";
		//console.log(params["query"]);
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
   	//console.log(this.RecipeoftheDay);
	 }));
  
	}
	loadRecipeoftheDay(id="")
	{
		//console.log("loadRecipeoftheDay");
		//console.log("id-" + id + "-");
	  this.RecipeoftheDay = [];
	  var params = {};
	 
    //params["query"] = "select id, image, label, dietLabels, s_instructions from recipes where s_instructions != '' order by rand() limit 1";
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
   		//console.log(this.RecipeoftheDay);
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
		  //console.log(params["query"]);
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
			  //console.log(params1['query']);
	  
		   var res =   this.dbService.getDatabyTablebyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
			  
				  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
				  {
		  
	  
				  }
	  
				  }));
		  }
		 //console.log(this.RecipeoftheDay);
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
	
				 var arrLabel = constants.healthLabelsWithImages;
				 if(arrLabel.length > 0)
				 {
				   for(let l=0; l < arrLabel.length; l++)
				   {
					

				
						
					 //   //console.log(img);
					  this.healthLabels.push({"label":arrLabel[l]["name"], "image":arrLabel[l]["image"]});
					  
					
					
				   }
				 }
			  
   
	}
	loadHealthLabelsfromDB()
	{
	  this.healthLabels = [];
	 // this.recipes = recipesList;
	  var params = {};
	  
	  params["returnfields"]=" healthLabels ";
	  // //console.log(JSON.stringify(params));
	  //params["instructions"] = "notempty";
  
	  var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
	 
	  // //console.log(invData);
   
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
					////console.log(arrLabel[l].toString().toLowerCase());
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
					 //   //console.log(img);
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
		 //console.log(this.healthLabels);
	   }
   
	  ));
   
	}

	limitTo(str, num)
	{
		return this.helpService.limitTo(str, num) + "...";
	}

	formatImage(image, type)
	{
	//  //console.log(image);
	  var retImage = image;
	  if(image !== "" && type !== "")
	  {
		retImage = this.helpService.formatImage(image, type);
		
	  }
	//  //console.log(retImage);
	  return retImage;
	}

	gotoRecipeDetails(page, id){
		console.log("in gotorecipedetails");
		if(page == "collection")
		{
			this.router.navigate([page, {id:id}]);
		}
		else if(page == "recipedetails")
		{
			this.router.navigate([page, id]);
		}
	}

	gotoRecipes(id) {
		this.router.navigate(['recipes', {dietLabels:id}]);
	}
	gotopage(page, id) {
		if(page == "schedule")
		{
			//console.log(this.planStatus[0]);
			this.router.navigate([page, {id:id, mum_id:this.planStatus[0]["mum_id"], userid: this.currentUser["id"]}]);
		}
		else
		{
		this.router.navigate([page, id]);
		}
	}
	formatValue(str)
{
//	//console.log(str);
	var retValue = str;
	if(str !== "")
	{
		retValue = parseFloat(str).toFixed(2);
	}
//	//console.log(retValue);
	return retValue;
}
formatLabels(str)
{
//	//console.log(str);
	var retArr = [];
	retArr.push(str);
	if(str !== "")
	{
		retArr = [];
		retArr = str.split("~");
	}
	return retArr;
}


/************ new functions  */
mealplans: Array<any> = [];


loadMealPlan()
  {
    this.mealplans = [];
   // this.recipes = recipesList;
    var params = {"query": "SELECT * FROM mealplan where status='1' ORDER BY RAND() LIMIT 1"};
    // ////console.log(JSON.stringify(params));
    var res =   this.dbService.getDatabyTablebyQuery("mealplan", params).subscribe(invData => setTimeout(() => {
  
     if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
       {
         this.mealplans = [];
         for(let i=0; i < invData["body"]["length"] ; i++)
         {
           this.mealplans.push(invData["body"][i]);
           //console.log(  this.mealplans);
         }
       }
     }
   
    ));
 
  }

  planStatus: Array<any>= []; 
getPlanStatus()
{
	//console.log("in getPlanstatus");
	//console.log(this.currentUser);
 // var params = {};
  if(this.currentUser && this.currentUser["id"] !== null && this.currentUser["id"] !== "")
  {

	var params = {"query": "SELECT mum.id mum_id, mp.id id, mp.name mpname, mp.tags FROM mealplan_user_mapping mum, mealplan mp where mum.userid = " + this.currentUser["id"] + " AND mp.id = mum.mealplanid AND mp.status=1 AND mum.status = 1 "};

	//console.log(params);
	  var res =   this.dbService.getDatabyTablebyQuery("mealplan_user_mapping", params).subscribe(invData => setTimeout(() => {
   
	if(invData !== null)
	{
	 
	  if(invData["body"]["length"] > 0)
	  {
		this.planStatus = invData["body"];
	  	//console.log(this.planStatus);
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
	console.log(value);
	var retvalue = this.sanitizer.bypassSecurityTrustHtml(value);
	console.log(retvalue);
    return retvalue;
  }
  collectionsList: Array<any> = [];
  loadcollections()
  {
	   /******** recipes api serach */
 
	  this.collectionsList = [];
	 // var params = {"limit": 100};
	 // params["createdby"] = this.currentUser["id"];
	  console.log(params);
	  var params = {"query": "SELECT c.*, COUNT(rm.id) AS recipecount, u.email, u.firstname, u.lastname FROM collection AS c LEFT JOIN recipe_mapping AS rm ON c.id = rm.collection_id LEFT JOIN users AS u ON c.created_by = u.id GROUP BY c.id limit 1, 4"};

	  var res =   this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {
  
		console.log(invData);
		if(invData !== null)
		{
		  var obj = invData["body"]["length"];
		  console.log(invData["body"]);
		  this.collectionsList = invData["body"];
		  for(let o=0; o <  this.collectionsList.length; o++)
		{
			this.collectionsList[o]["userjoined"] = false;
			this.collectionsList[o]["image"] =encodeURI( this.collectionsList[o]["image"]);
		}

		  console.log(this.collectionsList);
		  this.loaduserCount();
		}
	  }));
  
	  

  }
  
  loaduserCount()
  {

	console.log("in loadusercount");

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
			//	console.log(obj[o]["usercount"])
				this.collectionsList[fIndex]["userscount"] = obj[o]["usercount"];
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
	FROM community AS c
	LEFT JOIN community_join AS cj ON c.id = cj.community_id
	GROUP BY c.id, cj.community_id

	*/

	console.log("in loaduserJoinedStatus");
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
			//	console.log(obj[o]["usercount"])
				this.collectionsList[fIndex]["userjoined"] = true;
			//	console.log(this.communitiesList[fIndex]["userscount"] );
			}
		}

	  }
	}));

  }

  joincollection(id)
  {
	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select * from collection_join where collection_id = " + id + " AND userid = " + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("collection_join", params).subscribe(invData => setTimeout(() => {

	  console.log(invData);
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
	  /*
	  console.log(ingredients);
	  console.log(ingredients.length);
	  this.foodCategory ={};
	  this.measure={};

	  this.food = {};
	for(let i= 0; i < ingredients.length; i++)
	{

		console.log("i " + i);
		console.log(item);

		if(ingredients[i]["ingredients"])
		{
			try
			{
 			var item = JSON.parse(ingredients[i]["ingredients"]);
			 console.log(item);
			 for(let j=0; j < item.length; j++)
			 {
				 if(item[j]["foodCategory"] !== "")
				 this.foodCategory[item[j]["foodCategory"]] = item[j]["foodCategory"];

				 if(item[j]["measure"] !== "")
				 this.measure[item[j]["measure"]] = item[j]["measure"];

				 if(item[j]["food"] !== "")
				 this.food[item[j]["food"]] = item[j]["food"];
			 }
			}
			catch(error)
			{
				console.log(error);
			}
			 
		}
	}
	console.log(this.foodCategory);
	var text = "";
	for (let x in this.foodCategory) {
		text += "'" + x + "', ";
	  }
	  console.log(text);
	console.log(this.measure);
	var text1 = "";
	for (let x in this.measure) {
		text1 += "'" + x + "', ";
	  }

	  console.log(text1);
	  console.log(this.food);
	  var text2 = "";
	  var foodcount = 0;
	  for (let x in this.food) {
		text2 += "'" + x + "', ";
		foodcount++;
		}
  
		console.log(text2);
		console.log("foodcount " + foodcount);
*/
  }
}

	