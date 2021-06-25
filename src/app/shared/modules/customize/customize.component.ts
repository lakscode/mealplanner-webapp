import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CustomizeService } from './customize.service';
import { data } from "../../../../assets/data/questionnaire";
import { HelpService } from './../../../services/help.service';
import { DBService } from './../../../dbservices/db.service';

@Component({
  selector: 'app-customize',
  templateUrl: './customize.component.html',
  styleUrls: ['./customize.component.scss']
})
export class CustomizeComponent implements OnInit, OnDestroy {
	
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


   mealPlans: Array<any>= [];
  routeParams: any = {};
  sub: any;

  list: any;
  returnpath: any;
  returnparam1: any;
  questions: any =[];
  currentQuestion : any = 0;
  params: any = {};
  processing: boolean = false;
  uniqueid: any = "";
  bgimage: any = "";
    constructor(private router: Router, private dbService: DBService,  private helpService: HelpService, private customizeService: CustomizeService, private el: ElementRef) {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }
     this.bgimage = "assets/bg/diet3.jpg";
   
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
   

    }

    ngOnInit(): void {
      this.processing = false;
        // customize default values of carousels used by this component tree
        this.setDefaults();
    }

    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.customizeService.remove(this.id);
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
		this.customizeService.add(this);
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

  
  /************ questionnaire  */

  currentUser: any ;
  setDefaults()
  {

  	
		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
	
		}
		
this.processing= false;
    this.params = {};
    
    for(let i=1; i < 10; i++)
    {
      this.params["question" + i] ="";
    }
    
				this.questions =data;
      
    console.log(this.questions);
    this.routeParams = {};
    this.returnpath = "";
    this.returnparam1 = "";
    var questionnaireDone =  sessionStorage.getItem("questionnaire");
    
    if(typeof(questionnaireDone) !== "undefined" && questionnaireDone == "true")
    {
        this.router.navigate(["home"]);
    }

   
  // this.loadMealPlans();
  }

  complete()
  {
    this.processing = true;
    console.log("complete");
    console.log(this.params);
    var uniqueid =  localStorage.getItem("uniqueid");

    var params = {};
    params = this.params;
    //uniqueid = "1a15067e-ab63-a2ed-3582-220714793548";
    this.uniqueid = uniqueid;
    if(typeof(uniqueid) !== "undefined" && uniqueid !== null && uniqueid !== "")
    {
      params["user_uniqueid"] = uniqueid;
    }
    else
    {
      var uniqueid = this.helpService.GenerateUniqueId(20);
      params["user_uniqueid"] = uniqueid;
      localStorage.setItem("uniqueid",uniqueid);
    }

    var ipaddress =  localStorage.getItem("ipaddress");
    if(typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== "")
    {
      params["user_ipaddress"] = ipaddress;
    }
    if(this.currentUser !== null && typeof(this.currentUser["id"]) !=="undefined")
		{
      params["userid"] = this.currentUser["id"];
    }
    if((typeof(uniqueid) !== "undefined" && uniqueid !== null && uniqueid !== "") || (typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== ""))
    {
    
     
    //  params["user_uniqueid"] = uniqueid;
      var res =   this.dbService.postDataByTable("questionnaire", params).subscribe(invData => setTimeout(() => {
        this.processing = false;
        console.log(invData);
        localStorage.setItem("q_complete","true");
        localStorage.setItem("questions", JSON.stringify(params));

        this.router.navigate(["pricing"]);

      }));

    }
  }
  setAnswerText(answer)
  {
    var ans =  answer['answer'];
    if(typeof(answer.opt) !=="undefined" && answer.opt !== "")
    {
      ans += " " + answer.opt;
    }
    this.questions[this.currentQuestion]["answer"] =answer['answer'];
    console.log( this.questions[this.currentQuestion]);
    this.params["question" + (this.currentQuestion+1)] = ans;

  }
  setAnswer(answer, type)
  { 
   // console.log(this.currentQuestion);
   // console.log(answer);
   if(type == "checkbox")
   answer["selected"] = !answer["selected"];
    this.questions[this.currentQuestion]["answer"] = answer['text'];

    this.params["question" + (this.currentQuestion+1)] = answer['text'];

    console.log(this.questions);
  }
  toggleChoice(question, opts, index)
	{
		if(opts.length > 0)
		{
			for(let i=0; i < opts.length; i++)
			{
				if(i !== index)
				{
					opts[i].selected = false;
				}
				else
				{
					opts[i].selected = true;
					question["opt"] = opts[i]["name"];
				}
			}
		}
	}
  next()
  {
    
    if(this.currentQuestion < this.questions.length-1)
    {
      console.log(this.params["question" + (this.currentQuestion+1)]);
      if(typeof(this.params["question" + (this.currentQuestion+1)]) !== "undefined" && this.params["question" + (this.currentQuestion+1)] !== "")
      {
      this.currentQuestion++;
      }
    }
  //  console.log(this.questions);
  }

  
  
  getFLU(str)
  {
    var retStr = str;
    if(str !== "")
    retStr = this.helpService.setFirstLetterToUppercase(str);

    return retStr;
  }

}