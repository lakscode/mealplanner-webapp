import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../services/common';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  labels: any;
  constructor(private helpService:HelperService) {
    //console.log('Footer constructor called');
  }

  ngOnInit() {
    this.labels={"companyName":this.helpService.getConstants("companyName"), "copyright":this.helpService.getConstants("copyright")};
  }

}
