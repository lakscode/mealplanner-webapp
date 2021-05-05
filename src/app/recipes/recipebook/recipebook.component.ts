import { Component, OnInit,OnDestroy, OnChanges  } from '@angular/core';
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
import { recipe } from '../../jsonfiles/recipestructure';
import { PDFService } from '../../services/pdf.service';

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
	constructor(private router: Router, private route: ActivatedRoute, private pdfService: PDFService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}
ngOnChanges()
{
	console.log("ngOnchanges");
	this.loadDefaults();
}
	ngOnInit() {
		this.loadDefaults();
	}
loadDefaults()
{
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
		this.loadRecipes(this.searchRes["recipes"]);
	  }
	

	console.log(this.searchRes);
	}
  }));
  }

}

recipesList: Array<any> = [];
loadRecipes(idslist = "")
{
	console.log(idslist);
	this.recipesList = [];
  var params = {};



	if(idslist !== "")
	{
	
		
	params["idslist"] = idslist;

	}

	//params["instructions"] = "notempty";
	params["returnfields"] = " id, label, image, healthLabels, dietLabels, calories, yield ";
  
  console.log(JSON.stringify(params));

 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
	console.log(invData);
  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	{
		this.recipesList = [];

		this.recipesList = invData["body"];
		console.log(this.recipesList);
	
	}
	 
  }

 ));

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
				this.loadRecipebook(this.searchRes.id);
				
			}));
		}
		else
		{
		
			console.log("adding");
			console.log(params);
			var res =   this.dbService.postDataByTable("recipebook", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
		
				if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "")
				{
					this.loadRecipebook(recipeData['inserted_id']);	
				}
			}));
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
	console.log("Fileselect");
	var type = "image";
	if(typeof(this.uploadtype) !== "undefined" && this.uploadtype  !== "")
	{
		type = this.uploadtype ;

	}
console.log("type " + type);
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
	//	console.log(JSON.stringify(params));
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
}

	