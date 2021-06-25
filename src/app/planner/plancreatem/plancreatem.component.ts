import { Component, OnInit,OnDestroy, ViewChild  } from '@angular/core';
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
	selector: 'app-plancreatem',
	templateUrl: './plancreatem.component.html',
	styleUrls: ['./plancreatem.component.scss']
})
export class PlancreatemComponent implements OnInit {

	
//	@ViewChild('txtmodalText') txtmodalText : any;
	plan: any = {};
	planWeek: any;
	planDay: any;
  
	selectedWeek: any = 0;
	selectedDay: any =0;
	recipeList: Array<any> = [];
	selectedRecipeName : any; 
	routeParams: any;
	private onDestroy$: Subject<void> = new Subject<void>();
	sub: any;
  
	days: any;
  selDay :any ="";
  selDayIndex: any = -1;
  modalText: any = "";
  mealTypeList : Array<any> = [];
  oldName: any = "";
  currentUser: any;
  mineralsList: Array<any> = [];
  totalMineralsForDay : Array<any> = [];
  showpopup: boolean = false;
  errorMessage: any = "";
  emailContents: any;
  showemailPanel: any;
  sharemeal: any = {};
  
	  showNutrientsFlag: boolean = false;
	  role: any = {};
	viewMode: boolean = false;

	constructor(private router: Router, private route: ActivatedRoute, private modalService: ModalService, private pdfService: PDFService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}


