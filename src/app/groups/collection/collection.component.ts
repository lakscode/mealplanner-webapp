import { Component, OnInit,OnDestroy, OnChanges  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from '../../../environments/environment';
import { constants } from '../../jsonfiles/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

import { PDFService } from '../../services/pdf.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
	selector: 'app-collection',
	templateUrl: './collection.component.html',
	styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnChanges {
	private onDestroy$: Subject<void> = new Subject<void>();
	nutrientsList: Array<any> =[];
	routeParams: any = {};
	collection: any;
	loading:any = 0;
	paramMicro: Array<any> =[];
	mineralsList: Array<any> =[];
	ingredients: Array<any> =[];
	instructions: Array<any> = [];
	totalWeight: any=0
	calories: any=0
	currentUser: any;
	apiUrl: any = "";
	ispublic: boolean = false;
	searchparam: any = {};
	dietLabelsList: Array<any> = [];
	healthlabelsList: Array<any> = [];
	mineralsLabelsList: Array<any> = [];
	searchmorebar:boolean = false;
	addItem: boolean = false;
	showNutrientsFlag: boolean = false;
	collectionOwner: boolean  = false;
	setFav: boolean = false;
	showActions: any = {};

	urlShare : any = "";
urlTweet : any;
urlWhatsApp: any;
msg: any = "";

	constructor(private router: Router, private sanitize: DomSanitizer, private route: ActivatedRoute, private toastr: ToastrService, private pdfService: PDFService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder, private modalService: ModalService) {
	
	}
ngOnChanges()
{
	console.log("ngOnchanges");
	this.loadDefaults();
}
	ngOnInit() {
		this.loadDefaults();
		window.scrollTo(0,0);

		this.setFav = false;
	//	this.getFavouriteStatus();
	}
	loadShareValue()
	{
		var appUrl = environment.appUrl;
		this.urlShare = window.location.href;
		
		this.msg = "Join this collection today: " +  this.collection["collection_name"];
		
			if (this.urlShare.indexOf("localhost") !== -1) {
				this.urlShare = this.urlShare.replace("http://localhost:4200", appUrl)
			}
			this.urlTweet = "https://twitter.com/share?text=" + this.msg + "&url=" + encodeURIComponent(this.urlShare);
		//this.urlWhatsApp = this.transform("whatsapp://send?" + this.urlShare);
		this.urlWhatsApp = this.transform("https://api.whatsapp.com/send?text=" + this.msg + " " + this.urlShare);
		
	}
loadDefaults()
{
	this.urlShare = window.location.href;

	this.collectionOwner = false;
	this.showActions = {"join": true, "invite":false};
	
	this.getNutrientsMaxMin(); 

		this.dietLabelsList= [];
		for(let d=0; d < constants.dietLabels.length; d++)
		{
			this.dietLabelsList.push({"name":constants.dietLabels[d], "selected":false})
		}

		//this.healthlabelsList = constants.healthLabels;
		this.healthlabelsList= [];
		for(let h=0; h < constants.healthLabels.length; h++)
		{
			this.healthlabelsList.push({"name":constants.healthLabels[h], "selected":false})
		}

		//this.mineralsLabelsList = constants.minerals;
		this.mineralsLabelsList= [];
		for(let m=0; m <constants.minerals.length; m++)
		{
			this.mineralsLabelsList.push({"name":constants.minerals[m], "selected":false,  "unit":"",  "min":"", "max":"", "t_min":"", "t_max":""})
		}

		this.loadNutrientsMaxMin();

	this.searchparam = {"q":"", "range":{}}
	this.instructions= [];
	this.ispublic = false;
	this.apiUrl = environment.apiUrl;
	this.currentUser =this.helpService.getCurrentUser();
	if(this.currentUser !== null)
	{
	  if( this.currentUser["firstname"] !== "")
	  this.currentUser["displayname"] = this.currentUser["firstname"];
	  else if( this.currentUser["username"] !== "")
	  this.currentUser["displayname"] = this.currentUser["username"];
	  console.log( this.currentUser["displayname"]);
	}
	this.routeParams = {};
	this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
		//  console.log(params);   
		  this.routeParams = params;     
		  if (typeof (this.routeParams.id) !== "undefined") {
			console.log(this.routeParams.id);
			this.setDefaults();
			this.loadcollection(this.routeParams.id);
		  }    
		  else
		  {
			this.collectionOwner = true;
			  this.setDefaults();
		   
	   
		  }
		  if (typeof (this.routeParams.draft) !== "undefined") {
		   console.log(this.routeParams.draft);
		   this.loadcollection(this.routeParams.draft);
		   this.collectionOwner = true;
		 }  
		   console.log(this.routeParams);
	}); 

	


}

