import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
import { constants } from './../jsonfiles/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
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
		  for(let i=0; i< temp["length"] ; i++)
		  {
			  this.searchRes = temp[i];
			  if(typeof(this.routeParams.draft) !== "undefined" && this.routeParams.draft !== "")
			  delete this.searchRes["id"];
			  
			  var tempDigest = this.searchRes["digest"];
			  
			  if(typeof(this.searchRes["digest"]) !== "undefined")
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
			  this.searchRes["digestArr"]  = tempDigest;
			  this.searchRes['nutrientsArr'] = tempNutrients;
			  try{
				  console.log(this.searchRes["ingredients"]);
				this.searchRes["ingredients"] = JSON.parse(this.searchRes["ingredients"]);
			  }
			  catch(error)
			  {
				this.searchRes["ingredients"] = this.searchRes["ingredients"].split("~");
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
}

	