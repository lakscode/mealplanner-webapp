import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { constants } from '../../jsonfiles/constants';

@Component({
	selector: 'app-trending',
	templateUrl: './trending.component.html',
	styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {

	routeParams: any;
	private onDestroy$: Subject<void> = new Subject<void>();
	sub: any;

	plan: any = {};
 
  planDay: any
  selDay: any;
  mealTypeList: Array<any>= [];
  recipes: Array<any>= [];
  recipesList: Array<any>= [];
  dateObj : any = {};
  userid: any;
  planStatus: any;
  totalCats: Array<any>= [];
  mineralsList: Array<any>= [];
  selNutrient: any;
  showpopupMenu: boolean = false;


	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
			this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
			//  console.log(params);   
			  this.routeParams = params;     
			  if (typeof (this.routeParams.id) !== "undefined") {
				console.log(this.routeParams.id);
			  }   
			 
		   });
		   this.loadDefaults();
	}
	shownut(item)
	{
	//	console.log(item);
	//	console.log(this.plan['days']);
	}
	gotopage(page)
	{
		this.router.navigate([page]);
	}


	
	loadDefaults()
	{
	  this.showpopupMenu = false;
	  this.mineralsList = constants.minerals;

	  this.planStatus = null;
	  this.userid= null;
	  this.getTodaysDate();
	  this.mealTypeList = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
	  this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
		//  console.log(params);   
		  this.routeParams = params;     
		  if (typeof (this.routeParams.id) !== "undefined") {
		//	console.log(this.routeParams.id);
			this.plan["mealplanid"] =this.routeParams.id;
			//this.loadRecipe(this.routeParams.id);
		  }   
		  if (typeof (this.routeParams.userid) !== "undefined") {
			this.userid =this.routeParams.userid;
		   
		  }   
		  this.loadData();
		  this.getPlanStatus();
	   });
	}
	toggleMore()
	{
	  this.showpopupMenu = !this.showpopupMenu
	}
	loadData()
	{
	
	  if(typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== "")
	  {
		var params = {};
		params["id"] = this.routeParams.id;
		
		var res =   this.dbService.getDataByTable("mealplan", params).subscribe(mpData => setTimeout(() => {
  
		//  console.log(mpData);
		  if(mpData !== null)
		  {
			if(mpData["body"] !== null && mpData["body"]['length'] > 0)
			{
			  this.plan["id"] = mpData["body"][0]["id"];
			  this.plan["name"] = mpData["body"][0]["name"];
			  this.plan["tags"] = mpData["body"][0]["tags"];
			  this.plan["totalweeks"] = mpData["body"][0]["totalweeks"];
			  this.plan["mealplanid"] = mpData["body"][0]["id"];
			  this.plan["days"] = [];
			  for(let i=0; i < 7; i++)
			  {
				this.plan["days"].push({"day_num":i, "name":"Day " + (i+1), "breakfast":[], "snack1":[], "lunch":[], "snack2":[], "dinner":[]})
		  
			  }
			  this.loadDaysData();
			}
		  }
  
		}))
	  }
	}
  
	loadDaysData()
	{
	//  console.log("in loadDaysData");
	//  console.log(this.plan);
	  var idslist = "";
	  if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
	  {
		var params = {};
		 
		//  params["meal_plan_id"] = this.plan["id"];
		 // params["day_num"] = this.selDayIndex;
	   //   console.log(params);
		params['query'] = "select * from days where meal_plan_id = " + this.plan["id"] + " order by day_num";
		var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(dData => setTimeout(() => {
  
	   //   console.log(dData);
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
			   //   console.log(t);
				  if(t !== "")
				  idslist += t + ",";
				}
				this.planDay = this.plan['days'][i];
				
			  }
			  
			  this.planDay['forall']= {};
		//      console.log(this.planDay);
			}
		  
		  }
		  if(idslist !== "")
		  {			
			idslist = idslist.substring(0, idslist.length-1);
			this.loadRecipes(idslist);
		  }
		 
		  console.log(this.plan);
		 
		}))
	  }
   
	}
	loadRecipes(idslist)
	{
	  var params = {"limit": 100};
	  if(idslist !== "")
	  {
		params["idslist"] = idslist;
  
	  }
	//  console.log(params);
  var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
   // console.log(invData);
	if(invData !== null)
	{
	  if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	  {
		var temp = invData["body"];
		if(temp["length"] > 0)
		{
		  this.recipesList = [];
		  for(let i=0; i< temp["length"] ; i++)
		  {
			this.recipesList.push(temp[i])
		  }
		}
	  }
	  this.loadRecipesToDays();
	}
	
  }));
  }
	loadRecipesToDays()
	{
	  console.log(this.mineralsList);
	//  console.log("recipe list");
	 // console.log(this.recipesList);
	  for(let i=0; i < this.plan["days"]['length'] ; i++)
	  {
		var obj = this.plan["days"][i];
		this.totalCats = [];
		var totalMicros = [];
		var PerMicros = [];
		for(let j=0; j < this.mealTypeList['length']; j++)
		{
		  var totalCals = 0;
		  
		  if(this.plan["days"][i][this.mealTypeList[j]] !== "")
		  {
  
			var bIndex = this.recipesList.findIndex(x => (x.id === this.plan["days"][i][this.mealTypeList[j]]));
  
			if(bIndex > -1)
			{
			  this.plan["days"][i][this.mealTypeList[j]] =  this.recipesList[bIndex];
			  var oRecipe = this.plan["days"][i][this.mealTypeList[j]];
			//  console.log(oRecipe);
			  var caIndex = PerMicros.findIndex(x => (x.name.toLowerCase()  === "calories"));
			  
			  if(caIndex > -1)
			  {
				PerMicros[caIndex]['value'] =parseFloat(PerMicros[caIndex]["value"]) + parseFloat(oRecipe['calories']);
			  }
			  else
			  {
				PerMicros.push({"name":"Calories", 'value' :  parseFloat(oRecipe['calories']), "servings": oRecipe["yield"],   "unit":"Kcal"});
			  }
			  
			  var caIndex = totalMicros.findIndex(x => (x.name.toLowerCase()  === "calories"));
				
			  if(caIndex > -1)
			  {
				totalMicros[caIndex]={"name":"Calories", 'value' :  (parseFloat(totalMicros[caIndex]["value"]) + parseFloat(oRecipe['calories'])), "unit":"Kcal"}
			  }
			  else
			  {
				totalMicros.push({"name":"Calories", 'value' :  parseInt(oRecipe['calories']), "unit":"Kcal"});
			  }
  
			  if(typeof(oRecipe["digest"]) !== "undefined" && oRecipe["digest"] !== "")
			  {
			  var tempDigest = JSON.parse(oRecipe["digest"]);
			  oRecipe["nutrients"]  = tempDigest;
			  }
			  /*
			  if(tempDigest["length"] > 0)
				  {
					var paramMicro = [];
					var perMicro = [];
					for(let j=0; j< tempDigest["length"] ; j++)
					{
					  var mmicro = tempDigest[j];
				   
					  switch(mmicro.label.toLowerCase())
					  {
						case "fat": 
						case "carbs":
						case "protein":
						  console.log(mmicro);
						  mmicro.totalP = mmicro.total.toFixed(1);
						paramMicro.push(mmicro); 
  
						perMicro.push(mmicro);
  
						var mIndex = totalMicros.findIndex(x => (x.name.toLowerCase()  === mmicro.label.toLowerCase()));
				
						  if(mIndex > -1)
						  {
							totalMicros[mIndex]={"name":mmicro.label, 'value' :  (parseFloat(totalMicros[mIndex]["value"]) + parseFloat(mmicro.total)), "unit":mmicro.unit}
						  }
						  else
						  {
							totalMicros.push({"name": mmicro.label, 'value' :  parseFloat( mmicro.total), "unit":mmicro.unit});
  
						  }
						  var mIndexp = PerMicros.findIndex(x => (x.name.toLowerCase()  === mmicro.label.toLowerCase()));
				
						  if(mIndexp > -1)
						  {
							console.log(mmicro);
							PerMicros[mIndexp]["value"] = parseFloat(PerMicros[mIndexp]["value"]) + parseFloat(mmicro.total); 
						  }
						  else
						  {
							console.log(mmicro);
							PerMicros.push({"name": mmicro.label, 'value' :  parseFloat(mmicro.total), "servings": oRecipe["yield"], "unit":mmicro.unit});
						  }
					  
						break;
  
					  }
					 
					}
					oRecipe["paramMicro"] = paramMicro;
					oRecipe["perMicro"] = perMicro;
				  }
  
  
				  */
				  if(oRecipe["ingredients"] !== null)
				  {
				 //   console.log(this.plan["days"][i][this.mealTypeList[j]]["ingredients"]);
					if(oRecipe["ingredients"]["length"] > 0)
					{
					  oRecipe["ingredients"] =oRecipe["ingredients"];
   
					}
					else
					{
					  oRecipe["ingredients"] = JSON.parse(oRecipe["ingredients"]);
   
					}
				  }
				  else
				  oRecipe["ingredients"] = []
			  
				  oRecipe["instructions"] = oRecipe["s_instructions"];
			  totalCals +=  oRecipe["calories"]
		
			  oRecipe["totalNutrientsArr"] = [];
			  if(typeof( oRecipe["totalNutrients"]) !== "undefined" &&  oRecipe["totalNutrients"] !== "")
			  {
				var temptotalNutrients  = [];
				var tempObj = JSON.parse( oRecipe["totalNutrients"]);
				Object.keys(tempObj).forEach(function(k){
				  temptotalNutrients.push({"name": k, "value":tempObj[k]})
			
				});
				oRecipe["totalNutrientsArr"]  = temptotalNutrients;
				if(typeof(temptotalNutrients) !== "undefined" && temptotalNutrients !== null)
				{
  
			  if(typeof(temptotalNutrients) !== "undefined" && temptotalNutrients !== null)
			  {
				var resArr = [];
				 
				  oRecipe["nutrientsSel"] = [];
				  for(let j=0; j <  oRecipe["totalNutrientsArr"]["length"] ; j++)
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
  
						  oRecipe["nutrientsSel"].push(temp)
						  var cIndex = totalMicros.findIndex(x => (x.name.toLowerCase()  === this.mineralsList[k].toLowerCase()));
				
						  if(cIndex > -1)
						  {
							totalMicros[cIndex]={"name":this.mineralsList[k], 'value' :  (parseFloat(totalMicros[cIndex]["value"]) + parseFloat(temp["value"]["quantity"])), "unit":temp["value"]["unit"]}
						  }
						  else
						  {
							totalMicros.push({"name": this.mineralsList[k], 'value' :  parseFloat( temp["value"]["quantity"]), "unit":temp["value"]["unit"]});
						  }
  
  
						  var cIndex1 = PerMicros.findIndex(x => (x.name.toLowerCase()  === this.mineralsList[k].toLowerCase()));
				
						  if(cIndex1 > -1)
						  {
							PerMicros[cIndex1]['value']= (parseFloat(PerMicros[cIndex1]["value"]) + parseFloat(temp["value"]["quantity"]));
						  }
						  else
						  {
							PerMicros.push({"name": this.mineralsList[k], 'value' :  parseFloat( temp["value"]["quantity"]), "servings":oRecipe["yield"],"unit":temp["value"]["unit"]});
						  }
  
  
						}
					  }
					}
				  
				  }
				  //oRecipe['minerals'] =this.totalCats;
			//      console.log(JSON.stringify(PerMicros));
			 //     console.log(this.totalCats);
				  this.plan["days"][i]["totalCats"] = this.totalCats;
				  this.plan["days"][i]["totalMicros"] = totalMicros;
  
				  this.plan["days"][i]["perMicros"] = PerMicros;
  
				  this.plan["days"][i][this.mealTypeList[j]] =oRecipe;
				}
				}
			  }
			  }
  
		  }
		//  console.log('totalCals - ' + totalCals + '-')
		  if(this.plan["days"][i][this.mealTypeList[j]] !== "")
		  {
		  if(totalCals > 0)
		  {
		   // console.log(totalCals);
		   // console.log(totalCals.toString());
		  this.plan["days"][i][this.mealTypeList[j]]["totalcalories"] = totalCals.toString();
		  }
		  else
		  {
		  this.plan["days"][i][this.mealTypeList[j]]["totalcalories"] = "N/A";
		  }
		}
  
		}
	   
	  }

	  console.log(this.plan);
	  this.selDay = this.plan["days"][0];
	
   //   console.log(this.selDay);
	}
  
	selectDay(ev)
	{
	 // console.log(this.selDay);    
	}
	formatDec(param)
	{
	  var ret = param;
	  if(ret !== "")
	  {
		ret = ret.toFixed(1);
	  }
	  return ret;
	}
	SetFLU(str)
	{
	  var retStr = str;
	  if(str !== "")
	  {
		retStr = this.helpService.setFirstLetterToUppercase(str);
	  }
	  return retStr;
	}
  

	gotopagedetails(page, param = null)
	{
		 console.log("goto page " + page);
		 console.log(param);
		 var params = {};
		 if(param !== null)
		 {
		   params['id'] = param["id"];
		 }
		 params["returnpage"]= "schedule";
		 params["returnparam1"] = this.routeParams.id

	  this.router.navigate([page, params]);
	}
	getTodaysDate()
	{
	  this.dateObj["month"] = this.helpService.getMonth(new Date());
	  this.dateObj["day"] = this.helpService.getDay(new Date());
	  this.dateObj["date"] = new Date().getDate()
	  console.log(this.dateObj);
	}
	startPlan()
	{
	  var params = {};
	  if(this.userid !== null && this.userid !== "")
	  {
		params["userid"] = this.userid;
		params["mealplanid"] = this.routeParams.id;
		params["startdate"] = new Date();
		params["status"] = 1;
		var res =   this.dbService.postDataByTable("mealplan_user_mapping", params).subscribe(invData => setTimeout(() => {
   
		if(invData !== null)
		{
  
		}
		}));
	  }
	}
	getPlanStatus()
	{
	  var params = {};
	  if(this.userid !== null && this.userid !== "")
	  {
		params["userid"] = this.userid;
		params["mealplanid"] = this.routeParams.id;
		var res =   this.dbService.getDataByTable("mealplan_user_mapping", params).subscribe(invData => setTimeout(() => {
   
		if(invData !== null)
		{
		  console.log(invData);
		  if(invData["body"]["length"] > 0)
		  {
			this.planStatus = invData["body"][0];
			console.log(this.planStatus);
		  }
		}
		}));
	  }
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
		for(let j=0; j < this.mealTypeList.length; j++)
		{
		  if(typeof(itemday) !== "undefined" && typeof(itemday[this.mealTypeList[j]]) !== "undefined" && itemday[this.mealTypeList[j]] !== "")
		  {
		  console.log(itemday[this.mealTypeList[j]]["ingredients"]);
		//  console.log(itemday[this.mealTypeList[j]]["ingredientLines"]);
			if(typeof(itemday[this.mealTypeList[j]]["ingredients"]) !== "undefined" && itemday[this.mealTypeList[j]]["ingredients"] !== "")
		  {
			var tempA = JSON.parse(itemday[this.mealTypeList[j]]["ingredients"]);
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
	 // console.log(ingredientsList);
	//  console.log(shoppingList);
	//  console.log(consList);
  
	//  console.log(JSON.stringify(shoppingList));
	//  console.log(JSON.stringify(consList));
	  sessionStorage.setItem("list",JSON.stringify(consList));
	//  this.gotopage('grocerylist')
	}
  
  
	formatValue(str)
	{  
	  return this.helpService.formatValue(str);
	}
  
	formatValuePServing(str, servings)
	{
  
	  var retVal = str;
	  if(typeof(str) !== "undefined" && str !== "" && typeof(servings) !== "undefined" && servings !== "" && servings !== 0)
		{ 
		 retVal = this.helpService.formatValuePServing(str,servings);
	
		}
	  return retVal;
	}
   
	showTotal: any = false;
	showPerServing: any = true;
	toggleNutrients(opt)
	{
	  console.log("opt " + opt);
	  console.log("showTotal " + this.showTotal);
	  console.log("showPerServing " + this.showPerServing);
  
	  if(opt == "total" && this.showTotal)
	  this.showPerServing = false;
	  
	  
	  if(opt == "perserving" && this.showPerServing)
	  this.showTotal = false;
	 
	}
  
  
	showTotalMeal:any = {};
	showPerServingMeal:any = {};
	toggleNutrientsMeal(opt, mealtype)
	{
	  console.log("opt " + opt);
	  console.log("showTotalMeal " + this.showTotalMeal[mealtype]);
	  console.log("showPerServingMeal " + this.showPerServingMeal[mealtype]);
  
	  if(opt == "total" && this.showTotalMeal[mealtype])
	  this.showPerServingMeal[mealtype] = false;
	  
	  
	  if(opt == "perserving" && this.showPerServingMeal[mealtype])
	  this.showTotalMeal[mealtype] = false;
	 
	}
	  calculateTotalCalory(col)
	  {
	  console.log(this.plan);
	console.log(col);
		  var mMacro = [];
  
		  
		for(let m = 0; m < this.mealTypeList.length; m++ )
		{
			  var dItem = this.plan["days"][col][this.mealTypeList[m]];
			  console.log(dItem);
			  if(dItem !== null)
			  {
		  var fIndex21 = mMacro.findIndex(x1 =>(x1.name.toLowerCase() == "calories"));
					  
		  if(fIndex21 > -1)
		  mMacro[fIndex21]["value"] = parseFloat(mMacro[fIndex21]["value"]) + parseFloat(dItem["calories"]);
		  else
		  mMacro.push({"name" : "calories", "value" :dItem["calories"], "unit" : "Kcal", "servings":dItem["yield"]});
				  if(typeof(dItem["nutrientsSel"]) !== "undefined")
				  {
				  for(let j=0; j < dItem["nutrientsSel"]["length"]; j++)
				  {
					  
			var dmItem1 = dItem["nutrientsSel"][j];
					  console.log(dmItem1);
  
					  var lbl1 = dmItem1["value"]['label'].toLowerCase();
  
					  var fIndex1 = mMacro.findIndex(x1 =>(x1.name == lbl1));
					  
			if(fIndex1 > -1)
					  mMacro[fIndex1]["value"] = parseFloat(mMacro[fIndex1]["value"]) + dmItem1["value"]["quantity"];
					  else
					  mMacro.push({"name" : lbl1, "value" : dmItem1["value"]["quantity"], "unit" : dmItem1["value"]["unit"], "servings":dItem["yield"]});
  
				  }
				  }
		}
			  }
		  
	//    console.log(mMacro);
	  return mMacro;
	  }
  
	  calculateTotalCaloryPServing(col)
	  {
	  console.log(this.plan);
	console.log(col);
		  var mMacro = [];
  
		  
		for(let m = 0; m < this.mealTypeList.length; m++ )
		{
			  var dItem = this.plan["days"][col][this.mealTypeList[m]];
			  console.log(dItem);
			  if(dItem !== null)
			  {
		  var fIndex21 = mMacro.findIndex(x1 =>(x1.name.toLowerCase() == "calories"));
					  
		  if(fIndex21 > -1)
		  mMacro[fIndex21]["value"] = parseFloat(mMacro[fIndex21]["value"]) + (parseFloat(dItem["calories"])/dItem["yield"]) ;
		  else
		  mMacro.push({"name" : "calories", "value" :(parseFloat(dItem["calories"])/dItem["yield"]), "unit" : "Kcal", "servings":dItem["yield"]});
				  if(typeof(dItem["nutrientsSel"]) !== "undefined")
				  {
				  for(let j=0; j < dItem["nutrientsSel"]["length"]; j++)
				  {
					  
			var dmItem1 = dItem["nutrientsSel"][j];
		  //			console.log(dmItem1);
  
					  var lbl1 = dmItem1["value"]['label'].toLowerCase();
  
					  var fIndex1 = mMacro.findIndex(x1 =>(x1.name == lbl1));
					  
			if(fIndex1 > -1)
					  mMacro[fIndex1]["value"] = parseFloat(mMacro[fIndex1]["value"]) + (parseFloat(dmItem1["value"]["quantity"])/dItem["yield"]);
					  else
					  mMacro.push({"name" : lbl1, "value" : (parseFloat(dmItem1["value"]["quantity"])/dItem["yield"]), "unit" : dmItem1["value"]["unit"], "servings":dItem["yield"]});
  
				  }
				  }
		}
			  }
		  
	//    console.log(mMacro);
	  return mMacro;
	  }
  
  }
  


	