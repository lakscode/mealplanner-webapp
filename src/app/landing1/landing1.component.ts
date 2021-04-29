import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import {constants} from "../jsonfiles/constants"
@Component({
	selector: 'app-landing1',
	templateUrl: './landing1.component.html',
	styleUrls: ['./landing1.component.scss']
})
export class Landing1Component implements OnInit {
	count: any = 0;
	sliderList: Array<any> = [];
	recommendedRecipes: Array<any> = [];
	healthLabels: Array<any> = [];
	RecipeoftheDay: Array<any> = [];

constructor(private router: Router, private httpClient : HttpClient, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.count++;
		this.defaultRecipeofTheDay();
		this.loadRecipeoftheDay();

		this.loadHealthLabels();
	
		this.loadRecommendedRecipes();
	
	}

	defaultRecipeofTheDay()
	{
		this.httpClient.get('assets/data/recipeoftheday.json').subscribe(
			recipeoftheday => {        
			  if(recipeoftheday){
				this.RecipeoftheDay = [];
				this.RecipeoftheDay.push(recipeoftheday);
				console.log(this.RecipeoftheDay);
			  }else{
				this.defaultRecipeofTheDay();
			  }
			});  
	}
	loadRecommendedRecipes()
	{
	  this.recommendedRecipes = [];
  
	  var params = {"limit": "4"};
	  params["query"]="select id, label, image, s_instructions, healthLabels from recipes where s_instructions != '' AND label != '' AND image != '' group by healthLabels order by rand() limit 0, 4";
  
	  var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	//  console.log(invData);
   
	   if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		 {
		   this.recommendedRecipes = [];
		   for(let i=0; i < invData["body"]["length"] ; i++)
		   {
			 this.recommendedRecipes.push(invData["body"][i]);
			
		   }
		
		 }
	//	 console.log(this.recommendedRecipes);
	   }
	 
	  ));
   
	}

	loadRecipeoftheDay()
	{
	  this.RecipeoftheDay = [];
	  var params = {};
    //params["query"] = "select id, image, label, dietLabels, s_instructions from recipes where s_instructions != '' order by rand() limit 1";
	params["query"] = "select * from recipes where s_instructions != '' order by rand() limit 1";

	 var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
      this.RecipeoftheDay = [];
   		for(let i=0; i < invData["body"]["length"] ; i++)
		  {			
			  this.RecipeoftheDay.push(invData["body"][i]);		
		  }
		}
   console.log(this.RecipeoftheDay);
	 }));
  
	}

	loadHealthLabels()
	{
	  this.healthLabels = [];
	
				 var arrLabel = constants.healthLabelsNew;
				 if(arrLabel.length > 0)
				 {
				   for(let l=0; l < arrLabel.length; l++)
				   {
					
						var img = "assets/menu/veg.png";
						if(arrLabel[l].toString().toLowerCase().indexOf("vegetarian") !== -1)
						{
						  img = "assets/menu/vegetarian1.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("vegan") !== -1)
						{
						  img = "assets/menu/vegan.png";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("peanut-free") !== -1)
						{
						  img = "assets/menu/peanutfree.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("sugar-conscious") !== -1)
						{
						  img = "assets/menu/sugarfree.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("alcohol-free") !== -1)
						{
						  img = "assets/menu/alcoholfree.png";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("balanced") !== -1)
						{
						  img = "assets/menu/balanced-diet.png";
						}
					 //   console.log(img);
					  this.healthLabels.push({"label":arrLabel[l], "image":img});
					  
					
					
				   }
				 }
			  
   
	}
	loadHealthLabelsfromDB()
	{
	  this.healthLabels = [];
	 // this.recipes = recipesList;
	  var params = {};
	  
	  params["returnfields"]=" healthLabels ";
	  // console.log(JSON.stringify(params));
	  //params["instructions"] = "notempty";
  
	  var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
	 
	  // console.log(invData);
   
	   if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		 {
		   this.healthLabels = [];
		   for(let i=0; i < invData["body"]["length"] ; i++)
		   {
			 var temp =invData["body"][i];
			 if(typeof(temp["healthLabels"]) !== "undefined")
			 {
			   var tempLabel = temp["healthLabels"];
			   if(tempLabel !== "")
			   {
				 var arrLabel = tempLabel.split("~");
				 if(arrLabel.length > 0)
				 {
				   for(let l=0; l < arrLabel.length; l++)
				   {
					//console.log(arrLabel[l].toString().toLowerCase());
					 var indexLbl = this.healthLabels.findIndex(x=> x.label == arrLabel[l])
			   
					 if(indexLbl == -1)
					 {
						var img = "assets/menu/veg.png";
						if(arrLabel[l].toString().toLowerCase().indexOf("vegetarian") !== -1)
						{
						  img = "assets/menu/vegetarian1.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("vegan") !== -1)
						{
						  img = "assets/menu/vegan.png";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("peanut-free") !== -1)
						{
						  img = "assets/menu/peanutfree.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("sugar-conscious") !== -1)
						{
						  img = "assets/menu/sugarfree.jpg";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("alcohol-free") !== -1)
						{
						  img = "assets/menu/alcoholfree.png";
						}
						else if(arrLabel[l].toString().toLowerCase().indexOf("balanced") !== -1)
						{
						  img = "assets/menu/balanced-diet.png";
						}
					 //   console.log(img);
					  this.healthLabels.push({"label":arrLabel[l], "image":img, "count":1});
					  
					 }
					 else
					 {
					  this.healthLabels[indexLbl]["count"]=this.healthLabels[indexLbl]["count"]+1;
					 }
				   }
				 }
			   }
  
			 }
			 
		   }
		 }
		 console.log(this.healthLabels);
	   }
   
	  ));
   
	}

	limitTo(str, num)
	{
		return this.helpService.limitTo(str, num) + "...";
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

	gotoRecipeDetails(id){
	this.router.navigate(['recipedetails', id]);
	}

	gotoRecipes(id) {
		this.router.navigate(['recipes', {dietLabels:id}]);
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
}

	