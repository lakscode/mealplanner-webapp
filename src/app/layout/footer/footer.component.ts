import { Component, OnInit } from '@angular/core';
import { HelpService } from '../../services/help.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  labels: any;
  subscribe: any = {};
  constructor(private helpService:HelpService) {
    //console.log('Footer constructor called');
  }

  ngOnInit() {
    this.subscribe["email"] ="";
    this.labels={"companyName":this.helpService.getConstants("companyName"), "copyright":this.helpService.getConstants("copyright")};
  }
  subscribeEmail()
  {
    console.log(this.subscribe);
  }
}
