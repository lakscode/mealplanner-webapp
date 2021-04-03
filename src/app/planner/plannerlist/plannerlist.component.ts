import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';


@Component({
	selector: 'app-plannerlist',
	templateUrl: './plannerlist.component.html',
	styleUrls: ['./plannerlist.component.scss']
})
export class PlannerlistComponent implements OnInit {
	recipesList: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
this.loadRecipes()
	
	}

	loadRecipes()
    {
      this.recipesList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/listing-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

      this.recipesList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/listing-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});



      this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});


	  this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-4.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

	  this.recipesList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/listing-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

      this.recipesList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/listing-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate.", "author":"Peter Stiles", "created_at":"23/10/2015"});

    }
}

	