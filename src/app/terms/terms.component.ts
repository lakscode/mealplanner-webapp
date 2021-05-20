import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {


  constructor(private router: Router, private route: ActivatedRoute) {
	 
	}

  	ngOnInit() {

		
    	
  
	}


	

	gotopage(page)
	{
		this.router.navigate([page]);	
	}
}


