import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { isMaster } from 'cluster';

@Component({
	selector: 'app-plannercreate',
	templateUrl: './plannercreate.component.html',
	styleUrls: ['./plannercreate.component.scss']
})
export class PlannercreateComponent implements OnInit {

	recipesList: Array<any> = [];
	addRecipeImage: any;
	draggable: any;
	weekDays: Array<any> = [];
	ratingsArr: Array<any> = [];
	ratingIds: any;
	searchparam: any = {};
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.searchparam['q'] = "";
		this.addRecipeImage = "assets/images/placement_addrecipes@2x.png"
		this.draggable = "assets/images/icon_draggable_grey.png"
this.loadRecipes()
this.loadWeekDays();
	}

	loadWeekDays()
	{
		this.weekDays = [];
		this.weekDays.push({"name":"Sunday"})
		this.weekDays.push({"name":"Monday"})
		this.weekDays.push({"name":"Tuesday"})
		this.weekDays.push({"name":"Wednesday"})
		this.weekDays.push({"name":"Thursday"})
		this.weekDays.push({"name":"Friday"})
		this.weekDays.push({"name":"Saturday"})
	}
	loadRecipesOld()
    {
      this.recipesList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/listing-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

      this.recipesList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/listing-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});



      this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});


	  this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-4.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

	  this.recipesList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/listing-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

      this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

    }

	searchParam()
	{
		console.log(this.searchparam);
	
	}
	loadRecipes()
	{
	  this.recipesList = [];
		this.ratingIds = "";
	// this.recipes = recipesList;
	 var params = {"limit": "10"};
   //  params["caloriesfrom"] = this.searchparam.range.lower;
	// params["caloriesto"] = this.searchparam.range.upper;
	 console.log(this.searchparam);
	
  
	  if(typeof(this.searchparam["q"]) !== "undefined" && this.searchparam["q"] !== null && this.searchparam["q"] !== "")
	  {
		params["content"] = this.searchparam["q"];
	  }
  
	  params["instructions"] = "notempty";
  
	  console.log(JSON.stringify(params));
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	  console.log(invData);
  
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
		  this.recipesList = [];
	

		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
	
			this.recipesList.push(invData["body"][i]);
		

			this.ratingIds += invData["body"][i]["id"] + ",";
		  }
		  console.log(this.recipesList);
	
		  this.loadRatings();
		}
	  }
	
	 ));
  
	}
	loadRatings()
	{
	  if(this.ratingIds !== "")
	  {			
	   this.ratingIds = this.ratingIds.substring(0, this.ratingIds.length-1);
	  }
	 
		var params = {"limit": 100};
	   
		params["query"] = "SELECT count(rating) as totalcount, sum(rating) as totalrating, recipeid FROM `rating` where recipeid in (" + this.ratingIds + ") group by recipeid";
		var res =   this.dbService.getDatabyTablebyQuery("rating", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
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
				  console.log(temp[i]);
				  var recIndex = this.recipesList.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				  console.log(recIndex);
				  if(recIndex > -1)
				  {
					this.recipesList[recIndex]["totalcount"] = temp[i]["totalcount"];
					this.recipesList[recIndex]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList[recIndex]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));
					 }
  
				  }
  
				
  
				}
				console.log(this.ratingsArr);
				console.log(  this.recipesList);
			  }
			}
	
		  }
		}));
	 
	  
	  
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

	drop(ev) {
		console.log(ev);

		ev.preventDefault();
		var index = sessionStorage.getItem("dragstartindex");
		var recipeItem = this.recipesList[index];

		var data = ev.dataTransfer.getData("text");

		var cardBodyDiv1 = document.createElement("div");
		cardBodyDiv1.setAttribute("class","recipe-image-card-content  card-body");

		var cardBodyDiv = document.createElement("div");
		cardBodyDiv.setAttribute("class","image-card-container");

			var r_title = document.createElement('div');
			r_title.innerHTML = recipeItem["label"];
			r_title.setAttribute("class","recipe-name-box");
			cardBodyDiv.appendChild(r_title);

		var img1 = document.createElement('img');
            img1.src = this.formatImage(recipeItem["image"], 's');
			img1.style.width = "70px";
			img1.style.height = "70px";
			img1.style.position = "absolute";
			img1.id = "picture_" + index;
			img1.style.top = "0";
			img1.style.left = "0";
			img1.setAttribute("class","recipe-image recipe-image-card recipe-image-card__img open-fist-cursor");
			img1.setAttribute("draggable","true");
			cardBodyDiv.appendChild(img1);

			cardBodyDiv1.appendChild(cardBodyDiv)

			ev.target.offsetParent.appendChild(cardBodyDiv1);
		ev.target.appendChild(img1);

		ev.target.setAtribute("src", this.formatImage(recipeItem["image"], 's'))
		var panelObj = document.getElementById("imagep_" + index);
		console.log(panelObj);
		var img = document.createElement('img');
            img.src = this.formatImage(recipeItem["image"], 's');
			img.style.width = "70px";
			img.style.height = "70px";
			img.style.position = "absolute";
			img.id = "picture_" + index;
			img.style.top = "0";
			img.style.left = "0";
			img.setAttribute("class","recipe-image");
			img.setAttribute("draggable","true");
			panelObj.appendChild(img);
		

	  }
	
	  allowDrop(ev) {
		ev.preventDefault();
	  }
	
	  drag(ev, index) {
		  console.log(ev);
		  console.log("index " + index);
		  sessionStorage.setItem("dragstartindex",index);

		ev.dataTransfer.setData("text", ev.target.id);
	  }

}

	