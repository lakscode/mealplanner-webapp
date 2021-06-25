import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { constants } from '../../jsonfiles/constants';
//declare var $: any;
import { ModalService } from '../../shared/modules/modal/modal.service';
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
	modifyFilterLabels: Array<any> = [];
	splitcontent : boolean = false;
	filterOpts: any; 
	sortType: any = "";
	showFilters: boolean = false;
	constructor(private router: Router, private toastr: ToastrService, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder, private modalService: ModalService) {
	
	}
	toggleMore() {
		this.searchmorebar = !this.searchmorebar;
		if (this.searchmorebar)
			this.animClass = "searchbaranim";
	}

	hideLabels()
	{
		for(let l=0; l < this.searchFilterLabels.length; l++)
		{
			this.searchFilterLabels[l]['selected'] = false;
		}
	
	}
	hideModifyLabels()
	{
		for(let l=0; l < this.modifyFilterLabels.length; l++)
			{
				this.modifyFilterLabels[l]['selected'] = false;
			}
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
	showModifyLabels(label)
	{
	
		for(let l=0; l < this.modifyFilterLabels.length; l++)
		{
			if( this.modifyFilterLabels[l]["label"] == label.label)
			this.modifyFilterLabels[l]['selected'] = !this.modifyFilterLabels[l]['selected'];
			else
			this.modifyFilterLabels[l]['selected'] = false;
		}

	}
	ngOnInit() {
		console.log("ngOnInit");
		this.searchmorebar = false;
	//	this.dietLabelsList = constants.dietLabels;
		this.getNutrientsMaxMin(); 

		this.filterOpts = {};
		this.filterOpts = {"asc":false, "desc": false, "calories":false, "all":false}
		this.sortType = "";

		this.loadDDList();
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
	  this.searchparam = {"q":"", "range":{}, "dietLabels":"", "healthLabels":""}
	
  
	  this.routeParams = {};
	 	this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	  //  console.log(params);   
		this.routeParams = params;     
		if (typeof (this.routeParams.details) !== "undefined") {
		  console.log(this.routeParams.details);
		}    
		 if (typeof (this.routeParams.dietLabels) !== "undefined" && this.routeParams.dietLabels !== "") {
		  this.searchparam["dietLabels"] = this.routeParams.dietLabels;
		}   
		if (typeof (this.routeParams.healthLabels) !== "undefined" && this.routeParams.healthLabels !== "") {
			this.searchparam["healthLabels"] = this.routeParams.healthLabels;
		  } 
		console.log(this.routeParams);
		this.splitcontent = false;
	  this.searchProps();
	 }); 

