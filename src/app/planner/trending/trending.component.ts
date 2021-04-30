import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
declare var $: any;

@Component({
	selector: 'app-trending',
	templateUrl: './trending.component.html',
	styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {
	packages: Array<any> = [];
	routeParams: any;
	private onDestroy$: Subject<void> = new Subject<void>();
	sub: any;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.packages.push({"name":"Standard","duration":"7 Days","payment":"FREE", "currency":"","selected":false, "options":["Limited Recipes", "No nutrition details"]});
		this.packages.push({"name":"Premium","duration":"Monthly","payment":"9", "currency":"dollar","selected":false, "options":["Unlimited Recipes", "Meal Plan Suggestions"]});
		this.packages.push({"name":"Professional","duration":"Monthly","payment":"49", "currency":"dollar","selected":false, "options":["Unlimited Recipes", "Meal Plan Suggestions", "Client Organiser"]});
		this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
			//  console.log(params);   
			  this.routeParams = params;     
			  if (typeof (this.routeParams.id) !== "undefined") {
				console.log(this.routeParams.id);
			//	this.plan["mealplanid"] =this.routeParams.id;
				//this.loadRecipe(this.routeParams.id);
			  }   
			 
		   });
	
	}

	gotopage(page)
	{
		this.router.navigate([page]);
	}
}

	