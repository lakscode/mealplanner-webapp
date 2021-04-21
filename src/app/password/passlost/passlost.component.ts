import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelpService } from '../../services/help.service';
import { DBService } from '../../dbservices/db.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-passlost',
  templateUrl: './passlost.component.html',
  styleUrls: ['./passlost.component.scss']
})
export class PasslostComponent implements OnInit, OnDestroy {

  userEmail: string ; 
  result: any;
  ngUnsubscribe: Subject<any> = new Subject();
  emailContents: any;
  constructor(private helpService: HelpService, private httpClient: HttpClient, private dbService: DBService) { }

  ngOnInit() {
  this.getEmailContent();
  this.result = 0;
  this.userEmail = "";
  
  }
  getEmailContent(){
    //get email contents
    this.httpClient.get('assets/data/email.json').subscribe(
      emailtemplate => {        
        if(emailtemplate){
          this.emailContents = emailtemplate;
          console.log(this.emailContents);
        }else{
          this.getEmailContent();
        }
      });  
  }

  resetpass()
  { 

  var hasMatch = false;
  var iemail = { "email": this.userEmail};
  console.log(this.userEmail);
  this.dbService.getDatabyParam("users", iemail).subscribe(userData => setTimeout(() => {
  console.log(userData);
  console.log(userData["body"]["length"]);
    if(userData["body"]["length"]>0)
    {
    
      if (userData["body"][0].email == this.userEmail) {
        console.log("email exists" + userData["body"][0].email);
          
          hasMatch = true;
      } 
    }        
   // console.log("hasmatched" + hasMatch);
    if(hasMatch == true) {
      this.result = 1; 
      var data = {};      
      data["emailContent"] = this.emailContents.emails.resetpasswordToken.content;
      data["emailSubject"] = this.emailContents.emails.resetpasswordToken.subject;
      
      if(userData["body"][0]["firstname"] !== "")
      data['username'] =userData["body"][0]["firstname"];
      else
      data['username'] =userData["body"][0]["username"];

      if(userData["body"][0]["lastname"] !== "")
      data['username'] += " " + userData["body"][0]["lastname"];
     this.helpService.SendEmailPasswordReset(this.userEmail,data);
    } else {
      this.result = 2;
    }
  }));
  }


 
ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