setDefaults()
{

	
	this.collection = {};


}
existingIngCount:any = 0;
loadcollection(id)
{
  console.log("In load collection");
 // console.log(id);
  this.loading++;
 // console.log(this.loading);

  this.collection = [];
 var params = {}
 if(id)
 {
 params["id"] = id;
 }

 console.log(params);
 
 if(this.loading)
  {
	 var res =   this.dbService.getDataByTable("collection", params).subscribe(rbookData => setTimeout(() => {

	console.log(rbookData);
	this.collectionOwner = false;
	 
	if(rbookData !== null)
	{
	  if(typeof(rbookData["body"]) !== "undefined" && rbookData["body"] !== null && rbookData["body"]["length"] > 0)
	  {
		this.collection = rbookData["body"][0];
		if(this.currentUser['id'] == this.collection['created_by'])
	  	this.collectionOwner = true;
		
		  if(this.collectionOwner)
		  this.showActions["join"] = false;
		this.loadRecipes();
	  }
 
	console.log(this.collection);
	this.getJoinStatuscollection();
	

	}
	this.getcollectionJoined();
	this.loadShareValue();
  }));
  }

}

recipesList: Array<any> = [];
loadRecipes(idslist = "")
{
	console.log(idslist);
	this.recipesList = [];
  var params = {};

	

	//params["instructions"] = "notempty";
//	params["query"] = " select id, label, image, healthLabels, dietLabels, calories, yield, totalWeight, totalNutrients, digest from recipes where id in (select recipe_id from recipe_mapping where collection_id = " + this.routeParams.id  + ")";
	params["query"] = "select recipes.id, recipes.label, recipes.image, recipes.calories, recipes.healthLabels, recipes.dietLabels, recipes.yield, recipes.totalNutrients, users.email, users.firstname, users.lastname, users.username, recipe_mapping.created_at, users.id as userid from recipes join recipe_mapping on recipes.id = recipe_mapping.recipe_id join users on recipe_mapping.created_by = users.id where recipe_mapping.collection_id = " + this.routeParams.id  + "" ;
  console.log(JSON.stringify(params));

 var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
	console.log(invData);
  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	{
		this.recipesList = [];

		this.recipesList = invData["body"];
		console.log(this.recipesList);
		this.getFavouriteStatus();
	}
	 
  }

 ));

}

maxcalories:any = 0;
recipesList1:Array<any>=[];
searchProps()
{

console.log('searchProps');


var params = {}
if(this.searchparam.q)
{
//params["content"] = this.searchparam.q;
var words = this.searchparam.q.replace(" ", "~");
params["words"] = words;
this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipebook", this.currentUser["id"]);
}
if(typeof(this.searchparam.range) !== "undefined")
{
if(typeof(this.searchparam.range.lower) !== "undefined")
{
  params["caloriesfrom"] = this.searchparam.range.lower;
}
if(typeof(this.maxcalories) !== "undefined" && this.maxcalories > 0)
{
  params["caloriesto"] = this.maxcalories;
}
params["instructions"]="notempty";
}

params["returnfields"] = " id, label, image, healthLabels, dietLabels, calories, yield, digest, totalNutrients, totalWeight";

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
	this.helpService.saveSearchHistory(mQuery, "nutrients", "recipebook", this.currentUser["id"]);
 }
 //console.log("mQuery");
 //console.log(mQuery);
var checkMinerals = false;

if(typeof(dietlabels) !== "undefined" && dietlabels  !== "")
{
params["dietLabels"] = dietlabels
this.helpService.saveSearchHistory(dietlabels, "dietLabels",  "recipebook",this.currentUser["id"]);
} 

if(typeof(healthlabels ) !== "undefined" && healthlabels !== "")
{
params["healthLabels"] = healthlabels
this.helpService.saveSearchHistory(healthlabels, "healthLabels", "recipebook", this.currentUser["id"]);
} 

if(typeof(minerals ) !== "undefined" && minerals  !== "")
{
params["totalNutrientsne"]="notempty";
params["digestne"]="notempty";
checkMinerals = true;
//console.log(minerals);

} 

 //console.log(params);
if(mQuery !== "")
{
  var params1 = {};

  var query = "select id, label, image, healthLabels, dietLabels, calories, yield, digest, totalWeight, totalNutrients, cautions from recipes ";
  var where = " where totalNutrients != '' AND digest != ''  AND s_instructions != '' " ;
  if(this.maxcalories > 0)
  where +=  " AND calories >= " + this.maxcalories

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
		this.formatResult(invData);
	}));
	}
	else
	{
		console.log(params);
		params["limit"] = "20";
	var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		this.formatResult(invData);
	}));
	}
	
}

// id, collection_id , userid, created_at - collection_join
// id, collection_id , userid, created_at, recipeid - collection_save

ratingIds: any;
formatResult(invData)
{
	if(invData !== null)
	{
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
	
		}

	  }
	 
	 
	  this.loadRatings();

	}
}
ratingsArr: Array<any> = [];

loadRatings()
{
  if(typeof(this.ratingIds ) !== "undefined" && this.ratingIds !== "")
  {			
   this.ratingIds = this.ratingIds.substring(0, this.ratingIds.length-1);
  }
 
	var params = {"limit": 30};
   
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
		  }
		}

	  }
	}));
 
  
  
}

