import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';

import { HttpClient } from '@angular/common/http';

import { data} from "../jsonfiles/questionnaire"
import { timeStamp } from 'console';
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
	constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.loadData();
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
	loadData()
	{
		this.answersList = {};
		this.answersList["question1"] = ""
		this.answersList["question2"] = ""
		this.answersList["question3"] = ""
		this.answersList["question4"] = ""
		this.answersList["question5"] = ""
		this.answersList["question6"] = ""
		this.answersList["question7"] = ""
		this.answersList["question8"] = ""
		this.answersList["question9"] = ""

		this.responseText = "";
		this.questionsList =[];

		this.questionsList =data;
			

	}
	saveAnswer()
	{
		console.log(this.questionsList);	
	

		for(let i = 0; i < this.questionsList.length; i++)
		{
			var qItem = this.questionsList[i];
			if(typeof(qItem["answer"]) !== "undefined")
			this.answersList["question" + (i+1)] = qItem["answer"];
			else
			this.answersList["question" + (i+1)] = "";
		}
		console.log(this.answersList);
	}
	makeAnswers(question)
	{
		console.log(question);
		console.log(this.questionsList);	
		for(let i = 0; i < this.questionsList.length ; i++)
		{
			var qitem = this.questionsList[i];
			if(typeof(qitem['answer']) !== "undefined" && qitem["answer"] !== "")
			{
				var ans =  qitem["answer"];

				if(typeof(qitem["options"]) !== "undefined" && qitem["options"].length > 0)
				{
					if(qitem["options"].length > 0)
					{
						for(let i=0; i < qitem["options"].length; i++)
						{
							if( qitem["options"][i]['selected'])
							{
								ans += " " + qitem["opt"];
							}
						
						}
					}
				}
			
				this.answersList["question" + (i+1)] = ans;
			}
			else if(qitem.answers.length > 0)
			{
				var res = "";
				for(let j= 0; j < qitem.answers.length ; j++)
				{
					var aitem = qitem.answers[j];
					if(typeof(aitem['answer']) !== "undefined" && aitem["answer"] !== "" && aitem["answer"] !== false)
					{
						res +=  aitem["text"]  + ",";
					}
					
				}
				if(res !== "")
				{
					res = res.substring(0, res.length-1);	
				}
				this.answersList["question" + (i+1)] = res;
			}
		}
	}

	saveAnswers() {
	console.log(this.answersList);
	this.errorMessage = "";
	
	if(this.answersList["question1"] == "" || this.answersList["question2"] == "" || this.answersList["question3"] == "" || this.answersList["question4"] == "" || this.answersList["question5"] == "" || this.answersList["question6"] == "" || this.answersList["question7"] == "" || this.answersList["question8"] == "" ||	this.answersList["question9"] == "") {

	this.errorMessage = "Please fill out all the fields to help better....";


	} else {
	this.errorMessage  ="";
	}
	console.log(this.errorMessage);

	
    
  }
  
  // program the reset button
  	 resetAnswer() {
		this.answersList = {};
		this.answersList["question1"] = ""
		this.answersList["question2"] = ""
		this.answersList["question3"] = ""
		this.answersList["question4"] = ""
		this.answersList["question5"] = ""
		this.answersList["question6"] = ""
		this.answersList["question7"] = ""
		this.answersList["question8"] = ""
		this.answersList["question9"] = ""

  }
}

	