import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';


@Component({
	selector: 'app-ourteam',
	templateUrl: './ourteam.component.html',
	styleUrls: ['./ourteam.component.scss']
})
export class OurteamComponent implements OnInit {
	teamList: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {

		this.loadTeamList();
	}

	loadTeamList()
	{
		this.teamList = [];
		for(let i=1; i <=4; i++)
		{
		this.teamList.push({"name":"Johan Anderson", "title":"Executive Member", "specilise":"Nam ornare arcu turpis ne congues withCurabitur quis euismod ur.Nam ornare arcu turpis","image":"assets/images/temp-images/nutritionist" + i + ".jpg"})
		}
	}
}

	