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

  loadQuestionnaire()
  {
	var params= {};
	if(this.currentUser !== null && typeof(this.currentUser["id"]) !=="undefined")
	{
		params["userid"] = this.currentUser["id"];
  	}  
	var res =   this.dbService.getDataByTable("questionnaire", params).subscribe(invData => setTimeout(() => {
       console.log(invData);
	}));

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

        localStorage.setItem("q_complete","true");
        localStorage.setItem("questions", JSON.stringify(params));

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

		  if(this.questions[cq]["answer"].indexOf(answer['text']) == -1)
		  {
			  if(this.questions[cq]["answer"] !== "")
			this.questions[cq]["answer"] = this.questions[cq]["answer"] + "," + answer['text'];
			else
			this.questions[cq]["answer"] = answer['text'];

			this.params["question" + (cq+1)] = this.questions[cq]["answer"];
		  }
	  } 

   if(type == "checkbox")
   {
   		answer["selected"] = !answer["selected"];
    	this.questions[cq]["answer"] = answer['text'];

    	this.params["question" + (cq+1)] = answer['text'];
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

	