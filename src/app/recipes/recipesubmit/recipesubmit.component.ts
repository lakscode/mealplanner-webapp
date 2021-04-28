import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { constants } from './../../jsonfiles/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Component({
	selector: 'app-recipesubmit',
	templateUrl: './recipesubmit.component.html',
	styleUrls: ['./recipesubmit.component.scss']
})
export class RecipesubmitComponent implements OnInit {
	private onDestroy$: Subject<void> = new Subject<void>();
	nutrientsList: Array<any> =[];
	routeParams: any = {};
	searchRes: any;
	loading:any = 0;
	paramMicro: Array<any> =[];
	mineralsList: Array<any> =[];
	ingredients: Array<any> =[];
	currentUser: any;
	apiUrl: any = "";
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {

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

		this.getLabels();
		this.ingredients = [];
		this.ingredients.push({"text":""});
		this.searchRes = {};
		this.nutrientsList =  constants.minerals;
		console.log(this.nutrientsList);
		this.routeParams = {};
		this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	 //  console.log(params);   
	   this.routeParams = params;     
	   if (typeof (this.routeParams.id) !== "undefined") {
		 console.log(this.routeParams.id);
		 this.loadRecipe(this.routeParams.id);
	   }    
	   if (typeof (this.routeParams.draft) !== "undefined") {
		console.log(this.routeParams.draft);
		this.loadRecipe(this.routeParams.draft);
	  }  
		console.log(this.routeParams);

		

		}); 
	}

	

loadRecipe(id)
{
  console.log("In load Recipe");
  console.log(id);
  this.loading++;
  console.log(this.loading);
 // if(this.loading ==1)
  //{
  this.searchRes = [];
 var params = {}
 if(id)
 {
 params["id"] = id;
 }

 console.log(params);
 
 if(this.loading)
  {
  var res =   this.dbService.getDataByTable("myrecipes", params).subscribe(recipeData => setTimeout(() => {

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
			  if(typeof(this.routeParams.draft) !== "undefined" && this.routeParams.draft !== "")
			  delete this.searchRes["id"];
			  
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
			  if(typeof(this.searchRes["totalNutrients"]) !== "undefined" && this.searchRes["totalNutrients"] !== "")
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
			  if(typeof(this.searchRes["ingredients"]) !== "undefined" && this.searchRes["ingredients"] !== "")
			  {
				try{
					console.log(this.searchRes["ingredients"]);
					this.searchRes["ingredients"] = JSON.parse(this.searchRes["ingredients"]);
				}
				catch(error)
				{
					this.searchRes["ingredients"] = this.searchRes["ingredients"].split("~");
				}
			 }
			
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
				
				}
			  }

		

		  }
		}
	  }
	console.log(this.searchRes);
	}
  }));
  }
//}
}
dietLabelsList: Array<any>=[];
healthlabelsList: Array<any>=[];
getLabels()
{
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
}
getNutrients(item)
{
	console.log(item);
	var api_id = environment.edamameId;
	var api_key = environment.edamameKey;
	console.log(api_id);
	console.log(api_key);
	var apiURL = constants.edamam_nutrient_api   +"?app_id="+ api_id + "&app_key=" + api_key + "&ingr=" + item.text;

	console.log(apiURL);
	var res =   this.dbService.getLocalData(apiURL).subscribe(recipeData => setTimeout(() => {
		console.log(recipeData);
		item["nutrients"] = recipeData;
	}));

}
addNutrients()
{
	this.ingredients.push({"text":""});
}

autosave()
{
	console.log("autosave");
	console.log(this.searchRes);
	var params = {};
	var paramAdded = false;
	if(this.searchRes.label !== "")
	{
	
		params["label"] = this.searchRes.label;
		paramAdded = true;
		
	}
	if(paramAdded)
	{
		if(typeof(this.searchRes.id) !== "undefined"  && this.searchRes.id !== "")
		{
			console.log("updating");
			params["id"] = this.searchRes.id;
			params["uri"] = environment.appUrl + "/recipedetails/" + this.searchRes.id;
			params["url"] = environment.appUrl + "/recipedetails/" + this.searchRes.id;
			params["created_by"] =  this.currentUser["id"];
			var res =   this.dbService.updateDataByTable("myrecipes", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);	
				this.loadRecipe(this.searchRes.id);
				
			}));
		}
		else
		{
			params["created_by"] =  this.currentUser["id"];
			params["uri"] = environment.appUrl + "/recipedetails/" + Math.random();
			params["url"] = environment.appUrl + "/recipedetails/" + Math.random();
			console.log("adding");
			var res =   this.dbService.postDataByTable("myrecipes", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
		
				if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "")
				{
					this.loadRecipe(recipeData['inserted_id']);	
				}
			}));
		}
	}

}

/*********** imageand video upload  */


uploadtype: any= "";
uploadmedia(type)
{
	this.uploadtype  = type;
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
	if(typeof(this.uploadtype) !== "undefined" && this.uploadtype  !== "")
	{
		type = this.uploadtype ;

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
		this.dbService.uploadRecipe(params).subscribe(resultData => setTimeout(() => {
		  console.log(resultData);
		  if(typeof(resultData) !== "undefined" && resultData !== null)
		  {
			if(typeof(resultData["name"]) !== "undefined" && resultData["name"] !== null && resultData["name"] !== "")
			{
				var urlapi = this.apiUrl.replace("/api","");

			  this.searchRes[type] = urlapi + resultData["name"];
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


}

	