import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { constants } from './../../jsonfiles/constants';
import { HttpHeaders } from '@angular/common/http';
import { env } from 'process';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
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
setFav: boolean = false;
showRate: boolean = false;
commentsList:  Array<any> = [];
comment: any = {};
commentsCount: any = "";
apiUrl: any = "";
role: any = {};
showNutrientsFlag: boolean = false;
urlShare : any = "";
urlTweet : any;
urlWhatsApp: any;
msg: any = "";
labeltext: any = "";
perServingFlag: boolean = true;
	constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService,  private sanitize: DomSanitizer, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.apiUrl = environment.apiUrl;
		this.perServingFlag = true;


		this.urlShare = window.location.href;
		
		this.commentsList= [];
		this.comment = {"userid":"", "message":"", "image":"", "video":"", "status":"0", "created_time": new Date()};
		this.listParams = null;
		this.updated = 0;
		this.showRate  = false;
		this.setFav = false;

		this.mineralsList = constants.minerals;
		this.colors = ["#E0E0E0", "#76FF03", "#FFCA28", "#DD2C00"];
		this.rating= 0;
		this.ratingObj= {"totalcount":0, "totalrating":0, "displayrating":0}
		this.routeParams = {};
		this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	 //  console.log(params);   
		this.routeParams = params;     
		if (typeof (this.routeParams.id) !== "undefined") {
		//	console.log(this.routeParams.id);
		}  

	
	//	console.log(this.routeParams);
		
		this.loadRecipe(this.routeParams.id);
		
		this.getTotalRating();
		this.loadComments();
		}); 
		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		if( this.currentUser["firstname"] !== "")
		this.currentUser["displayname"]  = this.currentUser["firstname"];
		else if( this.currentUser["username"] !== "")
		this.currentUser["displayname"]  = this.currentUser["username"];
	//	console.log(this.currentUser);

		this.comment['userid'] = this.currentUser["id"];


		this.role = this.helpService.getRoleStatus(this.currentUser);

		this.showNutrientsFlag = this.helpService.showorhideNutritions(this.role);

	//	console.log(this.showNutrientsFlag);

		this.getFavouriteStatus();
		this.getRating();
		}
 

	}
	
	loadShareValue()
	{
		var appUrl = environment.appUrl;
		this.urlShare = window.location.href;
		
		this.msg = "Tried this recipe today: " +  this.searchRes["label"];
		
			if (this.urlShare.indexOf("localhost") !== -1) {
				this.urlShare = this.urlShare.replace("http://localhost:4200", appUrl)
			}
			this.urlTweet = "https://twitter.com/share?text=" + this.msg + "&url=" + encodeURIComponent(this.urlShare);
		//this.urlWhatsApp = this.transform("whatsapp://send?" + this.urlShare);
		this.urlWhatsApp = this.transform("https://api.whatsapp.com/send?text=" + this.msg + " " + this.urlShare);
		
	}
