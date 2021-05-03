import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { DBService } from '../../dbservices/db.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { HelpService } from '../../services/help.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
	userName: string;
	userRole : string;
	loggedIn : any;
	menuItems: any[];
	menuItems1: any[];
	menuItemsCustom: any[];
	currentUser : User;
	userRoleDet: any;
	companyname: any;
	subscribeCompanyService: any;
	companylogo : any;
	collapsed: boolean  = true;
	constructor(private router :Router, private userService: UserService, private helpService: HelpService,  private dbService: DBService, private location: Location) {

	var currentUrl = this.router.url;
	currentUrl = currentUrl.replace("/","");
	//console.log(currentUrl);
	var displayMenu =  true;

		this.currentUser = new User();
		this.userName = "";
		this.loggedIn = false;
		this.userRole = "";
		this.currentUser.userName = "";
		this.currentUser.loggedIn = false;

		this.menuItemsCustom = [
				{"id":"dashboard", "menu":"Dashboard", "display":displayMenu, "active": false},
				{"id":"admin", "menu":"Admin", "display":displayMenu, "active": false},
				{"id":"login", "menu":"Login", "display":displayMenu, "active": false}
			];
		this.menuItems= [
			{"id":"home", "menu":"Home", "link":"/home", "display":displayMenu, "active":false,
			"children":
				[
					{"id":"aboutus", "menu":"About the Team", "link":"/ourteam", "display":displayMenu, "active":false},
					{"id":"display", "menu":"FAQs", "link":"/faqs", "display":displayMenu, "active":false},
				//	{"id":"blogs", "menu":"Blogs", "link":"/blogs", "display":displayMenu, "active":false},
				//	{"id":"testimonials", "menu":"Testimonials", "link":"/testimonials", "display":displayMenu, "active":false}
				]
			},
			{"id":"features", "menu":"Features", "link":"/features", "display":displayMenu, "active":false},
			{"id":"pricing", "menu":"Pricing", "link":"/pricing", "display":displayMenu, "active":false},
		//	{"id":"schedule", "menu":"Schedule Demo", "link":"/scheduledemo", "display":displayMenu, "active":false},
			
		];
		this.menuItems1= [
			{"id":"home", "menu":"Home", "link":"/landing", "display":displayMenu, "active":false,
				"children":
				[
				//	{"id":"howitworks", "menu":"How it works", "link":"/howitworks", "display":displayMenu, "active":false},
				{"id":"home", "menu":"Home", "link":"/landing", "display":displayMenu, "active":false},
					{"id":"aboutus", "menu":"Our Team", "link":"/ourteam", "display":displayMenu, "active":false},
					{"id":"benefits", "menu":"Benefits", "link":"/benefits", "display":displayMenu, "active":false},
					{"id":"display", "menu":"FAQs", "link":"/faqs", "display":displayMenu, "active":false},
				//	{"id":"blogs", "menu":"Blogs", "link":"/blogs", "display":displayMenu, "active":false},
				//	{"id":"testimonials", "menu":"Testimonials", "link":"/testimonials", "display":displayMenu, "active":false}
				]
			},
			{"id":"recipes", "menu":"Recipes", "link":"/recipes", "display":displayMenu, "active":false,
				"children":
				[

					{"id":"recipe-list", "menu":"Recipes", "link":"/recipes", "display":displayMenu, "active":false},
					{"id":"recipe-favourites", "menu":"Favourites", "link":"/favourites", "display":displayMenu, "active":false},
					{"id":"my-recipes", "menu":"My Recipes", "link":"/myrecipes", "display":displayMenu, "active":false},
					{"id":"recipe-submit", "menu":"Submit Recipe", "link":"/recipesubmit", "display":displayMenu, "active":false}
				]
			},
			{"id":"planner", "menu":"Planner", "link":"/plan-list", "display":displayMenu, "active":false,
				"children":
				[

					{"id":"plan-list", "menu":"Plan List", "link":"/plan-list", "display":displayMenu, "active":false},
					{"id":"plan-create", "menu":"Create Plan", "link":"/plan-create", "display":displayMenu, "active":false}
				]
			}				
		];

	}
	SetFLU(str)
	{
	  var retStr = str;
	  if(str !== "")
	  {
		retStr = this.helpService.setFirstLetterToUppercase(str);
	  }
	  return retStr;
	}
	showMenu: boolean = false;
	isTrialExpired: boolean  = false;
	mobilemenu(item)
	{
		console.log("mobilemenu");
		console.log(item);
		item.expand = !item.expand; 
		this.gotopage(item.link);
		if(typeof(item.children) == "undefined" || item.children.length == 0)
		this.showMenu = false;
		
	}
	ngOnInit() {
		
		this.companylogo = 'assets/logo-dark.png';
		

		this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			this.setIconMenu();
			this.loggedIn = false;
			
			//console.log(userdata);
			if(typeof(userdata) !== "undefined" && userdata !== null)
			{
				this.currentUser = userdata;
				this.userName= "";
				if(typeof(this.currentUser["firstname"]) !== "undefined")
				{
					this.userName = this.currentUser["firstname"];
					this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
				}

				if(typeof(this.currentUser["lastname"]) !== "undefined")
				{
					var lastname = this.currentUser["lastname"].charAt(0).toUpperCase() + this.currentUser["lastname"].slice(1);
				this.userName = this.userName + " " + lastname;
				}

				 if(typeof(this.currentUser["username"]) !== "undefined") {
                this.userName = this.currentUser["username"];
                }
				if(typeof(this.currentUser["loggedIn"]) !== "undefined") {
					this.loggedIn = this.currentUser["loggedIn"];
					}
	
				//this.loggedIn = true;
				this.userRole =  this.currentUser["role"];
				this.userRoleDet = this.currentUser["role"];

				this.setIconMenu();

				this.companylogo = 'assets/logo-dark.png';
				this.companyname = "";
				this.isTrialExpired = this.helpService.isTrialExpired(this.currentUser);
			}
			
		//	console.log(this.loggedIn);
		}, 0));
	}
	
	setIconMenu()
	{
	//	console.log("In setIconMenu");
		for(let i=0; i < this.menuItems.length; i++)
		{
			this.menuItems[i]["active"] = false;

			if (this.router.url.indexOf(this.menuItems[i]["id"]) !== -1) {
				this.menuItems[i]["active"] = true;
				
			}
			else
			{
				this.gotoLogin();
			}

		}
	}
	gotoLogin()
	{
	var str = this.location.path();	
	//console.log("gotoLogin") ;
	//console.log(str);
	//console.log("this.router.url ") ;
	//console.log(this.router.url);
		if(!this.loggedIn && str.indexOf("resetpassword") == -1 && str.indexOf("index") == -1 && str.indexOf("home") == -1)
		{
			var params = {};
			if( this.router.url.indexOf("login") > -1)
			{

			}
			else
			{
		//		params = {"redirecturl":this.router.url}
			}
		//	this.router.navigate(["login", params]);	
		this.router.navigate(["login"]);			
		}
	}
		gotopage(page)
		{
			this.router.navigate([page]);
		}
	logout()
	{

		this.loggedIn = false;
		sessionStorage.removeItem("user");
		let username = this.userService.logout();

		sessionStorage.setItem('currentUser', "");
		
		this.gotopage('login');
	}
	
	navbarOpen = false;

	toggleNavbar(aitem) {

		this.navbarOpen = !this.navbarOpen;

		if(typeof(aitem) !== "undefined" && aitem !== "")
		this.setmenu(aitem);

	}
	
	setmenu(aitem)
	{

		for(let i=0; i< this.menuItems.length; i++)
		{
			let tempItem = this.menuItems[i];
			tempItem.active=false;
		}
		

		if(aitem !== "")
		aitem.active = true;
		
	}

	toggleNavbarCustom(item) {

		this.navbarOpen = !this.navbarOpen;

		if(typeof(item) !== "undefined" && item !== "")
		this.setmenucustom(item);
	}
	
	setmenucustom(aitem)
	{

		for(let i=0; i< this.menuItems.length; i++)
		{
			let tempItem = this.menuItems[i];
			tempItem.active=false;
		}
		
		for(let j=0;j< this.menuItemsCustom.length; j++)
		{
			let tempItem1 = this.menuItemsCustom[j];
			tempItem1.active=false;
		}
		
		if(aitem == "dashboard")
		this.menuItemsCustom[0].active = true;
	
		if(aitem == "admin")
		this.menuItemsCustom[1].active = true;
	
	
		if(aitem == "login")
		this.menuItemsCustom[2].active = true;
	}
	
	ngOnDestroy()
	{
		if(this.subscribeCompanyService) this.subscribeCompanyService.unsubscribe();
	}

  
}