//this.loadRecipes()
	
	}

	loadDDList()
	{

		this.searchFilterLabels = [];
		this.searchFilterLabels.push({"label":"Health Labels", "selected":false});
		this.searchFilterLabels.push({"label":"Diet Labels", "selected":false});
		this.searchFilterLabels.push({"label":"Cuisine Type", "selected":false});
		this.searchFilterLabels.push({"label":"Meal Type", "selected":false});
		this.searchFilterLabels.push({"label":"Nutrients", "selected":false});
		this.searchFilterLabels.push({"label":"Calories", "selected":false});


		this.modifyFilterLabels = [];
		this.modifyFilterLabels.push({"label":"Health Labels", "selected":false});
		this.modifyFilterLabels.push({"label":"Diet Labels", "selected":false});
		this.modifyFilterLabels.push({"label":"Cuisine Type", "selected":false});
		this.modifyFilterLabels.push({"label":"Meal Type", "selected":false});
	
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
		for(let h=0; h < constants.healthLabels.length; h++)
		{
			this.healthlabelsList.push({"name":constants.healthLabels[h], "selected":false})
		}

		//this.mineralsLabelsList = constants.minerals;
		this.mineralsLabelsList= [];
		for(let m=0; m <constants.minerals_new.length; m++)
		{
			this.mineralsLabelsList.push({"name":constants.minerals_new[m]["name"], "selected":false,  "unit":constants.minerals_new[m]["unit"],  "min":"", "max":"", "t_min":"", "t_max":""})
		}
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
		{
			retVal = this.helpService.limitTo(str, num);

			if(str.length > num)
			{
				retVal +=  "...";
			}
		}

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
  loadingData: boolean = false;
	searchProps()
	{

	console.log('searchProps');
		this.loadingData= true;

   var params = {}

    if (typeof (this.searchparam.dietLabels) !== "undefined" && this.searchparam.dietLabels !== "") {
		params["dietLabels"] = this.searchparam.dietLabels;

	}

	if (typeof (this.searchparam.healthLabels) !== "undefined" && this.searchparam.healthLabels !== "") {
		params["healthLabels"] = this.searchparam.healthLabels;

  }
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
	   var words = this.searchparam.q.replaceAll(" ","~");
		params["words"] = words;
		this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipes", this.currentUser["id"]);
	   }

   }
  
    if(typeof(this.maxcalories) !== "undefined" && this.maxcalories > 0)
    {
      params["caloriesto"] = this.maxcalories;
    }
    params["instructions"]="notempty";
 
   
  // params["cuisineType"] = "american";
   params["returnfields"] = " id, label, image, cuisineType, mealType, healthLabels, dietLabels, calories, yield";

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
	 
	 var mealtypes = "";
	 for(let c=0; c <this.mealTypeList.length; c++)
	 {
		 if(this.mealTypeList[c]["selected"])
		 mealtypes += this.mealTypeList[c]["name"] + "~";
	 }

	 if( mealtypes !== "")
	 {
		mealtypes=  mealtypes.slice(0, -1);
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

   if(typeof(mealtypes ) !== "undefined" && mealtypes !== "")
   {
    params["mealType"] = mealtypes
	this.helpService.saveSearchHistory(mealtypes, "mealType", "recipes", this.currentUser["id"]);
   } 



   if(typeof(minerals ) !== "undefined" && minerals  !== "")
   {
    params["totalNutrientsne"]="notempty";
    params["digestne"]="notempty";
    checkMinerals = true;
	console.log(minerals);

   } 
    console.log(params);
   if(mQuery !== "")
	  {

  
	  var params1 = {};

	  var query = "select id, label, image, cuisineType, healthLabels, mealType, dietLabels, calories, yield from recipes ";
	  var where = " where status = 1 AND totalNutrients != '' AND digest != ''  AND s_instructions != '' " ;
	  if(this.maxcalories > 0)
	  where +=  " AND calories <= " + this.maxcalories;

	  if(params["content"])
	  {
		  var temp = params["content"].split(",");
		  var tempc= "";
		  for(let t=0; t < temp.length; t++)
		  {
			tempc += " label LIKE '%" + temp[t] + "%' OR healthLabels LIKE '%" + temp[t] +  "%' OR dietLabels LIKE '%" + temp[t] + "%' OR";
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

	  params1["query"] = query + where + " limit 0, 30";
	  console.log(params1);
    var res =   this.dbService.getDatabyTablebyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
		console.log(invData);
		console.log(invData["body"]["length"]);
		if(invData["body"]["length"] == 0)
		{
			console.log("calling again searchprops");
			this.splitcontent = true;
			if(this.loopCount < 1){
				this.loopCount++;
				this.searchProps();
	
				}	
				this.noResult =  true;
		}
		else
		{
			this.loadingData= false;
			this.splitcontent = false;
		//	this.formatResult(this.shuffle(invData));
			this.formatResult(invData);
		}
	  }));

	  }
  else
  {
	
	  params["status"] = "1";
	  params["limit"] =  "100";
	  console.log(params);
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
			this.loadingData= false;
			this.splitcontent = false;
		//	this.formatResult(this.shuffle(invData));
			this.formatResult(invData);
		}
	  }));
  }

		
	}

	shuffle(array) {
		//for (var i = array.length - 1; i > 0; i--) {
		for (var i=0; i < array.length-1;i++) {			
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		console.log("after sort");
		console.log(array);
		return array;
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
			  this.totalPage = this.recipesList1["length"] / this.page_length;
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
	//this.router.navigate(['recipedetails', id]);
	window.open("/recipedetails/" + id)
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
		this.mineralsLabelsList[m]['min'] = "";
		this.mineralsLabelsList[m]['max'] = "";
		
	}
	this.maxcalories = 0;
	this.searchparam = {"q":""};

	this.searchProps();

}
showhidecontent(recipe)
{
	recipe.showpopup = !recipe.showpopup
	for(let r = 0; r < this.displayList.length; r++)
	{
		if(recipe.id !== this.displayList[r]["id"])
		{
			this.displayList[r]["showpopup"] = false;
			
			this.displayList[r]["showAdd2MP"] = false;
		}
	}


}



