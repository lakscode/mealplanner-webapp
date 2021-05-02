import { Component, OnInit,OnDestroy, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
declare var $: any;
import {constants} from "../../jsonfiles/constants"
import * as Highcharts from 'highcharts';

require('highcharts/modules/exporting')(Highcharts);  

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

	routeParams: any;
	private onDestroy$: Subject<void> = new Subject<void>();
	sub: any;
	Highcharts = Highcharts; // required
	chartConstructor = 'chart'; // optional string, defaults to 'chart'
	chartOptionsLine: any;


	plan: any = {};

	planDay: any
	selDay: any;
	mealTypeList: Array<any>= [];
	recipes: Array<any>= [];
	recipesList: Array<any>= [];
	dateObj : any = {};
	userid: any;
	planStatus: any;
	categories: any;
	selectedMealType: any;
	selType: any;
	selCat: any;
	selSubCat: any;
	selCatValues : Array<any> = [];
	colorArray: Array<any> = [];
	colorArrayList: Array<any> = [];
	labels: Array<any> = [];
	data: Array<any> = [];
	chartTitle: any = "";
	chartUnit: any = "";
	pie: any;

	welcomeMessage: any = "";
	totalCats: Array<any> = [];
	totalCatUnit: any = "";
	
	mineralsList : Array<any> = [];
	errorMessage:any = "";
	showpopupMenu: boolean = false;
	completeStatus: any = {};
	

	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
			this.loadDefaults();
		   
	}

	gotopage(page)
	{
		this.router.navigate([page]);
	}


	loadDefaults()
	{
	  this.showpopupMenu = false;
	  this.selSubCat = "";
	 // this.loadingService.present();
	 this.errorMessage = "";
	 this.mineralsList = constants.minerals;
	  this.colorArrayList = constants.colorslist;
	  this.colorArray = constants.colors;
	  this.welcomeMessage= "";
	  this.totalCats = [];
	  this.selType = "breakfast";
	  this.categories = [];
	  this.selCatValues= [];
	  this.categories = [
		{"name":"Calories"},
		{"name":"Protein"},
		{"name":"Vitamin"},
		{"name":"Minerals"},
		{"name":"Fat"},
		{"name":"Carbs"},  
		{"name":"Cholesterol"}
   
  
	  ];
	  this.selCat = this.categories[0];
	  console.log(this.selCat);
	  this.planStatus = null;
	  this.userid= null;
	  this. getTodaysDate();
	  this.mealTypeList = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
	 
	  this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
   
		  this.routeParams = params;     
		  if (typeof (this.routeParams.id) !== "undefined") {
  
			this.plan["mealplanid"] =this.routeParams.id;
  
		  }   
		  if (typeof (this.routeParams.userid) !== "undefined") {
			this.userid =this.routeParams.userid;
		   
		  }  
		  if (typeof (this.routeParams.mum_id) !== "undefined") { 
		  this.loadData();
		  }
		  this.getPlanStatus();
	   });
	   this.ChartDefaults();
	}
	toggleMore()
   {
	 this.showpopupMenu = !this.showpopupMenu
   }
	loadData()
	{
		console.log('load data');
	  if(typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== "")
	  {
		
		var params = {"query": "SELECT mum.id mum_id, mum.startdate startdate, mp.id id, mp.name mpname FROM mealplan_user_mapping mum, mealplan mp where mum.id = " + this.routeParams["mum_id"] + " AND mp.id = mum.mealplanid AND mp.status=1 "};
  
		var res =   this.dbService.getDatabyTablebyQuery("mealplan_user_mapping", params).subscribe(mpData => setTimeout(() => {
  
		  if(mpData !== null)
		  {
			if(mpData["body"] !== null && mpData["body"]['length'] > 0)
			{
			  this.plan["id"] = mpData["body"][0]["id"];
			  this.plan["name"] = mpData["body"][0]["mpname"];
			  this.plan["startdate"] = mpData["body"][0]["startdate"];
			  var temp = this.plan["startdate"].split("T");
			  this.plan["startdate"] = temp[0];
			  this.plan["totalweeks"] = mpData["body"][0]["totalweeks"];
			  this.plan["mealplanid"] = mpData["body"][0]["id"];
			  this.plan["days"] = [];
			  var Difference_In_Time = new Date().getTime() - new Date(this.plan["startdate"] ).getTime(); 
   
			  var diff_days = Difference_In_Time / (1000 * 3600 * 24); 
  
			  this.loadDaysData(diff_days);
			}
		  }
  
		}))
	  }
	}
  
	loadDaysData(diff_days)
	{
	//  this.loadingService.present();
	  var idslist = "";
	  var diff_days_ceil = Math.ceil(diff_days);
	  var param_day_num = 0;
	  if(diff_days_ceil > 0) 
	  param_day_num = diff_days_ceil -1;
	  this.errorMessage  = "";
	  this.welcomeMessage= "Your <b>Day " + (diff_days_ceil) + "</b> Plan";
  
	  if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
	  {
		var params = {};
		 
		  params["meal_plan_id"] = this.plan["id"];
		  params["day_num"] = param_day_num;
  
  
		var res =   this.dbService.getDataByTable("days", params).subscribe(dData => setTimeout(() => {
		  console.log(dData);
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
				this.planDay = this.plan['days'][i];
				
			  }
			  
			  this.planDay['forall']= {};
			  this.getCompleteStatus();
			
			}
			else
			{
			  this.errorMessage = "No schedule for today.";
			 // this.loadingService.dismiss();
			  var params = {}
			  params["id"] = this.routeParams.mum_id;
			  params['status'] = 2;
			  
			  var res =   this.dbService.updateDataByTable("mealplan_user_mapping", params).subscribe(dData => setTimeout(() => {
				console.log(dData);
				if(dData !== null)
				{
  
				}
			  }));
  
			}
		  }
		  if(idslist !== "")
		  {			
			idslist = idslist.substring(0, idslist.length-1);
			this.loadRecipes(idslist);
		  }
		 
		}))
	  }
   
	}
	selectType()
	{
	  this.selCatValues = [];
	  console.log(this.selCat);
	  this.selectedMealType = this.planDay[this.selType];
	  console.log(this.selectedMealType);
	}
	loadRecipes(idslist)
	{
		console.log("loadRecipes");
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
	console.log("loadRecipesToDays");
	  for(let i=0; i < this.plan["days"]['length'] ; i++)
	  {
		var obj = this.plan["days"][i];
		for(let j=0; j < this.mealTypeList['length']; j++)
		{
		  var totalCals = 0;
		  if(this.plan["days"][i][this.mealTypeList[j]] !== "")
		  {
  
			var bIndex = this.recipesList.findIndex(x => (x.id === this.plan["days"][i][this.mealTypeList[j]]));
  
			if(bIndex > -1)
			{
			  this.plan["days"][i][this.mealTypeList[j]] =  this.recipesList[bIndex];
			  if(typeof(this.plan["days"][i][this.mealTypeList[j]]["digest"]) !== "undefined" && this.plan["days"][i][this.mealTypeList[j]]["digest"] !== "")
			  {
			  var tempDigest = JSON.parse(this.plan["days"][i][this.mealTypeList[j]]["digest"]);
			  this.plan["days"][i][this.mealTypeList[j]]["digestArr"]  = tempDigest;
			  }
			  this.plan["days"][i][this.mealTypeList[j]]["totalNutrientsArr"] = [];
			  if(typeof(this.plan["days"][i][this.mealTypeList[j]]["totalNutrients"]) !== "undefined" && this.plan["days"][i][this.mealTypeList[j]]["totalNutrients"] !== "")
			  {
				var temptotalNutrients  = [];
				var tempObj = JSON.parse(this.plan["days"][i][this.mealTypeList[j]]["totalNutrients"]);
				Object.keys(tempObj).forEach(function(k){
				  temptotalNutrients.push({"name": k, "value":tempObj[k]})
  
				});
				this.plan["days"][i][this.mealTypeList[j]]["totalNutrientsArr"]  = temptotalNutrients;
			  }
  
			  if(tempDigest["length"] > 0)
				  {
					var paramMicro = [];
					for(let j=0; j< tempDigest["length"] ; j++)
					{
					  var mmicro = tempDigest[j];
					  switch(mmicro.label.toLowerCase())
					  {
						case "fat": 
						case "carbs":
						case "protein":
						  mmicro.totalP = mmicro.total.toFixed(1);
						paramMicro.push(mmicro); break
  
					  }
					 
					}
					this.plan["days"][i][this.mealTypeList[j]]["paramMicro"] = paramMicro;
				  }
				  if(this.plan["days"][i][this.mealTypeList[j]]["ingredients"] !== null)
				  {
					if(this.plan["days"][i][this.mealTypeList[j]]["ingredients"]["length"] > 0)
					{
					  this.plan["days"][i][this.mealTypeList[j]]["ingredients"] = this.plan["days"][i][this.mealTypeList[j]]["ingredients"];
   
					}
					else
					{
					  this.plan["days"][i][this.mealTypeList[j]]["ingredients"] = JSON.parse(this.plan["days"][i][this.mealTypeList[j]]["ingredients"]);
   
					}
				  }
				  else
				  this.plan["days"][i][this.mealTypeList[j]]["ingredients"] = []
			  
			  this.plan["days"][i][this.mealTypeList[j]]["instructions"] = this.plan["days"][i][this.mealTypeList[j]]["s_instructions"];
			  totalCals +=  this.plan["days"][i][this.mealTypeList[j]]["calories"]
  
			}
  
		  }
  
		  if(this.plan["days"][i][this.mealTypeList[j]] !== "")
		  {
		  if(totalCals > 0)
		  {
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
	  this.selType = "breakfast";
	  this.selectType();
	  this.selectCat(0);
      console.log(this.selDay);
   //this.loadingService.dismiss();
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
  
  
	
	gotopagedetails(page, param = null)
	{
  
		 var params = {};
		 if(param !== null)
		 {
		   params['id'] = param["id"];
		 }
		 params["returnpage"]= "schedulechart";
		 params["returnparam1"] = this.routeParams.id
		 params["returnparam2"] = this.routeParams.mum_id
	 
	  this.router.navigate([page, params]);
	}
	getTodaysDate()
	{
	  this.dateObj["month"] = this.helpService.getMonth(new Date());
	  this.dateObj["day"] = this.helpService.getDay(new Date());
	  this.dateObj["date"] = new Date().getDate()
  
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
		  if(invData["body"]["length"] > 0)
		  {
			this.planStatus = invData["body"][0];
		  }
		}
		}));
	  }
	}
  
	dataPie : Array<any> = [];
	chartIndex: any = 0;
	selectCat(index)
	{
		this.chartIndex = index;
	  console.log(this.selCat);
	  this.chartTitle = this.selCat.name;
	  this.chartUnit = this.selCat.unit;
	  this.selCatValues = [];
	  this.labels = [];
	  this.data = [];
	  this.dataPie= [];
	  var chartValCount = 0;
	  this.totalCats = [];
	  var totalValArr =[];
	  for(let i=0; i <  this.mealTypeList.length; i++)
	  {
	   // console.log(this.selDay[this.mealTypeList[i]]);
	   		var obj = this.selDay[this.mealTypeList[i]];
		if(typeof(obj) !== "undefined" && obj !== null)
		{
		if(typeof(obj["calories"]) !== "undefined")
		{
		  this.selCatValues[chartValCount] = {"name": this.mealTypeList[i],"id":obj["id"], "label": obj["label"], "totalWeight":obj["totalWeight"], "details": [] };
  
		  if(this.selCat["name"] == "Calories")
		  {
			this.selCatValues[chartValCount]["details"].push({"name":"Calories", "value": obj["calories"], "unit":"Kcal"});
			this.data[chartValCount] =  parseFloat(obj["calories"]);
			this.dataPie[chartValCount] = {"name":this.setFLU(this.mealTypeList[i]), "y":  parseFloat(obj["calories"])}
			this.labels[chartValCount] =  this.setFLU(this.mealTypeList[i]);
			chartValCount++;
			var cIndex = this.totalCats.findIndex(x => (x.name  === "Calories"));
			if(cIndex > -1)
			{
			  this.totalCats[cIndex]={"name": "Calories", 'value' :  (parseInt(this.totalCats[cIndex]["value"]) + parseInt(obj["calories"])), "unit":"Kcal"}
			}
			else
			{
			  this.totalCats.push({"name": "Calories", 'value' :  parseInt(obj["calories"]), "unit":"Kcal"});
			}
			
		   this.chartUnit= "Kcal";
		  }
		  else if(this.selCat["name"] == "Carbs"  || this.selCat["name"] == "Protein" || this.selCat["name"] == "Cholesterol")
		  {
			if( obj["digestArr"]["length"] > 0)
			{
			  var totalValue= 0;
			  for(let j=0; j < obj["digestArr"]["length"] ; j++)
			  {
				var temp = obj["digestArr"][j];
				if(temp["label"].indexOf(this.selCat["name"]) !== -1)
				{
				  if(temp["total"] > 0)
				  {
					if(temp["unit"].indexOf("u00b5") !== -1)
					{
					  temp["unit"] = temp["unit"].replace("u00b5", "µ");
					}
				  this.selCatValues[chartValCount]["details"].push({"name":temp["label"], "value": temp["total"].toFixed(2), "unit":temp["unit"]});
				  totalValue += temp["total"];
  
				  var cIndex = this.totalCats.findIndex(x => (x.name  === temp["label"]));
				  if(cIndex > -1)
				  {
					this.totalCats[cIndex]={"name": temp["label"], 'value' :  (parseInt(this.totalCats[cIndex]["value"]) + parseInt( temp["total"])), "unit":temp["unit"]}
				  }
				  else
				  {
					this.totalCats.push({"name": temp["label"], 'value' :  parseInt( temp["total"]), "unit":temp["unit"]});
				  }
			
				  this.chartUnit= temp["unit"];
	   
  
				  }
				}
			  
			  }
			  if(totalValue > 0)
			  {
			  this.data[chartValCount] =  totalValue; //totalValue.toFixed(0);
			  this.dataPie[chartValCount] = {"name":this.setFLU(this.mealTypeList[i]), "y":  totalValue}
		
			  this.labels[chartValCount] =  this.setFLU(this.mealTypeList[i]);
			  chartValCount++;
			 
			  }
			}
		   
		  }
		  else if(this.selCat["name"] == "Vitamin")
		  {
			if( obj["digestArr"]["length"] > 0)
			{
			 
			  var totalValue= 0;
			  for(let j=0; j < obj["digestArr"]["length"] ; j++)
			  {
				
				var temp = obj["digestArr"][j];
  
				
  
				if(temp["label"].indexOf(this.selCat["name"]) !== -1)
				{
				  if(typeof(totalValArr[i]) == "undefined")
				  {
					totalValArr[i] = {};
				  }
  
				  if(temp["total"] > 0)
				  {
					if(temp["unit"].indexOf("u00b5") !== -1)
					{
					  temp["unit"] = temp["unit"].replace("u00b5", "µ");
					}
				  this.selCatValues[chartValCount]["details"].push({"name":temp["label"], "value": temp["total"].toFixed(2), "unit":temp["unit"]});
				  totalValue += temp["total"];
				  if(typeof(totalValArr[i][temp["label"]]) !== "undefined")
				  totalValArr[i][temp["label"]] += temp["total"];
				  else
				  totalValArr[i][temp["label"]] = temp["total"];
				  var cIndex = this.totalCats.findIndex(x => (x.name  === temp["label"]));
				  if(cIndex > -1)
				  {
					this.totalCats[cIndex]={"name": temp["label"], 'value' :  (parseInt(this.totalCats[cIndex]["value"]) + parseInt( temp["total"])), "unit":temp["unit"]}
				  }
				  else
				  {
					this.totalCats.push({"name": temp["label"], 'value' :  parseInt( temp["total"]), "unit":temp["unit"]});
				  }
			
				  
				  this.chartUnit=  temp["unit"];
  
				  }
				}
			  
			  }
			  if(totalValue > 0)
			  {
			  this.data[chartValCount] =  totalValue; //totalValue.toFixed(0);
			  this.dataPie[chartValCount] = {"name":this.setFLU(this.mealTypeList[i]), "y":  totalValue}
			  this.labels[chartValCount] =  this.setFLU(this.mealTypeList[i]);
			  chartValCount++;
			 
			  }
		   //   console.log(totalValArr);
			}
		   
		  }
		  else if(this.selCat["name"] == "Fat")
		  {
			if( obj["totalNutrientsArr"]["length"] > 0)
			{
			  var totalValue= 0;
			  for(let j=0; j < obj["totalNutrientsArr"]["length"] ; j++)
			  {
				var temp = obj["totalNutrientsArr"][j];
				console.log(temp["value"]);
				if(temp["value"]["label"].indexOf(this.selCat["name"]) !== -1)
				{
				  if(temp["value"]["quantity"] > 0)
				  {
					if(temp["value"]["unit"].indexOf("u00b5") !== -1)
					{
					  temp["value"]["unit"] = temp["value"]["unit"].replace("u00b5", "µ");
					}
					console.log(temp["value"]["label"]);
				  this.selCatValues[chartValCount]["details"].push({"name":temp["value"]["label"], "value": temp["value"]["quantity"].toFixed(5), "unit":temp["value"]["unit"]});
				  totalValue += temp["value"]["quantity"];
				  console.log(temp["label"])
				  var cIndex = this.totalCats.findIndex(x => (x.name  === temp["value"]["label"]));
				  if(cIndex > -1)
				  {
					this.totalCats[cIndex]={"name": temp["value"]["label"], 'value' :  (parseInt(this.totalCats[cIndex]["value"]) + parseInt(temp["value"]["quantity"])), "unit":temp["value"]["unit"]}
				  }
				  else
				  {
					this.totalCats.push({"name": temp["value"]["label"], 'value' :  parseInt( temp["value"]["quantity"]), "unit":temp["value"]["unit"]});
				  }
			
				  this.chartUnit=  temp["unit"];
  
				  }
				}
			  
			  }
			  if(totalValue > 0)
			  {
				this.chartUnit=  "g";
			  this.data[chartValCount] =  totalValue; //totalValue.toFixed(0);
			  this.dataPie[chartValCount] = {"name":this.setFLU(this.mealTypeList[i]), "y":  totalValue}
			  this.labels[chartValCount] =  this.setFLU(this.mealTypeList[i]);
			  chartValCount++;
			 
			  }
			}
		   
		  } 
		  else if(this.selCat["name"].toUpperCase() == "MINERALS")
		  {
			if( obj["totalNutrientsArr"]["length"] > 0)
			{
			  var totalValue= 0;
			  for(let j=0; j < obj["totalNutrientsArr"]["length"] ; j++)
			  {
				var temp = obj["totalNutrientsArr"][j];
				console.log(temp["value"]);
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
  
					  this.selCatValues[chartValCount]["details"].push({"name":temp["value"]["label"], "value": temp["value"]["quantity"].toFixed(5), "unit":temp["value"]["unit"]});
					  totalValue += temp["value"]["quantity"];
  
					  var cIndex = this.totalCats.findIndex(x => (x.name  === this.mineralsList[k]));
					  this.chartUnit=  temp["value"]["unit"];
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
			  if(totalValue > 0)
			  {
			  this.data[chartValCount] =  totalValue; //parseFloat(totalValue).toFixed(0);
			  this.dataPie[chartValCount] = {"name":this.setFLU(this.mealTypeList[i]), "y":  totalValue}
			  this.labels[chartValCount] =  this.setFLU(this.mealTypeList[i]);
			  chartValCount++;
			 
			  }
			  
			}
		   
		  }
	  //    console.log("chartValCount " + chartValCount);
	  //    console.log(this.selCatValues);
		  if(typeof( this.selCatValues[chartValCount-1]) !== "undefined")
		  {
		//    console.log("sorting");
			this.selCatValues[chartValCount-1]["details"] = this.selCatValues[chartValCount-1]["details"].sort(this.helpService.sortArraybyName);
		  }
		}
	}
	  }
	console.log(this.data);
  
	  this.totalCats = this.totalCats.sort(this.helpService.sortArraybyName);
	//  console.log(this.selCatValues);
	 
	  this.createPieChart();
	}
  
  
	selectSubCat(item)
	{
	  item.active = true;
	  for(let i=0 ; i < this.totalCats.length; i++)
	  {
		if(this.totalCats[i]['name'] !== item['name'])
		{
		  this.totalCats[i]['active'] = false;
		}
	  }
	  this.selSubCat = item;
  //    console.log('selectSubcat');
  //    console.log(item);
	  this.chartTitle = this.setFLU(item.name);
	  this.chartUnit = item.unit;
	  this.labels = [];
	  this.data = [];
	  var chartValCount = 0;
  
	  for(let i=0; i <  this.mealTypeList.length; i++)
	  {
		var obj = this.selDay[this.mealTypeList[i]];
  
		if(typeof(obj["calories"]) !== "undefined")
		{
		  //this.selCatValues[chartValCount] = {"name": this.mealTypeList[i],"id":obj["id"], "label": obj["label"],  "details": [] };
		  if(this.selCat["name"] == "Vitamin")
		  {
			if( obj["digestArr"]["length"] > 0)
			{
			 
			  var totalValue= 0;
			  for(let j=0; j < obj["digestArr"]["length"] ; j++)
			  {
				
				var temp = obj["digestArr"][j];
  
				
  
				if(temp["label"].toLowerCase().indexOf(item["name"].toLowerCase()) !== -1)
				{
				  
  
				  if(temp["total"] > 0)
				  {
					if(temp["unit"].indexOf("u00b5") !== -1)
					{
					  temp["unit"] = temp["unit"].replace("u00b5", "µ");
					}
				  totalValue += temp["total"];
					}
				}
			   
			  }
			  if(totalValue > 0)
			  {
			  this.data[chartValCount] =  totalValue.toFixed(0);
			  this.dataPie[chartValCount] = {"name":this.setFLU(this.mealTypeList[i]), "y":  totalValue}
			  this.labels[chartValCount] =  this.setFLU(this.mealTypeList[i]);
			  chartValCount++;
			 
			  }
		   
			}
		   
		  }
		  else if(this.selCat["name"].toUpperCase() == "MINERALS")
		  {
			if( obj["totalNutrientsArr"]["length"] > 0)
			{
			  var totalValue= 0;
			  for(let j=0; j < obj["totalNutrientsArr"]["length"] ; j++)
			  {
				var temp = obj["totalNutrientsArr"][j];
			 //   console.log(temp["value"]);
			 //   for(let k=0; k < this.mineralsList["length"] ; k++)
			 //   {
				  if(temp["value"]["label"].toUpperCase().indexOf(item["name"].toUpperCase()) !== -1)
				  {
					if(temp["value"]["quantity"] > 0)
					{
					  if(temp["value"]["unit"].indexOf("u00b5") !== -1)
					  {
						temp["value"]["unit"] = temp["value"]["unit"].replace("u00b5", "µ");
					  }
  
					  totalValue += temp["value"]["quantity"];
				
					 
					}
				  }
			   // }
			  
			  }
			  if(totalValue > 0)
			  {
			  this.data[chartValCount] =  totalValue.toFixed(0);
			  this.dataPie[chartValCount] = {"name":this.setFLU(this.mealTypeList[i]), "y":  totalValue}
			  this.labels[chartValCount] =  this.setFLU(this.mealTypeList[i]);
			  chartValCount++;
			 
			  }
			}
		   
		  }
  
		}
	  }
   //   console.log(this.data);
   //   console.log(this.labels);
	  this.createPieChart();
	}
  
	/* Chart functions */
  
	
	setFLU(str)
	{
	  var retStr = str;
	  if(str !== "")
	  retStr = this.helpService.setFirstLetterToUppercase(str);
  
	  return retStr;
	}
  
	formatValue(val)
	{
	  return parseFloat(val).toFixed(2);
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
	  console.log(ingredientsList);
	  console.log(shoppingList);
	  console.log(consList);
  
	  console.log(JSON.stringify(shoppingList));
	  console.log(JSON.stringify(consList));
	  sessionStorage.setItem("list",JSON.stringify(consList));
	 // this.gotopage('grocerylist', { "returnpath":"planadd", "returnparam1": this.plan["mealplanid"]})
	}
  
	setComplete(item)
	{
	  var currentUser = this.helpService.getCurrentUser();
	  console.log(currentUser);
	  console.log(this.plan);
	  console.log(item);
	  var  params = {};
	//  params["id"] ="";
	  params["userid"] = currentUser["id"];
	  params["mealplanid"] =this.routeParams.id;
	  params["dayid"] =this.plan["days"][0]["id"];
	  if(typeof(item["name"]) !== "undefined" && item["name"] !== "")
	  {
		params[item["name"]] = "1";
	  }
  
  /*
	  params["breakfast"] = currentUser["id"];
	  params["snack1"] = currentUser["id"];
	  params["lunch"] = currentUser["id"];
	  params["snack2"] = currentUser["id"];
	  params["dinner"] = currentUser["id"]; */
	  console.log(this.completeStatus);
	 
	  if(typeof(this.completeStatus) !== "undefined" && this.completeStatus !== null && typeof(this.completeStatus["id"]) !== "undefined")
	  {
		params["id"] = this.completeStatus["id"];
		console.log(params);
		var res =   this.dbService.updateDataByTable("user_days_status", params).subscribe(invData => setTimeout(() => 
		{
			console.log(JSON.stringify(invData));
		  this.getCompleteStatus();
		}));
	  }
	  else
	  {
	  var res =   this.dbService.postDataByTable("user_days_status", params).subscribe(invData => setTimeout(() => 
	  {
		  console.log(JSON.stringify(invData));
		this.getCompleteStatus();
	  }));
	}
	}
  
	getCompleteStatus()
	{
	  var currentUser = this.helpService.getCurrentUser();
	  var  params = {};
	  params["userid"] = currentUser["id"];
	  params["mealplanid"] =this.routeParams.id;
	  params["dayid"] =this.plan["days"][0]["id"];
   
	  console.log(params);
	 
	  
	  var res =   this.dbService.getDataByTable("user_days_status", params).subscribe(invData => setTimeout(() => 
	  {
		  console.log(invData);
		  if(invData !== null && invData["body"]["length"] > 0)
		  {
			this.completeStatus = invData["body"][0];
			console.log("completestatus");
			console.log(this.completeStatus);
		  }
  
	  }));
	 
	}
  
	ChartDefaults()
	{
	var colorsArr = this.colorArrayList[0];
	if(typeof(this.chartIndex) !== "undefined" &&  this.chartIndex > -1)
	{
		colorsArr = this.colorArrayList[this.chartIndex];
	}

	Highcharts.setOptions({
		colors: Highcharts.map(colorsArr, function (color) {
			return {
				radialGradient: {
					cx: 0.5,
					cy: 0.3,
					r: 0.7
				},
				stops: [
					[0, color],
					[1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
				]
			};
		})
	});

		var parent = this;
		this.chartOptionsLine = {
			responsive: {
				rules: [{
				  condition: {
					maxWidth: 500
				  },
				  chartOptions: {
					legend: {
					  enabled: false
					}
				  }
				}]
			  },
			exporting: {
				filename: 'Day wise graph'
			}, 
			chart: {
				type: 'pie'
			  },
		  credits: {
			enabled: false
		  },
		  title: {
			text: ''
		  },
		  subtitle: {
			text: ''
		  },
		xAxis: {
			categories: []
		  },
		yAxis: {
			allowDecimals: false,
			title: {
			  text: 'No. of ' + parent.selCat["name"]
			},
			plotLines: [{
			  value: 0,
			  width: 1,
			  color: '#808080'
			}]
		},
	plotOptions: {
			pie: {
				colors: colorsArr,
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					distance: '-20%',
					enabled: true,
					//	format: '<b>{point.name}</b>: {point.percentage:.1f} %'
					//format: '<b>{point.name}</b>: {point.y:.1f} ' + parent.chartUnit,
					format: '{point.y:.1f} ' + parent.chartUnit,
					style: {color:"#000",
						textShadow: false ,
						textOutline: false 
					}
				},
				showInLegend: true
			}
		}, 
		tooltip: {
		//	pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		pointFormat: '{series.name}: <b>{point.y:.1f} ' + parent.chartUnit + '</b>'
		},
		accessibility: {
			point: {
				valueSuffix: '%'
			}
		},
		  series: [{"name":"", "data":[],  colorByPoint: true, 	
			  point:{
				events:{
					click: function (event) {
					//	console.log(event.clientX);
						var xcord = event.clientX;
						if(xcord > 990)
						xcord = xcord-150;
					/*parent.window.document.getElementById("contextmenu").style.display = 'block';
					parent.window.document.getElementById("contextmenu").style.top = event.clientY + "px"  ;
					parent.window.document.getElementById("contextmenu").style.left = xcord + "px"  ;
					parent.window.document.getElementById("contextLabel").style.display = 'block';
	
					var newlabel =  parent.window.document.getElementById("contextLabel")
					newlabel.innerHTML = "<b>" + event.point.series.name + "</b> : " + event.point.category + "<br><b>No. of Cases</b> : " + event.point.y;
	
					sessionStorage.setItem("reportType","complaintdttm");
					sessionStorage.setItem("reportProperty",event.point.series.name);
					sessionStorage.setItem("reportValue",event.point.category);	
					sessionStorage.setItem("reportDisplayText","Date");
					*/
					}
				}
			}      
		}]
		}; // required
	
	}

	createPieChart() {

		this.ChartDefaults();
		this.chartOptionsLine["series"][0]["data"] = this.dataPie;
		this.chartOptionsLine["series"][0]["name"] = 	this.selCat["name"];
		//this.chartOptionsLine["yAxis"]["title"] = 	"No.  of " + this.chartUnit;

		console.log(this.chartUnit);
		this.chartOptionsLine["xAxis"]["categories"] = this.labels;
		console.log(this.chartOptionsLine);
	
	var chartOptionsLine1 = {   
			chart: {
			   type: "spline"
			},
			title: {
			   text: "Monthly Average Temperature"
			},
			subtitle: {
			   text: "Source: WorldClimate.com"
			},
			legend: {
				align: 'right',
				verticalAlign: 'middle',
				layout: 'vertical'
			},
			xAxis:{
			   categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
				  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			yAxis: {          
			   title:{
				  text:"Temperature °C"
			   } 
			},
			tooltip: {
			   valueSuffix:" °C"
			},
			series: [
			   {
				  name: 'Tokyo',
				  data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,26.5, 23.3, 18.3, 13.9, 9.6]
			   },
			   {
				  name: 'New York',
				  data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,24.1, 20.1, 14.1, 8.6, 2.5]
			   },
			   {
				  name: 'Berlin',
				  data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
			   },
			   {
				  name: 'London',
				  data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
			   }
			]
		 };
		 console.log(this.chartOptionsLine);
	}

  }
  



	