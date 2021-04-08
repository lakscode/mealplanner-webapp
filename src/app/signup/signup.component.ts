import { Component, OnInit, } from '@angular/core';
import {HelpService} from "../services/help.service"

import { ActivatedRoute, Router } from '@angular/router';


import {DBService} from "../dbservices/db.service";
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
 
screenwidth: any;
screenheight: any;
shakeitcls: any;
username: any;
pass: any;
routeParams: any; 
emailphone: any;
errorMessage: any;
userObj: any = {};
role: any;
sub: any;
  errorPassMatch: any;

  constructor(private router: Router, private route: ActivatedRoute, private helpService: HelpService, private dbService: DBService) { 
    this.role = "FREE";
    this.errorMessage = "";
    this.shakeitcls = "";
      this.errorPassMatch = "";
    this.username = "";
    this.pass = "";
    
 } 


  ngOnInit() {
    console.log("login ngOnInit");
    this.loadDefaults();
  }

  ionViewDidEnter() {
    console.log("login ionViewDidEnter");
   this.loadDefaults();

  }
 
  loadDefaults()
  {
    this.username = "";
    this.pass = "";
  
    this.userObj = {"username":"", "email":"", "password":"", "confirmpass":""}

    this.routeParams = {};
    this.sub = this.route.params.subscribe(params => {
    //  console.log(params);   
      this.routeParams = params;     
      if (typeof (this.routeParams.plan) !== "undefined" && this.routeParams.plan !== "") {
        this.role = this.routeParams.plan.toUpperCase();
        this.userObj['role'] = this.routeParams.plan.toUpperCase();
      }   
   });  
  }

signup()
{
  console.log(this.userObj);
  var validEmail = true;
  if(this.userObj.email !== "")
  validEmail = this.ValidateEmail(this.userObj.email);

  console.log(validEmail);
if(this.userObj.username == "" ||  this.userObj.confirmpass == "" || this.userObj.password == "" || this.userObj.email == "")
{
  this.errorMessage = "All the fields are mandatory.";
}
else if(this.userObj.password == "" ||  this.userObj.confirmpass == "")
{
  this.errorMessage = "Passwords are empty.";
}
else if(this.userObj.password !== "" && this.userObj.password == this.userObj.confirmpass)
{
  if(this.userObj.username == "")
  {
    this.errorMessage = "Username is empty.";
  }
  else if(this.userObj.email == "")
  {
    this.errorMessage = "Email is empty.";
  }
  else if(!validEmail)
  {
    this.errorMessage = "Email is not valid.";
  }
  else
  {
  var params  = {'username': this.userObj.username, 'email':this.userObj.email}
  console.log(JSON.stringify(params));
  var res =   this.dbService.checkIfExists("users", params).subscribe(invData => setTimeout(() => 
  {
   this.errorMessage = "";
   console.log(invData);
 
   if(invData !== null)  
   {
     if(typeof(invData["body"]) !== "undefined" && invData["body"] !== null)
     {

      if(invData["body"]["length"] > 0)
      {
        var temp = invData["body"];
  
        this.errorMessage = "User already exists.";
        var record = invData["body"][0];
        var found = 0;
        if(record["username"].toLowerCase() == this.userObj.username.toLowerCase())
        {
          this.errorMessage = "Username already exists.";
          found = 1;
        } 
        else if(record["email"].toLowerCase() == this.userObj.email.toLowerCase())
        {
          this.errorMessage = "Email already exists.";
          found = 2;
        }
          console.log("found " + found);
      }
      else
      {
        console.log("All values are fine");
        console.log(validEmail);
        var encryptedPass = this.helpService.encryptPass(this.userObj["password"]);
        console.log(encryptedPass );

        var dcryptedPass = this.helpService.decryptPass(encryptedPass);
        console.log(dcryptedPass );
        var params = {
          "username":this.userObj["username"],
          "email":this.userObj["email"],
          "password":encryptedPass
        }
        console.log(params);
        var res =   this.dbService.postData("users", params).subscribe(invData => setTimeout(() => 
        {
          console.log(invData);
          if(invData !== null)
          {
            if(typeof(invData["result"]) !== "undefined" && invData["result"] == "success")
            {
              this.errorMessage = "User has been created. ";
              var parent = this;
                setTimeout(function(){ 
                  parent.gotologin();
                }, 3000);
            }
          }
        }));

      }
    }
     
   }  
   console.log(this.errorMessage);
  }));

  }
}
else
{
  this.errorMessage = "Passwords doesn't match.";
}

console.log(this.errorMessage);
 
}
ValidateEmail(inputText)
{
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(inputText.match(mailformat))
  {
  return true;
  }
  else
  {
  return false;
  }
}
resetAll()
{
  this.shakeitcls = "";
}
gotologin()
{
  console.log("in gotologin");

  this.router.navigate(["login"]);
  
}

  matchPass()
{

  if(this.userObj.password !== this.userObj.confirmpass)
  {
  this.errorPassMatch = "Passwords doesn't match";
  }

}
  clearError(type)
  {

    //if(type == "signup")
    //this.errorSignup = "";
  }


}
