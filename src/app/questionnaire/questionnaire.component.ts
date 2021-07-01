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
	ipaddress: any; 
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
 

	  this.uniqueid =  localStorage.getItem("uniqueid");
	  this.ipaddress =  localStorage.getItem("ipaddress");
	  var where = "";
	  if(typeof(this.uniqueid) !== "undefined" && this.uniqueid !== null && this.uniqueid !== "")
	  {
		where += " user_uniqueid = '" + this.uniqueid + "' ";
	  }

	  if(typeof(this.ipaddress) !== "undefined" && this.ipaddress !== null && this.ipaddress !== "")
	  {
		  	if(where !== "")
				where += " OR user_ipaddress = '" + this.ipaddress + "' ";	
			else
				where = " user_ipaddress = '" + this.ipaddress + "' ";
	  }

	  if(typeof(this.currentUser) !== "undefined" && this.currentUser !== null && typeof(this.currentUser["id"]) !=="undefined")
	  {
		  	if(where !== "")
				where += " OR userid = '" + this.currentUser["id"] + "' ";	
			else
				where = " userid = '" +this.currentUser["id"] + "' ";
	  }
	  if(where !== "")
	  {
	  params["query"] = "select * from questionnaire where" + where;

		var res =   this.dbService.getDatabyTablebyQuery("questionnaire", params).subscribe(invData => setTimeout(() => {
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
				console.log(this.questionnaire[0]["question"+(o+1)]);
				console.log(this.questions[o]['answers'][p]["text"]);

				if(this.questionnaire[0]["question"+(o+1)].indexOf(this.questions[o]['answers'][p]["text"]) !== -1 )
				{
					this.questions[o]['answers'][p]["selected"]  = true;
				}
			}

		}
		
	}
  }
  complete()
  {

	console.log(this.params);
    this.processing = true;
    
	delete this.params["tablename"];

    var paramsr = {};
	if(typeof(this.params["id"]) !== "undefined" &&this.params["id"] !== null && this.params["id"] !== "")
    {
      paramsr["id"] = this.params["id"];
    }
	for(let p = 1; p <10; p++)
	{
		if(typeof(this.params["question" + p]) !== "undefined" && this.params["question" + p] !== "")
		{
		
			paramsr["question" + p.toString()] = this.params["question" + p.toString()];
		}
	}


    if(this.params["user_uniqueid"] == "" || (typeof(this.uniqueid) !== "undefined" && this.uniqueid !== null && this.uniqueid !== ""))
    {
      paramsr["user_uniqueid"] = this.uniqueid;
    }
    else
    {
		this.uniqueid = this.helpService.GenerateUniqueId(20);
      paramsr["user_uniqueid"] = this.uniqueid;
      localStorage.setItem("uniqueid",this.uniqueid);
    }

    var ipaddress =  localStorage.getItem("ipaddress");
    if(this.params["user_ipaddress"] == "" && typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== "")
    {
      paramsr["user_ipaddress"] = ipaddress;
    }
    if((this.params["userid"] == "" || this.params["userid"] == "0") && this.currentUser !== null && typeof(this.currentUser["id"]) !=="undefined")
		{
      paramsr["userid"] = this.currentUser["id"];
    }

	if(this.currentUser !== null && this.currentUser["id"] !== "")
	paramsr["userid"] = this.currentUser["id"];

    if((typeof(this.uniqueid) !== "undefined" && this.uniqueid !== null && this.uniqueid !== "") || (typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== ""))
    {
		console.log(paramsr);
		delete paramsr["tablename"];
		if(typeof(paramsr["id"] ) !== "undefined" && paramsr["id"] !== "")
		{
			console.log("updaitn gquesitons");
			try
			{
			

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
			catch(error)
			{
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
	
			}
		}
		else
		{
			console.log("addign gquesitons");
			var res =   this.dbService.postDataByTable("questionnaire", paramsr).subscribe(invData => setTimeout(() => {
				this.processing = false;

				localStorage.setItem("q_complete","true");
				localStorage.setItem("questions", JSON.stringify(paramsr));

				if( this.currentUser !== null && this.currentUser["id"] !== "")
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
    	if(typeof(this.questions[cq]["answer"]) == "undefined" || this.questions[cq]["answer"] == null)
		{
			this.questions[cq]["answer"] = answer['text'];
  
			this.params["question" + (cq+1)] = this.questions[cq]["answer"];
		}
		 else if(this.questions[cq]["answer"] && this.questions[cq]["answer"].indexOf(answer['text']) == -1)
			{
				console.log(answer);
				console.log(this.questions[cq]);

				if(this.questions[cq]["answer"] !== "")
			  this.questions[cq]["answer"] = this.questions[cq]["answer"] + "," + answer['text'];
			  else
			  this.questions[cq]["answer"] = answer['text'];
  
			  this.params["question" + (cq+1)] = this.questions[cq]["answer"];
			}
			console.log(this.params["question" + (cq+1)]);

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
 

  gotopage(page)
  {
	  if(page == "signup")
	  {
		if(this.currentUser !== null  && typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== "")
		{
			this.router.navigate(['landing']); 
		}
		else
		{
			this.router.navigate([page]); 
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

	