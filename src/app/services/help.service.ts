import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { DBService } from '../dbservices/db.service';
import { UserService, User } from './user.service';
import { ModalService } from '../shared/modules/modal/modal.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { share } from 'rxjs/operators';
import { constants } from '../jsonfiles/constants.js';


import { ignorewordsArr } from '../jsonfiles/ignorewords.js';
import * as CryptoJS from 'crypto-js';
import { AES, enc } from "crypto-js";
@Injectable({ providedIn: 'root' })
export class HelpService {
	adalConfig: any;
	private interviwerEmailContent: any;
	private interviweeEmailContent: any;	
	constants: any;	
	accesstoken = environment.accessToken;
	emailContents: any;
	secretCode : any = "MTC_2021"
	constructor(private httpService: HttpClient, private router: Router, private route: ActivatedRoute, private dbService: DBService, private userService: UserService, private modalservice: ModalService) {

	}
	encryptPass(str) {  
	 
		return CryptoJS.AES.encrypt(str.trim(), this.secretCode).toString();  
	   
   }  
   decryptPass(str) {  
   
	   return CryptoJS.AES.decrypt(str.trim(), this.secretCode).toString(CryptoJS.enc.Utf8);  
 
	 
   }
   getCurrentUser()
   {
	  var currentUser = null;
	  var temp = localStorage.getItem("user");
	  if(typeof(temp) !== "undefined")
	   currentUser =JSON.parse(temp);
   return currentUser;
  
   }

   limitTo(str, num=30)
   {
	   var retStr =str;
	   if(num !== null)
	   retStr = str.substr(0, num);
	   else
	   retStr = str.substr(0, 3);

	   return retStr;
   }
   
	getConstants(str)
	{
		return constants[str];
	}
	gotoPage(page) {
		this.router.navigate(["investigation/" + page]);
	}
	
