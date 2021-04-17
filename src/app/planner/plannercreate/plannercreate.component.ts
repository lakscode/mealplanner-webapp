import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { constants } from '../../jsonfiles/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
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
		  console.log(this.currentUser["displayname"]);
		}
	
		this.mealTypeList = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
		this.recipesList = [];
		this.routeParams = {};
		this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
		//  console.log(params);   
		  this.routeParams = params;     
		  if (typeof (this.routeParams.id) !== "undefined") {
			console.log(this.routeParams.id);
			this.plan["mealplanid"] =this.routeParams.id;
			//this.loadRecipe(this.routeParams.id);
		  }   
		 
	   });  


this.loadRecipes()
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
	
		console.log(this.plan);
	
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
		console.log(this.searchparam);
	
	}
	loadRecipes(idslist = "")
	{
	  
		this.ratingIds = "";
	// this.recipes = recipesList;
	 var params = {}; //{"limit": "10"};
   //  params["caloriesfrom"] = this.searchparam.range.lower;
	// params["caloriesto"] = this.searchparam.range.upper;
	 console.log(this.searchparam);

	 if(idslist == "")
	 {
		params["limit"] =  "10";

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
  
	  console.log(JSON.stringify(params));
	  this.calculateCaloryFlag = false;
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	  console.log(invData);
  
	  var count = 0;
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
		 // this.recipesList = [];
	

		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			var recIndex = this.recipesList.findIndex(x1 => (x1.id === invData["body"][i]["id"]));
			//	console.log(recIndex);
				if(recIndex == -1)
				{
					this.recipesList.push(invData["body"][i]);
				}


		//	if(count < 6)
		//	{
		//	var rIndex = Math.floor(Math.random() * 7);  
		//	var cIndex = Math.floor(Math.random() * 5);  
		//	this.plan["days"][rIndex]["meals"][cIndex]["recipe"] = invData["body"][i];
		//	count++;
		//	}
		//	this.ratingIds += invData["body"][i]["id"] + ",";
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
						this.plan['days'][p]['meals'][q]["recipe"] = this.formatRecipe(this.recipesList[recIndex]);
					}
				}
			}
		  }
		  console.log(this.recipesList);
	
		  console.log(this.plan);
		  this.calculateCaloryFlag = true;
		 // this.loadRatings();
	
	
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
				console.log(this.ratingsArr);
				console.log(  this.recipesList);
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
 // console.log(oRecipe);
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
		var recipeItem = this.recipesList[index];

		var data = ev.dataTransfer.getData("text");
this.plan["days"][r]["meals"][c]["recipe"] =  this.formatRecipe(recipeItem);
	
		var panelObj = document.getElementById("imagep_" + index);
		console.log(panelObj);
		var img = document.createElement('img');
            img.src = this.formatImage(recipeItem["image"], 's');
			img.style.width = "70px";
			img.style.height = "70px";
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
		this.favouritesList = [];
		var params = {"limit": 100};
		console.log(params);
		var res =   this.dbService.getDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
	
		//  console.log(invData);
		  if(invData !== null)
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
			  this.loadRecipes(idslist);
			}
		  }
	
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
		  this.loadRecipes(idslist);
		}
       // this.loadRecipesToDays();
      }))
    }
 
  }
 
  saveMealPlan()
  {
	  console.log(this.plan);
  //  console.log(this.plan)
    var params = {};
    if(this.plan["name"] !== "")
    params["name"] = this.plan["name"];
    if(this.plan["tags"] !== "")
    params["tags"] = this.plan["tags"];

    if(this.plan["totalweeks"] !== "")
    params["totalweeks"] = this.plan["totalweeks"];
    params["status"] = this.plan["status"];
    params["created_by"] = this.currentUser["id"];
    if(typeof(this.plan["mealplanid"]) !== "undefined" && this.plan["mealplanid"] !== "")
    {
      params["id"]  =  this.plan["mealplanid"] 

     console.log(JSON.stringify(params));
      var res =   this.dbService.updateDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

     //   console.log(invData);

        if(invData !== null)
        {
        
        }
     //   console.log(this.plan)
      }));
    }
    else
    {
   //   console.log(params);
      var res =   this.dbService.postDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

   //     console.log(invData);

        if(invData !== null)
        {
        if(typeof(invData["inserted_id"]) !== "undefined") 
        {
			this.routeParams["id"] = invData['inserted_id'];
			this.plan["id"]=invData['inserted_id'];
            this.plan["mealplanid"]=invData['inserted_id'];
			
       //   console.log(this.plan);
        }
        }
      }));
    }

  }
  SavePlanData(r, c)
  {
	  console.log("in save plan data");
	console.log(this.plan);
	console.log(r);
	console.log("C " + c);


    if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    {
		var rowItem = this.plan["days"][r]["meals"];
		console.log(rowItem);
		console.log( this.plan["days"][r]['id']);
      var params = {};
       
        params["meal_plan_id"] = this.plan["id"];
        params["day_num"] = r;
       // params["name"] = "Day " + (r +1);

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

    //  console.log(params);
    //  console.log(JSON.stringify(params));
      if(typeof(this.plan["days"][r]['dayid']) == "undefined" || this.plan["days"][r]['dayid'] == "")
      { 
		  console.log("post data");
		  console.log(params);
        var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {

          console.log(dData);
          if(dData !== null)
          {
            if(dData["result"] !== null && dData["result"] !== "")
            {
              this.plan["days"][r]["meals"]= rowItem;
              this.plan["days"][r]['id']= dData['inserted_id'];
			  this.plan["days"][r]['dayid']= dData['inserted_id'];
            }
            else{
            // this.createDay();
            }
          }
        //  console.log(this.plan);

        }));
      }
      else
      {
		  console.log(this.plan);
        params["id"] = this.plan["days"][r]['dayid'];
      //  console.log(JSON.stringify(params));
	  console.log("update data");
	  console.log(params);
        var res =   this.dbService.updateDataByTable("days", params).subscribe(dData => setTimeout(() => {

        //  console.log(dData);
          if(dData !== null)
          {
            if(dData["result"] !== null && dData["result"] !== "")
            {
           //   this.plan["days"][this.selDayIndex]= params;
            //  this.plan["days"][this.selDayIndex]['id']= dData['inserted_id'];
            }
            else{
            // this.createDay();
            }
          }
        //  console.log(this.plan);
         // this.loadRecipesToDays();
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
}

	