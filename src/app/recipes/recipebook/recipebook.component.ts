import { Component, OnInit,OnDestroy, OnChanges  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { constants } from '../../../assets/data/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { recipe } from '../../../assets/data/recipestructure';
import { PDFService } from '../../services/pdf.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
import { ToastrService } from 'ngx-toastr';
@Component({
	selector: 'app-recipebook',
	templateUrl: './recipebook.component.html',
	styleUrls: ['./recipebook.component.scss']
})
export class RecipebookComponent implements OnInit, OnChanges {
	private onDestroy$: Subject<void> = new Subject<void>();
	nutrientsList: Array<any> =[];
	routeParams: any = {};
	searchRes: any;
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
	setFav: boolean = false;
	constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private pdfService: PDFService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder, private modalService: ModalService) {
	
	}
ngOnChanges()
{
	console.log("ngOnchanges");
	this.loadDefaults();

}
	ngOnInit() {
		this.loadDefaults();
		this.recipesList = [];
		
		this.searchRes = {"recipebook_name":"", "image":"", "description":"","notes":""};
	}
loadDefaults()
{

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
			this.loadRecipebook(this.routeParams.id);
		  }    
		  else
		  {
			  this.setDefaults();
		   this.searchRes = recipe;
	   
		  }
		  if (typeof (this.routeParams.draft) !== "undefined") {
		   console.log(this.routeParams.draft);
		   this.loadRecipebook(this.routeParams.draft);
		 }  
		   console.log(this.routeParams);
	}); 

	


}

setDefaults()
{

	
	this.searchRes = {};


}
existingIngCount:any = 0;
loadRecipebook(id)
{
  console.log("In load loadRecipebook");
  console.log(id);
  this.loading++;
  console.log(this.loading);

  this.searchRes = [];
 var params = {}
 if(id)
 {
 params["id"] = id;
 }

 console.log(params);
 
 if(this.loading)
  {
  var res =   this.dbService.getDataByTable("recipebook", params).subscribe(rbookData => setTimeout(() => {

	console.log(rbookData);

	if(rbookData !== null)
	{
	  if(typeof(rbookData["body"]) !== "undefined" && rbookData["body"] !== null && rbookData["body"]["length"] > 0)
	  {
		this.searchRes = rbookData["body"][0];
		if(this.searchRes["recipeslist"] !== "")
		{
			this.loadRecipes(this.searchRes["recipeslist"]);
			this.getFavouriteStatus();
		}
	  }
	

	console.log(this.searchRes);
	}
  }));
  }

}

recipesList: Array<any> = [];
splitcontent: boolean = false;
loopCount: any = 0;
loadingData: boolean = false;
loadRecipes(idslist = "")
{
	console.log(idslist);
	this.recipesList = [];
  var params = {};
if(!this.loadingData)
{
	this.loadingData = true;

	if(idslist !== "")
	{
	
		
	params["idslist"] = idslist;

	}
	else if(this.searchparam.q !== "")
	{
	//	params["content"] = this.searchparam.q;
		if (this.searchparam.q) {
			console.log(" this.splitcontent " + this.splitcontent);
			if (this.splitcontent) {
				params["content"] = this.searchparam.q.split(" ").join(",");
				console.log(params['content']);
				this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipes", this.currentUser["id"]);
				
			}
			else {
				this.loopCount = 0;
				var words = this.searchparam.q.replaceAll(" ", "~");
				params["words"] = words;
				this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipes", this.currentUser["id"]);
			}

		}

	}

	params["instructions"] = "notempty";
	params["returnfields"] = " id, label, image, healthLabels, dietLabels, calories, yield, totalWeight, totalNutrients, digest ";
  
  console.log(JSON.stringify(params));

 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
	console.log(invData);
  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	{
		this.loadingData = false;
		this.recipesList = [];

	
		if (invData["body"]["length"] == 0) {
			console.log("calling again searchprops");
			this.splitcontent = true;
			if (this.loopCount < 1) {
				this.loopCount++;
				this.loadRecipes(idslist);

			}
		}
		else {
			this.loadingData = false;
			this.splitcontent = false;
			this.recipesList = invData["body"];
		}
	
	}
	 
  }

 ));
}
else
{
	setTimeout(() => {
		this.loadRecipes(idslist);
	}, 1000);
}
}