/************** add to mean plan */


selectedRecipe2Add2plan: any;
addtoMealPlan(recipe)
{
	this.loadPlanNames();
this.selectedRecipe2Add2plan= recipe;
recipe.showAdd2MP = !recipe.showAdd2MP; 

}
plansList:Array<any>=[];
daysList: Array<any> = [];
mealTypesList : Array<any> = [];
plan: any = {"id":'', "day":"", "mealType":""};
showAdd2MP: boolean = false;
loadPlanNames()
{
	if(this.currentUser && this.currentUser["id"])
	{
	this.plansList = [];

	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select id, name from mealplan where created_by = " + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("mealplan", params).subscribe(invData => setTimeout(() => {

	  console.log(invData);
	  if(invData !== null)
	  {
		var obj = invData["body"]["length"];
		this.plansList = invData["body"];
	  }
	  this.loadOptions();

	}));
	}
}
loadOptions()
{
	this.mealTypesList = [];
	this.daysList = [];
	for(let d=0; d < 7; d++)
	{
		this.daysList.push({"id":d, "name":"Day " + (d+1)});
	}

	this.mealTypesList.push({"code":"breakfast", "name":"Breakfast"});
	this.mealTypesList.push({"code":"snack1", "name":"Pre-lunch Snack"});
	this.mealTypesList.push({"code":"lunch", "name":"Lunch"});
	this.mealTypesList.push({"code":"snack2", "name":"Evening Snack"});
	this.mealTypesList.push({"code":"dinner", "name":"Dinner"});

}
add2Plan()
{
	this.showAdd2MP= false;
	console.log(this.plan);

	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select * from days where meal_plan_id = " + this.plan["id"] + " AND day_num = " + this.plan["day"];
	var res =   this.dbService.getDatabyTablebyQuery("days", params).subscribe(invData => setTimeout(() => {

	  console.log(invData);
	  if(invData !== null && invData["body"]["length"] > 0)
	  {
		var selectedDay = invData["body"][0];
		if(selectedDay[this.plan["mealType"]] == "")
		{
			this.updateMealType();
		}
		else
		{
			this.toastr.warning('Another Recipe has been already added to selected meal type of the plan!!!', 'Add to Meal Plan');
		}
	  }
	  else
	  {
		var params = {};
		   
		params["meal_plan_id"] = this.plan["id"];
		params["day_num"] = this.plan["day"];
		params["name"] = "Day " + (this.plan["day"] +1);

		params["breakfast"] = "";
		params["snack1"] = "";
		params["lunch"] = "";
		params["snack2"] = "";
		params["dinner"] = "";
		params[this.plan["mealType"]] = this.selectedRecipe2Add2plan["id"];
		params["created_by"] = "";
		params["created_at"] = new Date();
		params["status"] = 1;

 
	
		var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {
		//	alert("New day record created for plan");
			this.toastr.success('Recipe has been added to the selected meal type of the plan!!!', 'Add to Meal Plan');
	
		}));

	  }
	}));

}

updateMealType()
{
	//alert("add recipe");
	var params1 = {};
	params1 ['query'] = "update days set " + this.plan["mealType"] + " = " + this.selectedRecipe2Add2plan["id"] + " where meal_plan_id = " + this.plan["id"] + " AND day_num = " + this.plan["day"];
	var res =   this.dbService.getDatabyTablebyQuery("days", params1).subscribe(invData => setTimeout(() => {
		this.toastr.success('Recipe has been added to the selected meal type of the plan!!!', 'Add to Meal Plan');
	

		var recipeindex = this.recipesList.findIndex(x=>(x.id == this. selectedRecipe2Add2plan.id));
		if(recipeindex  >-1)
		{
			this.recipesList[recipeindex].showAdd2MP = false;
		}
	}));
}


/**************************** Make copy of recipe  */


