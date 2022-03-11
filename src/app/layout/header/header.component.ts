import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { DBService } from '../../dbservices/db.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Location } from '@angular/common';
import { HelpService } from '../../services/help.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser, FacebookLoginProvider } from 'angularx-social-login'


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
	planLink:any;
	searchparam: any;
	isUser: any = {};
	constructor(private router :Router, private socialAuthService: SocialAuthService, public userService: UserService, public helpService: HelpService,  private dbService: DBService, private location: Location) {

	var currentUrl = this.router.url;
	currentUrl = currentUrl.replace("/","");

	var displayMenu =  true;
		this.searchparam = "";
            if(window.screen.width > 768 || window.innerWidth > 768)
            {
              // this.planLink = "/plan-create";
			  this.planLink = "/plancreate";
            }
            else
            {
                this.planLink = "/plan-createm";
            }
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
					{"id":"home-aboutus", "menu":"About the Team", "link":"/ourteam", "display":displayMenu, "active":false},
					{"id":"home-display", "menu":"FAQs", "link":"/faqs", "display":displayMenu, "active":false},
					{"id":"home-questionnaire", "menu":"Questionnaire", "link":"/questionnaire", "display":displayMenu, "active":false}
				]
			},
			{"id":"features", "menu":"Features", "link":"/features", "display":displayMenu, "active":false},
			{"id":"pricing", "menu":"Pricing", "link":"/pricing", "display":displayMenu, "active":false},
			
		];
		this.menuItems1= [
			{"id":"landing", "menu":"Home", "link":"/landing", "display":displayMenu, "active":false, "show":true,
				"children":
				[
					{"id":"landing", "menu":"Home", "link":"/landing", "display":displayMenu, "active":false, "show":true},
					{"id":"landing-aboutus", "menu":"Our Team", "link":"/ourteam", "display":displayMenu, "active":false, "show":true},
					{"id":"landing-benefits", "menu":"Benefits", "link":"/benefits", "display":displayMenu, "active":false, "show":true},
					{"id":"landing-display", "menu":"FAQs", "link":"/faqs", "display":displayMenu, "active":false, "show":true}				
				]
			},
			{"id":"recipes", "menu":"Recipes", "link":"/recipes", "display":displayMenu, "active":false, "show":true,
				"children":
				[

					{"id":"recipes-recipe-list", "menu":"Recipes", "link":"/recipes", "display":displayMenu, "active":false, "show":true},
					{"id":"recipes-favourites", "menu":"Favourites", "link":"/favourites", "display":displayMenu, "active":false, "show":true},
					{"id":"recipes-my-recipes", "menu":"My Recipes", "link":"/myrecipes", "display":displayMenu, "active":false, "show":true},
					{"id":"recipes-recipebooks", "menu":"Recipe Books", "link":"/recipebooks", "display":displayMenu, "active":false, "show":false},
					{"id":"recipes-recipe-submit", "menu":"Submit Recipe", "link":"/recipesubmit", "display":displayMenu, "active":false, "show":true}
				]
			},
			{"id":"planner", "menu":"Planner", "link":"/plans", "display":displayMenu, "active":false, "show":true /*,
				"children":
				[

					{"id":"planner-plan-list", "menu":"Meal Plans", "link":"/plans", "display":displayMenu, "active":false},
					{"id":"planner-plan-create", "menu":"Create Plan", "link":this.planLink, "display":displayMenu, "active":false}
					
				]*/
			}	,
			{"id":"collections", "menu":"Collections", "link":"/collections", "display":displayMenu, "active":false, "show":true/*
			,	"children":
				[

					{"id":"groups-communities", "menu":"Communities", "link":"/communities", "display":displayMenu, "active":false},
					{"id":"groups-groups", "menu":"Groups", "link":"/groups", "display":displayMenu, "active":false}
				]
				*/
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

		item.expand = !item.expand; 
		this.gotopage(item.link);
		if(typeof(item.children) == "undefined" || item.children.length == 0)
		this.showMenu = false;
		
	}
	ngOnInit() {	

		//console.log("header ngOnInit");
		this.companylogo = 'assets/logo-dark.png';
	
		this.setMenuActive();
		this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			
			this.loggedIn = false;
			console.log(userdata);
			if(typeof(userdata) !== "undefined" && userdata !== null)
			{
				this.currentUser = userdata;
				this.userName= "";
				if(typeof(this.currentUser["firstname"]) !== "undefined" && this.currentUser["firstname"] !== null)
				{
					this.userName = this.currentUser["firstname"];
					this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);

					}
				this.helpService.loadQuestionnaire();
				
				this.isUser = this.helpService.setUserRoles(this.currentUser);
			
				if(this.isUser["dietitian"])
				{
					this.menuItems1[1]["children"][3]['show'] = true;
				}

				 if(this.userName == "" && typeof(this.currentUser["username"]) !== "undefined") {
                this.userName = this.currentUser["username"];
				if(this.userName.indexOf("@") !== -1)
				{
					var t = this.userName.split("@");
					this.userName = t[0];
				}

                }
				if(typeof(this.currentUser["loggedIn"]) !== "undefined") {
					this.loggedIn = this.currentUser["loggedIn"];
					}
	
				//this.loggedIn = true;
				this.userRole =  this.currentUser["role"];
				this.userRoleDet = this.currentUser["role"];

				this.setMenuActive();
			
				this.companylogo = 'assets/logo-dark.png';
				this.companyname = "";
				this.isTrialExpired = this.helpService.isTrialExpired(this.currentUser);

				this.helpService.getIpaddress(this.currentUser);
			}
			this.setIconMenu();
			
		//	//console.log(this.loggedIn);
		}, 0));
			this.checkCurrentUser();
	}
	
	checkCurrentUser()
	{
		if(typeof(this.currentUser) !== "undefined" && this.currentUser !== null)
		{
			this.setUniqueid();
		}
		else
		{
		setTimeout(() => 
            {
				this.checkCurrentUser();
            }, 5000);
		}
	}
	setUniqueid()
	{
		if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] == "")
        {
		if(typeof(this.currentUser["uniqueid"]) == "undefined" || this.currentUser["uniqueid"] == "")
        {
          var uniqueid =  localStorage.getItem("uniqueid");

          if(typeof(uniqueid) !== "undefined" && uniqueid !== null && uniqueid !== "")
          {
            var params = {};
            params["id"] = this.currentUser["id"];
            params["uniqueid"] = uniqueid;
			try
			{
				var res =   this.dbService.updateDataByTable("users", params).subscribe(invData => setTimeout(() => 
				{

				}));
			}
			catch(error)
			{
				console.log(error);
				
			}
          }
        }
        
        if(typeof(this.currentUser["user_ipaddress"]) == "undefined" || this.currentUser["user_ipaddress"] == "")
        {
          var ipaddress =  localStorage.getItem("ipaddress");
 
          if(typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== "")
          {
            var params = {};
            params["id"] = this.currentUser["id"];
            params["user_ipaddress"] = ipaddress;
			try
			{
				
				var res =   this.dbService.updateDataByTable("users", params).subscribe(invData => setTimeout(() => 
				{

				}));
			}
			catch(error)
			{
				console.log(error);
			}
          }
        }
	}
	}
	setIconMenu()
	{
	//	//console.log("In setIconMenu");
		for(let i=0; i < this.menuItems.length; i++)
		{
			this.menuItems[i]["active"] = false;

			if (this.router.url.indexOf(this.menuItems[i]["id"]) !== -1) {
				this.menuItems[i]["active"] = true;
				
			}
			else
			{
				console.log("goto login");
				this.gotoLogin();
			}

		}
	}
	gotoLogin()
	{
	var str = this.location.path();	
	console.log("gotoLogin");
	console.log(str);
		if(!this.loggedIn && str.indexOf("resetpassword") == -1 && str.indexOf("index") == -1 && str.indexOf("landing") == -1 && str.indexOf("home") == -1 && str.indexOf("signup") == -1 && str.indexOf("pricing") == -1 && str.indexOf("features") == -1 && str.indexOf("recipedetails") == -1  && str.indexOf("group") == -1 && str.indexOf("privacy") == -1 && str.indexOf("benefits") == -1 && str.indexOf("calculate") == -1  && str.indexOf("recipesubmit") == -1  && str.indexOf("plancreate") == -1 && str.indexOf("recipesmodify") == -1 && str.indexOf("approve") == -1 && str.indexOf("admin") == -1 && str.indexOf("searchresults") == -1  && str.indexOf("recipebookview") == -1 && str.indexOf("questionnaire") == -1 && str.indexOf("utility") == -1)
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
		console.log("Going to login");
		this.router.navigate(["login"]);			
		}
	}


	setMenuActive()
	{
		for(let i=0; i < this.menuItems.length; i++)
		{
			this.menuItems[i]["active"] = false;

			if (this.router.url.indexOf(this.menuItems[i]["link"]) !== -1) {
				this.menuItems[i]["active"] = true;					
				
			}
			if(this.menuItems[i]["children"] && this.menuItems[i]["children"]["length"] > 0)
			{
				for(let j=0; j < this.menuItems[i]["children"]["length"]; j++)
				{
					if (this.router.url.indexOf(this.menuItems[i]["children"][j]["link"]) !== -1) {
						this.menuItems[i]["active"] = true;					
						
					}
				}
			}	
		}
		

		for(let i=0; i < this.menuItems1.length; i++)
		{
			this.menuItems1[i]["active"] = false;
			if (this.router.url.indexOf(this.menuItems1[i]["link"]) !== -1) {
				this.menuItems1[i]["active"] = true;					
				
			}	
			if(this.menuItems1[i]["children"] && this.menuItems1[i]["children"]["length"] > 0)
			{
				for(let j=0; j < this.menuItems1[i]["children"]["length"]; j++)
				{
					if (this.router.url.indexOf(this.menuItems1[i]["children"][j]["link"]) !== -1) {
						this.menuItems1[i]["active"] = true;					
						
					}
				}
			}	
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
		localStorage.removeItem("user");
		let username = this.userService.logout();

		sessionStorage.setItem('currentUser', "");
		localStorage.setItem('currentUser', "");
		
		var socialLogin = sessionStorage.getItem("socialLogin")
		if(socialLogin !== "")
		{
			this.socialAuthService.signOut();
		}
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
	searchparams()
	{

		if(this.searchparam !== "")
		{
			this.router.navigate(["searchresults", {param:this.searchparam}]);
			this.searchparam = "";
		}
	}
  
}
