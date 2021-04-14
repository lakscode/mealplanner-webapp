import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { Router, ActivatedRoute } from "@angular/router";
import { DBService } from '../../dbservices/db.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.scss']
})
export class ResetpassComponent implements OnInit, OnDestroy {

  userName: string;
  result: any;
  routeParams: any;
  ngUnsubscribe: Subject<any> = new Subject();
  token: any;
  email: any;
  selectedUser: any;
  password: any;
  confirmpassword; any;
  displaymessage: any;


  constructor(private router: Router, private route: ActivatedRoute, private dbService: DBService, private userService: UserService) { }
  ngOnInit() {
    this.result = 0;
    this.userName = "";
    this.token = "";
    this.email = "";
    this.password = "";
    this.confirmpassword = "";
    this.displaymessage = "";
    if (typeof (this.route.params["_value"]) !== "undefined") {
      this.routeParams = this.route.params["_value"];
      if (typeof (this.routeParams.token) !== "undefined") {
        this.token = decodeURIComponent(this.routeParams.token);
      }
      if (typeof (this.routeParams.email) !== "undefined") {
        this.email = this.routeParams.email;
      }
      if (this.token !== "" && this.email !== "") {
        this.checkIfTokenValid();
      }
    }
  }

  checkIfTokenValid() {
    var params = { "email": this.email, "resettoken": this.token };
    this.dbService.getDatabyParam("users", params).subscribe(userData => setTimeout(() => {
      if (userData["length"] > 0) {
        this.selectedUser = userData[0];
        var resetsentat = new Date(this.selectedUser["resetsentat"].toString());
        var currentDttm = new Date();
        var difference = currentDttm.getTime() - resetsentat.getTime();
        var resultInMinutes = Math.round(difference / 60000);
        if (resultInMinutes > 90) {
          this.result = 2;
          this.displaymessage = "Your reset password token has been expired.";
        }
        else {
          this.result = 0;
          this.displaymessage = "";
        }
      }
      else {
        this.result = 2;
        this.displaymessage = "Your reset password token has been expired.";
      }
    }));
  }
  onSubmit(form) {
    if (form.form.status == 'VALID') {
      this.resetpass();
    }
  }

  resetpass() {
    this.result = 1;
    if (this.password == this.confirmpassword) {
      var params = { "password": this.password };
      this.dbService.putData("users/" + this.selectedUser["_id"], params).subscribe(userData => setTimeout(() => {
        this.result = 1;
        this.displaymessage = "Password has been reset.";
        var paramsRest = { "resetsentat": "", "resettoken": "" };
        this.dbService.putData("users/" + this.selectedUser["_id"], paramsRest).subscribe(userresetData => setTimeout(() => {
        }));
      }));
    }
    else {
      this.result = 3;
      this.displaymessage = "Password and confirm password doesn't match";
    }
  }
  tryagain() {
    this.result = 0;
  }
  trylogin() {
    sessionStorage.removeItem("user");
    sessionStorage.setItem('currentUser', "");
    this.router.navigate(["login"]);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}