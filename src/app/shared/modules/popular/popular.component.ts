import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { PopularService } from './popular.service';
import { DBService } from '../../../dbservices/db.service';
import { HelpService } from '../../../services/help.service';
 import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.scss']
})
export class PopularComponent implements OnInit, OnDestroy {
	
    @Input() id: string;
    @Input() setDate: any;
    @Input() minDate: any;
    @Input() showhidetime: any = true;

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
   recipesList: Array<any> = [];
    constructor(private popularService: PopularService, private el: ElementRef, private dbService: DBService, private helpService: HelpService, private router: Router, private route: ActivatedRoute) {
    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    this.dt = {"date":"", "time":""};
    this.meridian = true;
    this.showhideTimeFlag = true;
    }

   
    ngOnInit(): void {
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
        this.popularService.remove(this.id);
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
    this.popularService.add(this);
    }

 
    close(): void {

        this.element.style.display = 'none';
        document.body.classList.remove('dt-modal-open');
    }
	
	save()
	{
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
    params["query"] = "select * from recipes where s_instructions != '' order by rand() limit 4";

	 var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
   
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
      this.recipesList = [];
   		for(let i=0; i < invData["body"]["length"] ; i++)
		  {			
			  this.recipesList.push(invData["body"][i]);		
		  }
		}
  //  console.log(this.recipesList);
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

}