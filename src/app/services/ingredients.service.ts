import { Injectable } from "@angular/core";
import { DBService } from '../dbservices/db.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class IngredientsService {
	constants: any;	
	accesstoken = environment.accessToken;
	emailContents: any;
	secretCode : any = "MTC_2021"
	ingredients:Array<any> = [];
	foodCategory: Array<any> = [];
	counter: any = 0;
	constructor(private dbService: DBService, private httpClient: HttpClient,) {
		console.log("ingredients service");
		this.httpClient.get('assets/data/ingredients.json').subscribe(
			ings => {        
			  if(ings){
				this.ingredients = [];
				this.ingredients = ings["ingredients"];
				console.log(this.ingredients);
			  }
			});  

		
	}

	getList(limit)
	{
		var params = {"query":"Select id, ingredients from recipes limit 0, 5000"}
		if(limit > 0)
		{
			params = {"query":"Select id, ingredients from recipes limit " + limit + ", 5000"}
		} 


		this.dbService.getDatabyTablebyQuery("common", params).subscribe(resData => setTimeout(() => {  
		//	console.log(resData);
			if(resData["body"]["length"]  > 0)
			{
			for(let i=0 ; i < resData["body"]["length"]; i++)
			{
				try
				{
				var ings = JSON.parse(resData["body"][i]["ingredients"]);
			//	console.log(ings);
				for(let j=0 ; j < ings["length"]; j++)
				{
					var ing = ings[j];
					if(ing.image !== null)
					{
				//	console.log(ing);

				var fCat = this.foodCategory.findIndex(x=> (x.category.toLowerCase() === ing.foodCategory.toLowerCase()))
				if(fCat == -1)
				{
					this.foodCategory.push({"category": ing.foodCategory, "ingredients":[]});
					fCat = this.foodCategory.findIndex(x=> (x.category.toLowerCase() === ing.foodCategory.toLowerCase()))
				}



				var iIndexf = this.foodCategory[fCat]["ingredients"].findIndex(x=> (x.food === ing.food));
				if(iIndexf == -1)
				{
					this.foodCategory[fCat]["ingredients"].push({"food":ing.food, "image":ing.image, "foodCategory":ing.foodCategory, "measure":ing.measure});
				}
					
					

					var iIndex = this.ingredients.findIndex(x=> (x.food.toLowerCase() === ing.food.toLowerCase()));
					if(iIndex == -1)
					{
						this.ingredients.push({"food":ing.food, "image":ing.image, "foodCategory":ing.foodCategory, "measure":ing.measure});
					}
					}
					
				}
			}
			catch(error)
			{
				//console.log(error);
			}
			}
			}
			this.counter++
			//console.log(this.counter);
			if(this.counter < 5)
			{
			this.getList(limit+5000);
			}
			else
			{
				//console.log(this.foodCategory);
			console.log(JSON.stringify(this.foodCategory));
			}
		}));
	}



	  
}