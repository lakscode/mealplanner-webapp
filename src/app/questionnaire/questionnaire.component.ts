import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormBuilder } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';
import { HttpClient } from '@angular/common/http';
import { data } from "../../assets/data/questionnaire";

@Component({
	selector: 'app-questionnaire',
	templateUrl: './questionnaire.component.html',
	styleUrls: ['./questionnaire.component.scss']
})
export class  QuestionnaireComponent implements OnInit {
	questionsList: any;
	responseText : any = "";
	answersList : any= {};
	errorMessage: any;
		currentUser: any ;
		processing: any;
	params: any;
	routeParams: any;
	uniqueid: any;
	returnparam1: any;
	questions: any;
	returnpath: any;
	constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
		this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
			window.scrollTo(0, 0)
		});
	}

	ngOnInit() {
		this.setDefaults();
	}
	
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

    this.routeParams = {};
    this.returnpath = "";
    this.returnparam1 = "";
    var questionnaireDone =  sessionStorage.getItem("questionnaire");
    
    if(typeof(questionnaireDone) !== "undefined" && questionnaireDone == "true")
    {
        this.router.navigate(["home"]);
    }
	this.loadQuestionnaire();
  }
  questionnaire: any = [];
  loadQuestionnaire()
  {
	var params= {};
	if(this.currentUser !== null && typeof(this.currentUser["id"]) !=="undefined")
	{
		params["userid"] = this.currentUser["id"];
  	}  
	var res =   this.dbService.getDataByTable("questionnaire", params).subscribe(invData => setTimeout(() => {
       console.log(invData);
	   if(invData["body"] && invData["body"]["length"] > 0)
	   {
		this.questionnaire  = [];
		this.questionnaire.push(invData["body"][0]);
		this.params["id"] = invData["body"][0]["id"];
		this.loadData();

	   }
	}));

  }

  loadData()
  {
	  console.log(this.questionnaire);
	for(let o=0; o <  this.questions["length"]; o++)
	{
		if(this.questionnaire[0]["question"+(o+1)] !== "")
		{
			this.questions[o]["answer"] = this.questionnaire[0]["question"+(o+1)];
		}
		for(let p=0; p <  this.questions[o]['answers']["length"]; p++)
		{
			if(this.questions[o]["type"] == "option")
			{
				if(this.questions[o]['answers'][p]["text"] == this.questionnaire[0]["question"+(o+1)])
				{
					this.questions[o]['answers'][p]["selected"]  = true;
				}
			}

			if(this.questions[o]["type"] == "checkbox")
			{
				if(this.questionnaire[0]["question"+(o+1)].indexOf(this.questions[o]['answers'][p]["text"]) !== -1 )
				{
					this.questions[o]['answers'][p]["selected"]  = true;
				}
			}

		}
		console.log(this.questions[o]);
	}
  }
  complete()
  {

	console.log(this.params);
    this.processing = true;
    console.log("complete");
    console.log(this.params);
	delete this.params["tablename"];

    var uniqueid =  localStorage.getItem("uniqueid");

    var paramsr = {};
	if(typeof(this.params["id"]) !== "undefined" &&this.params["id"] !== null && this.params["id"] !== "")
    {
      paramsr["id"] = this.params["id"];
    }
	for(let p = 1; p <10; p++)
	{
		if(typeof(this.params["question" + p]) !== "undefined" && this.params["question" + p] !== "")
		{
			console.log("p " + p);
			console.log(this.params["question"]  + p.toString());
			paramsr["question" + p.toString()] = this.params["question" + p.toString()];
		}
	}
    //uniqueid = "1a15067e-ab63-a2ed-3582-220714793548";
    this.uniqueid = uniqueid;
    if(this.params["user_uniqueid"] == "" || (typeof(uniqueid) !== "undefined" && uniqueid !== null && uniqueid !== ""))
    {
      paramsr["user_uniqueid"] = uniqueid;
    }
    else
    {
      var uniqueid = this.helpService.GenerateUniqueId(20);
      paramsr["user_uniqueid"] = uniqueid;
      localStorage.setItem("uniqueid",uniqueid);
    }

    var ipaddress =  localStorage.getItem("ipaddress");
    if(this.params["user_ipaddress"] == "" && typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== "")
    {
      paramsr["user_ipaddress"] = ipaddress;
    }
    if(this.params["userid"] == "" && this.currentUser !== null && typeof(this.currentUser["id"]) !=="undefined")
		{
      paramsr["userid"] = this.currentUser["id"];
    }
    if(typeof(this.currentUser["id"]) !== "undefined" || this.currentUser["id"] !== "" || (typeof(uniqueid) !== "undefined" && uniqueid !== null && uniqueid !== "") || (typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== ""))
    {
    
		console.log(paramsr);
		if(typeof(paramsr["id"] ) !== "undefined" && paramsr["id"] !== "")
		{
			console.log("updaitn gquesitons");
			var res =   this.dbService.updateDataByTable("questionnaire", paramsr).subscribe(invData => setTimeout(() => {
				this.processing = false;
		
				localStorage.setItem("q_complete","true");
				localStorage.setItem("questions", JSON.stringify(paramsr));
		
				if( this.currentUser["id"] !== "")
				{
					this.router.navigate(["landing"]);
				}
				else
				{
					this.router.navigate(["pricing"]);
				}
		
			  }));
		}
		else
		{
			console.log("addign gquesitons");
			var res =   this.dbService.postDataByTable("questionnaire", paramsr).subscribe(invData => setTimeout(() => {
				this.processing = false;

				localStorage.setItem("q_complete","true");
				localStorage.setItem("questions", JSON.stringify(paramsr));

				if( this.currentUser["id"] !== "")
				{
					this.router.navigate(["landing"]);
				}
				else
				{
					this.router.navigate(["pricing"]);
				}

			}));
		}

    }
  }
 
  setAnswerText(answer, cq)
  {
    var ans =  answer['answer'];
    if(typeof(answer.opt) !=="undefined" && answer.opt !== "")
    {
      ans += " " + answer.opt;
    }
    this.questions[cq]["answer"] =answer['answer'];
    console.log( this.questions[cq]);
    this.params["question" + (cq+1)] = ans;

  }
  answerCount: any = 0;
  CheckAnswers()
  {
	  this.answerCount = 0;
	for(let o=0; o <  this.questions["length"]; o++)
	{
		for(let o=0; o <  this.questions[o]['answers']["length"]; o++)
		{
		  if(this.questions[o]['answer'] !== '')
		  {
			this.answerCount++;
		  }
		}  
	}  

	
  }
  setAnswer(answer, cq,  type)
  { 
	  if(type == 'option')
	  {
		  for(let o=0; o <  this.questions[cq]['answers']["length"]; o++)
		  {
			if(this.questions[cq]['answers'][o]['text'] !== answer['text'])
			{
				this.questions[cq]['answers'][o]["selected"] = false;
			}
		  }

		  this.questions[cq]["answer"] = answer['text'];

		  this.params["question" + (cq+1)] = answer['text'];
	  } 

   if(type == "checkbox")
   {
   		answer["selected"] = !answer["selected"];
    	
		if(this.questions[cq]["answer"].indexOf(answer['text']) == -1)
			{
				if(this.questions[cq]["answer"] !== "")
			  this.questions[cq]["answer"] = this.questions[cq]["answer"] + "," + answer['text'];
			  else
			  this.questions[cq]["answer"] = answer['text'];
  
			  this.params["question" + (cq+1)] = this.questions[cq]["answer"];
			}

   }
   
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
 

  
  
  getFLU(str)
  {
    var retStr = str;
    if(str !== "")
    retStr = this.helpService.setFirstLetterToUppercase(str);

    return retStr;
  }

}

	