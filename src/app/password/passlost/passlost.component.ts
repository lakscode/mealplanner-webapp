import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelpService } from '../../services/help.service';
import { DBService } from '../../dbservices/db.service';

@Component({
  selector: 'app-passlost',
  templateUrl: './passlost.component.html',
  styleUrls: ['./passlost.component.scss']
})
export class PasslostComponent implements OnInit, OnDestroy {

  userEmail: string ; 
  result: any;
  ngUnsubscribe: Subject<any> = new Subject();

  constructor(private helpService: HelpService, private dbService: DBService) { }

  ngOnInit() {
  
  this.result = 0;
  this.userEmail = "";
  
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
     this.SendEmailPasswordReset(this.userEmail,null);
    } else {
      this.result = 2;
    }
  }));
  }


  SendEmailPasswordReset(email,data) {
    var paramstoken = { "email": email };
    this.dbService.postData("users/resettoken", paramstoken).subscribe(emailData => setTimeout(() => {      
      if (emailData) {      
        // var apiUrl = window.location.origin;
        var resetLink = window.location.origin + "/resetpassword;token=" + encodeURIComponent(emailData["hash"]) + ";email=" + email;
        data['resetLink'] = resetLink;
        data['email'] = email;
        var IemailSubject = this.FormatEmailContent(data.emailSubject, data);
        var IemailContent = this.FormatEmailContent(data.emailContent, data); 
        let Emaildata: any = { "to": email,  "from": environment.fromname+environment.fromemail, "datetime": new Date(), "subject": IemailSubject, "content": IemailContent, "contenthtml": IemailContent };
        // console.log(Emaildata);
        // send email     
        this.SaveEmailData(null, Emaildata);    
        this.dbService.postData("email", Emaildata).subscribe(emailData => setTimeout(() => {
          if (emailData) {
          }
          return emailData;
        }, 0));       
      }
    }));
  }
ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