formatString(str)
{
  var retVal = str;
  if(typeof(str) !== "undefined" && str !== "")
  {
    if(str.indexOf("'") > -1)
    {
    
    //retVal = str.replace(/'/g, "\'");
    retVal = retVal.replaceAll("'","");
    ////console.log(retVal);
    }
  }
  return retVal;
}
makeacopy(recipe)
{
	console.log("make a copy")
	var pparms = {"id":recipe.id}
	var res =   this.dbService.getDatabyFields("recipes", pparms).subscribe(recipeData1 => setTimeout(() => {
		console.log(recipeData1);
if(recipeData1 !== null && recipeData1["body"]["length"]> 0)
{
	var new_copy = JSON.parse(JSON.stringify(recipeData1["body"][0]));
	delete new_copy["id"];

	var pQuery = {"query":"select max(id) as maxid from recipes"};
	var res =   this.dbService.getDatabyTablebyQuery("recipes", pQuery).subscribe(recipeData => setTimeout(() => {
	 console.log(recipeData);
  
	  if(recipeData !== null && typeof(recipeData['body']) !== "undefined" && recipeData['body']['length'] >0)
	  {
		var newid =  recipeData['body'][0]["maxid"];
		if(typeof(newid) !== "undefined" && newid !== null && newid !== "")
		{
		  newid = parseInt(newid) + 1;
		//  new_copy["ingredients"]= this.formatString(JSON.stringify(new_copy["ingredients"]));
		//  new_copy["s_instructions"]= this.formatString(new_copy["s_instructions"]);
		  new_copy["created_by"]= this.currentUser["id"];
		  new_copy["status"]= "0";
		  new_copy["url"] = environment.appUrl + "/recipedetails/" + newid;
		  new_copy["uri"] = environment.appUrl + "/recipedetails/" + newid;
		  new_copy["shareAs"] = environment.appUrl + "/recipedetails/" + newid;
		  new_copy["source"] = environment.appname + "_" + recipe["id"];
		  new_copy["s_servings"] = new_copy["yield"];
		  console.log(JSON.stringify(new_copy));
		  this.createNewRecipe(new_copy, newid);
		  
		}
	    	  
	  }
	}));
}
}));

  }
  
  createNewRecipe(new_copy, newid)
  {
	var res =   this.dbService.postDataByTable("recipes", new_copy).subscribe(recipeData => setTimeout(() => {
	  console.log(recipeData);
  
	  if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "" && recipeData['inserted_id'] !== "0" && recipeData['inserted_id'] !== 0)
	  {
		this.toastr.success("Recipe has been copied.","Create a Copy of Recipe")
		var param = {};
  
		  param["id"] = recipeData['inserted_id'];
	   
		  if(newid !== recipeData['inserted_id'])
		  {
			this.updaterecipe(recipeData['inserted_id'])
		  }
			this.router.navigate(["recipesubmit", param]);
	  }
	}));
  }
  updaterecipe(newid)
  {
	console.log("in updatereicpe");
	console.log(newid);
	var new_copy = {};
	new_copy["id"] = newid;
	new_copy["url"] = environment.appUrl + "/recipedetails/" + newid;
	new_copy["uri"] = environment.appUrl + "/recipedetails/" + newid;
	new_copy["shareAs"] = environment.appUrl + "/recipedetails/" + newid;
  
  
   // var res =   this.dbService.updateDataByTable("recipes", new_copy).subscribe(recipeData => setTimeout(() => {
	//  console.log(recipeData);	     
   // }));
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
	this.showAdd2MP= false;
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
selectedRecipe: any ;
newRecipe: any; 
modifyRecipe(recipe)
{
	this.loadDDList();
	console.log(recipe);
	this.selectedRecipe = recipe;
	
//	this.selectedRecipe["newrecipe"]= JSON.parse(JSON.stringify(recipe));
	this.newRecipe = {};
	this.newRecipe["id"] =  this.selectedRecipe["id"];
	this.newRecipe["label"] =  this.selectedRecipe["label"];
	//this.newRecipe["s_instructions"] =  this.selectedRecipe["s_instructions"];
	this.newRecipe["dietLabels"] =  ""; //this.selectedRecipe["dietLabels"]
	this.newRecipe["healthLabels"] =  ""; //this.selectedRecipe["healthLabels"];
	this.newRecipe["cuisineType"] =  ""; //this.selectedRecipe["cuisineType"];
	this.newRecipe["mealType"] =  ""; //this.selectedRecipe["mealType"];

	console.log(this.selectedRecipe);

	var params= {};
	params["id"] =recipe.id;
	console.log(params);
	if(typeof(recipe.id) !== "undefined" && recipe.id !== null && recipe.id !== "")
	{
  var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
	  console.log(invData);
	  if( invData['body']["length"] > 0)
	  {
		this.newRecipe["s_instructions"]= invData['body'][0]["s_instructions"]
		this.selectedRecipe["s_instructions"]= invData['body'][0]["s_instructions"]
	  }
  }));
}




	this.openModal("modifyrecipe");
}
openModal(id)
{	
	this.modalService.open(id);
}
closeModal(id)
{	
	this.modalService.close(id);
}



