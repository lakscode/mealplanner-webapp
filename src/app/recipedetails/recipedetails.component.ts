import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { constants } from './../jsonfiles/constants';

@Component({
	selector: 'app-recipedetails',
	templateUrl: './recipedetails.component.html',
	styleUrls: ['./recipedetails.component.scss']
})
export class RecipedetailsComponent implements OnInit {

	private onDestroy$: Subject<void> = new Subject<void>();

	currentUser: any = null;
	favStatus: any= null;
	colors: Array<any> = [];
	ratingRecord: any= null;
	routeParams: any;
	rating: any;
  ratingSelected: any ;
  ratingGray: any;
  loading:any = 0;

 ratingObj: any = {};
 searchRes;
 paramMicro: Array<any> = [];
 mineralsList: Array<any> = [];
listParams: any;
updated: any;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.listParams = null;
		this.updated = 0;
		this.mineralsList = constants.minerals;
		this.colors = ["#E0E0E0", "#76FF03", "#FFCA28", "#DD2C00"];
		this.rating= 0;
		this.ratingObj= {"totalcount":0, "totalrating":0, "displayrating":0}
		this.routeParams = {};
		this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	 //  console.log(params);   
	   this.routeParams = params;     
	   if (typeof (this.routeParams.id) !== "undefined") {
		 console.log(this.routeParams.id);
	   }    
		 
		console.log(this.routeParams);
		this.loadRecipe(this.routeParams.id);
		}); 
		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		if( this.currentUser["firstname"] !== "")
		this.currentUser["displayname"]  = this.currentUser["firstname"];
		else if( this.currentUser["username"] !== "")
		this.currentUser["displayname"]  = this.currentUser["username"];
		console.log(this.currentUser);
		this.getFavouriteStatus();
		this.getRating();
		}
 

	}
	