loadNutrientsMaxMin()
{


  if(this.mineralsLabelsList["length"] > 0 && this.nutrientDbFields["length"] > 0)
  {
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
  }
  else
  {
	setTimeout(() => {
	  
	  this.loadNutrientsMaxMin();

	},1000);
  }
}
removeRecipe(recipe)
{
	console.log(recipe);
	var fIndex = this.recipesList.findIndex(r =>(r.id == recipe.id));
	console.log(fIndex);
	console.log(this.recipesList);
	if(fIndex !== -1)
	{
		console.log(fIndex);
		this.recipesList.splice(fIndex, 1);
		this.collection["recipes"] ="";
		var recipeids = "";
		for(let r=0; r < this.recipesList.length; r++)
		{
			recipeids +=  this.recipesList[r]["id"] + ",";
		}
		if(recipeids !== "")
		{
			recipeids = recipeids.substring(0, recipeids.length-1);	
			this.collection["recipes"] = recipeids;
		}
		console.log(this.recipesList);
		console.log(this.collection);
	}
	//this.toastr.error('Removed Recipe from Recipe Book', 'Recipe Book!');	
}
addRecipe(recipe)
{
	console.log(recipe);
	var fIndex = this.recipesList.findIndex(r =>(r.id == recipe.id));
	console.log(fIndex);
	console.log(this.recipesList);
	if(fIndex == -1)
	{
		this.recipesList.push(recipe);
		this.collection["recipes"] ="";
		var recipeids = "";
		for(let r=0; r < this.recipesList.length; r++)
		{
			this.recipesList[r]["expand"] = false;
			recipeids +=  this.recipesList[r]["id"] + ",";
		}
		if(recipeids !== "")
		{
			recipeids = recipeids.substring(0, recipeids.length-1);	
			this.collection["recipes"] = recipeids;
		}
		console.log(this.recipesList);
		console.log(this.collection);
	}
	this.toggleRecipeAdd = false;
	this.searchparam["q"] ="";
	//this.toastr.success('Added Recipe to Recipe Book', 'Recipe Book!');	

	var paramsr = {};
    paramsr["collection_id"] = this.collection["id"];
    paramsr["recipe_id"] = recipe["id"];
    paramsr["created_by"] = this.currentUser["id"];

    var res =   this.dbService.getDataByTable("recipe_mapping", paramsr).subscribe(invData => setTimeout(() => {
     
      if(invData !== null && invData["body"]["length"] > 0)
      {

      }
      else
      {
        var res =   this.dbService.postDataByTable("recipe_mapping", paramsr).subscribe(invData => setTimeout(() => {
     
        }));
      }
      this.loadRecipes();
    }));

}
saveRecipebook()
{
	console.log("saveRecipebook");
	console.log(this.collection);
	var params = {};
	
	if(this.collection["collection_name"] !== "")
	{
		params["collection_name"] = this.collection["collection_name"];
	
		if(typeof(this.collection["description"]) !== "undefined" && this.collection["description"] !== "")
		params["description"] = this.collection["description"];

		if(typeof(this.collection["notes"]) !== "undefined" && this.collection["notes"] !== "")
		params["notes"] = this.collection["notes"];

		if(typeof(this.collection["image"]) !== "undefined" && this.collection["image"] !== "")
		params["image"] = this.collection["image"];

		// if(this.collection["recipes"] !== "")
		//  params["recipes"] = this.collection["recipes"];

		if(typeof(this.collection["created_by"]) =="undefined" || this.collection["created_by"] == "" || this.collection["created_by"] == "0")
		{
		if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== "")
		params["created_by"] = this.currentUser["id"];
		}   
		if(typeof(this.collection.id) !== "undefined"  && this.collection.id !== "")
		{
			console.log("updating");
			params["id"] = this.collection.id;
			console.log(params);
			var res =   this.dbService.updateDataByTable("collection", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
				//this.toastr.success('Updated Recipe Book!', 'Recipe Book!');	
				this.loadcollection(this.collection.id);
				
			}));
		}
		else
		{
		
			console.log("adding");
			console.log(params);
			var res =   this.dbService.postDataByTable("collection", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
				//this.toastr.success('Saved Recipe Book!', 'Recipe Book!');
				if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "")
				{
					this.loadcollection(recipeData['inserted_id']);	
				}
			}));
		}
	}	

}

/*********** imageand video upload  */


