import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
              style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('1s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AppComponent implements OnInit {
  showHeader = false;
  showSidebar = false;
  showFooter = false;
  showBookDemo = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {
  }
  loggedIn: any;
  userName: any;
  user: any;
  chatwindowdisplay: any;
  ngOnInit() {
    this.chatwindowdisplay = "chatwindownone";
    localStorage.setItem('currentUser', "");
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild.snapshot.data.showHeader !== false;
        this.showSidebar = this.activatedRoute.firstChild.snapshot.data.showSidebar !== false;
        this.showFooter = this.activatedRoute.firstChild.snapshot.data.showFooter !== false;
      }
    });
    this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
      this.loggedIn = false;
      if (typeof (userdata) !== "undefined" && userdata !== null) {
        this.user = userdata;
        this.userName = this.user["userName"];
        if(this.user["loggedIn"])
       this.loggedIn = this.user["loggedIn"];

      }
    }, 0));
  }
  togglebookdemo() {
    this.showBookDemo = !this.showBookDemo;
  }
  openchat() {
    window.open("https://www.myincidentreport.com/");
  }

  
  togglechat()
  {
      if(this.chatwindowdisplay == "chatwindowdisplay")
     this.chatwindowdisplay = "chatwindownone";
    else
    this.chatwindowdisplay = "chatwindowdisplay";

  }
 
}