loadRecipe(id)
{
  console.log("In load Recipe");
  this.loading++;
//  console.log(this.loading);
 // if(this.loading ==1)
  //{
  this.searchRes = [];
 var params = {}
 if(id)
 {
 params["id"] = id;
 }

//  console.log(this.searchparam);
 //console.log(params);
 //this.searchRes["image"]="assets/images/temp-images/slide-recipe2-detail.jpg";
 if(this.loading)
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
				
			  this.searchRes =temp[0];

			  var tempDigest = this.searchRes["digest"];
			  
			  if(typeof(this.searchRes["digest"]) !== "undefined" && this.searchRes["digest"] !== "")
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

			  if(typeof(tempDigest) !== "undefined")
			  {
				this.searchRes["digestArr"] = [];
				this.searchRes["digestArr"]  = tempDigest;
			  }

			  if(typeof(tempNutrients) !== "undefined")
			  {
				this.searchRes["nutrientsArr"] = [];
				this.searchRes['nutrientsArr'] = tempNutrients;
			  }

			  if(typeof(this.searchRes["ingredients"]) !== "undefined")
			  {
				try{

					this.searchRes["ingredients"] = JSON.parse(this.searchRes["ingredients"]);
				}
				catch(error)
				{

					if(this.searchRes["ingredients"] !== "")
					{
					var temp = this.searchRes["ingredients"].split("~");
					this.searchRes["ingredients"] = temp;
					}
				}
			  }


			  if(this.searchRes["ingredients"] == "" && this.searchRes["ingredientLines"] !== "")
			  {
				this.searchRes["ingredients"] = [];
				  var temp = this.searchRes["ingredientLines"].split("~");
				  for(let t=0; t < temp["length"]; t++)
				  {
					  if(typeof(temp[t]) !== "undefined" && temp[t] !== null && temp[t] !== "")
					this.searchRes["ingredients"].push({"text":temp[t]})
				  }
			  }
			  this.searchRes["instructions"] = this.searchRes["s_instructions"];


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
					var fIndex1 = this.paramMicro.findIndex(x1=> (x1.label.toLowerCase() === mmicro.label.toLowerCase()));
					console.log(fIndex1);
					if(fIndex1 == -1)
					{
					mmicro.totalP = mmicro.total.toFixed(1);
				//	if( mmicro.total > 0)
					this.paramMicro.push(mmicro); 
					}
				  }
				}
			  }

			  if(tempNutrients)
			  {
				console.log(tempNutrients);
				for (let x in tempNutrients) {
				//	console.log(tempNutrients[x]);
					var mmicro = tempNutrients[x];
					console.log(mmicro);
					var fIndex = this.mineralsList.findIndex(x=> (x === mmicro.label.toLowerCase()));
					if(fIndex > -1)
					{
						var fIndex1 = this.paramMicro.findIndex(x1=> (x1.label.toLowerCase() === mmicro.label.toLowerCase()));
						console.log(fIndex1);
						if(fIndex1 == -1)
						{
							mmicro.totalP = mmicro.quantity.toFixed(1);
							if( mmicro.quantity > 0)
							this.paramMicro.push(mmicro); 
						}
					 
					}
				  }
		
			  } 

		}
	  }
	console.log(this.searchRes);
//	console.log(this.paramMicro);
this.updated++;
this.listParams= {};
this.listParams["dietLabels"] = this.searchRes['dietLabels'];
	  console.log(this.listParams);

	  this.loadShareValue();

	}
  }));
  }