fileupload()
{
  var obj = document.getElementById('inputuploadrecipe');
  if(obj !== null)
  obj.click();
}
onFileSelect(event) {
	console.log("Fileselect");
	var type = "image";

console.log("type " + type);
  if (event.target.files.length > 0) {
	const file = event.target.files[0];
	this.getBase64(file).then(
	  data => {
		console.log(data);


		var options = {
		  headers : new HttpHeaders({"Content-Type": "application/json"})
		  };

		var params = {};
		
		params["image"]= data.toString();

		params["name"]= this.currentUser["id"] + "_" + new Date().getTime() + "_"  + file.name;
	//	console.log(JSON.stringify(params));
		this.dbService.uploadMedia(params).subscribe(resultData => setTimeout(() => {
		  console.log(resultData);
		  if(typeof(resultData) !== "undefined" && resultData !== null)
		  {
			if(typeof(resultData["name"]) !== "undefined" && resultData["name"] !== null && resultData["name"] !== "")
			{
				var urlapi = this.apiUrl.replace("/api","");

			  this.collection["image"] = urlapi + resultData["name"];
			console.log(type);	
			  console.log(this.collection)
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

formatVal(str)
  {
	return this.helpService.formatValue(str);
  }

  deleteContent(type, index)
  {
	  if(type == "ins")
	  {
		  this.instructions.splice(index, 1);
	  }

	  if(type == "ing")
	  {
		  this.ingredients.splice(index, 1);
	  }
  }


  downloadplan()
	{
	  if(typeof(this.collection["id"]) !== "undefined" && this.collection["id"] !== "")
	  {
		  this.pdfService.createrecipebookpdf(this.collection["id"]).subscribe(dData => setTimeout(() => {

			  console.log(dData);
			  if(dData !== null )
			  {
			  var collectionObj ={};
			  collectionObj["collectionname"] = this.collection["collection_name"];
			  collectionObj["link"] = environment.apiUrl + "/" + dData["filename"];
			  var link = document.createElement('a');
			  link.href = collectionObj["link"];
			  link.target = "_blank";
		  //	link.download = mealPlan["link"];
			  link.click();
			  console.log(collectionObj["link"]);
			  }
		  }));
		}
  }



  nutrientDbFields:Array<any>=[];
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
  setFLU(str)
  {
	  var retValue = str;
	  if(str !== "")
	  {
		  retValue = this.helpService.setInputFirstToUppercase(str);
	  }
	  return retValue;
  }

  addNew() {
   
	this.toggleRecipeAdd = !this.toggleRecipeAdd;
 
  }

  selectedRecipe: any ;
 
  viewRecipe(recipe)
  {
	  this.selectedRecipe = recipe;
	  console.log(this.selectedRecipe);

	  this.selectedRecipe["formatNutrients"] = JSON.parse(this.selectedRecipe.totalNutrients);
	  console.log(this.selectedRecipe);
	 this.modalService.open('viewrecipe');
	  console.log("view details");
  }

  toggleRecipeAdd: boolean = false;

 
 closeModal(id) {

   this.modalService.close(id);
 }
 formatLimit(str)
 {
	 var retval = str;
	 if(str !== "")
	 {
 		retval = parseFloat(str).toFixed(2);
	 }
	 return retval;
 }
 formatlabels(str)
 {
	 var retval = str;
	 if(str !== "")
	 {
		retval = str.replace(/~/g, ', ');
	 }
	 return retval;
 }
 formatUnit(unit)
 {
	 console.log(this.selectedRecipe);
	 var retval = unit;
	 if(unit !== "")
	 {
		if(unit.indexOf("u00b5") !== -1)
		{
			retval = unit.replace("u00b5", "\u00b5");
		}

		
	 }
	 return retval;

 }
 formatCalories(calories, yeild)
 {
	console.log(this.selectedRecipe);
	 console.log(calories);
	 console.log(yeild);
	var retval = calories;
	if(calories !== "")
	{
		retval = (parseFloat(calories)/parseFloat(yeild)).toFixed(2);
	}
	return retval;
 }
 
 formatImage(img)
 {
	 return img.trim();
 }



 getFavouriteStatus()
{
  console.log("get FavouriteStatus");
  console.log(this.setFav);
  var idslist = "";
  for(let i=0; i< this.recipesList.length; i++)
  {
	this.recipesList[i]["UserFavStatus"]= false;
	  idslist += this.recipesList[i]["id"] + ",";
  }
  if(idslist !== "")
  {
	idslist = idslist.substring(0, idslist.length-1);
  }
  var params = {};

  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && idslist !== "")
  {
	//params["userid"] = this.currentUser["id"];
//	params["recipeid"] = this.routeParams.id;
 
	params["query"] = "SELECT recipeid, count(*) as favcount FROM `favourites` where recipeid in (" + idslist + ")group by recipeid"
	var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {
	   if(invData !== null)
	  {
	  console.log(invData);

		if(invData["body"]['length'] > 0)
		{
			for(let k=0; k < invData["body"]['length']; k++)
			{
				var fIndex = this.recipesList.findIndex(x=>(x["id"] === invData["body"][k]["recipeid"]));
				if(fIndex > -1)
				{
					this.recipesList[fIndex]["favcount"] =  invData["body"][k]["favcount"];
				}
			}
		}
		this.getFavouriteStatusForCurrentUser(idslist);
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

getFavouriteStatusForCurrentUser(idslist)
{
  console.log("get getFavouriteStatusForCurrentUser");
  console.log(this.setFav);
 
  var params = {};

  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && idslist !== "")
  {
 
	params["query"] = "SELECT * FROM `favourites` where recipeid in (" + idslist + ") and userid=" + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {
	   if(invData !== null)
	  {
	  console.log(invData);

		if(invData["body"]['length'] > 0)
		{
			for(let k=0; k < invData["body"]['length']; k++)
			{
				var fIndex = this.recipesList.findIndex(x=>(x["id"] === invData["body"][k]["recipeid"]));
				if(fIndex > -1)
				{
					this.recipesList[fIndex]["UserFavStatus"] = true;
				}
				
			}
		}
		console.log(this.recipesList);
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

toggleFav(recipe)
{
	console.log(recipe);

	if(typeof(recipe.id) !== "undefined" && recipe.id !== null && recipe.id !== "")
  {
var params = {};

params ['query'] = "select * from favourites where recipeid = " + recipe.id + " AND userid = " + this.currentUser["id"];
var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {

  console.log(invData);
  if(invData !== null && invData["body"]["length"] > 0)
  {
	console.log("removing record");
params = {};
	params["id"] = invData["body"][0]["id"];

	var res =   this.dbService.deleteDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
	 
		var fIndex = this.recipesList.findIndex(x=>(x["id"] === recipe.id));
		console.log(fIndex);
		if(fIndex > -1)
		{
			this.recipesList[fIndex]["UserFavStatus"] =  false;
			this.recipesList[fIndex]["favcount"] = parseInt(this.recipesList[fIndex]["favcount"]) - 1;
			console.log(	this.recipesList[fIndex]);
		}

	 
	
	}));
  }
  else
{
	console.log("Creating record");
	var params1 = {};
	params1["recipeid"] = recipe.id;
	params1["userid"] = this.currentUser["id"];
	
  var res =   this.dbService.postDataByTable("favourites", params1).subscribe(invData => setTimeout(() => {
	  if(invData !== null)
	  {
		  //alert("Recipe has been set as favourite.");
		  //this.getFavouriteStatus();
		  var fIndex = this.recipesList.findIndex(x=>(x["id"] ===  recipe.id));
		  if(fIndex > -1)
		  {
			  this.recipesList[fIndex]["UserFavStatus"] =  true;
			  this.recipesList[fIndex]["favcount"] = parseInt(this.recipesList[fIndex]["favcount"]) + 1;
		  }
	  }
	}));

	
  }  
}));
  }
}

setFavourite(id)
{
  console.log("set Favourites");
  var params = {};
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
var params = {};
console.log(params);
params ['query'] = "select * from favourites where recipeid = " + id + " AND userid = " + this.currentUser["id"];
var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {

  console.log(invData);
  if(invData !== null && invData["body"]["length"] > 0)
  {
	 
  }
  else

  {
	  var params1 = {};
	  params1["recipeid"] = id;
	  params1["userid"] = this.currentUser["id"];
	  
	var res =   this.dbService.postDataByTable("favourites", params1).subscribe(invData => setTimeout(() => {
		if(invData !== null)
		{
			//this.toastr.success('Recipe has been set as favourite.', 'Collection!');	
			//this.getFavouriteStatus();
			var fIndex = this.recipesList.findIndex(x=>(x["id"] === id));
			if(fIndex > -1)
			{
				this.recipesList[fIndex]["favcount"]  = this.recipesList[fIndex]["favcount"]+1;
				this.recipesList[fIndex]["UserFavStatus"] =  true;
				this.setFav = true;
				this.recipesList[fIndex]["expand"] = !this.recipesList[fIndex]["expand"];
			}
		}
	  }));
  }
}));

	
  }
}


removeFavourite(id)
{
  console.log("remove Favourites");
  console.log(id);
  var params = {};
  if(typeof(id) !== "undefined" && id !== null && id !== "")
  {

//	params["id"] = id;
	//params["userid"] = this.currentUser["id"];
var params = {};
console.log(params);
params ['query'] = "select * from favourites where recipeid = " + id + " AND userid = " + this.currentUser["id"];
var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {

  console.log(invData);
  if(invData !== null && invData["body"]["length"] > 0)
  {
params = {};
	params["id"] = invData["body"][0]["id"];

	var res =   this.dbService.deleteDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
		this.setFav = false;
	  if(invData !== null)
	  {

		//this.getFavouriteStatus();
		var fIndex = this.recipesList.findIndex(x=>(x["id"] === id));
		if(fIndex > -1)
		{
			this.recipesList[fIndex]["favcount"]  = this.recipesList[fIndex]["favcount"]-1;
			this.recipesList[fIndex]["UserFavStatus"] =  false;
			this.recipesList[fIndex]["expand"] = !this.recipesList[fIndex]["expand"];
		}
	  }
	  //console.log(this.setFav);
	}));
  }

}));

	
  }  
}

getcollectionJoined()
{
//	params["query"] = "select c.*, count(cj.id) as joinedcount from collection c, collection_join cj where cj.collection_id = c.id and c.id = "  + id + " group by cj.collection_id ";
	console.log("getcollectionJoined");
	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select count(id) as joinedcount from collection_join where collection_id = " + this.collection["id"] + " group by collection_id" ;
	var res =   this.dbService.getDatabyTablebyQuery("collection_join", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		if(invData && invData["body"]["length"] > 0)
		{
			this.collection["joinedcount"] = invData["body"][0]["joinedcount"];
		}
	 
	  }));

}

