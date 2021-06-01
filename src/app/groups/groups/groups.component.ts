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
import { ModalService } from '../../shared/modules/modal/modal.service';
import { HttpHeaders } from '@angular/common/http';

//declare var $: any;

@Component({
	selector: 'app-groups',
	templateUrl: './groups.component.html',
	styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
	recipesList: Array<any> = [];
	recipesList1: Array<any> = [];
	recipesList2: Array<any> = [];
	routeParams: any;
	currentUser: any;
	searchparam: any ; 
	ratingIds: any;
	group: any;

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
	apiUrl: any;

	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder, private modalService: ModalService) {
	this.group = {};
	}
	
	
	ngOnInit() {
	
				this.listorgrid = {"menu":"grid", "panel":"listing-grid"};
				this.apiUrl = environment.apiUrl;
				this.group = {};



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
		
		if(typeof(str) !== "undefined" && str !== null && str !== "")
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
		var params = {"query": "SELECT c.*, COUNT(rm.id) AS userscount, u.email, u.firstname, u.lastname FROM groups AS c LEFT JOIN group_join AS rm ON c.id = rm.groupid LEFT JOIN users AS u ON c.created_by = u.id GROUP BY c.id"};

		var res =   this.dbService.getDatabyTablebyQuery("groups", params).subscribe(invData => setTimeout(() => {
	
		  console.log(invData);
		  if(invData !== null)
		  {
			var obj = invData["body"]["length"];
			console.log(invData["body"]);
			this.communitiesList = invData["body"];
			for(let o=0; o < this.communitiesList.length; o++)
			{
			this.communitiesList[o]["image"] =encodeURI( this.communitiesList[o]["image"]);
			}

			console.log(this.communitiesList);
			//this.loaduserCount();
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

    createNew(){
      this.modalService.open('createNew');

    }
	editGroup(cItem){
		
		this.group = cItem; 
		this.modalService.open('createNew');
  
	  }
  closeModal(id) {

   this.modalService.close(id);
 }

 saveGroup()
{
	console.log("saveGroup");
	console.log(this.group);
	var params = {};
	
	if(this.group["group_name"] !== "")
	{
		params["group_name"] = this.group["group_name"];
	
		if(typeof(this.group["description"]) !== "undefined" && this.group["description"] !== "")
		params["description"] = this.group["description"];

		if(typeof(this.group["image"]) !== "undefined" && this.group["image"] !== "")
		params["image"] = this.group["image"];



		if(typeof(this.group["created_by"]) =="undefined" || this.group["created_by"] == "" || this.group["created_by"] == "0")
		{
		if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== "")
		params["created_by"] = this.currentUser["id"];
		}   
		if(typeof(this.group.id) !== "undefined"  && this.group.id !== "")
		{
			console.log("updating");
			params["id"] = this.group.id;
			console.log(params);
			var res =   this.dbService.updateDataByTable("groups", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
				//this.toastr.success('Updated Recipe Book!', 'Recipe Book!');	
				//this.loadCommunity(this.community.id);
				this.searchProps();
				
			}));
			 this.modalService.close('createNew');
		}
		else
		{
		
			console.log("adding");
			console.log(params);
			var res =   this.dbService.postDataByTable("groups", params).subscribe(recipeData => setTimeout(() => {
				console.log(recipeData);
				//this.toastr.success('Saved Recipe Book!', 'Recipe Book!');
				if(recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "")
				{
					//this.loadCommunity(recipeData['inserted_id']);
					this.searchProps();	
				}
			}));
			 this.modalService.close('createNew');
		}
	}	

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
	var params = {"query": "SELECT g.id, COUNT(gj.id) AS usercount 	FROM groups AS g LEFT JOIN group_join AS gj ON g.id = gj.groupid GROUP BY g.id, gj.groupid"};

	var res =   this.dbService.getDatabyTablebyQuery("groups", params).subscribe(invData => setTimeout(() => {

	 
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

  fileupload()
{
  var obj = document.getElementById('inputuploadrecipe');
  if(obj !== null)
  obj.click();
}
onFileSelect(event) {
	console.log("Fileselect");
	var type = "image";

console.log("type " + type);
  if (event.target.files.length > 0) {
	const file = event.target.files[0];
	this.getBase64(file).then(
	  data => {
		console.log(data);


		var options = {
		  headers : new HttpHeaders({"Content-Type": "application/json"})
		  };

		var params = {};
		
		params["image"]= data.toString();

		params["name"]= this.currentUser["id"] + "_" + new Date().getTime() + "_"  + file.name;
	//	console.log(JSON.stringify(params));
		this.dbService.uploadMedia(params).subscribe(resultData => setTimeout(() => {
		  console.log(resultData);
		  if(typeof(resultData) !== "undefined" && resultData !== null)
		  {
			if(typeof(resultData["name"]) !== "undefined" && resultData["name"] !== null && resultData["name"] !== "")
			{
				var urlapi = this.apiUrl.replace("/api","");

			  this.group["image"] = urlapi + resultData["name"];
			console.log(type);	
			  console.log(this.group)
			}
		  }
		}));
	});
  }
}

getBase64(file) {
  return new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => resolve(reader.result);
	reader.onerror = error => reject(error);
  });
}
}

	