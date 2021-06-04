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
@Component({
	selector: 'app-recipesubmit',
	templateUrl: './recipesubmit.component.html',
	styleUrls: ['./recipesubmit.component.scss']
})
export class RecipesubmitComponent implements OnInit, OnChanges {
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
	isEdit:boolean = false;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
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
			this.loadRecipe(this.routeParams.id);
			this.isEdit =  true;
		  }    
		  else
		  {
			  this.setDefaults();
		   this.searchRes = recipe;
	   
		  }
		  if (typeof (this.routeParams.draft) !== "undefined") {
		   console.log(this.routeParams.draft);
		   this.loadRecipe(this.routeParams.draft);
		 }  
		   console.log(this.routeParams);
	}); 

	


}
measureList: Array<any> =[];
foodCategoryList: Array<any> =[];
showFoodCategories: any = false;
showMeasures: any = false;
displayListMeasure: Array<any> =[];
displayListFoodCat: Array<any> =[];
setDefaults()
{

	/*
food: "pears"
foodCategory: "fruit"
image: "https://www.edamam.com/food-img/65a/65aec51d264db28bbe27117c9fdaaca7.jpg"
measure: "cup"
quantity: 3
text: "3 cups peeled, chopped, ripe Asian pears (about 3 large)"
weight: 420
	*/
	this.showFoodCategories = false;
	this.showMeasures = false;

	this.measureList = constants.measureList.sort();
	this.displayListMeasure = this.measureList;
	this.foodCategoryList = constants.foodCategoryList.sort();
	this.displayListFoodCat = this.foodCategoryList;
	this.addRows("ins");
	this.addRows("ing");
	this.getLabels();
	this.ingredients = [];
	this.instructions= [];
	this.ingredients.push({ "food":"", "foodCategory":"", "image":"", "measure":"", "quantity":"", "text":"","weight":""});
	this.searchRes = {};
	this.nutrientsList =  constants.minerals;
	console.log(this.nutrientsList);
}
existingIngCount:any = 0;
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
  var res =   this.dbService.getDataByTable("recipes", params).subscribe(recipeData => setTimeout(() => {

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
			  

			  if(typeof(this.searchRes["status"]) !== "undefined" && this.searchRes["status"] !== "")
			  {
				if (this.searchRes["status"] == 0)
				{
				  this.ispublic = false;
				} 
				else
				{
				  this.ispublic = true;
				}
			  }

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
		
			
			
			console.log(this.searchRes);
			console.log("this.searchRes");
			 console.log(this.searchRes["ingredientLines"]);
			 if(typeof(this.searchRes["ingredientLines"]) !== "undefined" && this.searchRes["ingredientLines"] !== "")
			 {
				var tempIng= this.searchRes["ingredientLines"].split("~");
				console.log(tempIng);
				if(tempIng.length > 0)
				{
					this.ingredients= [];
					for(let i=0; i < tempIng.length; i++)
					{
						this.existingIngCount++;
						this.ingredients.push({"text":tempIng[i], "nutrients":""})
					}
				}
				else
				{
					this.addRows("ing");
				}

			 }
			 else
			 {
				this.addRows("ing");
			 }

			

			
			
			 this.total_calories = 0;
			 this.total_weight = 0;

			 if(typeof(this.searchRes["calories"]) !== "undefined" && this.searchRes["calories"] !== "")
			 {
				this.calories = parseFloat(this.searchRes["calories"]);
			 }
			 if(typeof(this.searchRes["totalWeight"]) !== "undefined" && this.searchRes["totalWeight"] !== "")
			 {
				this.totalWeight = parseFloat(this.searchRes["totalWeight"]);
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
			
			  if(typeof(this.searchRes["s_instructions"]) !== "undefined" && this.searchRes["s_instructions"] !== "")
			  {
				var tempIns = this.searchRes["s_instructions"].split("~");
				if(tempIns.length > 1)
				{
				this.searchRes["instructions"]  = tempIns;
				}
				else
				{
					tempIns = this.searchRes["s_instructions"].split(". ");
					this.searchRes["instructions"]  = tempIns;
				}
				 console.log(tempIng);
				 if(tempIns.length > 0)
				 {
					 this.instructions= [];
					 for(let i=0; i < tempIns.length; i++)
					 {
		
						 this.instructions.push({"text":tempIns[i], "deleted":""})
					 }
				 }
				 else
				 {
					 this.addRows("ins");
				 }
 
			  }
			  else
			  {
				 this.addRows("ins");
			  }
 
			  console.log(this.instructions);
			
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
	  this.setLabels();

	console.log(this.searchRes);
	}
  }));
  }
