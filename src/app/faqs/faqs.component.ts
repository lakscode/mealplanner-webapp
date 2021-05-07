import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router } from "@angular/router";

@Component({
	selector: 'app-faqs',
	templateUrl: './faqs.component.html',
	styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
	stepsList: Array<any> = [];
	constructor(private router: Router) {
	
	}

	ngOnInit() {

	this.stepsList = [];

		this.stepsList.push({"subtitle":"Question 1", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam temporee."});

		this.stepsList.push({"subtitle":"Question 2", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore"});

		this.stepsList.push({ "subtitle":"Question 3", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore"});

		this.stepsList.push({"subtitle":"Question 4", "description":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore"});





	
	}
}

	