maxcalories:any = 0;
recipesList1:Array<any>=[];
searchProps()
{

//console.log('searchProps');


var params = {}
if(this.searchparam.q)
{
params["content"] = this.searchparam.q;
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

// console.log(params);
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

  params1["query"] = query + where + " limit 0, 100";
  console.log(params1);
	var res =   this.dbService.getDatabyTablebyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
		console.log(invData);
		this.formatResult(invData);
	}));
	}
	else
	{
	var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		this.formatResult(invData);
	}));
	}
	
}
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
		this.searchRes["recipes"] ="";
		var recipeids = "";
		for(let r=0; r < this.recipesList.length; r++)
		{
			recipeids +=  this.recipesList[r]["id"] + ",";
		}
		if(recipeids !== "")
		{
			recipeids = recipeids.substring(0, recipeids.length-1);	
			this.searchRes["recipes"] = recipeids;
		}
		console.log(this.recipesList);
		console.log(this.searchRes);
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
		this.searchRes["recipes"] ="";
		var recipeids = "";
		for(let r=0; r < this.recipesList.length; r++)
		{
			recipeids +=  this.recipesList[r]["id"] + ",";
		}
		if(recipeids !== "")
		{
			recipeids = recipeids.substring(0, recipeids.length-1);	
			this.searchRes["recipes"] = recipeids;
		}
		console.log(this.recipesList);
		console.log(this.searchRes);
	}
	this.toggleRecipeAdd = false;
	this.searchparam["q"] ="";
	//this.toastr.success('Added Recipe to Recipe Book', 'Recipe Book!');	
}
saveRecipebook()
{
	console.log("saveRecipebook");
	console.log(this.searchRes);
	var params = {};
	
	if(this.searchRes["recipebook_name"] !== "")
    params["recipebook_name"] = this.searchRes["recipebook_name"];
   
    if(this.searchRes["description"] !== "")
    params["description"] = this.searchRes["description"];

    if(this.searchRes["notes"] !== "")
    params["notes"] = this.searchRes["notes"];

	if(this.searchRes["image"] !== "")
    params["image"] = this.searchRes["image"];

    if(this.searchRes["recipes"] !== "")
    params["recipes"] = this.searchRes["recipes"];

	if(typeof(this.searchRes["createdby"]) =="undefined" || this.searchRes["createdby"] == "" || this.searchRes["createdby"] == "0")
    {
      if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== "")
      params["createdby"] = this.currentUser["id"];
    }   
		if(typeof(this.searchRes.id) !== "undefined"  && this.searchRes.id !== "")
		{
			console.log("updating");
			params["id"] = this.searchRes.id;
			console.log(params);
			var res =   this.dbService.updateDataByTable("recipebook", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
				this.toastr.success('Updated Recipe Book!', 'Recipe Book!');	
				this.loadRecipebook(this.searchRes.id);
				this.router.navigate(["recipebooks"]);   
				
			}));
		}
		else
		{
		
			console.log("adding");
			console.log(params);
			var res =   this.dbService.postDataByTable("recipebook", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
				this.toastr.success('Saved Recipe Book!', 'Recipe Book!');
				if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "")
				{
					this.loadRecipebook(recipeData['inserted_id']);	
					this.router.navigate(["recipebooks"]);   
				}
			}));
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

			  this.searchRes["image"] = urlapi + resultData["name"];
			console.log(type);	
			  console.log(this.searchRes)
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
	  if(typeof(this.searchRes["id"]) !== "undefined" && this.searchRes["id"] !== "")
	  {
		  this.pdfService.createrecipebookpdf(this.searchRes["id"]).subscribe(dData => setTimeout(() => {

			  console.log(dData);
			  if(dData !== null )
			  {
			  var recipeBook ={};
			  recipeBook["recipebook"] = this.searchRes["recipebook_name"];
			  recipeBook["link"] = environment.apiUrl + "/" + dData["filename"];
			  var link = document.createElement('a');
			  link.href = recipeBook["link"];
			  link.target = "_blank";
		  //	link.download = mealPlan["link"];
			  link.click();
			  console.log(recipeBook["link"]);
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
 formatHiphen(str)
 {
	 var ret = str;
	 if(str !== "" )
	 {
		 ret = str.replaceAll("~", ", ");

	 }
	 return ret;
 }

 gotopage(){        
   this.router.navigate(["recipebooks"]);    
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
			alert("favourite has been set");
			//this.getFavouriteStatus();
			var fIndex = this.recipesList.findIndex(x=>(x["id"] === id));
			if(fIndex > -1)
			{
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
	params["id"] = id;
	//params["userid"] = this.currentUser["id"];

	var res =   this.dbService.deleteDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
		this.setFav = false;
	  if(invData !== null)
	  {
		//this.getFavouriteStatus();
		var fIndex = this.recipesList.findIndex(x=>(x["id"] === id));
		if(fIndex > -1)
		{
			this.recipesList[fIndex]["UserFavStatus"] =  false;
			this.recipesList[fIndex]["expand"] = !this.recipesList[fIndex]["expand"];
		}
	  }
	  //console.log(this.setFav);
	}));
  }  
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


}

	