getJoinStatuscollection()
{

	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select * from collection_join where collection_id = " + this.collection["id"] + " AND userid = " + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("collection_join", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		if(invData !== null && invData["body"]["length"] > 0)
		{
			this.showActions['join'] = false;
		}
	 
	  }));
}

joincollection()
{

	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select * from collection_join where collection_id = " + this.collection["id"] + " AND userid = " + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("collection_join", params).subscribe(invData => setTimeout(() => {

	  console.log(invData);
	  if(invData !== null && invData["body"]["length"] > 0)
	  {
		
	  }
	  else
	  {
		var params = {};
		params["collection_id"] =this.collection["id"];
		params["userid"] =this.currentUser["id"];
		
		var res =   this.dbService.postDataByTable("collection_join", params).subscribe(dData => setTimeout(() => {
			alert("Joined collection ");
			this.showActions['join'] = true;
		}));

	  }
	}));

}

toggleMoreMenu(recipe, index, list)
{
	if(list == "addlist")
	{
		for(let i =0; i < this.recipesList1.length;i++)
		{
			if(this.recipesList1[i]["id"] !== recipe["id"] && index !== i)
			{
				this.recipesList1[i]["expand"] = false;
			}
		}	
	}

	if(list == "viewlist")
	{
		for(let i =0; i < this.recipesList.length;i++)
		{
			if(this.recipesList[i]["id"] !== recipe["id"] && index !== i)
			{
				this.recipesList[i]["expand"] = false;
			}
		}	
	}
	recipe["expand"] = !recipe["expand"];	

}
transform(value: any, args?: any): any {
	return this.sanitize.bypassSecurityTrustHtml(value);
	}

	formatDays(dt)
	{
		return Math.ceil(this.helpService.findDateDiff(dt));
	}


