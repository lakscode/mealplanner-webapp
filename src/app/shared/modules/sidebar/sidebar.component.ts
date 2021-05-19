import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { SidebarService } from './sidebar.service';
import { DBService } from './../../../dbservices/db.service';
import { HelpService } from './../../../services/help.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
	recipesList: Array<any> = [];
    @Input() id: string;
    @Input() setDate: any;
    @Input() minDate: any;
    @Input() showhidetime: any = true;
    adsList: Array<any> = [];
    sliderList: Array<any> = [];
     element: any;
     showhideTimeFlag: any;
	
    @Output() returnData: EventEmitter<any> = new EventEmitter();
	
    @Output() closeDT: EventEmitter<any> = new EventEmitter();
    meridian: any;

	 dt : any = {"date":"", "time":""};
   tempDt: any;
   maxDt: any;
   minDt :any;
   tempTm : any;
   elementId : any;
   date: any; 
   
    constructor(private sidebarService: SidebarService,private httpClient: HttpClient, private el: ElementRef, private dbService: DBService, private helpService: HelpService, private router: Router, private route: ActivatedRoute) {
    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    this.dt = {"date":"", "time":""};
    this.meridian = true;
    this.showhideTimeFlag = true;
    }


    ngOnInit(): void {
      this.adsList =[];
      this.getTheAds();
     this.loadRecipes();
   this.elementId= this.element.id;
if(this.showhidetime == false)
this.showhideTimeFlag = false;

//console.log(this.showhidetime);
//console.log(this.showhideTimeFlag);

    var d = new Date();
    if(this.elementId == "interviewDate" || this.elementId == "hearingSchedule"){
      this.tempDt = "";
      this.maxDt=""
      this.minDt = {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()};     
      this.tempTm = {hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds()};
    }
    else if(this.elementId == "incidentDate" || this.elementId == "complaintDate") {
      this.tempDt = "";
      this.maxDt={year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()};
      this.minDt = '';
      this.tempTm = {hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds()};
    }
    else {
      this.maxDt = "";
      this.minDt = '';
      this.tempDt = {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()};
		  this.tempTm = {hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds()};
    }	
    this.dt = {"date":this.tempDt, "time":this.tempTm};
    if(this.minDate == "")
    this.minDate = "";        
    }

    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.sidebarService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('dt-modal-open');

		var d = new Date();
		
		this.tempDt = {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()};
		this.tempTm = {hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds()};
		
		this.dt = {"date":this.tempDt, "time":this.tempTm};
		this.returnData.emit(this.dt);
    this.sidebarService.add(this);
    }

 
    close(): void {

        this.element.style.display = 'none';
        document.body.classList.remove('dt-modal-open');
    }
	
	save()
	{

  if(this.dt.date == null || this.dt.date == "")
  {
    var d = new Date();
		this.tempDt = {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()};
		this.dt["date"] = this.tempDt; //, "time":this.tempTm};
  }

  if(this.dt.time == null || this.dt.time == "")
  {
    var d = new Date();	
    this.tempTm = {hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds()};
		this.dt["time"] = this.tempTm;
  }


    this.returnData.emit(this.dt);

	}	
	
	closeCal()
	{

		this.closeDT.emit(this.dt);
	}	
  loadRecipes()
	{
	  this.recipesList = [];
	  var params = {};
    params["query"] = "select id, image, label, dietLabels from recipes where s_instructions != '' order by rand() limit 8";

	 var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
      this.recipesList = [];
   		for(let i=0; i < invData["body"]["length"] ; i++)
		  {			
			  this.recipesList.push(invData["body"][i]);		
		  }
    //  console.log(this.recipesList);
		}
	 }));
  
	}
  formatLabels(str)
  {
    
    var retStr = str;
    if(str !== "")
    {
      retStr= str.toString().replace(/~/g, ', ');
      retStr = retStr.trim();
    }
  
    return retStr;
  }
  formatImage(image, type)
  {
   // console.log(image);
    var retImage = image;
    if(image !== "" && type !== "")
    {
      retImage = this.helpService.formatImage(image, type);
      
    }
    return retImage;
  }

  gotoRecipeDetails(id){
  this.router.navigate(['recipedetails', id]);
  }

  selectedAd: any;
	getTheAds()
	{
		this.httpClient.get('assets/data/ads.json').subscribe(
			ads => {        
			  if(ads && ads["data"]){
				this.adsList = [];
				this.adsList = ads["data"];
       // console.log(this.adsList);
        if(this.adsList.length > 0)
        {
          const rndInt = Math.floor(Math.random() * this.adsList.length) + 1
          console.log(rndInt)
          if(typeof(this.adsList[rndInt]) !== "undefined" && this.adsList[rndInt] !== null)
          this.selectedAd = this.adsList[rndInt];
          else
          this.selectedAd = this.adsList[0];
        }
			  }
			});  
	}
}