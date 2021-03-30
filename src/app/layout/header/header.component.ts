import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { DBService } from '../../dbservices/db.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
	menuItemsCustom: any[];
	user : User;
	userRoleDet: any;
	mHome: any;
	mLogin: any;
	mRequest: any;
	mContact: any;
	mAbout: any;
	mStore: any;
	companyname: any;
	subscribeCompanyService: any;
	companylogo : any;

	constructor(private router :Router, private userService: UserService,  private dbService: DBService,) {

	var currentUrl = this.router.url;
	currentUrl = currentUrl.replace("/","");
console.log(currentUrl);
	var displayMenu =  true;

		this.mHome= false;
		this.mLogin = false;
		this.mRequest = false;
		this.mContact = false;
		this.mAbout = false;
		this.mStore = false;

		this.user = new User();
		this.userName = "";
		this.loggedIn = false;
		this.userRole = "";
		this.user.userName = "";
		this.user.loggedIn = false;

		this.menuItemsCustom = [
				{"id":"dashboard", "menu":"Dashboard", "display":displayMenu, "active": false},
				{"id":"admin", "menu":"Admin", "display":displayMenu, "active": false},
				{"id":"login", "menu":"Login", "display":displayMenu, "active": false}
			];
		this.menuItems= [
			{"id":"home", "menu":"Home", "link":"/home", "display":displayMenu, "active":false},
			{"id":"benefits", "menu":"Benefits", "link":"/benefits", "display":displayMenu, "active":false},
			{"id":"features", "menu":"Features", "link":"/features", "display":displayMenu, "active":false},
			{"id":"howitworks", "menu":"How it works", "link":"/howitworks", "display":displayMenu, "active":false},
			{"id":"display", "menu":"FAQs", "link":"/faqs", "display":displayMenu, "active":false},
			{"id":"blogs", "menu":"Blogs", "link":"/blogs", "display":displayMenu, "active":false},
			{"id":"contact", "menu":"Contact", "link":"/contact", "display":displayMenu, "active":false},
			{"id":"schedule", "menu":"Schedule Demo", "link":"/scheduledemo", "display":displayMenu, "active":false},
			{"id":"testimonials", "menu":"Testimonials", "link":"/testimonials", "display":displayMenu, "active":false}
		];

	}

	ngOnInit() {
		
		this.companylogo = 'assets/logo-dark.png';
		

		this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			this.setIconMenu();
			this.loggedIn = false;
			
			if(typeof(userdata) !== "undefined" && userdata !== null)
			{
				this.user = userdata;
				this.userName= "";
				if(typeof(this.user["firstname"]) !== "undefined")
				{
					this.userName = this.user["firstname"];
					this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
				}

				if(typeof(this.user["lastname"]) !== "undefined")
				{
					var lastname = this.user["lastname"].charAt(0).toUpperCase() + this.user["lastname"].slice(1);
				this.userName = this.userName + " " + lastname;
				}

				this.loggedIn = true;
				this.userRole =  this.user["role"];
				this.userRoleDet = this.user["role"];
				if(this.user["role"] == "DM")
				this.userRoleDet =  "Decision Maker";

				if(this.user["role"] == "IV")
				this.userRoleDet =  "Interviewer";

				if(this.user["role"] == "IN")
				this.userRoleDet =  "Investigator";

				if(this.user["role"] == "ADMIN")
				this.userRoleDet =  "Administrator";
				this.setIconMenu();

				this.companylogo = 'assets/logo-dark.png';
				this.companyname = "";
				

				if(typeof(this.user["company"]) !== "undefined" && this.user["company"] !== "")
				{
					
					this.subscribeCompanyService = this.dbService.getData("company/"+ this.user["company"]).subscribe(companyData => setTimeout(() => {


					//	if(companyData["companylogo"] !== "")
					//	this.companylogo =  companyData["companylogo"];
					//	console.log(this.companylogo);

						if(companyData["company"] !== "")
						this.companyname = companyData["company"];


					}, 0));
				}

			}

		}, 0));
	}

	setIconMenu()
	{
		console.log("In setIconMenu");
		this.mHome= false;
		this.mLogin = false;
		this.mRequest = false;
		this.mContact = false;
		this.mAbout = false;
		this.mStore = false;

		if (this.router.url.indexOf("home") !== -1) {
			this.mHome = true;
		}

		if (this.router.url.indexOf("request") !== -1) {
			this.mRequest = true;
		}
		console.log(this.mRequest);
		if (this.router.url.indexOf("contact") !== -1) {
			this.mContact = true;
		}

		if (this.router.url.indexOf("about") !== -1) {
			this.mAbout = true;
		}

		if (this.router.url.indexOf("store") !== -1) {
			this.mStore = true;
		}

	}
	
	logout()
	{

		this.loggedIn = false;
		sessionStorage.removeItem("user");
		let username = this.userService.logout();

		sessionStorage.setItem('currentUser', "");
		
		this.router.navigate(['login']);
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
