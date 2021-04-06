import { Component,  ElementRef, ViewChild, Input, Output, OnInit, OnDestroy,  EventEmitter, AfterViewChecked,AfterViewInit  } from '@angular/core';
import { TabspanelService } from './tabspanel.service';
import { HelpService } from '../../../services/help.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../../dbservices/db.service';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-tabspanel',
  templateUrl: './tabspanel.component.html',
  styleUrls: ['./tabspanel.component.scss']
})
export class TabspanelComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit   {
  
    @Input() item: any;
    @Input() id: string;
    @Input() setDate: any;
    @Input() minDate: any;
    @Input() showhidetime: any = true;
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
   curDate : any;
   curTime: any;
   startdate: any;

   selecteduser : any;
   currentUser: any;
   selectedMsg: any;

   recipesList1 :Array<any> = [];
   recipesList2 :Array<any> = [];
   recipesList3 :Array<any> = [];
   recipesList: Array<any> = [];
   ratingIds: any;
   selectedTab: any;
    constructor(private tabspanelService: TabspanelService, private spinner: NgxSpinnerService, private router: Router, private route: ActivatedRoute, private userService: UserService, private el: ElementRef, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService, private toastrservice: ToastrService) {
    
      this.element = el.nativeElement;
 
      this.id = "";
      this.dt = {"date":"", "time":""};
   
    }
    ngOnChanges() {
    //  this.LoadData();
    }

      
  
    ngAfterViewChecked() {
      // Called every time the view changes        
   
    } 

    ngAfterViewInit() {
        // Only called ONCE => upon initialization
   
    }
   

    ngOnInit(): void {   
      this.LoadData();   
    }

    LoadData()
    {
      this.selectedTab = 1;
      console.log("Show spinner");
    //  this.spinner.show();
      this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
        if(typeof(userdata) !=="undefined" && userdata !== null)
        {
        if(typeof(userdata['loggedIn']) !=="undefined")
        {   if(userdata['loggedIn'] == true)
          {
                    this.currentUser = userdata;
                }
              
        }
        else 
        {
          this.currentUser = userdata;
            }
          }
         
         if(typeof(this.currentUser) !== "undefined" && this.currentUser !== null)
            {
             // this.loadProfileImg();
            //  this.LoadProfileImages()
           
                
                

            }
    
   
        }, 0));
        this.loadRecipes();
    }
 

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.tabspanelService.remove(this.id);
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
    this.tabspanelService.add(this);
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
	  this.recipesList1 = [];
	  this.recipesList2 = [];
    this.recipesList3 = [];
	// this.recipes = recipesList;
	 var params = {"limit": "9"};

	  
	  params["instructions"] = "notempty";
  
	  console.log(JSON.stringify(params));
	 var res =   this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
  
	  console.log(invData);
    this.ratingIds ="";
	  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
		{
      this.recipesList1 = [];
      this.recipesList2 = [];
      this.recipesList3 = [];
      this.recipesList  = [];
		  for(let i=0; i < invData["body"]["length"] ; i++)
		  {
			  if(i < 3)
			this.recipesList1.push(invData["body"][i]);
			else if (i < 6)
			this.recipesList2.push(invData["body"][i]);
      else
      this.recipesList3.push(invData["body"][i]);
      this.ratingIds += invData["body"][i]["id"] + ",";
		
		  }
		  console.log(this.recipesList1);
		  console.log(this.recipesList2);
		  console.log(this.recipesList3);
      this.recipesList = this.recipesList1;
      this.loadRatings();
		}
  //  this.spinner.hide();
	  }));
  
	}
  setData(index)
  {
    this.selectedTab = index;
    switch(index)
    {
      case 1: this.recipesList = this.recipesList1; break;
      case 2: this.recipesList = this.recipesList2; break;
      case 3: this.recipesList = this.recipesList3; break;
      default: this.recipesList = this.recipesList1; break;
    }
    
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
		
				for(let i=0; i< temp["length"] ; i++)
				{
				 
				  console.log(temp[i]);
				  var recIndex = this.recipesList1.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				  console.log(recIndex);
				  if(recIndex > -1)
				  {
					this.recipesList1[recIndex]["totalcount"] = temp[i]["totalcount"];
					this.recipesList1[recIndex]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList1[recIndex]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));
					 }
           if(this.recipesList1[recIndex]["displayrating"] == "" ||this.recipesList1[recIndex]["displayrating"] == 0)
            this.recipesList1[recIndex]["displayrating"] = 3;
				  }
  
				  var rec1Index = this.recipesList2.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				  console.log(rec1Index);
				  if(rec1Index > -1)
				  {
					this.recipesList2[rec1Index]["totalcount"] = temp[i]["totalcount"];
					this.recipesList2[rec1Index]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList2[rec1Index]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));

            if(this.recipesList2[rec1Index]["displayrating"] == "" ||this.recipesList2[rec1Index]["displayrating"] == 0)
            this.recipesList2[rec1Index]["displayrating"] = 3;
					 }
  
				  }

          var rec3Index = this.recipesList3.findIndex(x3 => (x3.id === temp[i]["recipeid"]));
				  console.log(rec1Index);
				  if(rec3Index > -1)
				  {
					this.recipesList3[rec3Index]["totalcount"] = temp[i]["totalcount"];
					this.recipesList3[rec3Index]["totalrating"] = temp[i]["totalrating"];
  
					if( temp[i]["totalrating"] > 0 &&  temp[i]["totalcount"] > 0 )
					{
					  this.recipesList3[rec3Index]["displayrating"] = Math.ceil((temp[i]["totalrating"]/ temp[i]["totalcount"]));

            if(this.recipesList3[rec3Index]["displayrating"] == "" ||this.recipesList3[rec3Index]["displayrating"] == 0)
            this.recipesList3[rec3Index]["displayrating"] = 3;
					 }
  
				  }

  
				}
		
				console.log(  this.recipesList2);
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
}