//}
}
mtypeChange()
{
	console.log(this.searchRes);
	console.log("mealType " + this.searchRes["mealType"]);
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

	for(let h=0; h < constants.healthLabelsNew.length; h++)
	{
		if(constants.healthLabels[h] !== "")
		{
		this.healthlabelsList.push({"name":constants.healthLabelsNew[h], "selected":false})
		}
	}
	console.log(this.healthlabelsList);
}

setLabels()
{
	if(this.searchRes !== null)
	{
		if(typeof(this.searchRes["healthLabels"]) !== "undefined" && this.searchRes["healthLabels"] !=="")
		{
			console.log(this.searchRes["healthLabels"]);
			var temp = this.searchRes["healthLabels"].split("~");
			if(temp.length > 0)
			{
				for(let d=0; d < temp.length; d++)
				{
					temp[d] = temp[d].replace("_", "-");
					var indexh= this.healthlabelsList.findIndex(x => (x.name.toLowerCase() == temp[d].toLowerCase()))
					if(indexh > -1)
					{
						this.healthlabelsList[indexh]["selected"] = true;
					}
				}
			}
		}

		if(typeof(this.searchRes["dietLabels"]) !== "undefined" && this.searchRes["dietLabels"] !=="")
		{
			var temp = this.searchRes["dietLabels"].split("~");
			if(temp.length > 0)
			{
				for(let d=0; d < temp.length; d++)
				{
					temp[d] = temp[d].replace("_", "-");
					var indexD = this.dietLabelsList.findIndex(x => (x.name.toLowerCase() == temp[d].toLowerCase()))
					if(indexD > -1)
					{
						this.dietLabelsList[indexD]["selected"] = true;
					}
				}
			}
		}
	}
}
formahtLabel(item)
{
	console.log(item);
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
		this.formatIngredients();
	}));

}
cons_Nutrients: any= {};
total_calories: any = 0;
total_weight: any = 0;
labels: any = {};
formatIngredients()
{
	console.log(this.ingredients);
	var temp = "";
	var totalNutrients = {};
	this.cons_Nutrients= {};
	
	if(typeof(this.searchRes["totalNutrients"]) !== "undefined" && this.searchRes["totalNutrients"]!== "")
	{
		this.cons_Nutrients = JSON.parse(this.searchRes["totalNutrients"]);
	}
	for(let i=0; i < this.ingredients.length; i++)
	{
		temp += this.ingredients[i]["text"] + "~";
		if(typeof(this.ingredients[i]["nutrients"]) !== "undefined")
		this.consolidateNutrients(this.ingredients[i]["nutrients"]);
		this.formatLabels(this.ingredients[i]["nutrients"]);
	}
	if(temp !== '')
	temp=  temp.slice(0, -1);

	this.searchRes["ingredientLines"] = temp;
	this.searchRes["totalNutrients"] = JSON.stringify(this.cons_Nutrients);
	this.searchRes["calories"] = this.total_calories;
	this.searchRes["ingredients"] = JSON.stringify(this.ingredients);
}

