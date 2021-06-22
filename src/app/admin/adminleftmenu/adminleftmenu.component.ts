import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-adminleftmenu',
  templateUrl: './adminleftmenu.component.html',
  styleUrls: ['./adminleftmenu.component.scss']
})
export class AdminleftmenuComponent implements OnInit, OnDestroy {


session:any;
interviewlocation: any;
currentMenu: any;
amenuItems: any[];
subscribeUserService: any;
currentUser : any;
asubmenuItems :Array<any>= [];
extraItem: any;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute, private userService: UserService) { 

		this.amenuItems= [
			//{"id":"users", "menu":"Users", "subtitle":"Manage Employees, Realtors", "link":"/admin/users", "active":false, "visible":true,"icon":"group"},
			//{"id":"requests", "menu":"Enquiries",  "subtitle":"Manage Enquiries", "link":"/admin/enquires", "active":false, "visible":true, "icon":"tasks"},
			//{"id":"testimonials", "menu":"Testimonials", "subtitle":"Manage Testimonials", "link":"/admin/testimonials", "active":false, "visible":true, "icon":"trophy"},
			{"id":"approve", "menu":"Approve Recipes", "subtitle":"Manage approve", "link":"/admin/approve", "active":false, "visible":true, "icon":"file"}
		
		];

	
	}

	ngOnInit() {

		
			this.subscribeUserService = this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
		
		if(userdata !== null)
		{
		if(typeof(userdata['loggedIn']) !=="undefined")
		{   
			if(userdata['loggedIn'] == true)
			{
				this.currentUser = userdata;
			}
			else
			{
				this.router.navigate(["login", {redirectUrl:encodeURI(this.router.url)}]);
			}
		}
		else 
		{
			this.currentUser = userdata;
		}

		for(let io=0; io < this.amenuItems.length; io++)
		{
			var ioItem = this.amenuItems[io];
			ioItem["visible"] = false;
			switch(ioItem.id)
			{
			
				case "users": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"]  == "ADMIN")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
				case "requests": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
				case "testimonials": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
			
				case "announcements": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
			
				case "news": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
			
				case "banners": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
							
				
			}
		}

		//console.log(this.amenuItems);


	}

	}, 0));
	
	

		this.session="planning";
		var str = this.location.path();	
		console.log(str);
	var menufound = 0;
		for(let i=0; i < this.amenuItems.length; i++)
		{
			if(str.indexOf(this.amenuItems[i]["link"]) !== -1)
			{
				this.amenuItems[i]["active"] = true;
				menufound = 1;
			}
		}
		console.log(menufound);
		if(menufound == 0)
		this.amenuItems[0]["active"]=true;

	}
  
	setmenu(aitem)
	{
	console.log(aitem);
		console.log(aitem);
		var link = "";
		
			for(let i=0; i < this.amenuItems.length; i++)
			{
				this.amenuItems[i].active = false;
			}
			this.currentMenu=aitem.id;
	
			link = aitem.link;

			aitem.active = true;
	
			this.router.navigate([link]);
	
		
	}
	gotoPage(page, type)
	{
		this.router.navigate([page, {type: type}]);
	}
 ngOnDestroy()
  {
  if(this.subscribeUserService) this.subscribeUserService.unsubscribe();

  }

}
