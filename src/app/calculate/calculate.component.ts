import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router } from "@angular/router";

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
	constructor(private router: Router) {	
	}
	selectedOption : any;
	ngOnInit() {

	this.optionsList = [];

		this.optionsList.push({ "name":"BMI", "selected":true, "index":"1", "desc":"Body mass Index"});

		this.optionsList.push({ "name":"BMR", "selected":false,  "index":"2", "desc":"Basal metabolic rate "});
console.log(this.optionsList);
this.selectedOption = this.optionsList[0];
		}
	getIndex(index)
	{
		return parseInt(index) +1 ;
	}
	setOption(item)
	{
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
	
	  }

}

	