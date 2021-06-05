import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router } from "@angular/router";
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
@Component({
	selector: 'app-calculate',
	templateUrl: './calculate.component.html',
	styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit {
	optionsList: Array<any> = [];
	height: any ;
	weight: any;
	age:any;
	gender: any;

	bmiValue: any;
	bmrValue: any;
	resultMessage: any = "";
	activity: any;
	inputValue: any;
	currentUser: any;
	constructor(private router: Router, private dbService:DBService, private helpService: HelpService) {	
	}
	selectedOption : any;
	ngOnInit() {
		this.currentUser =this.helpService.getCurrentUser();
		this.inputValue = { "date":"", "weight":"","calories":"", "bloodpressure":""}
    this.inputValue.date = new Date();
	this.optionsList = [];

		this.optionsList.push({ "name":"BMI", "selected":true, "index":"1", "desc":"Body mass Index"});

		this.optionsList.push({ "name":"BMR", "selected":false,  "index":"2", "desc":"Basal metabolic rate "});
		this.optionsList.push({ "name":"Calories Burned", "selected":false,  "index":"3", "desc":"Calories Burned "});

console.log(this.optionsList);
this.selectedOption = this.optionsList[0];

		}
		activitiesList: any; 
  loadActivities()
  {
    this.dbService.getLocalData('assets/data/activities.json').subscribe(
      activities => {
				this.activitiesList = activities["activities"];
        console.log(this.activitiesList);
			});
      
  }

	getIndex(index)
	{
		return parseInt(index) +1 ;
	}
	setOption(item)
	{
		if(item.index == 3)
		{
			this.activity={"type":"", "duration":"60", "weight":"60", "height":"", }
			this.loadActivities();
		}
		this.selectedOption= item;
		for(let i=0; i< this.optionsList.length ; i++)
		{
			if(this.optionsList[i]["name"] !== item["name"])
			this.optionsList[i]['selected'] = false;
		}
		item["selected"] = true;
	}
	formatText(str)
	{
		var retval = "";
		if(str !== "")
		{
			retval = str.substring(1, 50);
		}
		return retval;
	}

	

	calculateBMI() {
		if (this.weight > 0 && this.height > 0) {
		  let finalBmi = this.weight / (this.height / 100 * this.height / 100);
		  this.bmiValue = parseFloat(finalBmi.toFixed(2));
		  this.setBMIMessage();
		  this.inputValue["weight"]  =this.weight;
			this.inputValue["bloodpressure"] =""
			this.inputValue["calories"] = "";
			console.log(this.inputValue);
			this.saveTrackingData();
		}
	  }
	  
	  // setBMIMessage will set the text message based on the value of BMI
	  private setBMIMessage() {
		if (this.bmiValue < 18.5) {
		  this.resultMessage = "Underweight"
		}
	  
		if (this.bmiValue > 18.5 && this.bmiValue < 25) {
		  this.resultMessage = "Normal"
		}
	  
		if (this.bmiValue > 25 && this.bmiValue < 30) {
		  this.resultMessage = "Overweight"
		}
	  
		if (this.bmiValue > 30) {
		  this.resultMessage = "Obese"
		}
	  }
	  
	  calculateBMR()
	  {
		this.bmrValue = 0;
		this.resultMessage = "";
		console.log(this.gender);
		if(this.gender == "male")
		{
		 // formula = 88.362 + (13.397 * weight in kg) + (4.799 x height in cm) - (5.677 x age in years)
		 this.bmrValue = 88.362 + (13.397 * this.weight) + (4.799 * this.height) - (5.677 * this.age)
		}
		if(this.gender == "female")
		{
		  this.bmrValue =  447.593 + (9.247 * this.weight) + (3.098 * this.height) - (4.330 * this.age)
		}
		this.inputValue["weight"]  =this.weight;
		this.inputValue["bloodpressure"] =""
		this.inputValue["calories"] = "";
		console.log(this.inputValue);
		this.saveTrackingData();
	  }

	  CalculateCB()
	  {
		console.log(this.activity);
		var caloriesburned =  this.activity['duration'] * ( this.activity.type * 3.5 *  this.activity.weight)/200;
		console.log(caloriesburned)
		this.inputValue["weight"]  ="";
		this.inputValue["bloodpressure"] =""
		this.inputValue["calories"] = caloriesburned;
		console.log(this.inputValue);
		this.saveTrackingData();
		console.log( this.activity);
	  }
	  saveTrackingData()
	  {
		console.log("in saveTrackingData");
		var params = {};
		params["datetime"] = new Date().toISOString().split('T')[0];
		if(this.inputValue["date"] !== "")
		params["datetime"] = new Date(this.inputValue["date"]).toISOString().split('T')[0];
		params["userid"] = this.currentUser["id"];
	  
		
		var res =   this.dbService.getDataByTable("trackings",params).subscribe(invData => setTimeout(() => 
		{
		 console.log(invData);
		  if(invData !==null && invData["body"]["length"] > 0)
		  {
			params["id"] = invData["body"][0]["id"];
	  
			this.updateTrackingData(params);
		  }
		  else
		  {
			this.createTrackingData(params);
		  }

		}));
	  
	   
	  }


createTrackingData(params)
{
  console.log(params);
  console.log("In createTrackingData")
  if(this.inputValue["weight"] !== "")
  params["weight"] = this.inputValue["weight"];

  if(this.inputValue["bloodpressure"] !== "")
  params["bloodpressure"] = this.inputValue["bloodpressure"];

  if(this.inputValue["calories"] !== "")
  params["calories"] = this.inputValue["calories"];

  console.log(params);
  var res =   this.dbService.postDataByTable("trackings",params).subscribe(invData => setTimeout(() => 
  {
    
    
  }));

}
updateTrackingData(params)
{
  console.log("In updateTrackingData")
  console.log(params);
  if(this.inputValue["weight"] !== "")
  params["weight"] = this.inputValue["weight"];

  if(this.inputValue["bloodpressure"] !== "")
  params["bloodpressure"] = this.inputValue["bloodpressure"];

  if(this.inputValue["calories"] !== "")
  params["calories"] = this.inputValue["calories"];

  params["id"] = params["id"];

  console.log(params);
  var res =   this.dbService.updateDataByTable("trackings",params).subscribe(invData => setTimeout(() => 
  {
    
    
  }));
 
}


}

	