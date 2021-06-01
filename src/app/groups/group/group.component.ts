import { Component, OnInit,OnDestroy, OnChanges  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { constants } from './../../jsonfiles/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

import { PDFService } from '../../services/pdf.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
	selector: 'app-group',
	templateUrl: './group.component.html',
	styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnChanges {
	private onDestroy$: Subject<void> = new Subject<void>();
	nutrientsList: Array<any> =[];
	routeParams: any = {};
	group: any;
	loading:any = 0;
	paramMicro: Array<any> =[];
	mineralsList: Array<any> =[];
	ingredients: Array<any> =[];
	instructions: Array<any> = [];
	totalWeight: any=0
	calories: any=0
	currentUser: any;
	apiUrl: any = "";
	ispublic: boolean = false;
	searchparam: any = {};
	dietLabelsList: Array<any> = [];
	healthlabelsList: Array<any> = [];
	mineralsLabelsList: Array<any> = [];
	searchmorebar:boolean = false;
	addItem: boolean = false;
	showNutrientsFlag: boolean = false;
	communityOwner: boolean  = false;
	setFav: boolean = false;
	showActions: any = {};

	urlShare : any = "";
urlTweet : any;
urlWhatsApp: any;
msg: any = "";
newcomment: any = {};
type: any = "";
newquestion: any = {};
	constructor(private router: Router, private sanitize: DomSanitizer, private route: ActivatedRoute, private toastr: ToastrService, private pdfService: PDFService, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder, private modalService: ModalService) {
	
	}
ngOnChanges()
{
	console.log("ngOnchanges");
	this.loadDefaults();
}
	ngOnInit() {
		this.loadDefaults();

		this.setFav = false;
	//	this.getFavouriteStatus();
	}
	loadShareValue()
	{
		var appUrl = environment.appUrl;
		this.urlShare = window.location.href;
		
		this.msg = "Join this group today: " +  this.group["group_name"];
		
			if (this.urlShare.indexOf("localhost") !== -1) {
				this.urlShare = this.urlShare.replace("http://localhost:4200", appUrl)
			}
			this.urlTweet = "https://twitter.com/share?text=" + this.msg + "&url=" + encodeURIComponent(this.urlShare);
		//this.urlWhatsApp = this.transform("whatsapp://send?" + this.urlShare);
		this.urlWhatsApp = this.transform("https://api.whatsapp.com/send?text=" + this.msg + " " + this.urlShare);
		
	}
loadDefaults()
{
	this.type = "groups";
	this.urlShare = window.location.href;

	this.communityOwner = false;
	this.showActions = {"join": true, "invite":false};
	this.newcomment = {};
	this.newquestion = {};
	this.newcomment["message"] = "";
	this.newquestion["message"] = "";
	this.apiUrl = environment.apiUrl;
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
		  if (typeof (this.routeParams.id) !== "undefined") {
			console.log(this.routeParams.id);
			this.setDefaults();
			this.loadgroup(this.routeParams.id);
		  }    
		  else
		  {
			this.communityOwner = true;
			  this.setDefaults();
		   
	   
		  }
		  if (typeof (this.routeParams.draft) !== "undefined") {
		   console.log(this.routeParams.draft);
		   this.loadgroup(this.routeParams.draft);
		   this.communityOwner = true;
		 }  
		   console.log(this.routeParams);
	}); 

	


}

setDefaults()
{

	
	this.group = {};


}
existingIngCount:any = 0;
loadgroup(id)
{
  console.log("In load group");
 // console.log(id);
  this.loading++;
 // console.log(this.loading);

  this.group = [];
 var params = {}
 if(id)
 {
 params["id"] = id;
 }

 console.log(params);
 
 if(this.loading)
  {
	 var res =   this.dbService.getDataByTable("groups", params).subscribe(rbookData => setTimeout(() => {

	console.log(rbookData);
	this.communityOwner = false;
	 
	if(rbookData !== null)
	{
	  if(typeof(rbookData["body"]) !== "undefined" && rbookData["body"] !== null && rbookData["body"]["length"] > 0)
	  {
		this.group = rbookData["body"][0];
		if(this.currentUser['id'] == this.group['created_by'])
	  	this.communityOwner = true;
		
		  if(this.communityOwner)
		  this.showActions["join"] = false;
		this.loadComments();
	  }
 
	console.log(this.group);
//	this.getJoinStatusCommunity();
	

	}
//	this.getCommunityJoined();
	this.loadShareValue();
  }));
  }

}

