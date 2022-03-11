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
	contentList: Array<any> = [];
    @Input() id: string;
    @Input() type: any = "recipes";
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
      console.log("tyoe " + this.type);
      if(typeof(this.type) == "undefined" || this.type == null || this.type == "" || this.type == "recipes")
      {
        this.loadRecipes();
      }
    else if(this.type == 'groups')
    {
      this.loadGroups();
    }
   this.elementId= this.element.id;
      
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

	
		this.returnData.emit(this.dt);
    this.sidebarService.add(this);
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
	  this.contentList = [];
	  var params = {};
    params["query"] = "select id, image, label, dietLabels from recipes where status = 1 AND s_instructions != '' order by rand() limit 8";

	 var res =   this.dbService.getDatabyTablebyQuery("common", params).subscribe(invData => setTimeout(() => {
   
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
      this.contentList = [];
   		for(let i=0; i < invData["body"]["length"] ; i++)
		  {			
			  this.contentList.push(invData["body"][i]);		
		  }
    //  console.log(this.recipesList);
		}
	 }));
  
	}
  loadGroups()
  {
    this.contentList = [];
	  var params = {};
    params["query"] = "SELECT c.*, COUNT(rm.id) AS userscount, u.email, u.firstname, u.lastname FROM groups AS c LEFT JOIN group_join AS rm ON c.id = rm.groupid LEFT JOIN users AS u ON c.created_by = u.id GROUP BY c.id order by rand() limit 8";

	 var res =   this.dbService.getDatabyTablebyQuery("groups", params).subscribe(invData => setTimeout(() => {
   console.log(invData);
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
      this.contentList = [];
   		for(let i=0; i < invData["body"]["length"] ; i++)
		  {			
			  this.contentList.push(invData["body"][i]);		
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

  gotopage(page, id){
  this.router.navigate([page, id]);
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