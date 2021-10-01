import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormBuilder } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { constants } from '../../../assets/data/constants';
import { HttpHeaders } from '@angular/common/http';
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
isloggedIn : boolean = false;
isUser: any = {};

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
  
		this.routeParams = params;     
		if (typeof (this.routeParams.id) !== "undefined") {

		}  

	

		
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

			this.isloggedIn = true;
		this.comment['userid'] = this.currentUser["id"];


		this.role = this.helpService.getRoleStatus(this.currentUser);

		this.showNutrientsFlag = this.helpService.showorhideNutritions(this.role);

		this.getFavouriteStatus();
		this.getRating();
		}
		
		this.isUser = this.helpService.setUserRoles(this.currentUser);

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

  this.loading++;

  this.searchRes = [];
 var params = {}
 if(id)
 {
 params["id"] = id;
 }


 if(this.loading)
  {
  var res =   this.dbService.getDatabyParam("recipes", params).subscribe(recipeData => setTimeout(() => {

	this.searchRes["ingredients"] =[];


	if(recipeData !== null)
	{
	  if(typeof(recipeData["body"]) !== "undefined" && recipeData["body"] !== null && recipeData["body"]["length"] > 0)
	  {
		var temp = recipeData["body"];
		if(typeof(temp) == "object" && temp["length"] > 0)
		{
				
			  this.searchRes =temp[0];

			  if(this.searchRes["yield"] == "")
			  {
				  if(typeof(this.searchRes["s_servings"]) !== "undefined" && this.searchRes["s_servings"] !== "")
				  {
					  this.searchRes["yield"] = this.searchRes["s_servings"];
				  }
				  else
				  {
					this.searchRes["yield"]  = 1;
				  }
			  }
console.log(this.searchRes);
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
				  try
				  {
					  tempNutrients = JSON.parse(this.searchRes["totalNutrients"]);
				  }
				  catch(error)
				  {

				  }
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
				
				this.searchRes["instructions"] = [];
				this.searchRes["instructions"].push(this.searchRes["s_instructions"]);
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
	
					if(fIndex1 == -1)
					{
					mmicro.totalP = mmicro.total.toFixed(1);
					if( mmicro.total > 0)
					this.paramMicro.push(mmicro); 
					}
				  }
				}
			  }

			  if(tempNutrients)
			  {

				for (let x in tempNutrients) {

					var mmicro = tempNutrients[x];

					var fIndex = this.mineralsList.findIndex(x=> (x === mmicro.label.toLowerCase()));
					if(fIndex > -1)
					{
						var fIndex1 = this.paramMicro.findIndex(x1=> (x1.label.toLowerCase() === mmicro.label.toLowerCase()));

						if(fIndex1 == -1)
						{
							mmicro.totalP = mmicro.quantity.toFixed(1);
							if( mmicro.quantity > 0)
							this.paramMicro.push(mmicro); 
						}
					 
					}
				  }
		
			  } 
			  this.getUser(this.searchRes.created_by);
		}
	  }

this.paramMicro = this.paramMicro.sort(this.sortArrayAsc);
this.updated++;
this.listParams= {};
this.listParams["dietLabels"] = this.searchRes['dietLabels'];

	  this.loadShareValue();

	}
  }));
  }

}

sortArrayAsc(a, b) {
	//return b.label - a.label;
	if (a.label.toLowerCase() < b.label.toLowerCase()) {
		return -1;
	  }
	  if (a.label.toLowerCase() > b.label.toLowerCase()) {
		return 1;
	  }
	  return 0;
}
getFavouriteStatus()
{

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
	}, 2000);
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
showAdd2MP: boolean = false;
setFavourite()
{
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
   
  var params = {};
  this.ratingObj= {"totalcount":0, "totalrating":0, "displayrating":0}
  if(typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
	params["query"]="SELECT count(rating) as totalcount, sum(rating) as totalrating FROM rating WHERE recipeid=" + this.routeParams.id;

  var res =   this.dbService.getDatabyTablebyQuery("rating", params).subscribe(rtData => setTimeout(() => {
    
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

		  }
		}
	  }
	}));
  }
}
getRating()
{
   
  var params = {};
  this.ratingRecord= null;
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
	params["userid"] = this.currentUser["id"];
	params["recipeid"] = this.routeParams.id;

	var res =   this.dbService.getDataByTable("rating", params).subscribe(rData => setTimeout(() => {
  
	  if(rData !== null)
	  {
	  
		if(rData["body"]["length"] > 0)
		{
		  this.ratingRecord = rData["body"][0];

	   
		  this.rating = this.ratingRecord["rating"];

		}
	  }
	}));
  }
}