loadRecipe(id)
{
  console.log("In load Recipe");
  this.loading++;
  console.log(this.loading);
  if(this.loading ==1)
  {
  this.searchRes = [];
 var params = {}
 if(id)
 {
 params["id"] = id;
 }

//  console.log(this.searchparam);
 console.log(params);
 //this.searchRes["image"]="assets/images/temp-images/slide-recipe2-detail.jpg";
 if(this.loading ==1)
  {
  var res =   this.dbService.getDatabyParam("recipes", params).subscribe(recipeData => setTimeout(() => {

	console.log(recipeData);
	this.searchRes["ingredients"] =[];


	if(recipeData !== null)
	{
	  if(typeof(recipeData["body"]) !== "undefined" && recipeData["body"] !== null && recipeData["body"]["length"] > 0)
	  {
		var temp = recipeData["body"];
		if(typeof(temp) == "object" && temp["length"] > 0)
		{
		  for(let i=0; i< temp["length"] ; i++)
		  {
			  this.searchRes = temp[i];
			//  console.log(this.searchRes);
			//  console.log(this.searchRes["digest"]);
			  var tempDigest = this.searchRes["digest"];
			  
			  if(typeof(this.searchRes["digest"]) !== "undefined")
			  {
				if (typeof(this.searchRes["digest"]) === 'object')
				{
				  
				} 
				else
				{
				  tempDigest = JSON.parse(this.searchRes["digest"]);
				}
			  }
			  var tempNutrients = this.searchRes["totalNutrients"];
			  if(typeof(this.searchRes["totalNutrients"]) !== "undefined")
			  {
				if (typeof(this.searchRes["totalNutrients"]) === 'object')
				{
				  
				} 
				else
				{
				  tempNutrients = JSON.parse(this.searchRes["totalNutrients"]);
				}
			  }
			  this.searchRes["digestArr"]  = tempDigest;
			  this.searchRes['nutrientsArr'] = tempNutrients;
			  this.searchRes["ingredients"] = JSON.parse(this.searchRes["ingredients"]);
			  this.searchRes["instructions"] = this.searchRes["s_instructions"];
			 // console.log(this.searchRes["s_instructions"]);
			  if(typeof(this.searchRes["s_instructions"]) !== "undefined" && this.searchRes["s_instructions"] !== "")
			  {
			  var temp1 = this.searchRes["s_instructions"].split("~");
			  if(temp1.length > 1)
			  {
			  this.searchRes["instructions"]  = temp1;
			  }
			  else
			  {
				temp1 = this.searchRes["s_instructions"].split(". ");
				this.searchRes["instructions"]  = temp1;
			  }
			  }
			  this.paramMicro = [];
			  if(tempDigest["length"] > 0)
			  {
			
				for(let j=0; j< tempDigest["length"] ; j++)
				{
				  var mmicro = tempDigest[j];

				  var fIndex = this.mineralsList.findIndex(x=> (x === mmicro.label.toLowerCase()));
				  if(fIndex > -1)
				  {
					mmicro.totalP = mmicro.total.toFixed(1);
					this.paramMicro.push(mmicro); 
				  }
				  /*switch(mmicro.label.toLowerCase())
				  {
					case "fat": 
					case "carbs":
					case "protein":
					case "cholesterol":
					case "sodium":
					case "sodium":
					  mmicro.totalP = mmicro.total.toFixed(1);
					this.paramMicro.push(mmicro); break
				  }*/
				}
			  }

			  if(tempNutrients)
			  {
				//console.log(tempNutrients);
				for (let x in tempNutrients) {
				//	console.log(tempNutrients[x]);
					var mmicro = tempNutrients[x];
					var fIndex = this.mineralsList.findIndex(x=> (x === mmicro.label.toLowerCase()));
					if(fIndex > -1)
					{
					  mmicro.totalP = mmicro.quantity.toFixed(1);
					  this.paramMicro.push(mmicro); 
					}
				  }
		
			  }

		  }
		}
	  }
//	console.log(this.searchRes);
//	console.log(this.paramMicro);
this.updated++;
this.listParams= {};
this.listParams["dietLabels"] = this.searchRes['dietLabels'];
	  console.log(this.listParams);
	}
  }));
  }
}
}
getFavouriteStatus()
{
  console.log("get FavouriteStatus");

  var params = {};
  this.favStatus = null;
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams) !== "undefined" && this.routeParams !== null && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
	params["userid"] = this.currentUser["id"];
	params["recipeid"] = this.routeParams.id;
 
	var res =   this.dbService.getDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
	   if(invData !== null)
	  {
		if(invData["body"]['length'] > 0)
		{
		  this.favStatus = invData["body"][0];
		  console.log(this.favStatus);
		}
	  }
	}));
  }
  else
  {
	var parent = this;
	setTimeout(function(){ 
		parent.getFavouriteStatus(); 
	}, 1000);
  }

}

setFavourite()
{
  console.log("set Favourites");
  var params = {};
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
	params["userid"] = this.currentUser["id"];
	params["recipeid"] = this.routeParams.id;
	params["created_at"] = new Date();
 
	var res =   this.dbService.postDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
	  if(invData !== null)
	  {
	   
		  this.getFavouriteStatus();
	   
	  }
	}));
  }
}

removeFavourite()
{
  console.log("set Favourites");
  var params = {};
  if(typeof(this.favStatus["id"]) !== "undefined" && this.favStatus["id"] !== null && this.favStatus["id"] !== "")
  {
	params["id"] = this.favStatus["id"];

	var res =   this.dbService.deleteDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
	  if(invData !== null)
	  {
		this.getFavouriteStatus();
	  }
	}));
  }  
}

getColor(index: number) {
 var color = this.colors[0];
 if(index >0 && index <=5)
 {
   if(index == 1 || index == 2)
   color = this.colors[1];
   else if(index == 2)
   color = this.colors[2];
   else if(index == 4 || index == 5)
   color = this.colors[3];

 }
 return color;
}

