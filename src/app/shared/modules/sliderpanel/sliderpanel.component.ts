import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SliderpanelService } from './sliderpanel.service';

@Component({
  selector: 'app-sliderpanel',
  templateUrl: './sliderpanel.component.html',
  styleUrls: ['./sliderpanel.component.scss']
})
export class SliderpanelComponent implements OnInit, OnDestroy {
	
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
   images: any;

   isMobile: boolean = false;

  

    constructor(config: NgbCarouselConfig, private router: Router, private sliderpanelService: SliderpanelService, private el: ElementRef) {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }
     config.interval = 3000;
   //  config.showNavigationArrows = true;
     config.showNavigationIndicators = true;
     
    
     this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
           // trick the Router into believing it's last link wasn't previously loaded
           this.router.navigated = false;
           // if you need to scroll back to top, here is the right place
           window.scrollTo(0, 0);
        }
    });

    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    this.dt = {"date":"", "time":""};
    this.meridian = true;
    this.showhideTimeFlag = true;
    }

    loadSliders()
    {
      /*
      this.sliderList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/full-slide-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      this.sliderList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/full-slide-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      */

      this.sliderList.push({"title":"More than 50 thousand recipes.", "image":"assets/images/temp-images/full-slide-4.jpg","image_small":"assets/images/temp-images/full-slide-4_small.jpg","rating":"", "description":"With a variety of recipes to choose from and an amazing platform like ours, save time on planning your meal. We equip households to save money at the grocery stores, eat better food, eat together and have a less stressful cooking experience in the kitchen."});
      this.sliderList.push({"title":"Weekly Meal Planner in your pocket!", "image":"assets/images/temp-images/full-slide-4.jpg","image_small":"assets/images/temp-images/full-slide-4_small.jpg","rating":"", "description":"Discover recipes that fit your lifestyle and customized meal plan to accommodate your schedule."});
    //  this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});



    }

    ngOnInit(): void {
   
        // customize default values of carousels used by this component tree
     
       var innerWidth = window.innerWidth;
      console.log("innerWidth " + innerWidth);
      if(innerWidth > 640)
      {
        this.isMobile = false;
      }
      else
      {
        this.isMobile = true;
      }
     this.loadSliders();
   this.elementId= this.element.id;
if(this.showhidetime == false)
this.showhideTimeFlag = false;

//console.log(this.showhidetime);
//console.log(this.showhideTimeFlag);
    
    }

    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.sliderpanelService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('dt-modal-open');

	//	this.returnData.emit(this.dt);
    this.sliderpanelService.add(this);
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
	
  formatImage(image)
  {
    var retImage = image;
    if(image !== "")
    {
      var img = image.split(".");
      retImage = img[0] + "_s" + "." + img[1];

    }

    return retImage;
  }

  gotopage(page){
    this.router.navigate([page]);
  }

}