import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {







  constructor(private router: Router, private route: ActivatedRoute) {
	 
	}

  	ngOnInit() {

		
    	
  
	}


	

	gotopage(page)
	{
		this.router.navigate([page]);	
	}
}


