import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';

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

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) { 
  /*
		this.amenuItems= [
			{"id":"users", "menu":"Users", "subtitle":"Manage Employees, Realtors", "link":"/admin/users", "active":false, "visible":true,"icon":"group"},
			{"id":"requests", "menu":"Enquiries",  "subtitle":"Manage Enquiries", "link":"/admin/enquires", "active":false, "visible":true, "icon":"tasks"},
			{"id":"testimonials", "menu":"Testimonials", "subtitle":"Manage Testimonials", "link":"/admin/testimonials", "active":false, "visible":true, "icon":"trophy"},
			{"id":"locations", "menu":"Locations", "subtitle":"Manage Locations", "link":"/admin/locations", "active":false, "visible":true, "icon":"globe"},
			{"id":"propertytypes", "menu":"Property Types", "subtitle":"Manage Property Types", "link":"/admin/propertytypes", "active":false, "visible":true, "icon":"list"},
			{"id":"properties", "menu":"Properties", "subtitle":"Manage Properties", "link":"/admin/properties", "active":false, "visible":true, "icon":"building"},
			{"id":"announcements", "menu":"Announcements", "subtitle":"Manage Announcements", "link":"/admin/announcements", "active":false, "visible":true, "icon":"bullhorn"},
			{"id":"news", "menu":"News", "subtitle":"Manage News", "link":"/admin/news", "active":false, "visible":true, "icon":"newspaper-o"},
			{"id":"wanted", "menu":"Buyer's Wanted", "subtitle":"Manage Wanted Details", "link":"/admin/wanted", "active":false, "visible":true, "icon":"file"},
		//{"id":"pages", "menu":"Pages", "subtitle":"Manage Pages", "link":"/admin/pages", "active":false, "visible":true, "icon":"file"},
			{"id":"requests", "menu":"Requests", "subtitle":"Manage Requests", "link":"/admin/requests", "active":false, "visible":true, "icon":"file"},
			{"id":"banners", "menu":"Banners", "subtitle":"Manage Banners", "link":"/admin/banners", "active":false, "visible":true, "icon":"image"}
		
		];
		*/
		this.amenuItems= [
			{"id":"users", "menu":"Users", "subtitle":"Manage Employees, Realtors", "link":"/admin/users", "active":false, "visible":true,"icon":"group"},
			{"id":"requests", "menu":"Enquiries",  "subtitle":"Manage Enquiries", "link":"/admin/enquires", "active":false, "visible":true, "icon":"tasks"},
			{"id":"testimonials", "menu":"Testimonials", "subtitle":"Manage Testimonials", "link":"/admin/testimonials", "active":false, "visible":true, "icon":"trophy"},
			{"id":"locations", "menu":"Locations", "subtitle":"Manage Locations", "link":"/admin/locations", "active":false, "visible":true, "icon":"globe"},
			{"id":"propertytypes", "menu":"Property Types", "subtitle":"Manage Property Types", "link":"/admin/propertytypes", "active":false, "visible":true, "icon":"list"},
			{"id":"properties", "menu":"Properties", "subtitle":"Manage Properties", "link":"/admin/properties", "active":false, "visible":true, "icon":"building"},
			{"id":"extras", "menu":"Extras", "subtitle":"Manage addiitional Items", "link":"/admin/extras", "active":false, "visible":true, "icon":"gear"},
			//{"id":"pages", "menu":"Pages", "subtitle":"Manage Pages", "link":"/admin/pages", "active":false, "visible":true, "icon":"file"},
		
		];

		this.extraItem = 	{"id":"extras", "menu":"Extras", "subtitle":"Manage addiitional Items", "link":"/admin/extras", "active":false, "visible":true, "icon":"building"},
			
		this.asubmenuItems = [
			{"id":"announcements", "menu":"Announcements", "subtitle":"Manage Announcements", "link":"/admin/announcements", "active":false, "visible":true, "icon":"bullhorn"},
			{"id":"news", "menu":"News", "subtitle":"Manage News", "link":"/admin/news", "active":false, "visible":true, "icon":"newspaper-o"},
			{"id":"wanted", "menu":"Wanted Details", "subtitle":"Manage Wanted Details", "link":"/admin/wanted", "active":false, "visible":true, "icon":"file-text"},
			{"id":"requests", "menu":"Requests", "subtitle":"Manage Requests", "link":"/admin/requests", "active":false, "visible":true, "icon":"paper-plane"},
			{"id":"banners", "menu":"Banners", "subtitle":"Manage Banners", "link":"/admin/banners", "active":false, "visible":true, "icon":"image"},
			{"id":"partners", "menu":"Partners", "subtitle":"Manage Partners", "link":"/admin/partners", "active":false, "visible":true, "icon":"user"},
			{"id":"ventures", "menu":"Farm Land", "subtitle":"Manage Ventures", "link":"/admin/ventures", "active":false, "visible":true, "icon":"map"}
		]

	}

	ngOnInit() {
				//console.log("In adminleftmenu Component ngOnInit");
		//console.log(this.route.params);
		
			this.subscribeUserService = this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
		//console.log("getting userdata");
		//console.log(userdata);
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
				case "locations": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
				case "properties": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "REALTOR" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
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
				case "propertytypes": 
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
				case "wanted": 
							if(this.currentUser["role"]  == "SUPERADMIN" || this.currentUser["role"].toString().toUpperCase()  == "EMPLOYEE")
							{
								this.amenuItems[io]["visible"] = true;
							}
							break;
				case "pages": 
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
							
				case "extras": 
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
		this.amenuItems[0]["active"]=true;
		//console.log(	this.amenuItems);
		
		if(typeof(this.route.params["_value"]) !== "undefined")
		{
			//console.log(this.route.params["_value"].id);
		}
	}
  
	setmenu(aitem, isextra = false)
	{
	console.log(aitem);
		console.log(aitem);
		var link = "";
		if(aitem.link !== "/admin/extras")
		{
			for(let i=0; i < this.amenuItems.length; i++)
			{
				if(this.amenuItems[i]["link"] !== aitem["link"])
				this.amenuItems[i].active = false;
			}
			this.currentMenu=aitem.id;
			aitem.active = true;

			this.extraItem.active = false;
			link = aitem.link;
		}
		else
		{
			for(let i=0; i < this.amenuItems.length; i++)
			{
				this.amenuItems[i].active = false;
			}
			this.currentMenu=aitem.id;
			

			this.extraItem.active = true;
			link = aitem.link;

		}
		if(isextra)
		{
			for(let i=0; i < this.amenuItems.length; i++)
			{
				if(this.amenuItems[i]["link"] == "/admin/extras")
				this.amenuItems[i].active = true;
				else
				this.amenuItems[i].active = false;
			}
		}
		if(aitem.link !== "/admin/extras")
		{
			this.router.navigate([link]);
		}
		
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