//}
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
		  console.log("favStatus ");
		  console.log(this.favStatus);
		  this.setFav = true;
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
toggleFav()
{
	if(this.setFav )
	{
		this.removeFavourite();
	}
	else
	{
		this.setFavourite();
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
	    this.setFav = true;
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
		this.setFav = false;
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
 this.setRating();
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
			console.log("displayrating");
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
		  console.log(this.rating);
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
		  console.log(params);
		  var res =   this.dbService.updateDataByTable("rating", params).subscribe(invData => setTimeout(() => {
			console.log(invData);
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
//	console.log(obj);
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

formatValue(str)
{
//	console.log(str);
	var retValue = str;
	if(str !== "")
	{
		retValue = parseFloat(str).toFixed(2);
	}
//	console.log(retValue);
	return retValue;
}
formatLabels(str)
{
//	console.log(str);
	var retArr = [];
	retArr.push(str);
	if(str !== "")
	{
		retArr = [];
		retArr = str.split("~");
	}
	return retArr;
}

newRecipe()
{
	console.log("new recipe");
		this.router.navigate(['recipesubmit', {'draft':this.routeParams.id}]);

}

/************ comments functions  */
loadComments()
{
	 this.commentsList = [];
	console.log("loadComments");
/*	var params = {};
	params["recipeid"] = this.routeParams.id;
	console.log(params);
	var res =   this.dbService.getDataByTable("comments", params).subscribe(rData => setTimeout(() => {
	  console.log(rData);     
	  if(rData !== null)
	  {
		  if(rData['body']['length'] > 0)
		  this.commentsList = rData['body'];
	  }
	}));
	*/
	var params = {};
	params["query"] = "select c.*, u.firstname, u.lastname, u.username, u.email, u.image as profileimage from comments c,  users u where u.id = c.userid  and c.recipeid =" + this.routeParams.id;
	var res =   this.dbService.getDatabyTablebyQuery("comments", params).subscribe(rData => setTimeout(() => {
		console.log(rData);     
		if(rData !== null)
		{
			if(rData['body']['length'] > 0)
			this.commentsList = rData['body'];
			for(let c=0; c < this.commentsList.length; c++)
			{
				var item = this.commentsList[c];
				if( item["profileimage"].indexOf("http://") !== -1 ||  item["profileimage"].indexOf("https://") !== -1)
				this.commentsList[c]["profileimage"] = item["profileimage"] ;
				else
				this.commentsList[c]["profileimage"] = this.formatApiUrl(item["profileimage"]) 

			}
			this.commentsCount = rData['body']['length'];
		}

		this.loadPlanNames();
	  }));

}

commentSubmitMsg: any = "";
submitcomment()
{

	console.log(this.comment);
	var params = {};
	params["recipeid"] = this.routeParams.id;
	params["userid"] = this.currentUser["id"];
	params["message"] = this.comment["message"];
	params["image"] = this.comment["image"];
	params["video"] = this.comment["video"];

	console.log(JSON.stringify(params));

	var res =   this.dbService.postDataByTable("comments", params).subscribe(rData => setTimeout(() => {
	  console.log(rData);     
	  if(rData !== null)
	  {
		this.loadComments();
		this.commentSubmitMsg = "Comment submitted successfully";
		this.toastr.success('Comment has been added successfully', 'Recipe Comments');
		this.showResponse('success');
	  }
	  
	}));

}
showResponse(msg)
{
	this.comment = {"userid":"", "message":"", "image":"", "video":"", "status":"0", "created_time": new Date()};
	
	setTimeout(() => {
		this.commentSubmitMsg = "";
	}, 2000);
}
formatApiUrl(path)
{
	console.log(path);
	var urlapi = this.apiUrl.replace("/api","");
	console.log(urlapi);
	console.log(urlapi + path);
	return urlapi + path;
}
formatName(comment)
{
	var username = "";
	if(comment.firstname !== "")
	{
		username = comment.firstname;
		if(comment.lastname !== "")
		{
			username += " " + comment.lastname;
		}
	}
	else if(comment.username !== "")
	{
		username = comment.username;
	}
	else if(comment.email !== "")
	{
		username = comment.email;
	}

	return username;
}
uploadmedia(type)
{
	this.comment["uploadtype"]  = type;
	this.fileupload();
}
fileupload()
{
  var obj = document.getElementById('inputuploadrecipe');
  if(obj !== null)
  obj.click();
}
onFileSelect(event) {

	var type = "image";
	if(typeof(this.comment["uploadtype"] ) !== "undefined" && this.comment["uploadtype"]  !== "")
	{
		type = this.comment["uploadtype"] ;

	}

  if (event.target.files.length > 0) {
	const file = event.target.files[0];
	this.getBase64(file).then(
	  data => {
	//	console.log(data);


		var options = {
		  headers : new HttpHeaders({"Content-Type": "application/json"})
		  };


	//	this.comment.image = data.toString();
		

		var imgData = data.toString().replace("data:image/jpeg;base64,","");
		var params = {};
		
		if(type !== "")
		params[type]= data.toString();
		else
		params["image"]= data.toString();

		params["name"]= this.currentUser["id"] + "_" + new Date().getTime() + "_"  + file.name;
		console.log(JSON.stringify(params));
		this.dbService.uploadMedia(params).subscribe(resultData => setTimeout(() => {
		  console.log(resultData);
		  if(typeof(resultData) !== "undefined" && resultData !== null)
		  {
			if(typeof(resultData["name"]) !== "undefined" && resultData["name"] !== null && resultData["name"] !== "")
			{
				var urlapi = this.apiUrl.replace("/api","");

			  this.comment[type] = urlapi + resultData["name"];
			console.log(type);	
			  console.log(this.comment)
			}
		  }
		}));
	});
  }
}

getBase64(file) {
  return new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => resolve(reader.result);
	reader.onerror = error => reject(error);
  });
}


formatText(str)
{
	var retVal = str;

	if(typeof(str) !== "undefined" && str !== "")
	{
		retVal = str.replace("u00bd", "\u00bd");
		retVal = retVal.replace("u00bc", "\u00bc");
		retVal = retVal.replace("u00be", "\u00be");
	}
	return retVal;
}




transform(value: any, args?: any): any {
return this.sanitize.bypassSecurityTrustHtml(value);
}

gotoRecipes(label, type) {
	if(type == "diet")
	this.router.navigate(['recipes', {dietLabels:label}]);
	if(type == "health")
	this.router.navigate(['recipes', {healthLabels:label}]);
	
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
		params[this.plan["mealType"]] = this.searchRes["id"];
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
	params1 ['query'] = "update days set " + this.plan["mealType"] + " = " + this.searchRes["id"] + " where meal_plan_id = " + this.plan["id"] + " AND day_num = " + this.plan["day"];
	var res =   this.dbService.getDatabyTablebyQuery("days", params1).subscribe(invData => setTimeout(() => {
		this.toastr.success('Recipe has been added to the selected meal type of the plan!!!', 'Add to Meal Plan');
	
	}));
}
showpopupflag: boolean = false;

showhidepopup()
{
	this.showpopupflag = !this.showpopupflag; 
///	if(this.showpopupflag && this.showAdd2MP)
//	this.showAdd2MP = false;
}
gotopage(){        
   this.router.navigate(["recipes"]);    
}
formatString(str)
{
  var retVal = str;
  if(str !== "")
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

makeacopy()
{
	console.log("make a copy")

	var new_copy = JSON.parse(JSON.stringify(this.searchRes));
	delete new_copy["id"];
	delete new_copy["favcount"];
	delete new_copy["tablename"];
	delete new_copy["instructions"];
	delete new_copy["nutrients"];
	delete new_copy["UserFavStatus"];
	delete new_copy["digestArr"];
	delete new_copy["nutrientsArr"];
	
	var pQuery = {"query":"select max(id) as maxid from recipes"};
	var res =   this.dbService.getDatabyTablebyQuery("recipes", pQuery).subscribe(recipeData => setTimeout(() => {
	 console.log(recipeData);
  
	  if(recipeData !== null && typeof(recipeData['body']) !== "undefined" && recipeData['body']['length'] >0)
	  {
		var newid =  recipeData['body'][0]["maxid"];
		if(typeof(newid) !== "undefined" && newid !== null && newid !== "")
		{
		  newid = parseInt(newid) + 1;
		  new_copy["ingredients"]= this.formatString(JSON.stringify(new_copy["ingredients"]));
		  new_copy["s_instructions"]= this.formatString(new_copy["s_instructions"]);
		  new_copy["created_by"]= this.currentUser["id"];
		  new_copy["status"]= "0";
		  new_copy["url"] = environment.appUrl + "/recipedetails/" + newid;
		  new_copy["uri"] = environment.appUrl + "/recipedetails/" + newid;
		  new_copy["shareAs"] = environment.appUrl + "/recipedetails/" + newid;
		  new_copy["source"] = environment.appname + "_" + this.searchRes["id"];
		  new_copy["s_servings"] = new_copy["yield"];
		  console.log(JSON.stringify(new_copy));
		  this.createNewRecipe(new_copy, newid);
		  
		}
	    	  
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
}


	