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

@Injectable({ providedIn: 'root' })
export class HelpService {
	adalConfig: any;

	constants: any;	
	accesstoken = environment.accessToken;
	emailContents: any;
	secretCode : any = "MTC_2021"


	constructor(private httpService: HttpClient, private router: Router, private route: ActivatedRoute, private dbService: DBService, private userService: UserService, private modalservice: ModalService) {

	}

	isMobile()
	{
		var isMobile = false;
		var innerWidth = window.innerWidth;

		if(innerWidth > 640)
		{
			isMobile = false;
		}
		else
		{
			isMobile = true;
		}
		return isMobile;
	}
	GenerateUniqueId(idlength) {
		var result = '';
		var characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		var charactersLength = characters.length;
		for (var i = 0; i < idlength; i++) {
			if (i !== 0) {
				if (i % 4 == 0 && i !== idlength)
					result += "-";
			}
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
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
	
	sortArraybyIndex(a, b) {
		if ( a[0] < b[0] ){
			return -1;
		  }
		  if ( a[0] > b[0] ){
			return 1;
		  }
		  return 0;
	}


	capitalize(s){
		if (typeof s !== 'string') return ''
		return s.charAt(0).toUpperCase() + s.slice(1)
	  }


	setInputFirstToUppercase(str:string){
		if (!str) return str;
		str = this.replaceSpecialCharacters(str);
		return str.charAt(0).toUpperCase() + str.slice(1);
	 }

	setFirstLetterToUppercase(str:string){
		if (!str) return str;
  	
		str = this.replaceSpecialCharacters(str);
		var newString = str.replace(/(^\s*\w|[\.\!\?]\s+\w)/g,function(c){return c.toUpperCase()});
		return newString;

	  }
	  setFirstLetterToLowecase(str:string){
		if (!str) return str;
  		
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
	
	isValidDate(d) {
		if (Object.prototype.toString.call(d) === "[object Date]") {
	
			if (isNaN(d.getTime())) { 
			  return false;
			} else {
			  return true;
			}
		  } else {
			return false;
		  }
	  }




	formatImage(image, type)
	{

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

	  return retImage;
	}

	findDateDiff(dt)
	{
		var ret = 0;
		if(typeof(dt) !== "undefined" && dt  !== null)
				{

					var Difference_In_Time = new Date().getTime() - new Date(dt).getTime(); 
	
					var diff_days = Difference_In_Time / (1000 * 3600 * 24); 
	
					if(diff_days > 0)
					ret= diff_days;
				}
				return ret;
	}

	isTrialExpired(user)
	{
		var res = false;
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(user["role"] == "TRIAL")
			{
				res = false;
			
				if(typeof(user["created_time"] ) !== "undefined" && user["created_time"]  !== null)
				{

					var Difference_In_Time = new Date().getTime() - new Date(user['created_time']).getTime(); 
	
					var diff_days = Difference_In_Time / (1000 * 3600 * 24); 

					if(diff_days > 0)
					res = true;
				}
			}
		}
		return res;

	}
	
	showorhideNutritions(role)
	{
		var showNutrientsFlag = true;

		if(role["isTrialExpired"])
		 showNutrientsFlag = false;
		else if(role["isPremium"]) 
		showNutrientsFlag = true;		
		else if(role["isProfessional"])
		 showNutrientsFlag = true;

		 return showNutrientsFlag;
	}
	getRoleStatus(user)
	{
		var role = {"isTrialExpired":false, "isPremium":false, "isProfessional":false };
		role["isTrialExpired"] = this.isTrialExpired(user);
		role["isPremium"] = this.isPremium(user);
		role["isProfessional"] = this.isProfessional(user);
		
		return role;
	}
	isTrial(user)
	{
		var returnVal = false;
		if(typeof(user["role"]) !== "undefined")
		{
			if(user["role"] == "TRIAL")
			{
				returnVal = true;
			}
		}
		return returnVal;

	}
	isPremium(user)
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
	isProfessional(user)
	{
		var returnVal = false;
		if(typeof(user["role"]) !== "undefined")
		{
			if(user["role"] == "PROFESSIONAL")
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

	/* roles 

	1 - MASTERADMIN
2 - ADMIN
3 - FREE
4 - PAID
5 - MTC CLIENT
6 - DIETITIAN
7 - DIETITIAN MODERATOR

*/
	isAdmin(user)
	{
		var res = false;
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(typeof(user["role"] ) !== "undefined" && user["role"]  !== null)
			{
				if(user["role"] == 1 || user["role"] == 2 )
				res = true;
			}
		}
		return res;

	}

	isDietician(user)
	{
		var res = false;
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(typeof(user["role"] ) !== "undefined" && user["role"]  !== null)
			{
				if(user["role"] == 1 || user["role"] == 2  || user["role"] == 6 || user["role"] == 7)
				res = true;
			}
		}
		return res;

	}

	isModerator(user)
	{
		var res = false;
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(typeof(user["role"] ) !== "undefined" && user["role"]  !== null)
			{
				if(user["role"] == 1 || user["role"] == 2  || user["role"] == 7)
				res = true;
			}
		}
		return res;

	}


	
	isPaid(user)
	{
		var res = false;
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(typeof(user["role"] ) !== "undefined" && user["role"]  !== null)
			{
				if(user["role"] == 1 || user["role"] == 2 || user["role"] == 4 || user["role"] == 5 || user["role"] == 6 || user["role"] == 7)
		
				res = true;
			}
		}
		return res;

	}