gotopage(){        
   this.router.navigate(["collections"]);    
}
gotodetails(id){        
	this.router.navigate(["recipedetails", id]);    
 }
usersList: Array<any> = [];
showusersflag: boolean = false;
widthClass: any = "";
hideusers()
{
	this.showusersflag = false;
}
showusers()
{
	this.widthClass = 40;
	this.modalService.open("viewusers");

	this.showusersflag = true;
  if(this.usersList.length == 0)
  {

  var params = {"query": "SELECT id, firstname, lastname, email, username, image FROM users where id in (select user_id from collection_join  where collectin_id = " + this.routeParams.id + ")"};

  params["query"] ="select id, username, firstname, lastname, email, image from users where id in (select userid from collection_join where collection_id = " + this.collection["id"] + ")"; 

  var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {

   
    if(invData !== null && invData["body"]["length"] > 0)
    {
      this.usersList = invData["body"];
  
    }
  }));
 

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



/**************** import recipe from url  */


recipeurl: any = "";
checkrecipeexists()
{
	var params1 = {};
	console.log(this.recipeurl);
	params1["url"] =  this.recipeurl;
	//params1["url"]="http://www.myrecipes.com/recipe/black-cardamom-beef-sliders";
   // this.importrecipe(params1["url"]);
console.log(params1);
  var res =   this.dbService.getDatabyFields("recipes", params1).subscribe(resData => setTimeout(() => {
	  console.log(resData);
	  if(resData !== null && resData['body']['length'] > 0)
	  {
	  //	alert("Recipe already in our database");
		  this.toastr.error('Recipe already in our database', 'Save Recipe from URL!');
		  
	  }
	  else
	  {
		  this.importrecipe(params1["url"]);
	  }
  }));
	   
}

instructionCount:any = 0;
toggleRecipeAddURL: boolean = false;
importrecipe(url)
{
  var params1 = {};
  this.instructionCount= 0;
  params1["url"]=url;
  var apiurl = environment.scrapeurl;
  console.log("apiurl " + apiurl);
  var res =   this.dbService.postLocalData(apiurl, params1).subscribe(resData => setTimeout(() => {
	  console.log(resData);
	  if(resData && resData["result"] && resData["result"] == "Error")
	  {
		  this.toastr.error('Unable to import this url at present. Please try existing recipes.', 'Save Recipe from URL!');
		  //alert("unable to import this url at present. Please try existing recipes ")
		  this.helpService.import_url_save(this.currentUser["id"],url,"collection_d");
	  }
	  else{
		  this.createrecipe(resData, url)
	  }
	  
  }));
}

new_recipe: any = {};

ingredientsImport :Array<any> = [];