formatLabels(item)
{
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
		this.searchRes["cautions"] = this.labels["cautions"];
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
		this.searchRes["dietLabels"] = this.labels["dietLabels"];
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
		this.searchRes["healthLabels"] = this.labels["healthLabels"];
	}
	console.log(this.labels);
	}
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
		console.log(this.cons_Nutrients); 
	}
}
addRows(type)
{
	console.log("add rows");
	console.log(type);
	console.log(JSON.stringify(this.instructions));
	if(type=="ing") {
	//	this.ingredients.push({"text":""});
	this.ingredients.push({ "food":"", "foodCategory":"", "image":"", "measure":"", "quantity":"", "text":"","weight":""});
	}
	if(type=="ins") this.instructions.push({"text":""});

	console.log(this.instructions);
}
formatInstructions()
{
	if(this.instructions.length > 0)
	{
		this.searchRes["instructionLines"] = "";
		for(let i = 0; i < this.instructions.length; i++)
		{
			this.searchRes["instructionLines"] += this.instructions[i]["text"] + "~";
		}
		if(this.searchRes["instructionLines"] !== "")
		this.searchRes["instructionLines"] = this.searchRes["instructionLines"].slice(0, -1);
	}
}
saveRecipe()
{
	console.log("saveRecipe");
	console.log(this.searchRes);
	var params = {};
	
	this.searchRes.status = 0;
	params["status"] =0;

	if(this.ispublic)
	{
		params["status"] =1;
		this.searchRes.status = 1;
	}

	if(typeof(this.searchRes["ingredientLines"]) !== "undefined" && this.searchRes["ingredientLines"] !== "")
	{
		params["ingredientLines"] =this.searchRes["ingredientLines"];
	}
	if(typeof(this.searchRes["instructionLines"] ) !== "undefined" && this.searchRes["instructionLines"]  !== "")
	{
		params["s_instructions"] =this.searchRes["instructionLines"];
		console.log(params["s_instructions"]);
	}
	

	if(this.searchRes.label !== "")
	{	
		params["label"] = this.searchRes.label;
	}
	if(typeof(this.searchRes['dietLabels']) !== "undefined"  &&  this.searchRes["dietLabels"] !== "")
	{
		params["dietLabels"] =this.searchRes["dietLabels"];
	}
	if(typeof(this.searchRes['healthLabels']) !== "undefined"  &&  this.searchRes["healthLabels"] !== "")
	{
		params["healthLabels"] =this.searchRes["healthLabels"];
	}
	if(typeof(this.searchRes.calories) !== "undefined"  &&  this.searchRes.calories !== "")
	{
		params["calories"] =this.searchRes.calories;
	}
	if(typeof(this.searchRes.totalWeight) !== "undefined"  &&  this.searchRes.totalWeight !== "")
	{
		params["totalWeight"] =this.searchRes.totalWeight;
	}
	if(typeof(this.searchRes.s_servings) !== "undefined"  &&  this.searchRes.s_servings !== "")
	{
		params["s_servings"] =this.searchRes.s_servings;
	}
	if(typeof(this.searchRes['mealType']) !== "undefined"  &&  this.searchRes['mealType'] !== "")
	{
		params["mealType"] =this.searchRes['mealType'];
	}
	if(typeof(this.searchRes.ispublic) !== "undefined"  &&  this.searchRes.ispublic !== "")
	{
		params["ispublic"] =this.searchRes.ispublic;
	}

	if(typeof(this.searchRes.image) !== "undefined"  &&  this.searchRes.image !== "")
	{
		params["image"] =this.searchRes.image;
	}
	if(typeof(this.searchRes.video) !== "undefined"  &&  this.searchRes.video !== "")
	{
		params["video"] =this.searchRes.video;
	}
	if(typeof(this.searchRes['totalNutrients']) !== "undefined"  &&  this.searchRes["totalNutrients"] !== "")
	{
		params["totalNutrients"] =this.searchRes["totalNutrients"];
	}
	params["source"] =  "fitaholic";
	params["created_by"] =  this.currentUser["id"];
		if(typeof(this.searchRes.id) !== "undefined"  && this.searchRes.id !== "")
		{
			console.log("updating");
			params["id"] = this.searchRes.id;
			params["uri"] = environment.appUrl + "/recipedetails/" + this.searchRes.id;
		
			console.log(params);
			var res =   this.dbService.updateDataByTable("recipes", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);	
				this.loadRecipe(this.searchRes.id);
				
			}));
		}
		else
		{
			params["uri"] = environment.appUrl + "/recipedetails/" + Math.random();
			console.log("adding");
			console.log(params);
			var res =   this.dbService.postDataByTable("recipes", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
		
				if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "")
				{
					this.loadRecipe(recipeData['inserted_id']);	
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
		this.dbService.uploadMedia(params).subscribe(resultData => setTimeout(() => {
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

  gotopage(){        
   this.router.navigate(["recipes"]);    
}

setValue(item, key, value, index)
{
	console.log("in setValue");
	console.log(item);
	console.log(value);
	item[key] = value;
	if(key == "foodCategory")
	this.showFoodCategories = false;

	if(key == "measure")
	this.showMeasures = false;

}
/*
this.displayListMeasure = this.measureList;
	this.foodCategoryList = constants.foodCategoryList;
	this.displayListFoodCat = this.foodCategoryList;
	*/

	resetDropdown()
	{
		this.showFoodCategories = false; this.showMeasures = false;
	}
filterList(item, key)
{
	console.log("in filterList");
	console.log(item);
	console.log(key);
	if(key == "measure")
	{
		this.displayListMeasure = this.measureList;
		if(item["measure"] !== "")
		{
			this.displayListMeasure = [];
			for(let m=0; m < this.measureList.length; m++)
			{
				if(this.measureList[m].toLowerCase().indexOf(item.measure.toLowerCase()) > -1)
				{
					this.displayListMeasure.push(this.measureList[m]);
				}
			}
		}
	}

	if(key == "foodCategory")
	{
		this.displayListFoodCat = this.measureList;
		if(item["foodCategory"] !== "")
		{
			this.displayListFoodCat = [];
			for(let m=0; m < this.measureList.length; m++)
			{
				if(this.measureList[m].toLowerCase().indexOf(item.foodCategory.toLowerCase()) > -1)
				{
					this.displayListFoodCat.push(this.measureList[m]);
				}
			}
		}
	}

}
}

	