/************** modify recipes */



setlabels(recipe1)
{

	console.log(this.selectedRecipe);
	console.log(recipe1);
	var paramsr = {};
	paramsr["recipeid"] = recipe1.id;
	paramsr["created_by"] = this.currentUser["id"];

	var res =   this.dbService.getDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
		if(invData !== null && invData["body"]["length"] > 0)
		{
			console.log("alredy modified");
			this.updateNewRecipe(recipe1, invData["body"][0]["id"])
		}
		else
		{
			if(recipe1["s_instructions"] !== this.selectedRecipe["s_instructions"])
			{
				console.log("instructions modified");
			paramsr["s_instructions"]= this.newRecipe["s_instructions"];
			}

			if(typeof(this.newRecipe["label"]) !== "undefined" &&  recipe1["label"] !== this.selectedRecipe["label"])
			paramsr["label"]= this.newRecipe["label"];

			if(typeof(this.newRecipe["dietLabels"]) !== "undefined" &&  this.newRecipe["dietLabels"] !== "")
			paramsr["dietLabels"]= this.newRecipe["dietLabels"];

			if(typeof(this.newRecipe["healthLabels"]) !== "undefined" &&  this.newRecipe["healthLabels"] !== "")
			paramsr["healthLabels"]= this.newRecipe["healthLabels"];

			if(typeof(this.newRecipe["cuisineType"]) !== "undefined" &&  this.newRecipe["cuisineType"] !== "")
			paramsr["cuisineType"]= this.newRecipe["cuisineType"];

			if(typeof(this.newRecipe["mealType"]) !== "undefined" && this.newRecipe["mealType"] !== "")
			paramsr["mealType"]= this.newRecipe["mealType"];

			console.log(paramsr);
			paramsr["status"]= 1;
			var res =   this.dbService.postDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
				this.toastr.success("Recipe has been updated.","Modify recipe");
				this.saveOriginal();
				this.closeModal("modifyrecipe");
			}));
			
		}
	}));


	

}

updateNewRecipe(recipe1, id)
{
	var paramsr = {};
	paramsr["recipeid"] = recipe1.id;
	paramsr["created_by"] = this.currentUser["id"];
	paramsr["id"] = id;
	
			if(this.newRecipe["s_instructions"] !== this.selectedRecipe["s_instructions"])
			paramsr["s_instructions"]= this.newRecipe["s_instructions"];

			if(typeof(this.newRecipe["label"]) !== "undefined" &&  this.newRecipe["label"] !== this.selectedRecipe["label"])
			paramsr["label"]= this.newRecipe["label"];

			if(typeof(this.newRecipe["dietLabels"]) !== "undefined" &&  this.newRecipe["dietLabels"] !== "")
			paramsr["dietLabels"]= this.newRecipe["dietLabels"];

			if(typeof(this.newRecipe["healthLabels"]) !== "undefined" &&  this.newRecipe["healthLabels"] !== "")
			paramsr["healthLabels"]= this.newRecipe["healthLabels"];

			if(typeof(this.newRecipe["cuisineType"]) !== "undefined" &&  this.newRecipe["cuisineType"] !== "")
			paramsr["cuisineType"]= this.newRecipe["cuisineType"];

			if(typeof(this.newRecipe["mealType"]) !== "undefined" && this.newRecipe["mealType"] !== "")
			paramsr["mealType"]= this.newRecipe["mealType"];
	console.log(paramsr);
	paramsr["status"]= 1;
			var res =   this.dbService.updateDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
				this.toastr.success("Recipe has been modifed.","Modify Recipe");
				
				this.closeModal("modifyrecipe");
			}));

			
}