rate(index)
{
  var rating = index;
  if(typeof(this.searchRes['rating']) !== "undefined" && this.searchRes["rating"] !== "")
  rating += parseInt(this.searchRes["rating"]);
  this.rating = rating;
 console.log(index);
 console.log(this.rating);
}

showRating()
{
  var obj = document.getElementById('ratingPanel');
  if(obj !== null)
  {
	if(obj.style.display == "block")
	obj.style.display = "none";
	else
	obj.style.display = "block";
  }
}
getTotalRating()
{
  console.log("getTotalRating");
  console.log(this.rating);    
  var params = {};
  this.ratingObj= {"totalcount":0, "totalrating":0, "displayrating":0}
  if(typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
	params["query"]="SELECT count(rating) as totalcount, sum(rating) as totalrating FROM rating WHERE recipeid=" + this.routeParams.id;
  console.log(JSON.stringify(params));
  var res =   this.dbService.getDatabyTablebyQuery("rating", params).subscribe(rtData => setTimeout(() => {

	  console.log(rtData);     
	  if(rtData !== null)
	  {
	  
		if(rtData["body"]["length"] > 0)
		{
	  
		  this.ratingObj["totalrating"] = rtData["body"][0]["totalrating"];
		  this.ratingObj["totalcount"] = rtData["body"][0]["totalcount"];
		  this.ratingObj["displayrating"] = 0;
		  if( this.ratingObj["totalrating"] > 0 &&  this.ratingObj["totalcount"] > 0 )
		  {
			this.ratingObj["displayrating"] = Math.ceil((this.ratingObj["totalrating"]/ this.ratingObj["totalcount"]));
			console.log(this.ratingObj["displayrating"]);
		  }
		}
	  }
	}));
  }
}
getRating()
{
  console.log("getRating");
  console.log(this.rating);    
  var params = {};
  this.ratingRecord= null;
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
	params["userid"] = this.currentUser["id"];
	params["recipeid"] = this.routeParams.id;
	console.log(params);
	var res =   this.dbService.getDataByTable("rating", params).subscribe(rData => setTimeout(() => {
	  console.log(rData);     
	  if(rData !== null)
	  {
	  
		if(rData["body"]["length"] > 0)
		{
		  this.ratingRecord = rData["body"][0];
		  console.log(this.ratingRecord);
	   
		  this.rating = this.ratingRecord["rating"];
		}
	  }
	}));
  }
}

setRating()
{
  console.log(this.rating);

  console.log("setRating");
 
	var params = {};
	if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
	{
	  params["userid"] = this.currentUser["id"];
	  params["recipeid"] = this.routeParams.id;
	  params["rating"] = this.rating;
	  if( this.ratingRecord == null)
	  {
		var res =   this.dbService.postDataByTable("rating", params).subscribe(invData => setTimeout(() => {
		  if(invData !== null)
		  {
			  this.getRating();     
			  this.showRating();
		  }
		}));
	  }
	  else{
		
		if(typeof(this.ratingRecord["id"]) !== "undefined" && this.ratingRecord["id"] !== "")
		{
		  params["id"] = this.ratingRecord["id"];
		  var res =   this.dbService.updateDataByTable("rating", params).subscribe(invData => setTimeout(() => {
			if(invData !== null)
			{
				this.getRating();     
				this.showRating();
			}
		  }));
		}
	  }
	}

}
formatObj(obj)
{
	console.log(obj);
	return JSON.stringify(obj);
}
formatDietLabels()
{
//	console.log('format dietlabels');
	var arr = [];
	arr.push(this.searchRes.dietLabels);
	if(typeof(this.searchRes.dietLabels) !== "undefined" && this.searchRes.dietLabels !== "")
	{
		var temp = this.searchRes.dietLabels.split("~");
		if(temp.length > 0)
		arr = temp;

	}
//	console.log(arr);
	return arr;
}
}


	