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
	GeneratePassword(idlength) {
		var characters = "abcdefghijklmnopqrstuvwxyz@#%^&*ABCDEFGHIJKLMNOP1234567890";
		var password = "";
		var charactersLength = characters.length;
		for (var i = 0; i < idlength; i++) {
			password += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return password;
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
	  var temp = sessionStorage.getItem("user");
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
  	
	//  console.log(retImage);

	  return retImage;
	}
	isProfessional(user)
	{
		var returnVal = false;
		if(typeof(user["role"]) !== "undefined")
		{
			if(user["role"] == "PREMIUM")
			{
				returnVal = true;
			}
		}
		return returnVal;

	}

	isEmployee(user)
	{
		var returnVal = false;
		if(typeof(user["role"]) !== "undefined")
		{
			if(user["role"].toString().toUpperCase().indexOf("EMP") !== -1)
			{
				returnVal = true;
			}
		}
		return returnVal;		
	}

	isMasterAdmin(user)
	{

		var res = false;

		if(user["role"] == "SUPERADMIN" || user["role"] == "MASTERADMIN"  || user["role"] == "SYSADMIN" || user["role"] == "DEVADMIN" )
		res = true;

		return res;

	}

	isSuperAdmin(user)
	{

		var res = false;
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(typeof(user["role"] ) !== "undefined" && user["role"]  !== null)
			{
				if(user["role"] == "SUPERADMIN")
				res = true;
			}
		}
		
		return res;

	}

	isAdmin(user)
	{
		var res = false;
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(typeof(user["role"] ) !== "undefined" && user["role"]  !== null)
			{
				if(user["role"] == "SUPERADMIN" || user["role"] == "MASTERADMIN"  || user["role"] == "SYSADMIN" || user["role"] == "DEVADMIN" || user["role"] == "ADMIN"  || user["isAdmin"] == "ADMIN"   || user["isAdmin"] == "CLIENTADMIN"  )
				res = true;
			}
		}
		return res;

	}

	formatStringDecode(str)
{
	var retVal = str;
	if(str !== "")
	{
		retVal = unescape(str);
	//	retVal = retVal.replace("&#39;", "'");
		
	}
	//console.log(retVal);
	return retVal;
}
formatStringEncode(str)
{
	var retVal = str;
	if(str !== "")
	{
		retVal = escape(str);
/*
		retVal = str.replace(/’/g, ' ');
		retVal = retVal.replace(/“/g, ' ');
		retVal = retVal.replace(/”/g, ' ');
		retVal = retVal.replace(/‘/g, '&#39;');
		retVal = retVal.replace(/’/g, '&#39;');
		retVal = retVal.replace(/'/g, '&#39;');
*/

	}

	return retVal;
}