setRating()
{

 
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

	return JSON.stringify(obj);
}
formatDietLabels()
{

	var arr = [];
	arr.push(this.searchRes.dietLabels);
	if(typeof(this.searchRes.dietLabels) !== "undefined" && this.searchRes.dietLabels !== "")
	{
		var temp = this.searchRes.dietLabels.split("~");
		if(temp.length > 0)
		arr = temp;

	}

	return arr;
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

newRecipe()
{

		this.router.navigate(['recipesubmit', {'draft':this.routeParams.id}]);

}

/************ comments functions  */
loadComments()
{
	 this.commentsList = [];

	var params = {};
	params["query"] = "select c.*, u.firstname, u.lastname, u.username, u.email, u.image as profileimage from comments c,  users u where u.id = c.userid  and c.recipeid =" + this.routeParams.id;
	var res =   this.dbService.getDatabyTablebyQuery("comments", params).subscribe(rData => setTimeout(() => {
    
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


	  }));

}

commentSubmitMsg: any = "";
submitcomment()
{


	var params = {};
	params["recipeid"] = this.routeParams.id;
	params["userid"] = this.currentUser["id"];
	params["message"] = this.comment["message"];
	params["image"] = this.comment["image"];
	params["video"] = this.comment["video"];



	var res =   this.dbService.postDataByTable("comments", params).subscribe(rData => setTimeout(() => {
   
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
	
//	setTimeout(() => {
		this.commentSubmitMsg = "";
//	}, 2000);
}
formatApiUrl(path)
{

	var urlapi = this.apiUrl.replace("/api","");

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

		var options = {
		  headers : new HttpHeaders({"Content-Type": "application/json"})
		  };

		

		var imgData = data.toString().replace("data:image/jpeg;base64,","");
		var params = {};
		
		if(type !== "")
		params[type]= data.toString();
		else
		params["image"]= data.toString();

		params["name"]= this.currentUser["id"] + "_" + new Date().getTime() + "_"  + file.name;

		this.dbService.uploadMedia(params).subscribe(resultData => setTimeout(() => {
	
		  if(typeof(resultData) !== "undefined" && resultData !== null)
		  {
			if(typeof(resultData["name"]) !== "undefined" && resultData["name"] !== null && resultData["name"] !== "")
			{
				var urlapi = this.apiUrl.replace("/api","");

			  this.comment[type] = urlapi + resultData["name"];
		
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
	if(this.isloggedIn)
	{
		if(type == "diet")
		this.router.navigate(['recipes', {dietLabels:label}]);
		if(type == "health")
		this.router.navigate(['recipes', {healthLabels:label}]);
	}
	
}
showpopupflag: boolean = false;

showhidepopup()
{
	this.showpopupflag = !this.showpopupflag; 
///	if(this.showpopupflag && this.showAdd2MP)
//	this.showAdd2MP = false;
}
gotopage(){        
	if(this.isloggedIn)
   this.router.navigate(["recipes"]);    
}
formatString(str)
{
  var retVal = str;
  if(str !== "")
  {
    if(str.indexOf("'") > -1)
    {
    

    retVal = retVal.replaceAll("'","");
  
    }
  }
  return retVal;
}

makeacopy()
{


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

		  this.createNewRecipe(new_copy, newid);
		  
		}
	    	  
	  }
	}));
  
   
  }
  
  createNewRecipe(new_copy, newid)
  {
	var res =   this.dbService.postDataByTable("recipes", new_copy).subscribe(recipeData => setTimeout(() => {

  
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

	var new_copy = {};
	new_copy["id"] = newid;
	new_copy["url"] = environment.appUrl + "/recipedetails/" + newid;
	new_copy["uri"] = environment.appUrl + "/recipedetails/" + newid;
	new_copy["shareAs"] = environment.appUrl + "/recipedetails/" + newid;
  
  
   // var res =   this.dbService.updateDataByTable("recipes", new_copy).subscribe(recipeData => setTimeout(() => {
	//  console.log(recipeData);	     
   // }));
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

	userInfo: any; 
	getUser(id)
	{
		console.log("in getuser");
		var params = {"id":id};
		var res =   this.dbService.getDatabyParam("users", params).subscribe(userData => setTimeout(() => {
			console.log(userData);
			if(userData !== null)
			{
				if(userData["body"]["length"] > 0)
				{
					this.userInfo = userData["body"][0];

					console.log(this.userInfo);
				}
			}
		}));

	}
}


	