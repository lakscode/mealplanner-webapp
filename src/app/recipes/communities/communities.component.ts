import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { constants } from '../../jsonfiles/constants';

//declare var $: any;

@Component({
	selector: 'app-communities',
	templateUrl: './communities.component.html',
	styleUrls: ['./communities.component.scss']
})
export class CommunitiesComponent implements OnInit {
	recipesList: Array<any> = [];
	recipesList1: Array<any> = [];
	recipesList2: Array<any> = [];
	routeParams: any;
	currentUser: any;
	searchparam: any ; 
	ratingIds: any;


	ratingsArr: Array<any> = [];
	listorgrid: any = {};
	private onDestroy$: Subject<void> = new Subject<void>();
	dietLabelsList: Array<any> = [];
	healthlabelsList: Array<any> = [];
	mineralsLabelsList: Array<any> = [];
	searchmorebar: boolean = false;
	animClass: any = "";
	page_num: any = 0;
	totalPage: any = 0;
	displayList: Array<any> = [];
	nutrientDbFields : Array<any> = [];
	role: any = {};
	showNutrientsFlag: boolean = false;

	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder) {
	
	}
	
	
	ngOnInit() {
	
				this.listorgrid = {"menu":"grid", "panel":"listing-grid"}


	 $('.listing-buttons span').on("click",function(){
        $('.listing-buttons span').removeClass("current");
        if( $(this).hasClass("grid")){
            $(this).addClass("current");
            if($(".recipe-listing").hasClass("listing-list")){
                $(".recipe-listing").removeClass("listing-list").addClass("listing-grid");
            }

        }
        if( $(this).hasClass("list")){
            $(this).addClass("current");
            $(".recipe-listing").removeClass("listing-grid").addClass("listing-list");

        }
    });


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
		  this.role = this.helpService.getRoleStatus(this.currentUser);

		  
		}
		
	
	  this.totalPage = 1;
	 this.page_num = 0;

	 
	
  
	  this.routeParams = {};
	 	this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	  //  console.log(params);   
		this.routeParams = params;     
	
		
		console.log(this.routeParams);
	  this.searchProps();
	 }); 

//this.loadRecipes()
	
	}


	
	counter(i: number) {
	//	console.log(i);
		var num = Math.ceil(i);
		return new Array(num);
	}
	prevPage()
	{
		if(this.page_num > 0)
		{
			this.page_num -= 1;
		}
		this.getDisplayList();
	}
	nextPage()
	{
		
		if(this.page_num > 0 && this.page_num < this.totalPage-1)
		{
			this.page_num += 1;
		}
		this.getDisplayList();
	}
	currentPage(pagenum)
	{
	//	console.log(pagenum);
		this.page_num = parseInt(pagenum);
		this.getDisplayList();
	}

	getDisplayList()
	{
	//	console.log(this.recipesList1);
	//	console.log(this.page_num);
		this.displayList=[];
		var startIndex= this.page_num*10;
		var endIndex = 10;

		if(startIndex + endIndex > this.recipesList1["length"])
		{
			endIndex = this.recipesList1["length"]-startIndex;
		}

	//	console.log(startIndex);
	//	console.log(endIndex);
endIndex = startIndex+ endIndex;
		for(let i=startIndex; i < endIndex; i++)
		{
		this.displayList.push(this.recipesList1[i]);
		
		}
	//	console.log(this.displayList);
		window.scrollTo(0, 0);
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

	setListorGrid(opt)
	{
		//		this.listorgrid = {"menu":"", "panel":"listing-grid"}
		console.log(this.listorgrid);
		this.listorgrid["menu"] = opt;
		this.listorgrid["panel"] = "listing-" + opt;
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
  communitiesList: Array<any> = [];
	searchProps()
	{

		this.communitiesList = [];
	   // var params = {"limit": 100};
	   // params["createdby"] = this.currentUser["id"];
		console.log(params);
		var params = {"query": "SELECT c.*, COUNT(rm.id) AS recipecount, u.email, u.firstname, u.lastname FROM community AS c LEFT JOIN recipe_mapping AS rm ON c.id = rm.community_id LEFT JOIN users AS u ON c.created_by = u.id GROUP BY c.id"};

		var res =   this.dbService.getDatabyTablebyQuery("community", params).subscribe(invData => setTimeout(() => {
	
		  console.log(invData);
		  if(invData !== null)
		  {
			var obj = invData["body"]["length"];
			console.log(invData["body"]);
			this.communitiesList = invData["body"];
			
			console.log(this.communitiesList);
			this.loaduserCount();
		  }
		}));
	
		
	}




	gotoRecipebook(id){
	this.router.navigate(['community', id]);
	}

 gotopage(page , params = null)
    {
        console.log("in gotopage");
        var param = {};
        if(params !== null)
        param = params;
        this.router.navigate([page, param]);
    
    }
  

  formatVal(str)
  {
	return this.helpService.formatValue(str);
  }

 
	formatValuePServing(str, servings)
  {

    var retVal = this.helpService.formatValuePServing(str, servings);
    return retVal;
  }
  countrecipes(recipes)
  {
	  var retval = 0;
	if(recipes !== "")
	{
		var temp = recipes.split(",");
		if(temp.length > 0)
		retval = temp.length;
	}

	  return retval;
  }

  loaduserCount()
  {
	  /*
	SELECT c.id, COUNT(cj.id) AS usercount
	FROM community AS c
	LEFT JOIN community_join AS cj ON c.id = cj.community_id
	GROUP BY c.id, cj.community_id

	*/

	console.log("in loadusercount");
	var params = {"query": "SELECT c.id, COUNT(cj.id) AS usercount 	FROM community AS c LEFT JOIN  community_join AS cj ON c.id = cj.community_id GROUP BY c.id, cj.community_id"};

	var res =   this.dbService.getDatabyTablebyQuery("community", params).subscribe(invData => setTimeout(() => {

	 
	  if(invData !== null)
	  {
		var obj = invData["body"];
		for(let o=0; o < obj.length; o++)
		{
			var fIndex = this.communitiesList.findIndex(x=>(x.id === obj[o]["id"]));
			
			if(fIndex > -1)
			{
				console.log(obj[o]["usercount"])
				this.communitiesList[fIndex]["userscount"] = obj[o]["usercount"];
				console.log(this.communitiesList[fIndex]["userscount"] );
			}
		}

	  }
	}));

  }
}

	