createrecipe(data, url)
{
  this.new_recipe = {};
  this.new_recipe["label"] = data["name"];
  this.new_recipe["image"] = data["image"];
  this.new_recipe["url"] = url;
  this.new_recipe["uri"] = url;
  this.new_recipe["ingredientLines"] = this.formatString(data["ingredients"].join("~"));
  
  this.new_recipe["s_instructions"] = this.formatString(data["instructions"].join("~"));
  this.new_recipe["created_by"] = this.currentUser["id"];
  this.new_recipe["status"] = "0";
  this.new_recipe["source"] = "imported";

  if(data["time"] && data["time"]["total"])
  {
	  this.new_recipe["totalTime"] = data["time"]["total"];
  }

//  for(let i=0; i < data["ingredients"].length; i++)
// {
//	  this.ingredientsImport.push({'text':data["ingredients"][i]});
 // }
  var ingr = [];
	for(let i=0; i < data["ingredients"].length; i++)
	{
		this.ingredients.push({'text':data["ingredients"][i]});

		ingr.push(data["ingredients"][i]);
	}

  this.instructionCount = 0;
//  this.getNutrients(this.ingredientsImport[0])

this.getNutrientsConsolidated(ingr);
}


/************ for nutrients */
getNutrientsConsolidated(ingr)
{

  console.log("getNutrientsConsoldiated");
	var api_id = environment.edamameId;
	var api_key = environment.edamameKey;

	console.log(api_id);
	console.log(api_key);
  console.log(ingr)
	var apiURL = constants.edamam_nutrient_api_details   +"?app_id="+ api_id + "&app_key=" + api_key ;

	console.log(apiURL);
	var res =   this.dbService.getIngredientsApi(apiURL, ingr).subscribe(recipeData => setTimeout(() => {
		console.log(recipeData);
		if(recipeData["dietLabels"] && recipeData["dietLabels"]["length"] > 0)
		this.new_recipe["dietLabels"] = JSON.stringify(recipeData['dietLabels']);

		if(recipeData["healthLabels"] && recipeData["healthLabels"]["length"] > 0)
		this.new_recipe["healthLabels"] = JSON.stringify(recipeData['healthLabels']);

		if(recipeData["totalWeight"] && recipeData["totalWeight"]> 0)
		this.new_recipe["totalWeight"] =recipeData["totalWeight"];

		this.new_recipe["calories"] =recipeData["calories"];

		if(recipeData["cautions"] && recipeData["cautions"]["length"] > 0)
		this.new_recipe["cautions"] =JSON.stringify(recipeData["cautions"]);


  
		  if(typeof(recipeData["yield"]) !== "undefined" && recipeData["yield"] !== "" && recipeData["yield"] !== "0" && recipeData["yield"] !== 0)
		  this.new_recipe["yield"] = recipeData["yield"];
		  this.new_recipe["s_servings"] = recipeData["yield"]
  console.log(this.new_recipe);
  this.SaveRecipe();


	   // item["nutrients"] = recipeData;
		
		
	  //  if(this.instructionCount < this.ingredients.length-1)
	  //  {
		  //  this.instructionCount++;
			//this.getNutrients(this.ingredients[this.instructionCount]);
	   // }
	  //  else
	  //  {
	  //	  this.formatIngredients();
	   // }
	}));

}

/************ for nutrients */

getNutrients(item)
{


  console.log(item);
  var api_id = environment.edamameId;
  var api_key = environment.edamameKey;

  console.log(api_id);
  console.log(api_key);

  var apiURL = constants.edamam_nutrient_api   +"?app_id="+ api_id + "&app_key=" + api_key + "&ingr=" + item["text"];

  console.log(apiURL);
  var res =   this.dbService.getLocalData(apiURL).subscribe(recipeData => setTimeout(() => {
	  console.log(recipeData);
	  item["nutrients"] = recipeData;
	  
	  
	  if(this.instructionCount < this.ingredientsImport.length-1)
	  {
		  this.instructionCount++;
		  this.getNutrients(this.ingredientsImport[this.instructionCount]);
	  }
	  else
	  {
		  this.formatIngredients();
	  }
  }));

}

