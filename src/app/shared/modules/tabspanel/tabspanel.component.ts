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

   destUser: any;
   newMessage: any;
   usersList: any;
   subscribeUsersService: any;
   messagetext: any;
   chatData: Array<any> = [];
   selectedItem: any;
   replymessage: any;
   profileimage: any;
   profileimageTo: any;
   profileimageFrom: any;
   msgid  : any = "0";
   userMessage = {"id":"", "message":"", "details":"", "items":[],"source":"", "createdat":"", "username":""}
   createConcernArr : Array<any>=[];
createReportStep:any = 0;
   @ViewChild('scrollMe', null) private myScrollContainer: ElementRef;
    constructor(private tabspanelService: TabspanelService, private router: Router, private route: ActivatedRoute, private userService: UserService, private el: ElementRef, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService, private toastrservice: ToastrService) {
      this.replymessage = "";
      this.msgid = "0";
      this.element = el.nativeElement;
      this.profileimage = "assets/user-icon.png";
      this.profileimageFrom = "assets/user-icon.png";
      this.profileimageTo = "assets/user-icon.png";
      this.id = "";
      this.dt = {"date":"", "time":""};
      this.meridian = true;
      this.showhideTimeFlag = true;
      this.createConcernArr = [];
      this.createReportStep = 0;
      this.createConcernArr.push({"id":1, "question":"Please let me know your firstname", "answer":""});
      this.createConcernArr.push({"id":2, "question":"Please let me know your lastname", "answer":""});
      this.createConcernArr.push({"id":3, "question":"Please let me know your email", "answer":""});
      this.createConcernArr.push({"id":4, "question":"Please let me know your location", "answer":""});  
      this.createConcernArr.push({"id":5, "question":"Where did the incident happened?", "answer":""});  
      this.createConcernArr.push({"id":6, "question":"When did the incident happened? (Ex: mm/dd/yyyy)", "answer":""});   
      this.createConcernArr.push({"id":7, "question":"Can you please explain the incident.", "answer":""});   
      this.createConcernArr.push({"id":8, "question":"Who is the Respondent?", "answer":""});   
      this.createConcernArr.push({"id":9, "question":"What is the Respondent's email?", "answer":""});   

    }
    ngOnChanges() {
    //  this.LoadData();
    }

      
  
    ngAfterViewChecked() {
      // Called every time the view changes        
      this.scrollToBottom();        
    } 

    ngAfterViewInit() {
        // Only called ONCE => upon initialization
        this.scrollToBottom();
    }
   

    ngOnInit(): void {   
      this.LoadData();   
    }

    LoadData()
    {

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
        this.showmessages();
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
	
    
  comp(a, b) {
	return new Date(a.createdat).getTime() - new Date(b.createdat).getTime();
}

  
showmessages()
{

this.msgid = (parseInt(this.msgid) + 1).toString();
this.userMessage = {"id":this.msgid, "message":"Hi, I am Rang Realtors Help!", "details":"Welcome to Rang Realtors. How I can help you?", "items":[], "source":"bot", "createdat":"", "username":"Guest User"};
this.chatData.push(this.userMessage);

var tempItems = [];
tempItems.push({"item":"Login", "link":"login"});
tempItems.push({"item":"Reset Password", "link":"resetpass"});
tempItems.push({"item":"Request Quotation", "link":"createcase"});
tempItems.push({"item":"View Status", "link":"viewcases"});
tempItems.push({"item":"Reports", "link":"reports"});
tempItems.push({"item":"Create Report", "link":"createreport"});
tempItems = [];
this.msgid = (parseInt(this.msgid) + 1).toString();
this.userMessage = {"id":this.msgid, "message":"Also, I can help you with things like:", "details":"", "items":tempItems, "source":"bot", "createdat":"", "username":"Guest User"};
this.chatData.push(this.userMessage);


//  this.userMessage = {"id":"3", "message":"message 1", "details":"", "items":[], "source":"user", "createdat":"", "username":"Anna"};
 // this.chatData.push(this.userMessage);

 


}
menuitemopt(menuitem)
{
  
  this.msgid = (parseInt(this.msgid) + 1).toString();
  if(this.chatData["length"] > 0)
  {
    var len = this.chatData["length"];
    var temp = this.chatData[len-1];

    this.msgid =  (parseInt(temp["id"]) + 1).toString();
  }
  var tempItems = [];
  
  if(menuitem.link == "login")
  {
    tempItems.push({"item":"Login Now", "link":"loginnow", "details":"please click link to login"});
  }

  if(menuitem.link == "createcase")
  {
    tempItems.push({"item":"Create Case", "link":"createcase1"});
    tempItems.push({"item":"Dashboard", "link":"dashboard"});
    tempItems.push({"item":"Attach Files", "link":"Attachfiles"});

  }
  if(menuitem.link == "createreport")
  {
    this.createreport();
  }
  if(tempItems.length >0)
  {
  this.userMessage = {"id":this.msgid, "message":"Please select option: ", "details":"", "items":tempItems, "source":"bot", "createdat":"", "username":"Guest User"};
  this.chatData.push(this.userMessage);
  }

  // this.scrolltoBotto1();
  this.scrollToBottom();
  //this.chatreply();

}
onSubmit(form)
{
 // console.log(this.replymessage);
  if(this.replymessage !== "")
  {
    this.chatreply();
  }
}
createreport()
{
//  console.log(this.createReportStep);
//  console.log(this.createConcernArr);
  
 if(this.createReportStep < this.createConcernArr.length)
 {
  var tempItems = [];
  if(typeof(this.createConcernArr[this.createReportStep]) !== "undefined" && this.createConcernArr[this.createReportStep] !== null)
  {
    if(typeof(this.createConcernArr[this.createReportStep]["question"]) !== "undefined")
    {
      tempItems.push({"item":this.createConcernArr[this.createReportStep]["question"], "link":"loginnow", "details":"please click link to login"});
    }
  }

  if(tempItems.length >0)
  {
    var userMessage1 = {"id":this.msgid, "message":"", "details":"", "items":tempItems, "source":"bot", "createdat":"", "username":"Guest User", "parent":"createreport"};
    this.chatData.push(userMessage1);
  }

  this.createReportStep++;
}
else
{
  var tempItems = [];
 // console.log("in else");
    
 // if(tempItems.length >0)
 // {
    var userMessage1 = {"id":this.msgid, "message":"Thank you for contacting us. We shall get back to you soon. Have a good day.", "details":"", "items":tempItems, "source":"bot", "createdat":"", "username":"Guest User", "parent":""};
    this.chatData.push(userMessage1);
    this.createReportStep = 0;
 // }

}
}
scrollToBottom(): void {
  // console.log("In scrollToBottom");
     try {
         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
         
     } catch(err) { }                 
 }


scrolltoBotto1()
{
 /// console.log("scrolltoBotto1");
  setTimeout(() => {  
    var obj =  document.getElementById('scrollMe');
    obj.scrollTop = 9999999;
    console.log(obj.clientHeight);
    console.log(obj);
  }, 1000);
}
chatreply()
{
  console.log(this.chatData);
  if(this.replymessage !== "")
  {
    if(this.chatData["length"] > 0)
    {
      var len = this.chatData["length"];
      var temp = this.chatData[len-1];

      this.msgid =  (parseInt(this.msgid) + 1).toString();
    }

    this.userMessage = {"id":this.msgid, "message":this.replymessage , "details":"", "items":[], "source":"user", "createdat":"", "username":"Guest User"};
    this.chatData.push(this.userMessage);
    
    var msg = this.replymessage.toLowerCase();

    var flagreport = 0;
    if(this.chatData.length>0)
    {
      if(typeof(this.createConcernArr[this.createReportStep-1]) !== "undefined")
      {
        if(typeof(this.createConcernArr[this.createReportStep-1]["answer"]) !== "undefined")
        {
          this.createConcernArr[this.createReportStep-1]["answer"] = this.replymessage;
          if(this.chatData.length> 2)
          var te = this.chatData[this.chatData.length -2]
          if(te["parent"]== "createreport")
          {
            this.createreport();
            flagreport = 1;
          }
        }
      }
    }
    
    if(flagreport == 0)
    {
      if(msg.indexOf("hi") !== -1 || msg.indexOf("hello") !== -1)
      {
        this.showmessages();
      }
      else if(msg.indexOf("bye") !== -1 || msg.indexOf("thanks") !== -1)
      {
        var exitMessage  = "Thank you for using Rang Realtors Chatbot. Hope it was useful. Have a good day.";
        this.msgid =  (parseInt(this.msgid) + 1).toString();
        this.userMessage = {"id":this.msgid, "message":exitMessage , "details":"", "items":[], "source":"bot", "createdat":"", "username":"Bot"};
        this.chatData.push(this.userMessage);
      }
      else
      {
        var exitMessage  = "I didnt understand your question. Please can you explain again. ";
        this.msgid =  (parseInt(this.msgid) + 1).toString();
        this.userMessage = {"id":this.msgid, "message":exitMessage , "details":"", "items":[], "source":"bot", "createdat":"", "username":"Bot"};
        this.chatData.push(this.userMessage);
      }
    }
  //  console.log(this.chatData);
    this.replymessage = "";
  }

}

loadProfileImg()
	{
	  var param = {"userid": this.currentUser["_id"]};

	  this.dbService.getDatabyParam("userprofiles", param).subscribe(oinvData => setTimeout(() => {
		  
		  if(oinvData["length"] > 0)
		  {
        if(oinvData[0]["profileimg"] !== "")
		    this.profileimage = oinvData[0]["profileimg"];
		  }
	  }));

  }
  
  LoadProfileImages()
  {

    this.profileimageFrom = "assets/user-icon.png";
this.profileimageTo = "assets/user-icon.png";


var arrUniqueIDs = [];

				arrUniqueIDs.push({"userid":this.currentUser["_id"]});
        arrUniqueIDs.push({"userid":this.item["_id"]});



			var params = {"userids": arrUniqueIDs};

			this.dbService.postData("userprofiles/forProfilePics", params).subscribe(profilepicsArr => setTimeout(() => {


				if(profilepicsArr["length"] > 0)
				{
					for(let ip=0; ip < profilepicsArr["length"]; ip++)
					{
			
            if(profilepicsArr[ip]["userid"] == this.currentUser["_id"])
            {
              if(profilepicsArr[ip]["profileimg"] !== "")
              this.profileimageFrom = profilepicsArr[ip]["profileimg"]
            }

            if(profilepicsArr[ip]["userid"] == this.item["_id"])
            {
              if(profilepicsArr[ip]["profileimg"] !== "")
              this.profileimageTo = profilepicsArr[ip]["profileimg"]

            }

					}
					

				}
			
			}));

    
    
  }
}