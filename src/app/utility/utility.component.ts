import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.scss']
})
export class UtilityComponent implements OnInit {

//loaddata();
totalCount: any = 0;
counter: any = 0;
nutrientsList: Array<any> = ["fat",
"carbs",
"protein",
"cholesterol",
"sodium",
"calcium",
"magnesium",
"potassium",
"iron",
"zinc",
"phosphorus",
"vitamin_a",
"vitamin_c",
"thiamin_b1",
"riboflavin_b2",
"niacin_b3",
"vitamin_b6",
"folate_equivalent_total",
"folate_food",
"folic_acid",
"vitamin_b12",
"vitamin_d",
"vitamin_e",
"vitamin_k",
"sugar_alcohols",
"water",
"energy",
"saturated",
"monounsaturated",
"polyunsaturated",
"fiber",
"sugars",
"sugars_added"];


  constructor(private router: Router, private route: ActivatedRoute) {
	 
	}

  	ngOnInit() {
		console.log("Utility ngOnInit");
		

this.loaddata();
  
	}

	Savedata(params)
	{
		this.displaydata("counter" + this.counter);
	if(this.counter == this.totalCount-1)
				{
					this.displaydata("finished");
				}
	
				this.displaydata("In Savedata");
		//console.log(params);
		params["tablename"] = "nutrients";
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				
			}
		  }
		  
		  xhttp.open("POST", "https://mealplannerapi-otkcj.ondigitalocean.app/api/common/create.php", true);
		 
		  xhttp.setRequestHeader("Content-Type", "application/json");

		  xhttp.send(JSON.stringify(params));	
	}
	
	
	displaydata(data)
	{
	console.log(data);
	var content = document.getElementById("content");
	if(content !== null)
	{
		content.innerHTML += content.innerHTML + data + "<br>";
	}
	}

	loaddata()
	{
		this.nutrientsList = ["fat",
		"carbs",
		"protein",
		"cholesterol",
		"sodium",
		"calcium",
		"magnesium",
		"potassium",
		"iron",
		"zinc",
		"phosphorus",
		"vitamin_a",
		"vitamin_c",
		"thiamin_b1",
		"riboflavin_b2",
		"niacin_b3",
		"vitamin_b6",
		"folate_equivalent_total",
		"folate_food",
		"folic_acid",
		"vitamin_b12",
		"vitamin_d",
		"vitamin_e",
		"vitamin_k",
		"sugar_alcohols",
		"water",
		"energy",
		"saturated",
		"monounsaturated",
		"polyunsaturated",
		"fiber",
		"sugars",
		"sugars_added"];

		var parent = this;
		this.displaydata("In loaddata");
		this.displaydata(this.nutrientsList.length);
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			
				var objI = JSON.parse(this.responseText);
				
				parent.displaydata("record count " + objI["body"].length);
				if(objI["body"].length > 0)
				{
					
					parent.totalCount = objI["body"]["length"];
					//for(let i =0; i < objI["body"]["length"]; i++)
						for(let i =0; i < objI["body"]["length"]; i++)
					{
						parent.counter++;
						var params = {};
						var id = objI["body"][i]["id"];
						var digest = objI["body"][i]["digest"];
						var totalNutrients = objI["body"][i]["totalNutrients"];
						parent.displaydata("id " + id);
					//	console.log("digest " );
						if(digest !== "")
						{
							var digestObj = JSON.parse(digest);
							if(digestObj.length > 0)
							{
								
								for(let d =0; d < digestObj["length"]; d++)
								{
									var dItem = digestObj[d];
									if(dItem.label !== "")
									{
										var dIndex = -1;
										for(let n=0; n < parent.nutrientsList.length; n++)
										{
											if(parent.nutrientsList[n].toLowerCase() == dItem.label.toLowerCase())
											dIndex = n;
										}
										
										if(dIndex > -1)
										{
											params[dItem.label.toLowerCase()]= dItem.total;
											
										}
										
									}
								
								}
							}
						}
				
						if(totalNutrients !== "")
						{
							var totalN = JSON.parse(totalNutrients);
						Object.keys(totalN).forEach(function(key) {
					
						  if(totalN[key]["label"] !== "")
							{
								var lbl = totalN[key]["label"].toLowerCase();
								lbl = lbl.replaceAll(" " , "_");
								lbl = lbl.replaceAll("(" , "_");
								lbl = lbl.replaceAll(")" , "");
								lbl = lbl.replaceAll("__" , "_");
								//console.log(" lbl " + lbl);
								var dIndex = -1;
								for(let n=0; n < parent.nutrientsList.length; n++)
								{
									if(parent.nutrientsList[n].toLowerCase() ==  lbl)
											dIndex = n;
								}
										
								if(dIndex > -1)
								{
									params[lbl]= totalN[key]["quantity"]
											
								}
										
							}
									
						})
						}

					//	console.log(params);
						params["recipeid"]  =id;
						parent.Savedata(params);
					}
				
				}
				

			}
		  };
		  
		  // SELECT id, url, digest, totalNutrients FROM recipes a  HAVING id NOT IN (SELECT recipeid FROM nutrients);
		  
		  var fromno = "0";
		  var tono = "500";
		  
		 
		  
		 // var params1 = {"query":"select id, url, digest, totalNutrients  from recipes limit 58000, 4000"};
		 var params1 = {"tablename":"recipes", "query":"SELECT id, url, digest, totalNutrients FROM recipes where s_instructions != ''   HAVING id NOT IN (SELECT recipeid FROM nutrients) limit " + fromno + ", " + tono };
		  
		  console.log(params1);
		  xhttp.open("POST", "https://mealplannerapi-otkcj.ondigitalocean.app/api/common/read_by_query.php", true);
		 
		  xhttp.setRequestHeader("Content-Type", "application/json");

		  xhttp.send(JSON.stringify(params1));	
		//  console.log(JSON.stringify(params));
	
		  
	}
	
	
	

	gotopage(page)
	{
		this.router.navigate([page]);	
	}
}


