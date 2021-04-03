import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
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
   
    constructor(private sliderpanelService: SliderpanelService, private el: ElementRef) {
    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    this.dt = {"date":"", "time":""};
    this.meridian = true;
    this.showhideTimeFlag = true;
    }

    loadSliders()
    {
      this.sliderList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/full-slide-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});

      this.sliderList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/full-slide-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});



      this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});





    }

    ngOnInit(): void {
     this.loadSliders();
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
        this.sliderpanelService.remove(this.id);
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
    this.sliderpanelService.add(this);
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
	
		
}