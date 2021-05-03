import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
import { constants } from '../jsonfiles/constants';
import { environment } from './../../environments/environment';
import { FitBitService } from '../services/fitbit.service';
import * as Highcharts from 'highcharts';

require('highcharts/modules/exporting')(Highcharts);  
@Component({
	selector: 'app-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.scss']

})
export class ProgressComponent implements OnInit {
	Highcharts = Highcharts; // required
	chartConstructor = 'chart'; // optional string, defaults to 'chart'

	bars: any;
	colorArray: any;
	lines: any;
	hrzLines2:any;
	steps: any;
	response: any;
	tracktypes : Array<any>  = [];
	currentUser: any;
	stepsArr : Array<any> = [];
	distanceArr : Array<any> = [];
	caloriesArr : Array<any> = [];
  
	weightArr :any = {};
	bpArr :any = {};
  
	fablistArr : Array<any> = [];
	selectedItem: any = null;
	inputValue: any = {};
	displaycharts : any = [];
	oldDisplayCharts: any ;
	fitbitData: Array<any> = [];
	fitbitChartData : Array<any> = [];
	showPopupMenu: boolean = false;
	activity: any = {};
	showfitbitChart: any = {};
	showhealthChart: any = {};
	diffInMs: any;
	
	constructor(private router: Router, private route: ActivatedRoute, private fitBitService: FitBitService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit()
  {
    this.setDefaults();
  }

  loadFitbitData()
  {
    console.log("loadFitbitData");
    this.fitbitData= [];
    this.fitbitChartData= [];
     
    var params = {};

  params["userid"] = this.currentUser["id"]
  params["vendor"] = "fitbit";
  console.log(params);
  var access = {};

  var res =   this.dbService.getDataByTable("userinfo",params).subscribe(invData => setTimeout(() => 
  { 
    console.log("display userinfo");
    console.log(invData);
    if(invData && invData["body"] && invData["body"]["length"] > 0)
    {
      for(let i=0; i < invData["body"]["length"]; i++)
      {
        if(invData["body"][i]["type"] == "access_token")
        {

          access["access_token"] = invData["body"][i]["value"];
        }

        if(invData["body"][i]["type"] == "user_id")
        {

          access["user_id"] = invData["body"][i]["value"];
        }
      }
      console.log("access ");
      console.log(access);
    //  this.fitBitService.loadFitBitDatacalories(access);

    //  this.fitBitService.loadFitBitData(access);

    //  this.fitBitService.loadFitBitDatadistance(access);

      setTimeout(() => 
      {
         this.getFitBitData();
      }, 2000);
    }
    
    
  }));

  }
  

  toggleMore()
  {
  
    if(this.showPopupMenu)
      {

        console.log( this.oldDisplayCharts);
        console.log( this.displaycharts);
        var change = false;
        for(var key in this.displaycharts)
        {
            if(this.displaycharts[key]['display'] !== this.oldDisplayCharts[key]['display'])
            {
              change= true;
            }
        }
        if(change)
        {
          this.setDisplayCharts()
        }
      }
      else
      {
        this.oldDisplayCharts = JSON.parse(JSON.stringify(this.displaycharts));
      }

    this.showPopupMenu = !this.showPopupMenu;
  }
  setDisplayCharts()
  {
    console.log(this.displaycharts);
  
    localStorage.setItem("displaycharts", JSON.stringify(this.displaycharts));
    this.loadChartData();
    this.loadWeightChart();
  }
 
  loadChartsmenu()
  {
    console.log("loadChartsmenu");
    this.displaycharts ={};

    this.displaycharts["steps"] = {"id":1, "name":"steps", "display":true};
    this.displaycharts["caloriesburned"] = {"id":2, "name":"caloriesburned", "display":true};
    this.displaycharts["distance"] = {"id":3, "name":"distance", "display":true};
    this.displaycharts["bloodpressure"] = {"id":4, "name":"bloodpressure", "display":true};
    this.displaycharts["weight"] = {"id":5, "name":"weight", "display":true};

    console.log(this.displaycharts);

    var temp =  localStorage.getItem("displaycharts");
    if(temp !== "")
    {
      console.log(temp);
      var t = JSON.parse(temp);
      if(typeof(t) !== "undefined" && t !== null)
      {
        for(var key in t)
        {
            this.displaycharts[key]['display'] = t[key]['display'];
        }
      }   
    }
    console.log(this.displaycharts);
    this.showhealthChart["steps"] = false;
    this.showhealthChart["calories"] = false;
    this.showhealthChart["distance"] = false;
    this.showhealthChart["weight"] = false;
    this.showhealthChart["bloodpressure"] = false;

    this.loadChartData();
    this.loadWeightChart();
  }
  loadDataMenu()
  {
    this.fablistArr=[];
    this.fablistArr.push({"type":"weight", "label":"Add Weight", "icon":"barbell-outline"});
    this.fablistArr.push({"type":"calories", "label":"Add Calories", "icon":"fast-food-outline"});
    //this.fablistArr.push({"type":"bloodpressure", "label":"Add Blood Pressure", "icon":"fitness-outline"});
    this.fablistArr.push({"type":"bloodpressure", "label":"Add Blood Pressure", "icon":"pulse"});
   // this.fablistArr.push({"type":"activity", "label":"Add Activity", "icon":"bicycle"});
  }
  setDefaults()
  {
    console.log(this.displaycharts);
  //  this.showfitbitChart = {"steps":true, "distance":true, "calories":true}
    this.showfitbitChart["steps"] = false;
    this.showfitbitChart["calories"] = false;
    this.showfitbitChart["distance"] = false;

    this.activity={"type":"", "duration":"60", "weight":"60", "height":"", }
 	this.showPopupMenu = false;
   	this.loadDataMenu();
    this.inputValue = { "date":"", "weight":"","calories":"", "bloodpressure":""}
    this.inputValue.date = new Date();
  
    this.currentUser =this.helpService.getCurrentUser();
    if(this.currentUser !== null)
    {
      if( this.currentUser["firstname"] !== "")
      this.currentUser["displayname"]  = this.currentUser["firstname"];
      else if( this.currentUser["username"] !== "")
      this.currentUser["displayname"]  = this.currentUser["username"];
      console.log(this.currentUser);
    }
    this.loadFitbitData();
    this.loadChartsmenu();
  //  this.tracktypes = constants.tracktypes;
    this.colorArray = constants.colorslist[7]; //colors;
    console.log(this.colorArray);
 
	this.response= "";
  
   

  }



loadChartData()
{
  console.log("loadChartData");
  this.stepsArr = [];
  this.distanceArr = [];
  this.caloriesArr = [];
  var params = {};

 
  //params["userid"] = this.currentUser["id"];
  //params["vendor"] = "health";
  var stepsChart = {"labels":[], "data":[], "unit":""};;
  var caloriesChart = {"labels":[], "data":[], "unit":""};;
  var distancechart = {"labels":[], "data":[], "unit":""};;

  console.log(params);

 
  var date = new Date();
date.setDate(date.getDate() -15);

var month = (date.getMonth()+1);
var monthv= month.toString();
if(month < 10)
monthv = "0" + month;

var dat1 =  date.getDate();
var dat1v= dat1.toString();
if(dat1 < 10)
dat1v = "0" + dat1;


var finalDate = date.getFullYear() + "-" + monthv + "-" + dat1v;
console.log(finalDate);
  params["query"] = "select * from workouts where userid = '" + this.currentUser["id"] + "' AND vendor = 'health' AND DATE(starttime)  > '" + finalDate + "'";

  console.log( params["query"]);
  var res =   this.dbService.getDatabyTablebyQuery("workouts",params).subscribe(invData => setTimeout(() => 
  {


    console.log(invData);
    stepsChart = {"labels":[], "data":[], "unit":""};
    caloriesChart = {"labels":[], "data":[], "unit":""};
    distancechart = {"labels":[], "data":[], "unit":""};

    
    if(invData !==null && invData["body"]["length"] > 0)
    {
    
      stepsChart["labels"]= []; stepsChart["data"]= [];

      caloriesChart["labels"]= []; caloriesChart["data"]= [];

      distancechart["labels"]= []; distancechart["data"]= [];
      var dArr = invData["body"].sort(this.sortArray);
      for(let i=0; i < dArr['length']; i++)
      {
        var datetext = dArr[i]['starttime'];
        datetext =datetext.substr(0, 10);
       // console.log(datetext);
        
        if(dArr[i]["type"] == 1)
        {
          var dlIndex1 = stepsChart["labels"].findIndex(x => (x == datetext));
          if(dlIndex1 == -1)
          {
          this.stepsArr.push(dArr[i]);
          stepsChart["labels"].push(datetext);
          stepsChart["data"].push(parseInt(dArr[i]["measure"]));
          stepsChart["unit"] = dArr[i]["unit"];
          }
          else if(dArr[i]["measure"] >  stepsChart["data"][dlIndex1]["measure"] )
          {
            stepsChart["data"][dlIndex1]["measure"] = parseInt(dArr[i]["measure"]);
          }
        }

        if(dArr[i]["type"] == 2)
        {
          var dlIndex = caloriesChart["labels"].findIndex(x => (x == datetext));
          if(dlIndex == -1)
          {
          this.distanceArr.push(dArr[i]);
          caloriesChart["labels"].push(datetext);
          caloriesChart["data"].push(parseInt(dArr[i]["measure"]));
          caloriesChart["unit"] = dArr[i]["unit"];
          }
          else if(dArr[i]["measure"] >  caloriesChart["data"][dlIndex]["measure"] )
          {
            caloriesChart["data"][dlIndex]["measure"] = parseInt(dArr[i]["measure"]);
          }
        }

        if(dArr[i]["type"] == 3)
        {
          var lIndex = distancechart["labels"].findIndex(x => (x == datetext));
          if(lIndex == -1)
          {
          this.caloriesArr.push(dArr[i]);
          distancechart["labels"].push(datetext);
          distancechart["data"].push(parseInt(dArr[i]["measure"])); // * 0.001).toFixed(1));
          distancechart["unit"] = dArr[i]["unit"];
          }
          else if(dArr[i]["measure"] >  distancechart["data"][lIndex]["measure"] )
          {
            distancechart["data"][lIndex]["measure"] = parseInt(dArr[i]["measure"]);
          }
        }

      }
    }
    

   
    var stepschartFlag = true;
    if(typeof(this.displaycharts["steps"]) !== "undefined" && this.displaycharts["steps"] !== null)
    {
      if(typeof(this.displaycharts["steps"]["display"]) !== "undefined" && this.displaycharts["steps"]["display"] !== null)
      {
        stepschartFlag = this.displaycharts["steps"]["display"];
      }
    }
    if(stepschartFlag)
    {
    if(stepsChart["data"]["length"] > 0)
    {
      this.showhealthChart["steps"] = true;
  //  this.createBarChart(stepsChart);
	this.createStepsChart("Steps", stepsChart["labels"],stepsChart["data"])
    }
    }
    
    var calschartFlag = true;
    if(typeof(this.displaycharts["caloriesburned"]) !== "undefined" && this.displaycharts["caloriesburned"] !== null)
    {
     // console.log(this.displaycharts["caloriesburned"]);
      if(typeof(this.displaycharts["caloriesburned"]["display"]) !== "undefined" && this.displaycharts["caloriesburned"]["display"] !== null)
      {
        calschartFlag = this.displaycharts["caloriesburned"]["display"];
      }
    }
  //  console.log("calschartFlag  " + calschartFlag);
    if(calschartFlag)
    {
    if(caloriesChart["data"]["length"] > 0)
    {
      this.showhealthChart["calories"] = true;
   // this.createSimpleLineChart(caloriesChart);
	this.createCaloriesChart("calories", caloriesChart["labels"],caloriesChart["data"])
    }
    }
    
    var distchartFlag = true;
    if(typeof(this.displaycharts["distance"]) !== "undefined" && this.displaycharts["distance"] !== null)
    {
      if(typeof(this.displaycharts["distance"]["display"]) !== "undefined" && this.displaycharts["distance"]["display"] !== null)
      {
        distchartFlag = this.displaycharts["distance"]["display"];
      }
    }

    if(distchartFlag)
    {
    if(distancechart["data"]["length"] > 0)
    {
      this.showhealthChart["distance"] = true;
    //this.createGroupLineChart(linechart2);
	this.createDistanceChart("distance", distancechart["labels"],distancechart["data"])
    }
    }

    console.log(stepsChart);
    console.log(caloriesChart);
    console.log(distancechart);
  }));

  
  
}

loadWeightChart()
{
  var params = {};
  params["userid"] = this.currentUser["id"];

 

  var res =   this.dbService.getDataByTable("trackings",params).subscribe(invData => setTimeout(() => 
  {
    
    this.weightArr  = {"labels":[], "data":[]};
    this.bpArr = {"labels":[], "dataS":[], "dataD":[]};
    if(invData !==null && invData["body"]["length"] > 0)
    {
      console.log(invData);
      var tArr = invData["body"].sort(this.sortArray);
      for(let i=0; i < tArr['length']; i++)
      {
        console.log(tArr[i]);
        this.weightArr["labels"].push(tArr[i]["datetime"]);
        this.weightArr["data"].push(tArr[i]["weight"]);
        if(tArr[i]["weight"] !== "")
        this.showhealthChart["weight"] = true;

        this.bpArr["labels"].push(tArr[i]["datetime"]);
        if(tArr[i]["bloodpressure"] !== "")
        {
          var temp = tArr[i]["bloodpressure"].split("/");
          if(temp.length == 2)
          {
            this.showhealthChart["bloodpressure"] = true;
            this.bpArr["dataS"].push(temp[0].trim());
            this.bpArr["dataD"].push(temp[1].trim());
          }
          else
          {
            this.bpArr["dataS"].push("0");
            this.bpArr["dataD"].push("0");
          }       
        }
        else
        {
          this.bpArr["dataS"].push("0");
          this.bpArr["dataD"].push("0");
        }
        

      }
      this.createExtraCharts();
    }
  }));

}
sortArray(a, b) {
  return new Date(a.starttime).getTime() - new Date(b.starttime).getTime();
}

  createExtraCharts()
  {
  //  this.showhealthChart["weight"] = false;
  //  this.showhealthChart["bloodpressure"] = false;

    console.log(this.weightArr);
    console.log(this.bpArr);

    
    console.log(this.showhealthChart);
    var weightchart = true;
    if(typeof(this.displaycharts["weight"]) !== "undefined" && this.displaycharts["weight"] !== null)
    {
      if(typeof(this.displaycharts["weight"]["display"]) !== "undefined" && this.displaycharts["weight"]["display"] !== null)
      {
        weightchart = this.displaycharts["weight"]["display"];
      }
    }
    if(weightchart)
    {
     
   

    var bpchart = true;
    if(typeof(this.displaycharts["bloodpressure"]) !== "undefined" && this.displaycharts["bloodpressure"] !== null)
    {
      if(typeof(this.displaycharts["bloodpressure"]["display"]) !== "undefined" && this.displaycharts["bloodpressure"]["display"] !== null)
      {
        bpchart = this.displaycharts["bloodpressure"]["display"];
      }
    }
    if(bpchart)
    {
    
  }
  }
}
  createBarChart(stepsChart) {

  
  }

  createSimpleLineChart(caloriesChart) {
  
  }

  createGroupLineChart(linechart2) {
  
  }
  gotopage(page)
  {
   
    this.router.navigate([page]);
  }
  showPopup(item)
  {
    console.log("Show Popup");
  
    this.selectedItem = item;
    if(this.selectedItem["type"] == "calories")
    {
      this.loadActivities();
    }
    console.log(this.selectedItem);
    var obj = document.getElementById("popupPanel");
    if(obj !== null)
    {
      obj.style.display = "block";
    }
  }

  closePopup()
  {
    var obj = document.getElementById("popupPanel");
    if(obj !== null)
    {
      obj.style.display = "none";
    }
  }

  setValues()
  {
    console.log("setValues");
    if(this.selectedItem["type"] == "calories")
    {
      if(this.inputValue['calories'] =="" && this.activity.type !== "")
      {
        this.CalculateCB();
      }
    }
 
   
  }
  changeInfo()
  {
    console.log("changeInfo");
  }






  getFitBitData()
{
 console.log("getFitBitData");
  this.stepsArr = [];
  this.distanceArr = [];
  this.caloriesArr = [];
  var params = {};

 
  params["userid"] = this.currentUser["id"];
  params["vendor"] = "fitbit";
  var stepsChart = {"labels":[], "data":[], "unit":""};;
  var linechart1 = {"labels":[], "data":[], "unit":""};;
  var linechart2 = {"labels":[], "data":[], "unit":""};;

  var res =   this.dbService.getDataByTable("workouts",params).subscribe(invData => setTimeout(() => 
  {
   
    stepsChart = {"labels":[], "data":[], "unit":""};;
    linechart1 = {"labels":[], "data":[], "unit":""};;
    linechart2 = {"labels":[], "data":[], "unit":""};;

    
    if(invData !==null && invData["body"]["length"] > 0)
    {
    //  console.log(invData);
      stepsChart["labels"]= []; stepsChart["data"]= [];

      linechart1["labels"]= []; linechart1["data"]= [];

      linechart2["labels"]= []; linechart2["data"]= [];
      var dArr = invData["body"].sort(this.sortArray);
      for(let i=0; i < dArr['length']; i++)
      {
      //console.log(dArr[i]);
        var datetext = dArr[i]['starttime'];
        datetext =datetext.substr(0, 10);
       // console.log(datetext);
       var today = new Date();
       var startTime  = new Date(dArr[i]['starttime']);

       var total_days = (today.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24);
    //   console.log(datetext + " - " + total_days);
       if(total_days < 16)
       {
        if(dArr[i]["type"] == "1")
        {
          this.stepsArr.push(dArr[i]);
          stepsChart["labels"].push(datetext);
          stepsChart["data"].push(dArr[i]["measure"]);
          stepsChart["unit"] = dArr[i]["unit"];
        }

        if(dArr[i]["type"] == "2")
        {
          this.distanceArr.push(dArr[i]);
          linechart1["labels"].push(datetext);
          linechart1["data"].push(dArr[i]["measure"]);
          linechart1["unit"] = dArr[i]["unit"];
        }

        if(dArr[i]["type"] == "3")
        {
          this.caloriesArr.push(dArr[i]);
          linechart2["labels"].push(datetext);
          linechart2["data"].push((dArr[i]["measure"] * 0.001).toFixed(1));
          linechart2["unit"] = dArr[i]["unit"];
        }
      }

      }
    }
  
    this.showfitbitChart["steps"] = false;

    this.showfitbitChart["calories"] = false;

    this.showfitbitChart["distance"] = false;
 
    if(stepsChart["data"]["length"] > 0)
    {
    
      this.showfitbitChart["steps"] = true;
      this.createFBarChart(stepsChart);
    }
  
    
    if(linechart1["data"]["length"] > 0)
    {
      this.showfitbitChart["distance"] = true;
      this.createFSimpleLineChart(linechart1);
    }
   
    
  
    if(linechart2["data"]["length"] > 0)
    {
      this.showfitbitChart["calories"] = true;
    this.createFGroupLineChart(linechart2);
    }


  //  console.log(stepsChart);
  //  console.log(linechart1);
  //  console.log(linechart2);
  }));

  
  
}


createFBarChart(stepsChart) {

}

createFSimpleLineChart(caloriesChart) {
  
}

createFGroupLineChart(linechart2) {
  
}
chartOptionsLine: any;

chartOptionsSteps: any;
createStepsChart(chartname, labels, data)
{
	console.log("chart name " + chartname);
	console.log(labels);
	console.log(data);
	
	this.chartOptionsSteps = {   
		chart: {
		   type: "spline"
		},
		title: {
		   text: "Daily " + chartname
		},
		subtitle: {
		   text: ""
		},
		legend: {
			align: 'right',
			verticalAlign: 'middle',
			layout: 'vertical'
		},
		xAxis:{
		   categories:labels
		},
		yAxis: {          
		   title:{
			  text:"No. of Steps"
		   } 
		},
		tooltip: {
		   valueSuffix:" "
		},
		series: [
		   {
			  name: 'Steps',
			  data: data
		   }
		]
	 }; 
	 console.log(this.chartOptionsLine);
}

chartOptionsCalories: any;
createCaloriesChart(chartname, labels, data)
{
	console.log("chart name " + chartname);
	console.log(labels);
	console.log(data);
	
	this.chartOptionsCalories = {   
		chart: {
		   type: "spline"
		},
		title: {
		   text: "Daily " + chartname
		},
		subtitle: {
		   text: ""
		},
		legend: {
			align: 'right',
			verticalAlign: 'middle',
			layout: 'vertical'
		},
		xAxis:{
		   categories:labels
		},
		yAxis: {          
		   title:{
			  text:"No. of calories"
		   } 
		},
		tooltip: {
		   valueSuffix:" Kcal"
		},
		series: [
		   {
			  name: 'Calories',
			  data: data
		   }
		]
	 }; 

	 console.log(this.chartOptionsCalories);
}


chartOptionsDistance: any;
createDistanceChart(chartname, labels, data)
{
	console.log("chart name " + chartname);
	console.log(labels);
	console.log(data);
	
	this.chartOptionsDistance = {   
		chart: {
		   type: "spline"
		},
		title: {
		   text: "Daily " + chartname
		},
		subtitle: {
		   text: ""
		},
		legend: {
			align: 'right',
			verticalAlign: 'middle',
			layout: 'vertical'
		},
		xAxis:{
		   categories:labels
		},
		yAxis: {          
		   title:{
			  text:"In kms"
		   } 
		},
		tooltip: {
		   valueSuffix:" km"
		},
		series: [
		   {
			  name: 'Distance',
			  data: data
		   }
		]
	 }; 

	 console.log(this.chartOptionsDistance);
}

/*********88 additional functions */

activitiesList: any; 
  loadActivities()
  {
    this.dbService.getLocalData('assets/data/activities.json').subscribe(
      activities => {
				this.activitiesList = activities["activities"];
        console.log(this.activitiesList);
			});
      
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
   // this.saveTrackingData();
    console.log( this.activity);
  }
}


	