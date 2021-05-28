import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { DBService } from './dbservices/db.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

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
  
    localStorage.setItem('currentUser', "");
/*
    this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {

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
          var resultInDays = Math.round(difference / (1000 * 3600 * 24));
  
        if(resultInDays > 30)
        {
          sessionStorage.setItem("showRenew", "true")

        }
       }
      }
      

      }
    }, 0));
    */
  }
 
 
}
