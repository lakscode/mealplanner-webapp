import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelpService } from '../../../services/help.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DBService} from "../../../dbservices/db.service"
import {environment} from "../../../../environments/environment"
@Component({
  selector: 'app-socialshare',
  templateUrl: './socialshare.component.html',
  styleUrls: ['./socialshare.component.scss']
})
export class SocialshareComponent implements OnInit {
  @Input() urlShare: string;
  @Input() labeltext: string;
  @Output() returnData: EventEmitter<any> = new EventEmitter();
  labels: any;

urlTweet : any;
urlWhatsApp: any;
msg: any = "";
  constructor(private helpService: HelpService, private dbService: DBService, private sanitizer: DomSanitizer) { 
  
    }

  ngOnInit() {
    this.initialization();
       

  }
  
  initialization()
  {

    
    var appUrl = environment.appUrl;
    this.urlShare = window.location.href;

    this.msg = "Tried this recipe today: " + this.labeltext;

		if (this.urlShare.indexOf("localhost") !== -1) {
			this.urlShare = this.urlShare.replace("http://localhost:4200", appUrl)
		}
		this.urlTweet = "https://twitter.com/share?text=" + this.msg + "&url=" + encodeURIComponent(this.urlShare);
    //this.urlWhatsApp = this.transform("whatsapp://send?" + this.urlShare);
    this.urlWhatsApp = this.transform("https://api.whatsapp.com/send?text=" + this.msg + " " + this.urlShare);


  }
  transform(value: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  addSearchData(form)
  {
   
  }

}