	CheckModuleEnabled(moduleName) {
		var data = localStorage.getItem("menuitems");		
		var result = false;
		var menuItems = JSON.parse(data);
		if (menuItems !== null) {
			for (let i = 0; i < menuItems.length; i++) {
				var temp = menuItems[i];
				
				if (temp.link == moduleName) {
				if(temp['closestate'] == true || temp['closestate'] == 'true')
				{
					result = true;
				}
				else if (temp.disabled == false)
						result = false;
					else
						result = true;
				}
			}
		}		
		return result;
	}
	CurrentDateTime() {
		var d = new Date();
		var tempDt2 = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
		var tempTm2 = { hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds() };
		var tempTm = "";
		var am_pm;
		var hours;
		if (tempTm2 != null)
		{
			
			if(tempTm2.hour < 12)
			{
				am_pm = "AM";
			} 
			else
			{
				am_pm = "PM";
			}
	  		hours = tempTm2.hour
			if(tempTm2.hour > 12)
			hours = tempTm2.hour-12;
			if(hours == 0 && am_pm == "PM")
			hours = 12;
		}
		var tempDt = "";
		tempDt = tempDt2.month + "-" + tempDt2.day + "-"  + tempDt2.year ;
		var tempTm = "";
		//tempTm = ('0' + tempTm2.hour).slice(-2) + ":" + ('0' + tempTm2.minute).slice(-2);
		tempTm = ('0' + hours).slice(-2) + ":" + ('0' + tempTm2.minute).slice(-2) + " " +am_pm;
		return tempDt + " " + tempTm;
	}
	CurrentUser() {
		this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			if (typeof (userdata) !== "undefined" && userdata !== null) {
				return userdata;
			}
		}, 0));
	}
	


	sortArraybyCreatedAt(a, b) {
		return new Date(b.createdat).getTime() - new Date(a.createdat).getTime();
	}
	sortArraybyLastModified(a, b) {
		return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
	}
	sortArraybyIndex(a, b) {
		if ( a[0] < b[0] ){
			return -1;
		  }
		  if ( a[0] > b[0] ){
			return 1;
		  }
		  return 0;
	}

	sortArraybyCompany(a, b) {
		if ( a["company"] < b["company"] ){
			return -1;
		  }
		  if ( a["company"] > b["company"] ){
			return 1;
		  }
		  return 0;
	}
	sortArraybyLoc(a, b) {
		if ( a["location"] < b["location"] ){
			return -1;
		  }
		  if ( a["location"] > b["location"] ){
			return 1;
		  }
		  return 0;
	}
	sortArraybyLocation(a, b) {
		if ( a.location.toLowerCase() < b.location.toLowerCase() ){
			return -1;
		  }
		  if ( a.location.toLowerCase() > b.location.toLowerCase() ){
			return 1;
		  }
		  return 0;
	}


	sortArraybyFirstname(a, b) {
		if ( a.firstname < b.firstname ){
			return -1;
		  }
		  if ( a.firstname > b.firstname ){
			return 1;
		  }
		  return 0;
	}
	capitalize(s){
		if (typeof s !== 'string') return ''
		return s.charAt(0).toUpperCase() + s.slice(1)
	  }

	sortArraybyFirstnameI(a, b) {
		if ( a.firstname.toLowerCase() < b.firstname.toLowerCase() ){
			return -1;
		  }
		  if ( a.firstname.toLowerCase() > b.firstname.toLowerCase() ){
			return 1;
		  }
		  return 0;
	}

	setInputFirstToUppercase(str:string){
		if (!str) return str;
		str = this.replaceSpecialCharacters(str);
		return str.charAt(0).toUpperCase() + str.slice(1);
	 }

	setFirstLetterToUppercase(str:string){
		if (!str) return str;
  		//return str[0].toUpperCase() + str.substr(1).toLowerCase();
		//return str.charAt(0).toUpperCase() + str.slice(1);
		str = this.replaceSpecialCharacters(str);
		var newString = str.replace(/(^\s*\w|[\.\!\?]\s+\w)/g,function(c){return c.toUpperCase()});
		return newString;

	  }
	  setFirstLetterToLowecase(str:string){
		if (!str) return str;
  		//return str[0].toUpperCase() + str.substr(1).toLowerCase();
		//return str.charAt(0).toUpperCase() + str.slice(1);
		str = this.replaceSpecialCharacters(str);
		var newString = str.replace(/(^\s*\w|[\.\!\?]\s+\w)/g,function(c){return c.toLowerCase()});
		return newString;

	  }
	  replaceSpecialCharacters(txt)
	  {
		var returnTxt : string = "";
		
		if(txt !== "")
		{
		returnTxt = txt.replace(/’/g, '\'');
		returnTxt = returnTxt.replace(/“/g, '\"');
		returnTxt = returnTxt.replace(/”/g, '\"');
		returnTxt = returnTxt.replace(/-/g, '-');
		

		}
		
		
		
		return returnTxt;
	  }
	getDateIgnoreClassList()
	{
		var ignoreClassesList = ["ngb-tp-input",
				"chevron ngb-tp-chevron bottom",
				"chevron ngb-tp-chevron",
				"btn-light ng-star-inserted bg-primary text-white",
				"btn-light text-muted outside ng-star-inserted",
				"btn-light ng-star-inserted",
				"ngb-dp-day",
				"ngb-dp-weekday",
				"ngb-dp-weekday small ng-star-inserted",
				"ngb-dp-navigation-chevron",
				"ngb-dp-arrow", 
				"ngb-dp-arrow-btn",
				"ngb-dp-header bg-light",
				"ng-star-inserted",
				"popup-datetime",
				"custom-select",
				"ngb-tp-meridian",
				"btn btn-outline-primary",
				"btn btn-link ng-star-inserted",
				"ngb-dp-week",
				"calclose",
				"ngb-tp",
				"ngb-tp-meridian",
				"ngb-tp-input-container",
				"ngb-tp-input-container ngb-tp-minute",
				"ngb-tp-input-container ngb-tp-hour"];

		return ignoreClassesList;		
	}

	LockUrl(data)
	{
		if(typeof(data["_id"]) !== "undefined")
		{
			return this.dbService.putData("lockurls/" + data["_id"], data).pipe(
			map((res) => res)).pipe(share());
		}
		else
		{
			return this.dbService.postData("lockurls", data).pipe(
				map((res) => res)).pipe(share());
		}
	}


	public getBrowserName() {
		if(typeof(window) !== "undefined" && typeof(window.navigator) !== "undefined")
		{
			var agent = window.navigator.userAgent.toLowerCase()
			switch (true) {
			case agent.indexOf('edge') > -1:
				return 'edge';
			case agent.indexOf('opr') > -1 && !!(<any>window).opr:
				return 'opera';
			case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
				return 'chrome';
			case agent.indexOf('trident') > -1:
				return 'ie';
			case agent.indexOf('firefox') > -1:
				return 'firefox';
			case agent.indexOf('safari') > -1:
				return 'safari';
			default:
				return 'other';
			}
		}
		else
		{
			return "unknown";
		}
	}
	FindSimilarCases(text)
	{
		
		//    console.log(text);
		   text = text.replace(/[&\/\\#, +()$~%.'":*?<>-_{}]/g, ' ');
		   text = text.replace(/[0-9]/g, ' ');
		   var textArr = text.split(" ");
		//    console.log(textArr);
		   var ignorewords = ignorewordsArr;

		   for(let i= 0; i < textArr["length"]; i++)
		   {
				if(ignorewords.indexOf(textArr[i]) > -1 || textArr[i]["length"] < 3)
				{
					textArr[i] = "";
				}
		   }
		  
		   var params = [];
		   for(let i= 0; i < textArr["length"]; i++)
		   {
			   if(textArr[i] !== "")
				params.push(textArr[i]);
		   }

  		//    console.log(params);

		   /*
		   this.dbService.postData("investigations/similarcases", params).subscribe(invData => setTimeout(() => {  

		   }));

		   */

		
	}	
	isValidDate(d) {
		if (Object.prototype.toString.call(d) === "[object Date]") {
			// it is a date
			if (isNaN(d.getTime())) {  // d.valueOf() could also work
			  return false;
			} else {
			  return true;
			}
		  } else {
			return false;
		  }
	  }

	CatchErrorModule(obj)
	{
		var params = {"company": obj.company, 
		"caseid": obj.caseid,
		"module": obj.module, 
		"error": obj.error, 
		"details":obj.details,
		"createdbyname": obj.createdname,
		"createdby":obj.userid,
		"createdat": new Date()}


		this.dbService.postData("logevents", params).subscribe(invData => setTimeout(() => {  

		}));
	}



	formatImage(image, type)
	{
	//	console.log(image);
	  var retImage = image;
	 
	  if(image !== "" && typeof(type) !== "undefined" && type !== "")
	  {
	
		var fIndex = image.lastIndexOf(".");
		if(image.lastIndexOf(".jpg"))
		{
			retImage = image.replace(".jpg", "-" + type + ".jpg");
		}
		else if(image.lastIndexOf(".png"))
		{
			retImage = image.replace(".png", "-" + type + ".png");
		}
		else if(image.lastIndexOf(".jpeg"))
		{
			retImage = image.replace(".jpeg", "-" + type + ".jpeg");
		}
		else if(image.lastIndexOf(".webp"))
		{
			retImage = image.replace(".webp", "-" + type + ".webp");
		}
		else
		{
			retImage = image;
		}
  
	  }
	  else if(image !==  "" && typeof(type) == "undefined")
	  {
		retImage = image;
	  }
  	
	  console.log(retImage);

	  return retImage;
	}

}