SendEmailPasswordReset(email,data) {
    var paramstoken = { "email": email, "resetdatetime": new Date() };
	console.log(paramstoken);
    this.dbService.resettoken(paramstoken).subscribe(emailData1 => setTimeout(() => {   
		console.log(emailData1);   
      if (emailData1) {      
		  if(typeof(emailData1['status_code']) !== "undefined" && emailData1['status_code'] !== "")
		  {
			  if(emailData1['status_code'] == 1)
			  {
				var params1 = { "email": email };
				this.dbService.getDatabyParam("users", params1).subscribe(emailData => setTimeout(() => { 

					if(emailData["body"]["length"] > 0)
					{

				var temp = emailData['body'][0]['resettoken'];

					if(data == null)
					data = {};
					// var apiUrl = window.location.origin;
					var resetLink = environment.appUrl + "/resetpassword;token=" + encodeURIComponent(temp) + ";email=" + email;
					data['resetLink'] = resetLink;
					data['email'] = email;
					var IemailSubject = this.FormatEmailContent(data.emailSubject, data);
					var IemailContent = this.FormatEmailContent(data.emailContent, data); 
					let Emaildata: any = { "to": email,  "from": environment.fromname+environment.fromemail, "datetime": new Date(), "subject": IemailSubject, "content": IemailContent, "contenthtml": IemailContent };
					 console.log(Emaildata);
					// send email     
					
					this.dbService.postData("email", Emaildata).subscribe(emailData => setTimeout(() => {
					if (emailData) {
					}
					return emailData;
					}, 0));    
				}
				})); 
				}
			}  
      }
    }));
  }


  /***************************************** */
	FormatEmailContent(content, data) {		
		var formattedContent = "";
		formattedContent = content;	
		if(formattedContent && data){			
			

			if(data.username)
			formattedContent = formattedContent.replace(/<username>/gi,data.username.charAt(0).toUpperCase() + data.username.slice(1));
			
			if(typeof(data.userphone) !== "undefined" && data.userphone !== "")
			{
				formattedContent = formattedContent.replace(/<userphone>/gi, "Phone: " + data.userphone + "<br />");
			}
			else
			{
				formattedContent = formattedContent.replace(/<userphone>/gi, "");
			}

			formattedContent = formattedContent.replace(/<useremail>/gi, data.useremail);
			
			if(data.mealplan)
			formattedContent = formattedContent.replace(/<mealplan>/gi, data.mealplan);

			if(data.link)
			formattedContent = formattedContent.replace(/<link>/gi, data.link);

			formattedContent = formattedContent.replace(/<email>/gi, data.email);

			formattedContent = formattedContent.replace(/<name>/gi, data.name);
			formattedContent = formattedContent.replace(/<toname>/gi, data.toname);
			formattedContent = formattedContent.replace(/<phone>/gi, data.phone);

	
			formattedContent = formattedContent.replace(/<password>/gi, data.password);
			
			if(data.firstname)
			formattedContent = formattedContent.replace(/<firstname>/gi, data.firstname.charAt(0).toUpperCase() + data.firstname.slice(1));
			
				
			if(data.lastname)
			formattedContent = formattedContent.replace(/<lastname>/gi, ' '+ data.lastname.charAt(0).toUpperCase() + data.lastname.slice(1));	
			
			if(data.resetLink)
			formattedContent = formattedContent.replace(/<resetLink>/gi, data.resetLink);

			if(data.verifycode)
			formattedContent = formattedContent.replace(/<verifycode>/gi, data.verifycode);
			

			formattedContent = formattedContent.replace(/<location>/gi, data.location);
			formattedContent = formattedContent.replace(/<role>/gi, data.role);
			formattedContent = formattedContent.replace(/<url>/gi, data.appUrl);
			formattedContent = formattedContent.replace(/<logiurl>/gi, data.loginUrl);
			formattedContent = formattedContent.replace(/<workemail>/gi, data.workemail);
	
			formattedContent = formattedContent.replace(/<usertype>/gi, data.usertype);			
			formattedContent = formattedContent.replace(/<companyname>/gi, environment.companyname);			
				
			return formattedContent;			
		}
	
	}
	formatValue(str)
	{
  
	  var retVal = str;
	  if(typeof(str) !== "undefined" && str !== "" )
		{ 
		 retVal = parseFloat(str).toFixed(2);
		
		}
	  return retVal;
	}
	formatValuePServing(str, servings)
  {

    var retVal = str;
    if(typeof(str) !== "undefined" && str !== "")
    {
      retVal = parseFloat(str);
     
      if(typeof(servings) !== "undefined" && servings !== "" && servings !== 0)
      { 
        retVal = (parseFloat(str) /  servings).toFixed(2);
      
      }
    }
    return retVal;
  }


  getMonth(date, num = null)
	{
		const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
		];
		var d = new Date();
		if(date !== null)
		 d = date;
		var monthName= monthNames[d.getMonth()];
		if(num !== null)
		monthName = monthName.substr(0, num);
		else
		monthName = monthName.substr(0, 3);
		return monthName;
	}
	getDay(date, num = null)
	{
		const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
		"Saturday"];
		var d = new Date();
		if(date !== null)
		 d = date;
		var dayName= dayNames[d.getDay()];
		if(num !== null)
		dayName = dayName.substr(0, num);
		else
		dayName = dayName.substr(0, 3);
		
		return dayName;
	}
}