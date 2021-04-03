import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

@Component({
	selector: 'app-testimonials',
	templateUrl: './testimonials.component.html',
	styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
	userName: any;
	subscribeTestimonialService: any;
	testimonials: Array<any> = [];
	constructor(private router: Router, private route: ActivatedRoute, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService) {
	}
	ngOnInit() {
		this.loadData();
	}

	loadData() {
		this.testimonials = [];
		this.testimonials.push({ "subject": "Melissa Batson, CEO – Sun Builders", "testimonial": "Being your customer is a huge time saver." });

		this.testimonials.push({ "subject": "Testimonial From 2", "testimonial": "I just wanted to share a quick note and let you know that you guys do a really good job. I'm glad I decided to work with you" });

		this.testimonials.push({ "subject": "Testimonial From 3", "testimonial": "I just wanted to share a quick note and let you know that you guys do a really good job. I'm glad I decided to work with you" });

		this.testimonials.push({ "subject": "Testimonial From 4", "testimonial": "I just wanted to share a quick note and let you know that you guys do a really good job. I'm glad I decided to work with you" });

		this.testimonials.push({ "subject": "Testimonial From 5", "testimonial": "I just wanted to share a quick note and let you know that you guys do a really good job. I'm glad I decided to work with you" });

		this.testimonials.push({ "subject": "Testimonial From 6", "testimonial": "I just wanted to share a quick note and let you know that you guys do a really good job. I'm glad I decided to work with you" });

		this.testimonials.push({ "subject": "Testimonial From 7", "testimonial": "I just wanted to share a quick note and let you know that you guys do a really good job. I'm glad I decided to work with you" });

		this.testimonials.push({ "subject": "Testimonial From 8", "testimonial": "I just wanted to share a quick note and let you know that you guys do a really good job. I'm glad I decided to work with you" });

	//	this.LoadTestimonials();
	}


	LoadTestimonials() {
		this.testimonials = [];
		this.subscribeTestimonialService = this.dbService.getData("testimonials").subscribe(fileDatas => setTimeout(() => {
			if (fileDatas["body"]["length"] > 0) {			
			
				for (let i = 0; i < fileDatas["body"]["length"]; i++) {
					var t = fileDatas["body"][i];
				//	if(t["testimonial"] !== "")
				//	t["testimonial"]= this.helpService.formatStringDecode(t["testimonial"]);
					if(fileDatas["body"][i].deleted !=="1")
					this.testimonials.push(t);
				  }
			}
			if (fileDatas["body"]["length"] == 0) {
				//  this.errorMessage = "No Testimonials";
			}
		}));
	}
	ngOnDestroy() {
		if (this.subscribeTestimonialService) this.subscribeTestimonialService.unsubscribe();
	}
}