commentsList: Array<any> = [];
allcomments: Array<any> = [];
loadComments()
{
	
	this.commentsList = [];
  var params = {};

	

	//params["instructions"] = "notempty";
//	params["query"] = " select id, label, image, healthLabels, dietLabels, calories, yield, totalWeight, totalNutrients, digest from recipes where id in (select recipe_id from recipe_mapping where community_id = " + this.routeParams.id  + ")";
	params["query"] = "select gc.*, u.username, u.firstname, u.lastname, u.email, u.image as userimage from group_comments gc, users u where gc.groupid= " + this.routeParams.id  + " AND u.id = gc.userid" ;
  console.log(JSON.stringify(params));

 var res =   this.dbService.getDatabyQuery("recipes", params).subscribe(invData => setTimeout(() => {
	console.log(invData);
  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
	{	
		
		this.commentsList = [];

		//this.commentsList = invData["body"];
		
		for(let i =0 ; i< invData["body"]["length"] ; i++)
		{
			
			var item = invData["body"][i];
			this.allcomments.push(item);
			if(item.parentid == "0")
			{
				this.commentsList.push(item)
			}
			

		}
		this.loadChildren(this.commentsList);
		console.log(this.commentsList);
		this.getFavouriteStatus();
	}

	this.newComment();
	 
  }

 ));

}

loadChildren(commentsList)
{
console.log("loadCildren");
	for(let x=0; x < commentsList.length; x++)
	{
		var item = commentsList[x];
		console.log(item);
		var filteredArr = this.allcomments.filter(x =>(x.parentid == item.id));
		if(filteredArr["length"] > 0)
		{
			commentsList[x]["children"] = [];
		
			commentsList[x]["children"] = filteredArr;

			if(commentsList[x]["children"]["length"] > 0)
			this.loadChildren(commentsList[x]["children"])
		}	
	}	
}

newComment()
{
	this.commentsList.push({"userid":this.currentUser["id"], "groupid":this.routeParams.id, "parentid":"","message":"","image":"","video":""})
}
/*********** imageand video upload  */


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

formatVal(str)
  {
	return this.helpService.formatValue(str);
  }

  deleteContent(type, index)
  {
	  if(type == "ins")
	  {
		  this.instructions.splice(index, 1);
	  }

	  if(type == "ing")
	  {
		  this.ingredients.splice(index, 1);
	  }
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


 
 closeModal(id) {

   this.modalService.close(id);
 }
 formatLimit(str)
 {
	 var retval = str;
	 if(str !== "")
	 {
 		retval = parseFloat(str).toFixed(2);
	 }
	 return retval;
 }
 formatlabels(str)
 {
	 var retval = str;
	 if(str !== "")
	 {
		retval = str.replace(/~/g, ', ');
	 }
	 return retval;
 }
 formatImage(img)
 {
	 return img.trim();
 }



 getFavouriteStatus()
{
  console.log("get FavouriteStatus");
  console.log(this.setFav);
  var idslist = "";
  for(let i=0; i< this.commentsList.length; i++)
  {
	this.commentsList[i]["UserFavStatus"]= false;
	  idslist += this.commentsList[i]["id"] + ",";
  }
  if(idslist !== "")
  {
	idslist = idslist.substring(0, idslist.length-1);
  }
  var params = {};

  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && idslist !== "")
  {
	//params["userid"] = this.currentUser["id"];
//	params["recipeid"] = this.routeParams.id;
 
	params["query"] = "SELECT recipeid, count(*) as favcount FROM `favourites` where recipeid in (" + idslist + ")group by recipeid"
	var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {
	   if(invData !== null)
	  {
	  console.log(invData);

		if(invData["body"]['length'] > 0)
		{
			for(let k=0; k < invData["body"]['length']; k++)
			{
				var fIndex = this.commentsList.findIndex(x=>(x["id"] === invData["body"][k]["recipeid"]));
				if(fIndex > -1)
				{
					this.commentsList[fIndex]["favcount"] =  invData["body"][k]["favcount"];
				}
			}
		}
		//this.getFavouriteStatusForCurrentUser(idslist);
	  }
	}));
  }
  else
  {
	var parent = this;
	setTimeout(function(){ 
		parent.getFavouriteStatus(); 
	}, 1000);
  }

}

