import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { DBService } from './dbservices/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeader = false;
  showSidebar = false;
  showFooter = false;

  subscribeParam:any = {};
  loggedIn: any;
  userName: any;
  user: any;



  constructor(private router: Router, private dbService: DBService,   private userService: UserService) {
    
  }
 

  ngOnInit() {
    this.subscribeParam["email"] = "";
    this.loggedIn = false;

    
    var parent = this;
    setTimeout(() => {
    try{
    this.dbService.getLocalData("http://www.geoplugin.net/json.gp").subscribe(ipdata => setTimeout(() => 
    {
     console.log(ipdata);
     if(typeof(ipdata) !== "undefined" && ipdata !== null && typeof(ipdata['geoplugin_request']) !== "undefined" && ipdata['geoplugin_request'] !== "")
     {
       var ipaddress = ipdata['geoplugin_request'];
       if(typeof(ipaddress) !== "undefined" && ipaddress !== null && ipaddress !== "")
       {
         localStorage.setItem("ipaddress", ipaddress);
       }
     }
    }));
  }
  catch(error)
  {
    console.log(error);
  }
    }, 6000);

    localStorage.setItem('currentUser', "");
    /*
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild.snapshot.data.showHeader !== false;
        this.showSidebar = this.activatedRoute.firstChild.snapshot.data.showSidebar !== false;
        this.showFooter = this.activatedRoute.firstChild.snapshot.data.showFooter !== false;
      }
    });
    */
    this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
     // console.log(userdata);
      this.loggedIn = false;
      if (typeof (userdata) !== "undefined" && userdata !== null) {
        this.user = userdata;
        this.userName = this.user["userName"];
        if(this.user["loggedIn"])
       this.loggedIn = this.user["loggedIn"];
       var showRenew = sessionStorage.getItem("showRenew");
       if(typeof(showRenew) == "undefined" || showRenew !== "true")
       {
       if(typeof(this.user["created_time"]) !== "undefined" && this.user["created_time"] !== "")
       {
        var resetsentat = new Date(this.user["created_time"].toString());

        var currentDttm = new Date();

        var difference = currentDttm.getTime() - resetsentat.getTime();
        var resultInMinutes = Math.round(difference / 60000);
     //   console.log(resultInMinutes);
        var resultInDays = Math.round(difference / (1000 * 3600 * 24));
  
        if(resultInDays > 30)
        {
          sessionStorage.setItem("showRenew", "true")

        }
       }
      }
      

      }
    }, 0));
  }
 
 
}