SaveRecipe()
{
  console.log(this.new_recipe);
  console.log(JSON.stringify(this.new_recipe));
	var res =   this.dbService.postDataByTable("recipes", this.new_recipe).subscribe(recipeData => setTimeout(() => {
	  console.log(recipeData);
  
	  if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "" && recipeData['inserted_id'] !== "0" && recipeData['inserted_id'] !== 0)
	  {
		  this.toastr.success('Recipe has been imported!!!', 'Save Recipe from URL!');
		  this.new_recipe["id"] = recipeData['inserted_id'];
		  this.recipesList.push(this.new_recipe);
		  this.addRecipe(this.new_recipe);
		//  this.searchProps();
	  }
	  else
	  {
		  this.toastr.error('Error importing the recipe!!!', 'Save Recipe from URL!');
	  }
	}));
  
}
formatString(str)
{
var retVal = str;
if(str !== "")
{
  if(str.indexOf("'") > -1)
  {
  retVal = retVal.replaceAll("'","");
  console.log(retVal);
  }
}
return retVal;
}
cons_Nutrients: any= {};
total_calories: any = 0;
total_weight: any = 0;
labels: any = {};
formatIngredients()
{
  console.log(this.ingredientsImport);
  var temp = "";
  var totalNutrients = {};
  this.cons_Nutrients= {};
  
  if(typeof(this.new_recipe["totalNutrients"]) !== "undefined" && this.new_recipe["totalNutrients"]!== "")
  {
	  this.cons_Nutrients = JSON.parse(this.new_recipe["totalNutrients"]);
  }
  for(let i=0; i < this.ingredientsImport.length; i++)
  {
	  temp += this.ingredientsImport[i]["text"] + "~";
	  if(typeof(this.ingredientsImport[i]["nutrients"]) !== "undefined")
	  this.consolidateNutrients(this.ingredientsImport[i]["nutrients"]);
	  this.formatLabels(this.ingredientsImport[i]["nutrients"]);
  }
  if(temp !== '')
  temp=  temp.slice(0, -1);

  //this.new_recipe["ingredientLines"] = temp;
  this.new_recipe["totalNutrients"] = JSON.stringify(this.cons_Nutrients);
  this.new_recipe["calories"] = this.total_calories;
  console.log(this.new_recipe);
  this.SaveRecipe();
}

formatLabels(item)
{
//	console.log("Formatlabels");
//	console.log(item);
  if(typeof(item) !== "undefined" && item !== null)
  {
  
  if(typeof(item["cautions"]) !== "undefined" && item['cautions'] !== null && item['cautions'] !== "")
  {
	  var cautions  = item["cautions"]
	  if(typeof(this.labels["cautions"]) == "undefined")
	  {
		  this.labels["cautions"] = cautions.join("~");
	  }
	  else
	  {
		  for(let c=0; c < cautions.length; c++)
		  {
			  if(this.labels["cautions"].indexOf(cautions[c]) == -1)
			  {
				  cautions[c] = cautions[c].replace("_", "-");
				  this.labels["cautions"] += "~" + cautions[c];
			  }
		  }
	  }
	  this.new_recipe["cautions"] = this.labels["cautions"];
  }
  if(typeof(item["dietLabels"]) !== "undefined" && item['dietLabels'] !== null && item['dietLabels'] !==  "")
  {
	  var tDiet  = item["dietLabels"];
	  if(typeof(this.labels["dietLabels"]) == "undefined")
	  {
		  this.labels["dietLabels"] = tDiet.join("~");
	  }
	  else
	  {
		  for(let c=0; c < tDiet.length; c++)
		  {
			  if(this.labels["dietLabels"].indexOf(tDiet[c]) == -1)
			  {
				  tDiet[c] = tDiet[c].replaceAll("_", "-");
				  this.labels["dietLabels"] += "~" + tDiet[c];
			  }
		  }
	  }
	  this.new_recipe["dietLabels"] = this.labels["dietLabels"];
  }
  if(typeof(item["healthLabels"]) !== "undefined" && item['healthLabels'] !== null && item['healthLabels'] !== "")
  {
	  var tlabel2  = item["healthLabels"];
	  if(typeof(this.labels["healthLabels"]) == "undefined")
	  {
		  this.labels["healthLabels"] = tlabel2.join("~");
	  }
	  else
	  {
		  for(let c=0; c < tlabel2.length; c++)
		  {
			  if(this.labels["healthLabels"].indexOf(tlabel2[c]) == -1)
			  {
				  tlabel2[c] = tlabel2[c].replaceAll("_", "-");
				  this.labels["healthLabels"] += "~" + tlabel2[c];
			  }
		  }
	  }
	  this.new_recipe["healthLabels"] = this.labels["healthLabels"];
  }
//	console.log(this.labels);
  }
//	console.log(this.labels);
//	console.log(this.new_recipe);
}

consolidateNutrients(item)
{
	if(typeof(item["totalWeight"]) !== "undefined" && item['totalWeight'] !== null)
	{
	this.total_weight  += item["totalWeight"];
	}

	if(typeof(item["calories"]) !== "undefined" && item['calories'] !== null)
	{
	this.total_calories  += item["calories"];
	}
	if(typeof(item["totalNutrients"]) !== "undefined" && item['totalNutrients'] !== null)
	{
	var obj = item["totalNutrients"];

	if(item)
		{
			for (let x in obj) {
			
				if(typeof(this.cons_Nutrients[x]) == "undefined")
				{
					this.cons_Nutrients[x] = obj[x];
				}
				else
				{
					this.cons_Nutrients[x]['quantity'] = parseFloat(this.cons_Nutrients[x]['quantity']) + obj[x]["quantity"];
				}
			}
		
		}
	//	console.log(this.cons_Nutrients); 
	}
}

formatimage(image)
{
  var ret = image;
  if(image !== "")
  {
    if(image.indexOf("uploads/profiles") > -1)
    {
		var urlapi = this.apiUrl.replace("/api","");

      ret = urlapi + image;
    }
  }
  return ret;
}
}

	