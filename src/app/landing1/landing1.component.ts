import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';

@Component({
	selector: 'app-landing1',
	templateUrl: './landing1.component.html',
	styleUrls: ['./landing1.component.scss']
})
export class Landing1Component implements OnInit {
	count: any = 0;
	sliderList: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		this.count++;
		//if(this.count==0)
		//window.location.reload();
		this.loadSliders();
	
	}

	loadSliders()
    {
		this.sliderList=[];
      /*
      this.sliderList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/full-slide-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      this.sliderList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/full-slide-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});
      */

      this.sliderList.push({"title":"More than 50 thousand recipes.", "image":"assets/images/temp-images/full-slide-1.jpg","rating":"", "description":"By providing tools that streamline the meal planning process we equip households to eat better food, eat together, save money at the grocery store, and have a less stressful cooking experience in the kitchen."});
      this.sliderList.push({"title":"Meal Planning tool to add recipes to your weekly plan", "image":"assets/images/temp-images/full-slide-4.jpg","rating":"", "description":" recipes that fit your lifestyle and customized meal plan to accommodate your schedule,"});
    //  this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});



    }

}

	