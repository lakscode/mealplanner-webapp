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

  userName: string ; 
  result: any;
  ngUnsubscribe: Subject<any> = new Subject();

  constructor(private helpService: HelpService, private dbService: DBService) { }

  ngOnInit() {
  
  this.result = 0;
  this.userName = "";
  
  }
  resetpass()
  { 

  var hasMatch = false;
  var iemail = { "email": this.userName};
  this.dbService.getDatabyParam("users", iemail).subscribe((userData: any[]) => setTimeout(() => {
    if(userData.length > 0)
    {
      if (userData[0].email == this.userName) {
        //console.log("email exists" + userData[0].email);
          
          hasMatch = true;
      } 
    }        
   // console.log("hasmatched" + hasMatch);
    if(hasMatch == true) {
      this.result = 1; 
     // this.helpService.SendEmailPasswordReset(this.userName,null);
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
