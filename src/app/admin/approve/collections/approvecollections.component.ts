import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../../services/user.service';
import {  FormBuilder } from '@angular/forms';
import { DBService } from '../../../dbservices/db.service';
import { HelpService } from '../../../services/help.service';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
	selector: 'app-approvecollections',
	templateUrl: './approvecollections.component.html',
	styleUrls: ['./approvecollections.component.scss']
})
export class ApprovecollectionsComponent implements OnInit {
	dataList: Array<any> = [];
	
	routeParams: any;
	currentUser: any;

	private onDestroy$: Subject<void> = new Subject<void>();
	
	noResult: boolean = false;

	filterOpts: any = {};

	constructor(private router: Router, private toastr: ToastrService, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}

	ngOnInit() {
		console.log("ngOnInit");
	
		this.filterOpts = {};
		this.filterOpts = {"submitted":false, "approved": false, "rejected":false, "all":true}
		this.recordType = "";
		this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
		

		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
		  console.log( this.currentUser["displayname"]);
		  
	
		}
		
	
  
	  this.routeParams = {};
	 	this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	  //  console.log(params);   
		this.routeParams = params;     
	  this.loadData();
	 }); 

	}


	limitTo(str, num)
	{
		var retVal = str;
		if(typeof(str) !== "undefined" && str !== "")
		retVal = this.helpService.limitTo(str, num) + "...";
		return retVal;
	}

	formatImage(image, type)
	{
	//  console.log(image);
	  var retImage = image;
	  if(image !== "" && type !== "")
	  {
		retImage = this.helpService.formatImage(image, type);
		
	  }
	//  console.log(retImage);
	  return retImage;
	}

	
	setFLU(str)
	{
		var retValue = str;
		if(str !== "")
		{
			retValue = this.helpService.setInputFirstToUppercase(str);
		}
		return retValue;
	}


  /******** recipes api serach */
  maxcalories: any = "";
  loopCount: any = 0;
	filterRecords(opt)
	{
		this.filterOpts["submitted"] = false;
		this.filterOpts["approved"] = false;
		this.filterOpts["rejected"] = false;
		this.filterOpts["all"] = false;

		this.recordType = opt; 
		this.filterOpts[opt] = true;
		this.loadData();

	}
	showFilters: boolean = false;
	recordType  : any = "";
	loadData()
	{

	var status = "";
	if(this.filterOpts.submitted)
	status = "c.status = 0 ";

	if(this.filterOpts.approved)
	status = "c.status = 1 ";
	
	if(this.filterOpts.rejected)
	status = "c.status = 2 ";

	if(this.filterOpts.all)
	status = "";

	console.log(status);
	console.log('searchProps');
	this.noResult =  false;
  

	 
   var params = {"query": "SELECT c.*, COUNT(rm.id) AS recipecount, u.email, u.firstname, u.lastname FROM collection AS c LEFT JOIN recipe_mapping AS rm ON c.id = rm.collection_id LEFT JOIN users AS u ON c.created_by = u.id "};
   if(status !== "")
   {
	   params["query"] += " where  " + status;
   }
   params["query"] += " GROUP BY c.id";
   
	 
	  console.log(params);
    var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		console.log(invData["body"]["length"]);
		if(invData["body"]["length"] > 0)
		{
			console.log("calling again searchprops");
			this.dataList = invData["body"];		
		}
		else
		{
			this.dataList = [];
			this.noResult =  true;
		}
	  }));

	  
 

		
	}
	chooseactions(collection)
	{
		if(collection.opt == 1)
		{
			this.approvechanges(collection);
		}
		if(collection.opt == 2)
		{
			this.rejectchanges(collection);
		}
	}

	gotopage(page, id){
		console.log(id);
	//this.router.navigate(['recipedetails', id]);
	window.open("/" + page + "/;id:"+ id + "");
	}

 
  formatlabels(str)
  {
	  var ret = str;
	  if(str !== "")
	  ret = str.replaceAll("~", ", ");

	  return ret;
  }




approvechanges(collection)
{
	console.log("approve hancges");
	console.log(collection);
	if(collection["status"] !== 1)
	{
		if(typeof(collection["id"]) !== "undefined" && collection["id"] !== "")
		{
			var params = {};
		params["approved_by"] = this.currentUser["id"];
		params["status"] = "1";
		params["id"] = collection["id"];
		var res =   this.dbService.updateDataByTable("collection", params).subscribe(invData => setTimeout(() => {
			console.log("Modified collection");
			this.toastr.success('Collection ' + collection["collection_name"]  + " has been approved.", 'Manage Collections!');
			this.loadData();
		}
		));
	}
	}
}


rejectchanges(collection)
{
	console.log("reject hancges");
	console.log(collection);
	if(collection["status"] !== 2)
	{
		if(typeof(collection.id) !== "undefined" && collection.id !== "")
		{
			var params = {};
			params["id"] = collection.id;
			params["status"]= "2";
			params["approved_by"] = this.currentUser["id"];
			console.log(params);
			var res =   this.dbService.updateDataByTable("collection", params).subscribe(invData => setTimeout(() => {
				this.toastr.warning('Collection ' + collection["collection_name"]  + " has been rejected.", 'Manage Collections!');
				console.log("Rejected the changes collection");
				this.loadData();
			}));
		}
	}

}
}

	