toggleFav(recipe)
{
	console.log(recipe);

	if(typeof(recipe.id) !== "undefined" && recipe.id !== null && recipe.id !== "")
  {
var params = {};

params ['query'] = "select * from favourites where recipeid = " + recipe.id + " AND userid = " + this.currentUser["id"];
var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {

  console.log(invData);
  if(invData !== null && invData["body"]["length"] > 0)
  {
	console.log("removing record");
params = {};
	params["id"] = invData["body"][0]["id"];

	var res =   this.dbService.deleteDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
	 
		var fIndex = this.commentsList.findIndex(x=>(x["id"] === recipe.id));
		console.log(fIndex);
		if(fIndex > -1)
		{
			this.commentsList[fIndex]["UserFavStatus"] =  false;
			this.commentsList[fIndex]["favcount"] = parseInt(this.commentsList[fIndex]["favcount"]) - 1;
		}

	 
	
	}));
  }
  else
{
	console.log("Creating record");
	var params1 = {};
	params1["recipeid"] = recipe.id;
	params1["userid"] = this.currentUser["id"];
	
  var res =   this.dbService.postDataByTable("favourites", params1).subscribe(invData => setTimeout(() => {
	  if(invData !== null)
	  {
		  //alert("Recipe has been set as favourite.");
		  //this.getFavouriteStatus();
		  var fIndex = this.commentsList.findIndex(x=>(x["id"] ===  recipe.id));
		  if(fIndex > -1)
		  {
			  this.commentsList[fIndex]["UserFavStatus"] =  true;
			  this.commentsList[fIndex]["favcount"] = parseInt(this.commentsList[fIndex]["favcount"]) + 1;
		  }
	  }
	}));

	
  }  
}));
  }
}

setFavourite(id)
{
  console.log("set Favourites");
  var params = {};
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {
var params = {};
console.log(params);
params ['query'] = "select * from favourites where recipeid = " + id + " AND userid = " + this.currentUser["id"];
var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {

  console.log(invData);
  if(invData !== null && invData["body"]["length"] > 0)
  {
	 
  }
  else

  {
	  var params1 = {};
	  params1["recipeid"] = id;
	  params1["userid"] = this.currentUser["id"];
	  
	var res =   this.dbService.postDataByTable("favourites", params1).subscribe(invData => setTimeout(() => {
		if(invData !== null)
		{
			alert("favourite has been set");
			//this.getFavouriteStatus();
			var fIndex = this.commentsList.findIndex(x=>(x["id"] === id));
			if(fIndex > -1)
			{
				this.commentsList[fIndex]["UserFavStatus"] =  true;
				this.setFav = true;
				this.commentsList[fIndex]["expand"] = !this.commentsList[fIndex]["expand"];
			}
		}
	  }));
  }
}));

	
  }
}


removeFavourite(id)
{
  console.log("remove Favourites");
  console.log(id);
  var params = {};
  if(typeof(id) !== "undefined" && id !== null && id !== "")
  {

//	params["id"] = id;
	//params["userid"] = this.currentUser["id"];
var params = {};
console.log(params);
params ['query'] = "select * from favourites where recipeid = " + id + " AND userid = " + this.currentUser["id"];
var res =   this.dbService.getDatabyTablebyQuery("favourites", params).subscribe(invData => setTimeout(() => {

  console.log(invData);
  if(invData !== null && invData["body"]["length"] > 0)
  {
params = {};
	params["id"] = invData["body"][0]["id"];

	var res =   this.dbService.deleteDataByTable("favourites", params).subscribe(invData => setTimeout(() => {
		this.setFav = false;
	  if(invData !== null)
	  {
		//this.getFavouriteStatus();
		var fIndex = this.commentsList.findIndex(x=>(x["id"] === id));
		if(fIndex > -1)
		{
			this.commentsList[fIndex]["UserFavStatus"] =  false;
			this.commentsList[fIndex]["expand"] = !this.commentsList[fIndex]["expand"];
		}
	  }
	  //console.log(this.setFav);
	}));
  }

}));

	
  }  
}

