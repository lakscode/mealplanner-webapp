import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { ModalService } from './shared/modules/modal/modal.service';
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

  subscribeParam:any = {};
  loggedIn: any;
  userName: any;
  user: any;



  constructor(private router: Router, private activatedRoute: ActivatedRoute, private modalService: ModalService, private userService: UserService) {
    
  }
 

  ngOnInit() {
    this.subscribeParam["email"] = "";
    this.loggedIn = false;

    var parent = this;
  
   // setTimeout(function(){  parent.openModal('popupformessage'); }, 3000);

    localStorage.setItem('currentUser', "");
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild.snapshot.data.showHeader !== false;
        this.showSidebar = this.activatedRoute.firstChild.snapshot.data.showSidebar !== false;
        this.showFooter = this.activatedRoute.firstChild.snapshot.data.showFooter !== false;
      }
    });
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
      //  console.log(resetsentat);
        var currentDttm = new Date();
     //   console.log(currentDttm);
        var difference = currentDttm.getTime() - resetsentat.getTime();
        var resultInMinutes = Math.round(difference / 60000);
     //   console.log(resultInMinutes);
        var resultInDays = Math.round(difference / (1000 * 3600 * 24));
     //   console.log(resultInDays);
        if(resultInDays > 30)
        {
          sessionStorage.setItem("showRenew", "true")
       // this.openModal("popupforrenew");
        }
       }
      }
      

      }
    }, 0));
  }
  gotopage(page)
  {
    this.closeModal("popupforrenew")
    this.router.navigate([page]);
  }
  openModal(id)
  {
    this.modalService.open(id);
  }
  closeModal(id)
  {
this.modalService.close(id);
  }
  subscribeEmail()
  {

  }
}
