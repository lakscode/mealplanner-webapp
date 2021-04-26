import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
declare var $: any;

@Component({
	selector: 'app-pricing',
	templateUrl: './pricing.component.html',
	styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
	packages: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.packages.push({"name":"Standard","duration":"7 Days","payment":"FREE", "currency":"","selected":false, "options":["Limited Recipes", "No nutrition details"]});
		this.packages.push({"name":"Premium","duration":"Monthly","payment":"9", "currency":"dollar","selected":false, "options":["Unlimited Recipes", "Meal Plan Suggestions"]});
		this.packages.push({"name":"Professional","duration":"Monthly","payment":"49", "currency":"dollar","selected":false, "options":["Unlimited Recipes", "Meal Plan Suggestions", "Client Organiser"]});
		
	
	}

	gotopage(page)
	{
		this.router.navigate([page]);
	}
}

	