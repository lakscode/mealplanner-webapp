import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../../dbservices/db.service';
import { HelpService } from '../../../services/help.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { constants } from '../../../jsonfiles/constants';


@Component({
	selector: 'app-approverecipes',
	templateUrl: './approverecipes.component.html',
	styleUrls: ['./approverecipes.component.scss']
})
export class ApproverecipesComponent implements OnInit {
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
	filterOpts: any = {};

	constructor(private router: Router, private toastr: ToastrService, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		console.log("ngOnInit");
	
		this.filterOpts = {};
		this.filterOpts = {"submitted":true, "approved": false, "rejected":false, "all":false}
		this.recordType = "submitted";
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
  
	
		}
		
	
  
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
	filterRecords(opt)
	{
		this.filterOpts["submitted"] = false;
		this.filterOpts["approved"] = false;
		this.filterOpts["rejected"] = false;
		this.filterOpts["all"] = false;

		this.recordType = opt; 
		this.filterOpts[opt] = true;
		this.searchProps();

	}
	showFilters: boolean = false;
	recordType  : any = "";
	searchProps()
	{

	var status = "";
	if(this.filterOpts.submitted)
	status = "rm.status = 1 ";

	if(this.filterOpts.approved)
	status = "rm.status = 2 ";
	
	if(this.filterOpts.rejected)
	status = "rm.status = 3 ";

	if(this.filterOpts.all)
	status = "rm.status != 0  ";

	console.log(status);
	console.log('searchProps');
	this.noResult =  false;
  
   var params1 ={};
	  params1["query"] = "SELECT rm.*, r.image, r.label as rlabel, r.cuisineType as rcuisineType, r.dietLabels as rdietLabels, r.healthLabels as rhealthLabels,r.mealType as rmealType,  r.s_instructions as rs_instructions FROM `recipes_modify` rm, recipes r WHERE rm.recipeid = r.id";
	  if(status !== "")
	  {
		params1["query"]  +=  " AND " + status;
	  }
	  console.log(params1);
    var res =   this.dbService.getDatabyTablebyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
		console.log(invData);
		console.log(invData["body"]["length"]);
		if(invData["body"]["length"] > 0)
		{
			console.log("calling again searchprops");
			this.recipesList1 = invData["body"];		
		}
		else
		{
			this.recipesList1 = [];
			this.noResult =  true;
		}
	  }));

	  
 

		
	}


	gotoRecipeDetails(id){
		console.log(id);
	//this.router.navigate(['recipedetails', id]);
	window.open("/recipedetails/"+ id);
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





updateNewRecipe(recipe1, id)
{
	var paramsr = {};
	paramsr["recipeid"] = recipe1.id;
	paramsr["created_by"] = this.currentUser["id"];
	paramsr["id"] = id;
			if(recipe1["s_instructions"] !== recipe1["newrecipe"]["s_instructions"])
			paramsr["s_instructions"]= recipe1["newrecipe"]["s_instructions"];

			if(typeof(recipe1["newrecipe"]["label"]) !== "undefined" &&  recipe1["label"] !== recipe1["newrecipe"]["label"])
			paramsr["label"]= recipe1["newrecipe"]["label"];

			if(typeof(recipe1["newrecipe"]["dietLabels"]) !== "undefined" &&  recipe1["newrecipe"]["dietLabels"] !== "")
			paramsr["dietLabels"]= recipe1["newrecipe"]["dietLabels"];

			if(typeof(recipe1["newrecipe"]["healthLabels"]) !== "undefined" &&  recipe1["newrecipe"]["healthLabels"] !== "")
			paramsr["healthLabels"]= recipe1["newrecipe"]["healthLabels"];

			if(typeof(recipe1["newrecipe"]["cuisineType"]) !== "undefined" &&  recipe1["newrecipe"]["cuisineType"] !== "")
			paramsr["cuisineType"]= recipe1["newrecipe"]["cuisineType"];
		//	paramsr["dishType"]= recipe1["newrecipe"]["dishType"];

			if(typeof(recipe1["newrecipe"]["mealType"]) !== "undefined" && recipe1["newrecipe"]["mealType"] !== "")
			paramsr["mealType"]= recipe1["newrecipe"]["mealType"];
	console.log(paramsr);
			var res =   this.dbService.updateDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
				this.toastr.success("Recipe has been modifed.","Modify Recipe");
			}));
}
approvechanges(recipe)
{
	console.log("approve hancges");
	console.log(recipe);
	if(typeof(recipe.recipeid) !== "undefined" && recipe.recipeid !== "")
	{
		var params = {};
		params["id"] = recipe.recipeid;
		if(recipe.label !== "" && recipe.rlabel !== recipe.label)
		{
			params["label"] = recipe.label;
		}

		if(recipe.s_instructions !== "" && recipe.rs_instructions !== recipe.s_instructions)
		{
			params["s_instructions"] = recipe.s_instructions;
		}

		if(recipe.healthLabels !== "" && recipe.rhealthLabels !== recipe.healthLabels)
		{
			params["healthLabels"] = recipe.healthLabels;
		}


		if(recipe.dietLabels !== "" && recipe.rdietLabels !== recipe.dietLabels)
		{
			params["dietLabels"] = recipe.dietLabels;
		}

		if(recipe.mealType !== "" && recipe.rmealType !== recipe.mealType)
		{
			params["mealType"] = recipe.mealType;
		}

		if(recipe.cuisineType !== "" && recipe.rcuisineType !== recipe.cuisineType)
		{
			params["cuisineType"] = recipe.cuisineType;
		}
		
	
		console.log(params);
		var res =   this.dbService.updateDataByTable("recipes", params).subscribe(invData => setTimeout(() => {

			console.log("Modified recipy");
			this.updateStatus(2,recipe["id"] )
		}));
	}
}

updateStatus(status, id)
{
	var params = {};
	params["approved_by"] = this.currentUser["id"];
	params["status"] = status;
	params["id"] = id;
	var res =   this.dbService.updateDataByTable("recipes_modify", params).subscribe(invData => setTimeout(() => {
		console.log("Modified status");

	}
	));

}
rejectchanges(recipe)
{
	console.log("reject hancges");
	console.log(recipe);
	if(typeof(recipe.id) !== "undefined" && recipe.id !== "")
	{
		var params = {};
		params["id"] = recipe.id;
		params["status"]= "3";
		params["approved_by"] = this.currentUser["id"];
		console.log(params);
		var res =   this.dbService.updateDataByTable("recipes_modify", params).subscribe(invData => setTimeout(() => {

			console.log("Rejected the changes recipy");
			
		}));
	}

}
}

	