getCommunityJoined()
{
//	params["query"] = "select c.*, count(cj.id) as joinedcount from community c, community_join cj where cj.community_id = c.id and c.id = "  + id + " group by cj.community_id ";
	console.log("getCommunityJoined");
	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select count(id) as joinedcount from community_join where community_id = " + this.group["id"] + " group by community_id" ;
	var res =   this.dbService.getDatabyTablebyQuery("community_join", params).subscribe(invData => setTimeout(() => {
		console.log(invData);
		if(invData && invData["body"]["length"] > 0)
		{
			this.group["joinedcount"] = invData["body"][0]["joinedcount"];
		}
	 
	  }));

}

getJoinStatusCommunity()
{

	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select * from group_join where groupid = " + this.group["id"] + " AND userid = " + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("group_join", params).subscribe(invData => setTimeout(() => {

	  console.log(invData);
	  }));
}

joinCommunity()
{

	var params = {};
	//params["created_by"]  = this.currentUser["id"];
	console.log(params);
	params ['query'] = "select * from group_join where groupid = " + this.group["id"] + " AND userid = " + this.currentUser["id"];
	var res =   this.dbService.getDatabyTablebyQuery("group_join", params).subscribe(invData => setTimeout(() => {

	  console.log(invData);
	  if(invData !== null && invData["body"]["length"] > 0)
	  {
		
	  }
	  else
	  {
		var params = {};
		params["groupid"] =this.group["id"];
		params["userid"] =this.currentUser["id"];
		
		var res =   this.dbService.postDataByTable("group_join", params).subscribe(dData => setTimeout(() => {
			alert("Joined group ");
			this.showActions['join'] = true;
		}));

	  }
	}));

}

transform(value: any, args?: any): any {
	return this.sanitize.bypassSecurityTrustHtml(value);
	}

	formatDays(dt)
	{
		return Math.ceil(this.helpService.findDateDiff(dt));
	}


gotopage(){        
   this.router.navigate(["groups"]);    
}

/************888 comments */


saveComment(type, comment= null)
{
  console.log("saveComment");
  var params = {};
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.routeParams.id) !== "undefined" && this.routeParams.id !== null && this.routeParams.id !== "")
  {

	  var params1 = {};
	  params1["groupid"] = this.routeParams.id ;
	  params1["userid"] = this.currentUser["id"];
	  if(comment !== null)
	  params1["parentid"] = comment["id"];
	  if(comment !== null)
	  params1["message"] = comment["message"]
	  if(type == "newcomment")
	  if(this.newcomment !== null && this.newcomment["message"] !== null)
	  {
		 params1["message"] = this.newcomment ["message"]

	  }
	  if(type== "newquestion")
	  if(this.newquestion !== null && this.newquestion["message"] !== null)
	  {
		 params1["message"] = this.newquestion ["message"]

	  }

	  console.log(params1);
	var res =   this.dbService.postDataByTable("group_comments", params1).subscribe(invData => setTimeout(() => {
		if(invData !== null)
		{
			console.log(invData);
			params1["username"] = this.currentUser['displayname'];
			params1["userimage"] = this.currentUser["image"];
			params1["id"] = invData["inserted_id"];
			if(type == "newquestion")
			this.commentsList.push(params1)
			else if(type == "newcomment")
			{
				var fIndex = this.commentsList.findIndex(x => (x.id ==  params1["parentid"]));
				if(fIndex > -1)
				{
					this.commentsList[fIndex]["children"].push(params1);
				}
			}
			this.newquestion["message"] = "";
			this.newcomment["message"] = "";
		}
	  }));
  }

}
resize(field, index = null) {
   console.log(field);
   if(index !== null)
   field  = field + index;
   console.log(field);
    var obj = document.getElementById(field);
   // console.log(obj);
   if(obj !== null)
   {
    obj.style.height = obj.scrollHeight + 'px';
   }
  }

  addChild(comment)
  {
	  comment["children"] = [];
	  comment["children"].push({"message":"", "parentid":comment.id, "userid":this.currentUser["id"], "username":this.currentUser["displayname"]})
  }



}

	