		ngOnInit() {
			this.LoadParams();
		  }
		  toggleMore()
		  {
			this.showpopup = ! this.showpopup;
			console.log("in toggleMore");
			var obj = document.getElementById("morecontextmenupadd");
			console.log(obj);
			this.viewMode= false;
	
		  }
		  LoadParams()
		  {
			this.showpopup= false;
		
			this.errorMessage = "";
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
		
				this.role = this.helpService.getRoleStatus(this.currentUser);
				this.showNutrientsFlag = this.helpService.showorhideNutritions(this.role);
			this.viewMode= false;
				console.log(this.showNutrientsFlag);
			this.mealTypeList = ["breakfast", "snack1", "lunch", "snack2", "dinner"];
			this.modalText = "";
			this.routeParams = {};
			this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
			//  console.log(params);   
			  this.routeParams = params;     
			  if (typeof (this.routeParams.id) !== "undefined") {
				console.log(this.routeParams.id);
				this.plan["mealplanid"] =this.routeParams.id;
				//this.loadRecipe(this.routeParams.id);
			  
			  }   
			  this.setDefaults();
		   });  
		  }
		  setDefaults()
		  {
		
			/*
			this.httpClient.get('assets/data/email.json').subscribe(
					emailtemplate => {
						this.emailContents = emailtemplate;
					});
					*/
			  this.showemailPanel = false;
			  this.sharemeal = {"email":""};
			this.errorMessage= "";
			this.selectedRecipeName= "";
			this.loadRecipes();
			this.recipeList = [];
			this.oldName = "";
			this.plan["name"] = "";
			this.plan["tags"] = "";
			this.plan["weeks"] = [];
			this.plan["totalweeks"]="";
			this.plan["days"] = [];
			this.plan["status"] = false;
			
			for(let i=0; i < 7; i++)
			{
			  this.plan["days"].push({"day_num":i, "name":"Day " + (i+1), "breakfast":"", "snack1":"", "lunch":"", "snack2":"", "dinner":""})
		
			}
			this.selDay = this.plan["days"][0];
			this.selDayIndex = 0;
			this.planDay = this.plan['days'][this.selDay['day_num']];
			this.planDay['forall']= {};
		  //  console.log(this.selDay);
		  
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
					this.plan["created_by"] = mpData["body"][0]["created_by"];
					this.oldName =  this.plan["name"];
		
					if(this.plan['created_by'] !== this.currentUser['id'])
					{
					this.viewMode= true;
					}
		
		
					this.loadDaysData();
				  }
				}
		
			  }))
			}
			this.getNutrientsMaxMin(); 
			this.loadFilters();
		  }
		
		  initializeDays()
		  {
			this.plan["days"] = [];
			for(let i=0; i < 7; i++)
			{
			  this.plan["days"].push({"day_num":i, "name":"Day " + (i+1), "breakfast":[], "snack1":[], "lunch":[], "snack2":[], "dinner":[]})
		
			}
		  }
		  onNameChange(type)
		  {
			this.saveMealPlan();
		  }
		  loadDaysData()
		  {
		  //  console.log("in loadDaysData");
		
			if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
			{
			  var params = {};
			   
			  //  params["meal_plan_id"] = this.plan["id"];
			  params["query"] = "select * from days where meal_plan_id = " + this.plan["id"] + " order by day_num";
			  var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(dData => setTimeout(() => {
		
				console.log(JSON.stringify(dData));
				if(dData !== null)
				{
				  if(dData["body"] !== null && dData["body"]['length'] > 0)
				  {
					var totaldays = 7;
					if(dData["body"]['length'] <7)
					totaldays = dData["body"]['length'];
					var arr  = dData["body"].sort(this.sortArraybyDay);
					for(let i=0; i < totaldays ; i++)
					{
					  this.plan["days"][i]= arr[i];
					}
					console.log(this.selDay['day_num']);
					this.planDay = this.plan['days'][this.selDay['day_num']];
					this.planDay['forall']= {};
					console.log(this.planDay);
					this.selDay = this.plan["days"][0];
				  }
				  else{
					this.initializeDays();
					this.createDay();
				  }
				}
				else{
				  this.initializeDays();
				  this.createDay();
				}
				console.log(this.plan);
				this.loadRecipesToDays();
			  }))
			}
		 
		  }
		  sortArraybyDay(a, b) {
				if ( a['day_num'] < b['day_num'] ){
					return -1;
				  }
				  if ( a['day_num'] > b['day_num'] ){
					return 1;
				  }
				  return 0;
			}
		  createDay()
		  {
			if(this.plan["name"] !== "")
			{
			  this.errorMessage = "";
			if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
			{
			  var params = {};
			   
				params["meal_plan_id"] = this.plan["id"];
				params["day_num"] = this.selDayIndex;
				params["name"] = "Day " + (parseInt(this.selDayIndex) +1);
		
				params["breakfast"] = "";
				if(typeof(this.plan["days"][this.selDayIndex]["breakfast"]["id"]) !== "undefined")
				params["breakfast"] = this.plan["days"][this.selDayIndex]["breakfast"]["id"];
		
				params["snack1"] = "";
				if(typeof(this.plan["days"][this.selDayIndex]["snack1"]["id"]) !== "undefined")
				params["snack1"] = this.plan["days"][this.selDayIndex]["snack1"]["id"];
		
				params["lunch"] = "";
				if(typeof(this.plan["days"][this.selDayIndex]["lunch"]["id"]) !== "undefined")
				params["lunch"] = this.plan["days"][this.selDayIndex]["lunch"]["id"];
		
				params["snack2"] = "";
				if(typeof(this.plan["days"][this.selDayIndex]["snack2"]["id"]) !== "undefined")
				params["snack2"] = this.plan["days"][this.selDayIndex]["snack2"]["id"];
		
				params["dinner"] = "";
				if(typeof(this.plan["days"][this.selDayIndex]["dinner"]["id"]) !== "undefined")
				params["dinner"] = this.plan["days"][this.selDayIndex]["dinner"]["id"];
		
				params["created_by"] = this.currentUser["id"];
				params["created_at"] = new Date();
				params["status"] = 1;
		
			//  console.log(params);
			//  console.log(JSON.stringify(params));
			  if(typeof(this.plan["days"][this.selDayIndex]['id']) == "undefined" || this.plan["days"][this.selDayIndex]['id'] == "")
			  { 
			   var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {
		
				  console.log(dData);
				  if(dData !== null)
				  {
					if(dData["result"] !== null && dData["result"] !== "")
					{
					  this.plan["days"][this.selDayIndex]= params;
					  this.plan["days"][this.selDayIndex]['id']= dData['inserted_id'];
					}
					else{
					// this.createDay();
					}
				  }
		
		
				})); 
			  }
			  else
			  {
				params["id"] = this.plan["days"][this.selDayIndex]['id'];
				console.log(JSON.stringify(params));
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
				  this.loadRecipesToDays();
				}));
			  }
			}  
		  }
		  else
		  {
			this.errorMessage="Plan name is mandatory";
		  }
		  }
		  toggleNutrients(index, mealtype)
		  {
			 this.planDay[mealtype]["expand"] = !this.planDay[mealtype]["expand"]
			for(let i=0; i < this.mealTypeList.length; i++)
			{
			  var mtype = this.mealTypeList[i];
			  if(mtype.toLowerCase() !== mealtype.toLowerCase())
			  {
					   if(this.planDay[mtype] !== "")
				{
				this.planDay[mtype]["expand"] = false;
				var objIcon1 = document.getElementById("icon_" + i  + "_" + mtype);
				if(objIcon1 !== null)
				{
				  objIcon1.setAttribute("name","chevron-down-outline")
				}
				}
			  }
			}
		  //  var obj = document.getElementById("nutrients_" + index  + "_" + mealtype);
		
			var objIcon = document.getElementById("icon_" + index  + "_" + mealtype);
			if(objIcon !== null)
			{
			  if(this.planDay[mealtype]["expand"])
			  {
				objIcon.setAttribute("name","chevron-up-outline")
			  }
			  else
			  {
				objIcon.setAttribute("name","chevron-down-outline")
				
			  }
			}
			/*
			if(obj !== null)
			{
			  if(obj.style.display == "none")
			  {
				obj.style.display="block";
				objIcon.setAttribute("name","chevron-up-outline")
			  }
			  else
			  {
				obj.style.display = "none";
				objIcon.setAttribute("name","chevron-down-outline")
			  }
			}
			*/
		  }
		
		  resize(field) {
		   
			var obj = document.getElementById(field);
		   // console.log(obj);
		   if(obj !== null)
		   {
			obj.style.height = obj.scrollHeight + 'px';
		   }
		  }
		  setDayIndex(index, currentDay)
		  {
			this.selDayIndex = index;
		  //  console.log(index);
			this.selDay = currentDay;
		
			this.selDayIndex = this.selDay['day_num'];
			//console.log(this.selDay);
		   // console.log(this.plan);
			this.planDay = this.plan['days'][this.selDay['day_num']];
		
			
		   // console.log(this.planDay);
			this.planDay['forall']= {};
			if(typeof(this.planDay['id']) !== "undefined" && this.planDay['id'] !== "")
			{
		
			}
			else
			{
			this.createDay();
			}
		
		  }
		  selectDay(ev)
		  {
		//	console.log(ev);
		//	console.log(this.selDay);
			this.selDayIndex = this.selDay['day_num'];
			//console.log(this.selDay);
		   // console.log(this.plan);
			this.planDay = this.plan['days'][this.selDay['day_num']];
		   // console.log(this.planDay);
			this.planDay['forall']= {};
			if(typeof(this.planDay['id']) !== "undefined" && this.planDay['id'] !== "")
			{
		
			}
			else
			{
			this.createDay();
			}
		  //  console.log(this.plan['days']);
			
		//   console.log(this.planDay);
		  }
		  showDay(index)
		  {
		  //  console.log("ShowDay");
		  //  console.log(index);
			return parseInt(index)+1;
		  }
		
		  loadRecipes(txt = "")
		  {
			var params = {"limit": 100};
		
			if(txt !== "")
			{
			params["content"] = txt;
			this.helpService.saveSearchHistory(params["content"], "text", "plan_mobile", this.currentUser["id"]);
		
			}
		
		  params["instructions"] = "notempty";
		
		
		  var checkMinerals = false;
		 if(typeof(this.advanceFilters) !== "undefined" && this.advanceFilters !== null)
		 {
		   if(typeof(this.advanceFilters["dietLabels"] ) !== "undefined" && this.advanceFilters["dietLabels"]  !== "")
		   {
			params["dietLabels"] = this.advanceFilters["dietLabels"]
			this.helpService.saveSearchHistory(this.advanceFilters["dietLabels"], "dietLabels", "plan_mobile", this.currentUser["id"]);
		
		   } 
		
		   if(typeof(this.advanceFilters["healthLabels"] ) !== "undefined" && this.advanceFilters["healthLabels"]  !== "")
		   {
			params["healthLabels"] = this.advanceFilters["healthLabels"]
			this.helpService.saveSearchHistory(this.advanceFilters["healthLabels"], "healthLabels", "plan_mobile", this.currentUser["id"]);
		
		   } 
		   if(typeof(this.advanceFilters["minerals"] ) !== "undefined" && this.advanceFilters["minerals"]  !== "")
		   {
			params["totalNutrientsne"]="notempty";
			params["digestne"]="notempty";
			checkMinerals = true;
			params["minerals"]=this.advanceFilters["mineralsquery"] ;
			this.helpService.saveSearchHistory(this.advanceFilters["mineralsquery"], "nutrients", "plan_mobile", this.currentUser["id"]);
		
		   } 
		   this.advanceFilters["minerals"]
		//   console.log(this.advanceFilters);
		 }
		 params["returnfields"] = " id, label, image, healthLabels, dietLabels, calories,totalNutrients, digest";
		// console.log(params);
			var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
			//  console.log(invData);
			  if(invData !== null)
			  {
				if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
				{
				  var temp = invData["body"];
				  if(temp["length"] > 0)
				  {
					for(let i=0; i< temp["length"] ; i++)
					{
		 
					//  this.recipeList.push(this.formatRecipe(temp[i]))
					  var isMatching = true;
					  if(checkMinerals)
					  isMatching = this.filterMinerals(invData["body"][i]);
			
					  if(isMatching)
					  this.recipeList.push(invData["body"][i]);
					}
				  }
				 
				}
		
		
				this.loadRecipesToDays();
		 
			  }
			}));
		
		  }
		 
		  loadRecipesToDays()
		  {
		//	console.log(this.recipeList);
			for(let i=0; i < this.plan["days"]['length'] ; i++)
			{
			  var obj = this.plan["days"][i];
			  for(let j=0; j < this.mealTypeList['length']; j++)
			  {
			  
				if(this.plan["days"][i][this.mealTypeList[j]] !== "")
				{
			//	  console.log("day "+ i);
			//	  console.log(this.plan["days"][i][this.mealTypeList[j]])
				  var bIndex = this.recipeList.findIndex(x => (x.id === this.plan["days"][i][this.mealTypeList[j]]));
			//	  console.log(bIndex);
				  if(bIndex > -1)
				  {
					this.plan["days"][i][this.mealTypeList[j]] =  this.formatRecipe(this.recipeList[bIndex]);
					if(i == this.selDayIndex)
					this.planDay[this.mealTypeList[j]] = this.formatRecipe(this.recipeList[bIndex]);
				  }
				  else if(this.plan["days"][i][this.mealTypeList[j]] !== "" && bIndex == -1)
				  {
				  
				//	console.log ("calling recipe by id");
					if(typeof(this.plan["days"][i][this.mealTypeList[j]]["id"]) == "undefined" && typeof(this.plan["days"][i][this.mealTypeList[j]]["label"]) == "undefined")
					{
				//	  console.log("recipe id " + this.plan["days"][i][this.mealTypeList[j]]);
					  this.getRecipeById(i, this.mealTypeList[j], this.plan["days"][i][this.mealTypeList[j]]);
					}
				   
				  }
				}
			  }
			}
		  }
		 getRecipeById(index, type, id)
		 {
		//   console.log("getRecipeById")
		//   console.log("index " + index);
		//   console.log(id);
		   var params = {'id':id}
		  // console.log(params);
		
		   
		  params["returnfields"] = " id, label, image, healthLabels, ingredients, dietLabels, calories, totalNutrients, digest";
		  var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
		
		//	 console.log(invData);
		   
			 if(invData !== null)
			 {
			   if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
			   {
				 var temp = invData["body"];
				 if(temp["length"] > 0)
				 {
				  this.plan["days"][index][type] =  this.formatRecipe(temp[0]);
				//  console.log(this.planDay);
				 //  this.planDay[type]= this.plan["days"][index][type];
				 }
				
			   }
		 
				
			   }
			 
		   }));
		
		 } 
		 isItemAvailable: boolean = false;
		 items:Array<any> = [];
		isSearching: boolean = false;
		 getItems(ev: any, prop) {
	//	  console.log("in getItems);")
	//	  console.log(this.planDay);
		
	//	  console.log(this.modalText);
	//	  console.log(prop);
		
		  if(!this.isSearching)
		  {
		this.items = [];
		this.planDay['selected'] = prop;
		const val = this.planDay[prop]["label"];
		console.log("selectedRecipeName " + this.selectedRecipeName);
		console.log("val " + val);
		var checkMinerals = false;
		var params = {};
		var filterExists = false;
		if( this.selectedRecipeName !== val)
		{
		  filterExists= true;
		}
		if(typeof(this.advanceFilters) !== "undefined" && this.advanceFilters !== null)
		{
		  if(typeof(this.advanceFilters["dietLabels"] ) !== "undefined" && this.advanceFilters["dietLabels"]  !== "")
		  {
		   params["dietLabels"] = this.advanceFilters["dietLabels"]
		   filterExists = true;
		   this.helpService.saveSearchHistory(this.advanceFilters["dietLabels"], "dietLabels", "plan_mobile", this.currentUser["id"]);
		
		  } 
		
		  if(typeof(this.advanceFilters["healthLabels"] ) !== "undefined" && this.advanceFilters["healthLabels"]  !== "")
		  {
		   params["healthLabels"] = this.advanceFilters["healthLabels"]
		   this.helpService.saveSearchHistory(this.advanceFilters["healthLabels"], "healthLabels", "plan_mobile", this.currentUser["id"]);
		
		   filterExists = true;
		  } 
		  if(typeof(this.advanceFilters["minerals"] ) !== "undefined" && this.advanceFilters["minerals"]  !== "")
		  {
		   params["totalNutrientsne"]="notempty";
		   params["digestne"]="notempty";
		   checkMinerals = true;
		   params["minerals"]=this.advanceFilters["mineralsquery"] ;
		   this.helpService.saveSearchHistory(this.advanceFilters["mineralsquery"], "nutrients", "plan_mobile", this.currentUser["id"]);
		
		   filterExists = true;
		  } 
		  //this.advanceFilters["minerals"]
		  console.log(this.advanceFilters);
		}
		console.log(params);
		  console.log(filterExists )
		if(filterExists)
		{
		// if (val && val.trim() !== '') {
		params["limit"] = 25;
		if(val !== "")
		{
		params["content"] = val;
		this.helpService.saveSearchHistory(params["content"], "text", "plan_mobile", this.currentUser["id"]);
		}
		
		console.log(val);
		
		params["instructions"] = "notempty";
		params["returnfields"] = " id, label, image, healthLabels, dietLabels, calories, totalNutrients, digest";
		this.isSearching = true;
		console.log(params);
		var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
		
		  if(invData !== null)
		  {
			if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
			{
			  var temp = invData["body"];
			  if(temp["length"] > 0)
			  {
				this.recipeList = [];
				for(let i=0; i< temp["length"] ; i++)
				{
				  this.recipeList.push(this.formatRecipe(temp[i]));
				}
			  }
			}
			this.isItemAvailable = true;
			this.isSearching = false;
			this.items = this.recipeList.filter((item) => {    
			 // console.log(item);       
				return (item["label"].toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
		
			}
		  
		}));
		//  }
		} else {
		  this.isItemAvailable = false;
		}
		  }
		}
		setrecipe(planDay, prop,  item)
		{
		
		  
		
		  this.plan["days"][this.selDay['day_num']][prop] = item;
		  this.selectedRecipeName= this.plan["days"][this.selDay['day_num']][prop]["label"];
		  this.isItemAvailable = false;
		   this.items = [];
		
			this.plan["days"][this.selDay['day_num']][prop] = item;
		
		   for(let f=0; f < this.plan["days"]["length"]; f++)
		   {
		
			if(this.planDay['forall'][prop])
			{
			if(typeof(this.plan["days"][f][prop]["label"]) == "undefined" || this.plan["days"][f][prop]["label"] == "")
			{
			 this.plan["days"][f][prop] = this.formatRecipe(item);
			 
			}
		
			}
			var totalCalperDay = 0;
		   for(let mt = 0; mt < this.mealTypeList["length"]; mt++)
		   {
			if(typeof(this.plan["days"][f][this.mealTypeList[mt]]["calories"]) !== "undefined" && this.plan["days"][f][this.mealTypeList[mt]]["calories"] !== "")
			{
			  var mtype = this.mealTypeList[mt];
			  totalCalperDay += parseInt(this.plan["days"][f][mtype]["calories"]);
			}
		   }
		 //  console.log("totalCalperDay " + totalCalperDay);
		   this.plan["days"][f]["totalCalories"] = totalCalperDay;
		  }
		  this.planDay['forall'][prop] = false;
		  this.planDay[prop]=item;
		 
		   console.log(this.planDay);
		  this.createDay();
		 // this.autosave()
		 //  console.log(this.plan);
		   this.closeModal();
		}
		closeModal()
		{
		  this.addMealFlag= false;
		 
		  
		}
		addMealFlag : boolean = false;
		addMeal(mealtype)
		{
		  console.log("Addmeal ");
		  console.log(mealtype);
		  this.modalText = mealtype;
		 
		  if(this.planDay[mealtype] == "")
		  {
			this.planDay[mealtype] = {};
			this.planDay[mealtype]["label"] = "";
			this.planDay[mealtype]["searchtext"] = "";
		  }
		  this.addMealFlag = !this.addMealFlag;
		  console.log(this.addMealFlag);
		}
		  save()
		  {
		 //   console.log(this.plan);
			if(this.plan["days"]["length"] > 0)
			{
		
			}
		  }
		
		  updateMealPlanStatus()
		  {
			this.createDay();
			var params = {};
		   // if(this.plan["name"] !== "")
		   // params["name"] = this.plan["name"];
		   // if(this.plan["tags"] !== "")
			//params["tags"] = this.plan["tags"];
		
		  //  if(this.plan["totalweeks"] !== "")
			//params["totalweeks"] = this.plan["totalweeks"];
			params["status"] = "1";
			if(typeof(this.plan["mealplanid"]) !== "undefined" && this.plan["mealplanid"] !== "")
			{
			  params["id"]  =  this.plan["mealplanid"] 
			  console.log(params);
			  var res =   this.dbService.updateDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {
		
			 //   console.log(invData);
		
			  }));
			}
		  }
		  saveMealPlan()
		  {
			if(this.plan["name"] !== "")
			{
			  this.errorMessage = "";
		  //  console.log(this.plan)
			var params = {};
			if(this.plan["name"] !== "")
			params["name"] = this.helpService.setFirstLetterToUppercase(this.plan["name"]);
			else
			params["name"] = this.helpService.setFirstLetterToUppercase("My Diet Plan");
			
			if(this.plan["tags"] !== "")
			params["tags"] = this.helpService.setFirstLetterToUppercase(this.plan["tags"]);
		
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
			 console.log(params);
			  var res =   this.dbService.postDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {
		
		   //     console.log(invData);
		
				if(invData !== null)
				{
				if(typeof(invData["inserted_id"]) !== "undefined") 
				{
				  this.plan["id"]=invData['inserted_id'];
					this.plan["mealplanid"]=invData['inserted_id'];
					this.createDays();
				}
				}
			  }));
			}
		  }
		  else
		  {
			this.errorMessage = "Plan name is mandatory.";
		  }
		
		  }
		
		  saveDayDetails()
		  {
		
		
		  }
		  gotopage(page, params=null)
		  {
			var param = {};
			if(params !== null)
			{
			  param = params;
			}
		//	this.helpService.setPathInfo(page, null);
			this.router.navigate([page, param]);
		  }
		  totalCats : Array<any> = [];
		  getFLU(str)
		  {
			var retStr = str;
			if(str !== "")
			retStr = this.helpService.setFirstLetterToUppercase(str);
		
			return retStr;
		  }
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
		
		
		  formatMinerals(day)
		  {
		  //  console.log(day);
		  this.planDay['mexpand'] = ! this.planDay['mexpand']; 
		  if(this.planDay['mexpand'] )
		  {
			var tMArray = [];
			this.totalMineralsForDay= [];
			for(let d=0; d < this.mealTypeList.length; d++)
			{
			  var mealType = this.mealTypeList[d];
			  if(typeof(day[mealType]) !== "undefined")
			  {
				if(typeof(day[mealType]["calories"]) !== "undefined")
				{
				var kIndex = tMArray.findIndex(x => (x.name  === "calories"));
				//  console.log(cIndex);
				  if(kIndex > -1)
				  {
					console.log(tMArray[kIndex]["value"]);
					console.log(day[mealType]["calories"]);
					
					tMArray[kIndex]["value"] =  parseInt(tMArray[kIndex]["value"] ) + parseInt(day[mealType]["calories"]);
				  }
				  else
				  {
					tMArray.push({"name":"calories", "value":day[mealType]["calories"], "unit":"Kcal"});
				  }
				}
				/*
				console.log(tMArray);
				console.log(day[mealType]["paramMicro"]);
				if(typeof(day[mealType]["paramMicro"]) !== "undefined" && day[mealType]["paramMicro"]["length"]> 0)
				{
				  var pArr = day[mealType]["paramMicro"];
			   //   console.log(mArr);
				  for(let ma=0; ma < pArr.length; ma++)
				  {
				//    console.log(mArr[ma]);
					var cIndex = tMArray.findIndex(x => (x.name  === pArr[ma]["label"]));
				   console.log(cIndex);
					if(cIndex > -1)
					{
					  tMArray[cIndex]["value"] = (parseFloat(tMArray[cIndex]["value"]) +  pArr[ma]["total"]).toFixed(2);
					}
					else
					{
					  tMArray.push({"name":pArr[ma]["label"], "value": pArr[ma]["total"], "unit": pArr[ma]["unit"]});
					}
				  }
		
				}
				console.log(tMArray);
				*/
		
				if(typeof(day[mealType]["minerals"]) !== "undefined" && day[mealType]["minerals"]["length"]> 0)
				{
				  var mArr = day[mealType]["minerals"];
			   //   console.log(mArr);
				  for(let ma=0; ma < mArr.length; ma++)
				  {
				//    console.log(mArr[ma]);
					var cIndex = tMArray.findIndex(x => (x.name  === mArr[ma]["name"]));
				  //  console.log(cIndex);
					if(cIndex > -1)
					{
					  tMArray[cIndex]["value"] +=  mArr[ma]["value"]
					}
					else
					{
					  tMArray.push(mArr[ma]);
					}
				  }
		
				}
				
			  }
			
			}
		 //   console.log(tMArray);
		
		 this.totalMineralsForDay= tMArray;
		  }
		
		  }
		  matches: any;
		  startListening(modaltext)
		  {
		   /*
			console.log(this.planDay[modaltext].label);
			this.speechService.startListening().subscribe((speeches)=>{
			  this.matches=speeches;
			  console.log("Matches");
			  console.log(this.matches);
			  console.log(this.matches.length);
			  if(this.matches[0] !== "")
			  {
				var temp = this.matches[0].toLowerCase();
				temp = temp.replace("search"," ");
				temp = temp.replace("find"," ");
				temp = temp.replace("need"," ");
				temp = temp.replace("want"," ");
				temp = temp.replace("recipes"," ");
				temp = temp.replace("recipe"," ");
				this.planDay[modaltext].label = temp;
				if(this.matches.length > 0)
				this.planDay[modaltext].label = temp;
		
				setTimeout(() => {
				  this.txtmodalText.setFocus();
				}, 500);
		
				console.log(this.planDay[modaltext].label);
			  }
		
			},(err)=>{
			  console.log(JSON.stringify(err))
			})
			*/
		
		  }
		  toFixed(str)
		  {
			var retVal = str;
			if(str !== "")
			{
			  retVal = parseFloat(str).toFixed(2);
			}
			return retVal;
		  }
		  getIngredientsList()
		  {
			console.log(this.plan);
			var ingredientsList = [];
			var shoppingList = [];
			var consList = [];
			var foodCategory = [];
			for(let i=0; i < this.plan["days"]["length"]; i++)
			{
			  console.log(this.plan["days"][i]);
			  var itemday = this.plan["days"][i];
			  for(let j=0; j < this.mealTypeList.length; j++)
			  {
				if(typeof(itemday) !== "undefined" && typeof(itemday[this.mealTypeList[j]]) !== "undefined" && itemday[this.mealTypeList[j]] !== "")
				{
				console.log(itemday[this.mealTypeList[j]]["ingredients"]);
			  //  console.log(itemday[this.mealTypeList[j]]["ingredientLines"]);
				  if(typeof(itemday[this.mealTypeList[j]]["ingredients"]) !== "undefined" && itemday[this.mealTypeList[j]]["ingredients"] !== "")
				{
				  if(itemday[this.mealTypeList[j]]["ingredients"].length  < 4999)
				  {
				  var tempA = JSON.parse(itemday[this.mealTypeList[j]]["ingredients"]);
				console.log(tempA);
				for(let k=0; k < tempA.length; k++)
				{
				  ingredientsList.push(tempA[k]['text'])
				  var t = tempA[k]['text'];
				  var t = tempA[k]['food']
				  console.log(tempA[k]['foodCategory']);
				  if(tempA[k]['foodCategory'] !== null)
				  {
				  var fIndexc = foodCategory.findIndex(x=>(x.toLowerCase().trim() ===  tempA[k]['foodCategory'].toLowerCase().trim()));
				  if(fIndexc == -1)
				  {
					foodCategory.push(tempA[k]['foodCategory'])
				  }
				  }
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
		
					consList.push({"name": tempA[k]['food'].toLowerCase(), 'foodCategory': tempA[k]['foodCategory'], 'quantity':  tempA[k]['quantity'], 'measure': tempA[k]['weight'], 'unit': unit})
					}
				}
			  }
			  }
				}
			  }
			}
			console.log(ingredientsList);
			console.log(shoppingList);
			console.log(consList);
			console.log(foodCategory);
		 //   console.log(JSON.stringify(shoppingList));
		 //   console.log(JSON.stringify(consList));
			sessionStorage.setItem("list",JSON.stringify(consList));
			this.gotopage('grocerylist', { "returnpath":"planadd", "returnparam1": this.plan["mealplanid"]})
		  }
		
		
		  /**************8 create base days */
		
		createdIndex: any = 0
		  createDays()
		  {
			console.log("createDays");
			if(this.plan["name"] !== "")
			{
			  this.errorMessage = "";
			if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
			{
			  
			  var params = {};
			   
				params["meal_plan_id"] = this.plan["id"];
				params["day_num"] = this.createdIndex;
				params["name"] = "Day " + (this.createdIndex +1);
		
				params["breakfast"] = "";
				params["snack1"] = ""; 
				params["lunch"] = "";
				params["snack2"] = "";
				params["dinner"] = "";
		
				params["created_by"] = "";
				params["created_at"] = new Date();
				params["status"] = 1;
		
			 
				var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {
		
				  console.log(dData);
				  if(dData !== null)
				  {
					if(dData["result"] !== null && dData["result"] !== "")
					{
					  this.plan["days"][this.createdIndex]= params;
					  this.plan["days"][this.createdIndex]['id']= dData['inserted_id'];
					}
				  
				  }
				  this.createdIndex++;
				  if(this.createdIndex < 7)
				  {
					setTimeout(() => {
					  console.log(this.createdIndex);
					  this.createDays();
					},300);
				  }
				}));
			 
			console.log(this.plan);
			}
			 
		  }
		}
		
		
		autosave()
		{
		  console.log("autosave");
		  console.log(this.plan);
			if(this.plan["name"] !== "")
			{
			  this.errorMessage = "";
			if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
			{
			  for(let d=0; d < 7; d++)
			  {
			  var params = {};
			   console.log( this.plan["days"][d]);
			//  params["meal_plan_id"] = this.plan["id"];
		   //   params["day_num"] = d;
			 // params["name"] = "Day " + (d +1);
			  params["id"] =   this.plan["days"][d]["id"];
			  params["breakfast"] = "";
			  if(typeof(this.plan["days"][d]["breakfast"]["id"]) !== "undefined")
			  params["breakfast"] = this.plan["days"][d]["breakfast"]["id"];
		
			  params["snack1"] = "";
			  if(typeof(this.plan["days"][d]["snack1"]["id"]) !== "undefined")
			  params["snack1"] = this.plan["days"][d]["snack1"]["id"];
		
			  params["lunch"] = "";
			  if(typeof(this.plan["days"][d]["lunch"]["id"]) !== "undefined")
			  params["lunch"] = this.plan["days"][d]["lunch"]["id"];
		
			  params["snack2"] = "";
			  if(typeof(this.plan["days"][d]["snack2"]["id"]) !== "undefined")
			  params["snack2"] = this.plan["days"][d]["snack2"]["id"];
		
			  params["dinner"] = "";
			  if(typeof(this.plan["days"][d]["dinner"]["id"]) !== "undefined")
			  params["dinner"] = this.plan["days"][d]["dinner"]["id"];
		
			  params["created_by"] = this.currentUser["id"];
			  params["created_at"] = new Date();
			  params["status"] = 1;
			  if(typeof(this.plan["days"][d]["id"]) !== "undefined" && this.plan["days"][d]["id"] !== "")
			  {
				console.log(params);
			 
				var res =   this.dbService.updateDataByTable("days", params).subscribe(dData => setTimeout(() => {
		
				  console.log(dData);
				  if(dData !== null)
				  {
					if(dData["result"] !== null && dData["result"] !== "")
					{
					  this.plan["days"][d]= params;
					  this.plan["days"][d]['id']= dData['inserted_id'];
					}
				  
				  }
		 
		
				}));
			  }
			console.log(this.plan);
			}
			}  
		  }
		}
		showSharePanel()
		{
		  
		  this.showemailPanel = !this.showemailPanel;
		  
		
		}
		downloadPlan()
		{
		  console.log("shareplan");
		  console.log(this.plan["id"]);
		  console.log(this.sharemeal );
		  if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
			{
			  this.pdfService.createpdf(this.plan["id"]).subscribe(dData => setTimeout(() => {
		
				if(dData !== null )
						{
				  var mealPlan ={};
				  mealPlan["mealplan"] = this.plan["name"];
				  mealPlan["link"] = environment.apiUrl + "/" + dData["filename"];
				  window.open(encodeURI( mealPlan["link"]),"_system","location=yes");
						
						}
		
			  }));
			}
		
		}
		sharePlan()
		{
		  console.log("shareplan");
		  console.log(this.plan["id"]);
		  console.log(this.sharemeal );
		  if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
			{
			  this.pdfService.createpdf(this.plan["id"]).subscribe(dData => setTimeout(() => {
		
				console.log(dData);
				if(dData !== null )
				{
				var mealPlan ={};
				mealPlan["mealplan"] = this.plan["name"];
				mealPlan["link"] = environment.apiUrl + "/" + dData["filename"];
				mealPlan["emailcontent"] = this.emailContents.emails.sharemealplan.content;
				mealPlan["emailsubject"] = this.emailContents.emails.sharemealplan.subject;
				mealPlan["email"] = "lakshmimys@gmail.com";
				if(this.sharemeal["email"] !== "")
				mealPlan["email"] = this.sharemeal["email"] ;
			//	this.helpService.("sharemealplan", mealPlan);
				this.showSharePanel();
				}
		
		
			  }));
			}
		
		}
		
		/****  for filters */
		filterFlag : boolean = false;
		filters: any = {};
		nutrientDbFields : Array<any> = [];
		advanceFilters: any;
		loadFilters()
			  {
		
				this.filters = {};
				if(constants.minerals["length"] > 0)
				{
				  this.filters["minerals"] = {"label":"Minerals", "expand":false, "data":[]}
				  this.filters["minerals"]["data"] = [];
				  for(let m = 0; m < constants.minerals_new["length"] ; m++)
				  {
				   
					this.filters["minerals"]["data"].push({"name":constants.minerals_new[m]["name"], "unit":constants.minerals_new[m]["unit"],  "min":"", "max":"", "t_min":"", "t_max":"", "selected":false});
				  }
				  this.loadNutrientsMaxMin();
				}
				if(constants.dietLabels["length"] > 0)
				{
				  this.filters["dietLabels"] = {"label":"Diet Labels", "expand":false, "data":[]}
				  this.filters["dietLabels"]["data"] = [];
				  for(let d = 0; d < constants.dietLabels["length"] ; d++)
				  {
					this.filters["dietLabels"]["data"].push({"name":constants.dietLabels[d], "selected":false});
				  }
				}
		
				if(constants.healthLabels["length"] > 0)
				{
				  this.filters["healthLabels"] = {"label":"Health Labels", "expand":false, "data":[]}
				  this.filters["healthLabels"]["data"] = [];
				  for(let h = 0; h < constants.healthLabels["length"] ; h++)
				  {
					this.filters["healthLabels"]["data"].push({"name":constants.healthLabels[h], "selected":false});
				  }
				}
		
		
			  }
			 
			  setFilters()
			  {
				this.filterFlag= !this.filterFlag;
			   // console.log(this.filters);
			   
			  }
			
			  clearFilters()
			  {
				this.filterFlag= false;
				this.loadFilters();
			  }
			  loadNutrientsMaxMin()
			  {
			 //   console.log("loadNutrientsMaxMin");
			//    console.log(this.filters["minerals"]["data"]);
			//    console.log(this.nutrientDbFields);
			
				if(this.filters["minerals"]["data"]["length"] > 0 && this.nutrientDbFields["length"] > 0)
				{
			 //     console.log(this.filters["minerals"]["data"]);
			 //     console.log(this.nutrientDbFields);
				  for(let m =0; m < this.filters["minerals"]["data"]["length"]; m++)
				  {
					  if(typeof(this.filters["minerals"]["data"][m]["name"]["label"]) !== "undefined")
					  {
					var lbl = this.filters["minerals"]["data"][m]["name"]["label"].toLowerCase();
					if(lbl.indexOf(" ") > -1)
					{
					  lbl = lbl.replace(" ", "_");
					}
					
					if(typeof(this.nutrientDbFields[0]["min"+lbl]) !== "undefined" && this.nutrientDbFields[0]["min"+lbl] !== "")
					{
					  this.filters["minerals"]["data"][m]["t_min"] = this.nutrientDbFields[0]["min"+lbl];
					}
			
					if(typeof(this.nutrientDbFields[0]["max"+lbl]) !== "undefined" && this.nutrientDbFields[0]["max"+lbl] !== "")
					{
					  this.filters["minerals"]["data"][m]["t_max"] = this.nutrientDbFields[0]["max"+lbl];
					}
				}
				  }
			 //     console.log(this.filters["minerals"]["data"]);
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
			//    console.log("getNutrientsMaxMin");
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
				
			   var res =   this.dbService.getDatabyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
			
				  
				if(invData["body"]["length"] > 0)
				{
				  this.nutrientDbFields = invData["body"];
			 //     console.log(this.nutrientDbFields);
				}
			   }))
			  
			  }
		
		
			  searchFilters($event, modalText)
			  {
				this.advanceFilters = {"dietLabels":"","healthLabels":"", "minerals":""};
				console.log(this.filters);
			   
				this.advanceFilters["dietLabels"] = "";
				this.advanceFilters["healthLabels"] = "";
				this.advanceFilters["minerals"] = "";        
		
				if(this.filters["dietLabels"]["data"]["length"] > 0)
				{
				  var dQuery = "(";
				  for(let i=0; i <this.filters["dietLabels"]["data"]["length"]; i++)
				  {
					var item = this.filters["dietLabels"]["data"][i];
		
					if(item["selected"])
					{
					  dQuery += " r.dietLabels LIKE '%" + item["name"] + "%' OR ";
					this.advanceFilters["dietLabels"] += item["name"] + "~";
					}
				   
				  }
				  if( this.advanceFilters["dietLabels"] !== "")
				  {
					this.advanceFilters["dietquery"] =  dQuery.slice(0, -4) + ")";
					this.advanceFilters["dietLabels"] =  this.advanceFilters["dietLabels"].slice(0, -1);
				  }
				}
		
				if(this.filters["healthLabels"]["data"]["length"] > 0)
				{
				  var hQuery = "(";
				  for(let i=0; i <this.filters["healthLabels"]["data"]["length"]; i++)
				  {
					var item = this.filters["healthLabels"]["data"][i];
					if(item["selected"])
					{
					this.advanceFilters["healthLabels"] += item["name"] + "~";
					hQuery += " r.healthLabels LIKE '%" + item["name"] + "%' OR ";
					}
				  
				  }
				  if( this.advanceFilters["healthLabels"] !== "")
				  {
					this.advanceFilters["healthquery"] =  hQuery.slice(0, -4) + ")";
					this.advanceFilters["healthLabels"] =  this.advanceFilters["healthLabels"].slice(0, -1);
				  }
				}
				var mQuery = "";
				if(this.filters["minerals"]["data"]["length"] > 0)
				{
				 
				  for(let i=0; i <this.filters["minerals"]["data"]["length"]; i++)
				  {
					var item = this.filters["minerals"]["data"][i];
					if(item["selected"])
					{
					  console.log(item);
					  if(typeof(item["min"]) !== "undefined" && item["min"] !== "" && item["min"] >0)
					  {
						mQuery += " n." + item["name"]['label'].toLowerCase() + " >= " + item["min"] + " AND ";
					  }
					  if(typeof(item["max"]) !== "undefined" && item["max"] !== "" && item["max"] >0)
					  {
						mQuery += " n." + item["name"]['label'].toLowerCase() + " <= " + item["max"] + " AND ";
					  }
		
					this.advanceFilters["minerals"] += item["name"]['label'] + "~";
					}
				  
				  }
				  if( this.advanceFilters["minerals"] !== "")
				  {
					console.log(mQuery);
					this.advanceFilters["mineralsquery"] =  mQuery.slice(0, -4);
					
					this.advanceFilters["minerals"] =  this.advanceFilters["minerals"].slice(0, -1);
				  }
				}
		
				console.log(this.advanceFilters);
			  //  this.loadRecipes();
			  this.getItems($event, modalText)
			  }
		
			  filterMinerals(oRecipe)
		{
		  var fRecipe = this.formatRecipe(oRecipe);
		 // console.log(fRecipe);
		  var tN = oRecipe["totalNutrients"];
		  var tD = oRecipe["digest"];
		  var retValue = false;
		  var totalCats = [];
		  var minerals = "";
		  if(typeof(this.advanceFilters["minerals"] ) !== "undefined" && this.advanceFilters["minerals"]  !== "")
		   {
			 minerals = this.advanceFilters["minerals"];
		
		   }
		 //  console.log(minerals);
		  for(let j=0; j < oRecipe["totalNutrientsArr"]["length"] ; j++)
		  {
			var temp = oRecipe["totalNutrientsArr"][j];
		
			  if(minerals.toUpperCase().indexOf(temp["value"]["label"].toUpperCase()) !== -1)
			  {
			 //   console.log(temp["value"]["label"]);
			 retValue= false;
				if(temp["value"]["quantity"] > 0)
				{
				//  console.log(temp["value"]);
				  retValue= true;
				}
			  }
		
		  }
		//  console.log(retValue);
		
		  return retValue;
		
		}
		selectDeselect(item)
		{
		  console.log(item);
		  item['selected'] = !item['selected'];
		}
		
		formatVal(str, limit )
		{
		  var retVal = str;
		  if(str !== "")
		  {
			retVal = Math.ceil(parseFloat(str));
		  }
		  return retVal;
		}
}
		
