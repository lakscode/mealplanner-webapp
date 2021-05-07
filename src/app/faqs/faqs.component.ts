import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
declare var $: any;


@Component({
	selector: 'app-faqs',
	templateUrl: './faqs.component.html',
	styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
	stepsList: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {

	this.stepsList = [];

		this.stepsList.push({"label":"Features", "subtitle":"Question 1", "image":"assets/images/temp-images/main-recipe3.jpg", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam temporee."});

		this.stepsList.push({"label":"Choose", "subtitle":"Question 2","image":"assets/images/temp-images/new-var2.jpg", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore"});

		this.stepsList.push({"label":"Design", "subtitle":"Question 3","image":"assets/images/temp-images/steps-tab1.jpg", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore"});

		this.stepsList.push({"label":"Design", "subtitle":"Question 4","image":"assets/images/temp-images/Meal-Planning.jpg", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore"});





	
	}
}

	