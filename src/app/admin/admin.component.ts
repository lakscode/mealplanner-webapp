import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
	session:any;
	details: any;
	showMainpage: any;
	currentPhase: any;
	caseId: any;

  	constructor(private router: Router, private route: ActivatedRoute, config: NgbCarouselConfig) { }

  	ngOnInit() {
	
	}
}