saveOriginal()
{
	var paramsr = {};
	paramsr["status"] = 0;
	paramsr["s_instructions"] = this.selectedRecipe["s_instructions"];
	paramsr["label"] = this.selectedRecipe["label"];

	paramsr["dietLabels"] = this.selectedRecipe["dietLabels"];
	paramsr["healthLabels"] = this.selectedRecipe["healthLabels"];

	paramsr["cuisineType"] = this.selectedRecipe["cuisineType"];
	paramsr["mealType"] = this.selectedRecipe["mealType"];
	paramsr["recipeid"] = this.selectedRecipe["id"];
	paramsr["created_by"] = this.currentUser["id"];
	paramsr["approved_by"] = this.currentUser["id"];
	var res =   this.dbService.postDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
		
	}));

}
filterRecords(opt)
{
	this.filterOpts["asc"] = false;
	this.filterOpts["desc"] = false;
	this.filterOpts["rejected"] = false;
	this.filterOpts["all"] = false;

	this.sortType = opt; 
	this.filterOpts[opt] = true;
	
	if(opt == "asc")
	{
		console.log("sort ascending");

		this.recipesList1 = this.recipesList1.sort(this.sortArraybyLabelAsc);
		console.log(this.recipesList1);
		this.getDisplayList();
	}

	if(opt == "desc")
	{
		console.log("sort descending");

		this.recipesList1 = this.recipesList1.sort(this.sortArraybyLabelDesc);
		this.getDisplayList();
	}

	if(opt == "calories")
	{
		this.recipesList1 = this.recipesList1.sort(this.sortArraybyLabelCalories);
		this.getDisplayList();
	}

}
sortArraybyLabelAsc(a, b) {
	//return b.label - a.label;
	if (a.label.toLowerCase() < b.label.toLowerCase()) {
		return -1;
	  }
	  if (a.label.toLowerCase() > b.label.toLowerCase()) {
		return 1;
	  }
	  return 0;
}
sortArraybyLabelDesc(a, b) {
	if (b.label.toLowerCase() < a.label.toLowerCase()) {
		return -1;
	  }
	  if (b.label.toLowerCase() > a.label.toLowerCase()) {
		return 1;
	  }
	  return 0;
}
sortArraybyLabelCalories(a, b) {
	if (a.calories < b.calories) {
		return -1;
	  }
	  if (a.calories > b.calories) {
		return 1;
	  }
	  return 0;
}

setValues(type)
{
	console.log(this.newRecipe[type]);
	if(type == "healthLabels")
	{
		this.newRecipe[type]= "";
		for(let c=0; c < this.healthlabelsList.length; c++)
		{
			if(this.healthlabelsList[c]["selected"])
			{
				this.newRecipe[type] += this.healthlabelsList[c]["name"] + "~";
			}
		}
	}
	
	if(type == "dietLabels")
	{
		this.newRecipe[type]= "";
		for(let c=0; c < this.dietLabelsList.length; c++)
		{
			if(this.dietLabelsList[c]["selected"])
			{
				this.newRecipe[type] += this.dietLabelsList[c]["name"] + "~";
			}
		}
	}

	if(type == "cuisineType")
	{
		this.newRecipe[type]= "";
		for(let c=0; c < this.cuisineTypeList.length; c++)
		{
			if(this.cuisineTypeList[c]["selected"])
			{
				this.newRecipe[type] += this.cuisineTypeList[c]["name"] + "~";
			}
		}
	}
	if(type == "mealType")
	{
		this.newRecipe[type]= "";
		for(let c=0; c < this.mealTypeList.length; c++)
		{
			if(this.mealTypeList[c]["selected"])
			{
				this.newRecipe[type] += this.mealTypeList[c]["name"] + "~";
			}
		}
	}
	console.log(this.newRecipe);
}
}

	