	setUserRoles(user)
	{
		var userObj = {"admin" : false, "dietitian": false, "moderator": false, "paid": false };

		//console.log(user);
		if(typeof(user) !== "undefined" && user !== null)
		{
			if(this.isAdmin(user))
			userObj["admin"]  = true;
			
			if(this.isDietician(user))
			userObj["dietitian"]  = true;

			if(this.isModerator(user))
			userObj["moderator"]  = true;

			if(this.isPaid(user))
			userObj["paid"]  = true;
		}
		//console.log(userObj);
		return userObj;
	}

	formatStringDecode(str)
{
	var retVal = str;
	if(str !== "")
	{
		retVal = unescape(str);

		
	}

	return retVal;
}
formatStringEncode(str)
{
	var retVal = str;
	if(str !== "")
	{
		retVal = escape(str);


	}

	return retVal;
}

SendEmailPasswordReset(email,data) {
    var paramstoken = { "email": email, "resetdatetime": new Date() };

    this.dbService.resettoken(paramstoken).subscribe(emailData1 => setTimeout(() => {   

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
				
					var resetLink = environment.appUrl + "/resetpassword;token=" + encodeURIComponent(temp) + ";email=" + email;
					data['resetLink'] = resetLink;
					data['email'] = email;
					var IemailSubject = this.FormatEmailContent(data.emailSubject, data);
					var IemailContent = this.FormatEmailContent(data.emailContent, data); 
					let Emaildata: any = { "to": email,  "from": environment.fromname+environment.fromemail, "datetime": new Date(), "subject": IemailSubject, "content": IemailContent, "contenthtml": IemailContent };
			
				 
					
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

			if(data.recipebook)
			formattedContent = formattedContent.replace(/<recipebook>/gi, data.recipebook);

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

			formattedContent = formattedContent.replace(/<role>/gi, data.role);
			formattedContent = formattedContent.replace(/<url>/gi, data.appUrl);
			formattedContent = formattedContent.replace(/<logiurl>/gi, data.loginUrl);
			formattedContent = formattedContent.replace(/<workemail>/gi, data.workemail);
	
			formattedContent = formattedContent.replace(/<usertype>/gi, data.usertype);			
					
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
     
      if(typeof(servings) !== "undefined" && servings !== "" && servings !== "0" && servings !== 0)
      { 
        retVal = (parseFloat(str) /  parseInt(servings)).toFixed(2);
      
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

	
	sortArraybyName(a, b) {
		//	return b.name - a.name;
			if ( a['name'] < b['name'] ){
				return -1;
			  }
			  if ( a['name'] > b['name'] ){
				return 1;
			  }
			  return 0;
		}

	saveSearchHistory(searchwords, category, page, userid)
	{
		var params = {};
		params["text"] =  searchwords;
		params["category"] =  category;
		params["userid"] =  userid;
		params["page"] = page;
	
		var res =   this.dbService.getDataByTable("search_history", params).subscribe(recipeData => setTimeout(() => {
			//console.log(recipeData);
	
		
		}));		
	}

	scrape_recipe() {
	
		
	  }

	  import_url_save(userid, url, module)
	  {
		  var params = {};
		  params['url'] = url;


		this.dbService.getDataByTable("import_url", params).subscribe(resData => setTimeout(() => {  
			if(resData && resData["body"]["length"] > 0)
			{

			}
			else
			{
				params['created_by'] = userid;
				params['module'] = module;
				this.dbService.postDataByTable("import_url", params).subscribe(invData => setTimeout(() => {  

				}));
			}
		}));

		

	  }
	   
	 
	  getIpaddress(user)
	  {
	
		fetch("https://api.ipify.org/?format=json"),function(response) {
            alert(response.ip);
        };
		
		  
		
	}


	formatText(str)
	{
		var retStr = str;
		if(str !== "")
		{
		
			retStr = str.replace(/tsp/gi, 'tbsp')
			retStr = retStr.replace(/teaspoons/gi, 'tbsp')
			retStr = retStr.replace(/teaspoon/gi, 'tbsp')
			retStr = retStr.replace(/tablespoons/gi, 'tbsp')
			retStr = retStr.replace(/tablespoon/gi, 'tbsp')
			retStr = retStr.replace(/cups/gi, 'cup')
		
			retStr = retStr.replace("u2013", "-"); 
			 
			retStr = retStr.replace("u00bc", " 1/4");
			retStr = retStr.replace("u00bc", " 1/2");
			retStr = retStr.replace("u00bd", " 3/4");
			retStr = retStr.replace("u2153", " 1/3");
			retStr = retStr.replaceAll("  ", " ");
		}
		return retStr;
	}

	todayDate()
	{
		//console.log("in todayDate");
		var d = new Date();
	  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

	  var tempDt2 = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), dayname: weekdays[d.getDay()], mmddyyy: d.getMonth() + 1 + "-" + d.getDate() + "-" + d.getFullYear(), monthname : months[d.getMonth()] };
		return tempDt2;
	}

	getGreetings()
	{
	   var today = new Date()
	   var curHr = today.getHours()
	   var retval = "Good Day";
	   if (curHr < 12) {
		retval ='Good Morning';
	   } else if (curHr < 18) {
		retval= 'Good Afternoon';
	   } else {
		retval= 'Good Evening';
	   }
	   return retval;
	}
}