import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';

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
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.count++;


		this.loadHealthLabels();
		//if(this.count==0)
		//window.location.reload();
		this.loadSliders();
		this.loadRecommendedRecipes();
	
	}

	loadSliders()
    {
		this.sliderList=[];
      /*
      this.sliderList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/full-slide-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      this.sliderList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/full-slide-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      */

      this.sliderList.push({"title":"More than 50 thousand recipes.", "image":"assets/images/temp-images/full-slide-1.jpg","rating":"", "description":"By providing tools that streamline the meal planning process we equip households to eat better food, eat together, save money at the grocery store, and have a less stressful cooking experience in the kitchen."});
      this.sliderList.push({"title":"Meal Planning tool to add recipes to your weekly plan", "image":"assets/images/temp-images/full-slide-4.jpg","rating":"", "description":" recipes that fit your lifestyle and customized meal plan to accommodate your schedule,"});
    //  this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});



    }


	loadRecommendedRecipes()
	{
	  this.recommendedRecipes = [];
  
	  var params = {"limit": "4"};
	  params["query"]="select id, label, image, s_instructions, healthLabels from recipes where s_instructions != '' AND label != '' AND image != '' group by healthLabels order by rand() limit 0, 4";
  
	  //select rc.id, rc.label, rc.image, rc.s_instructions, rc.healthLabels, count(rt.rating) as totalcount, sum(rt.rating) as totalrating from recipes rc join rating rt where rt.recipeid = rc.id AND s_instructions != '' AND label != '' AND image != '' group by healthLabels limit 0, 5
  
	  var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	  console.log(invData);
   
	   if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		 {
		   this.recommendedRecipes = [];
		   for(let i=0; i < invData["body"]["length"] ; i++)
		   {
			 this.recommendedRecipes.push(invData["body"][i]);
			// this.ratingIds += invData["body"][i]["id"] + ",";
		   }
		 //  this.recipesLoaded++;
		 //  this.loadRatings();
		 }
		 console.log(this.recommendedRecipes);
	   }
	 
	  ));
   
	}

	loadHealthLabelsold()
	{
		this.healthLabels = [];

		this.healthLabels.push({"label":"7 Days Meal Plan", "image":"assets/images/temp-images/listing-1.jpg"});
		this.healthLabels.push({"label":"Low-Carb", "image":"assets/images/temp-images/listing-2.jpg"});
		this.healthLabels.push({"label":"Gluten-Free", "image":"assets/images/temp-images/listing-3.jpg"});
		this.healthLabels.push({"label":"Pescatarian", "image":"assets/images/temp-images/listing-1.jpg"});
		this.healthLabels.push({"label":"Vegetarian", "image":"assets/images/temp-images/listing-2.jpg"});
		this.healthLabels.push({"label":"Vegan", "image":"assets/images/temp-images/listing-3.jpg"});

	}



	loadHealthLabels()
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
}

	