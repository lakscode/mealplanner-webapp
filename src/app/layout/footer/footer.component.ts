import { Component, OnInit } from '@angular/core';
import { HelpService } from '../../services/help.service';
import { DBService } from '../../dbservices/db.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  labels: any;
  subscribe: any = {};
  constructor(private helpService:HelpService, private dbService: DBService) {
    //console.log('Footer constructor called');
  }

  ngOnInit() {
    this.subscribe["email"] ="";
    this.labels={"companyName":this.helpService.getConstants("companyName"), "copyright":this.helpService.getConstants("copyright")};
  }
  subscribeEmail()
  {
    console.log(this.subscribe);
    if(this.subscribe.email)
    {
      //this.helpService.savesubscribeemail(this.subscribe.email);
      var params={};
      params["email"] = this.subscribe.email;

      console.log(params);
      var res =   this.dbService.postDataByTable("subscriptions", params).subscribe(recipeData => setTimeout(() => {
        console.log(recipeData);
    
      
      }));	

    }
    
  }
}
