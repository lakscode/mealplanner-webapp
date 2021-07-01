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

  }
 
 
}
