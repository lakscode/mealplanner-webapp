import { Component, OnInit } from '@angular/core';
import { HelpService } from '../../services/help.service';
import { DBService } from '../../dbservices/db.service';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  labels: any;
  subscribe: any = {};
  constructor(private helpService:HelpService, private dbService: DBService, private router: Router, private route: ActivatedRoute) {
    //console.log('Footer constructor called');
  }

  ngOnInit() {
    this.subscribe["email"] ="";
    this.labels={"companyName":this.helpService.getConstants("companyName"), "copyright":this.helpService.getConstants("copyright"), "contactNo":this.helpService.getConstants("contactNo"), contactEmail:this.helpService.getConstants("contactEmail") };

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

   gotopage(page)
    {
    console.log(page);
        this.router.navigate([page]);
    
    }
}
