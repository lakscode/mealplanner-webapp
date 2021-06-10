import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../dbservices/db.service';
import { HelpService } from '../services/help.service';

import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DomSanitizer } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-myinfo',
	templateUrl: './myinfo.component.html',
	styleUrls: ['./myinfo.component.scss']

})
export class MyinfoComponent implements OnInit {
	routeParams:any;
	sub:any;
	private onDestroy$: Subject<void> = new Subject<void>();
	currentUser: any;
	currentUserInfo: any;
	tracktypes:Array<any> = [];
	response: any; 
  options: any;
  profileImage: any;
  apiURL : any;
  profilePath: any;
  model: NgbDateStruct;
date: {year: number, month: number};

	constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder, private calendar: NgbCalendar) {
	
	}
	selectToday() {
		this.model = this.calendar.getToday();
	  }
	
	ngOnInit() {

		this.setDefaults();
	}

	setDefaults()
	{
	  this.apiURL = environment.apiUrl;
	  this.profilePath = this.apiURL.replace("/api","");
	  this.profileImage = "assets/user-icon.png";
	 // this.tracktypes = constants.tracktypes;
	
	  this.currentUserInfo = {"dob":"", "age":"", "gender":"", "weight":"", "height":""};
	  this.routeParams = {};
	  this.sub = this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
	   console.log(params);   
		this.routeParams = params;     
		if (typeof (this.routeParams.id) !== "undefined") {
		 console.log(this.routeParams.id);
		  this.loadProfile(this.routeParams.id);
  
		} 
		else
		{
		  this.currentUser =this.helpService.getCurrentUser();
		  if(this.currentUser !== null)
		  {
			this.loadProfile(this.currentUser.id);
		  }
		}  
	 });  
	}
	loadProfile(id)
	{
	  var params  = {'id':  id}
	  console.log(JSON.stringify(params));
	  var res =   this.dbService.getDatabyParam("users", params).subscribe(invData => setTimeout(() => 
	  {
		console.log(invData);
		if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"]["length"] > 0)
		{
		  this.currentUser = invData["body"][0];
		  delete this.currentUser["password"];
		  console.log(this.currentUser);
		  if(this.currentUser["firstname"] !== "")
		  {
			this.currentUser["displayname"] = this.currentUser["firstname"];
			if(this.currentUser["lastname"] !== "")
			{
			this.currentUser["displayname"] += " " + this.currentUser["lastname"];
			}
  
		  }
		  else if(this.currentUser["username"] !== "")
		  {
			this.currentUser["displayname"] = " " + this.currentUser["username"];
		  }
		  if(this.currentUser["dob"] !== "" && this.currentUser['age'] == "")
		  {  
			this.currentUser['age'] = this.getAgeinYears();
		  }
		  if(this.currentUser["image"] !== "")
		  {
		  
		//	this.profileImage = this.profilePath + this.currentUser["image"] ;

			if( this.currentUser["image"].indexOf("http://") !== -1 ||  this.currentUser["image"].indexOf("https://") !== -1)
			this.profileImage = this.currentUser["image"] ;
			else
			this.profileImage = this.profilePath + this.currentUser["image"] ;
		  }
		}
	
	  }));
	}
	getAgeinYears()
	{
	  var dateParam1 = new Date();
	  var dateParam2  = new Date(this.currentUser['age']);
	  var diff =(dateParam2.getTime() - dateParam1.getTime()) / 1000;
	  diff /= (60 * 60 * 24);
			var years = Math.abs(Math.round(diff/365.25));
			console.log(years);
		  return years;
	}
  
	changeInfo(param)
	{
	  console.log(param);
	  if(this.currentUser && this.currentUser["id"])
	  {
		var params = {"id":this.currentUser["id"]}
		params[param] = this.currentUser[param];
		console.log(params);
		if(param == "dob")
		{
		  if(this.currentUser['age'] == "")
		  {
  
		   params['age'] = this.getAgeinYears();
		   this.currentUser['age'] = params['age']; 
		  }
		}
			
				console.log(params);
		if(this.currentUser[param] !== "")
		{
		  var res =   this.dbService.putData("users", params).subscribe(invData => setTimeout(() => 
		  {
			console.log(JSON.stringify(invData));
			delete this.currentUser["password"];
					sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
					let username = this.userService.setUser(this.currentUser);

		  }));
		}
	  }
  
	}
	gotopage(page)
	{
	
	  this.router.navigate([page]);
	}
	client_id: any = "22C62Y";
	client_secret: any = "ced65b437bcd88764093097a725abaaa";
	redirect_uri : any = "https://www.medicaltourismco.com/utility/oauth.php";
  
	
	connect2Fitbit()
	{
	  var access_token = "";

  /*
	 const browser = this.iab.create('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=' + this.client_id + '&redirect_uri=' + this.redirect_uri + '&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight');
   
	 //browser.executeScript();
	 
	 //browser.insertCSS(...);
	 browser.on('loadstop').subscribe(event => {
		 browser.insertCSS({ code: "body{color: red;" });
	 });
	 
	 browser.close();*/
  
	}
  
  


	
	
	saveStats(arr, type)
	{
	
	  var typeid = 0;
	  var findIndex =  this.tracktypes.findIndex(x=> (x.name === type))
	  if(findIndex > -1)
	  {
		typeid = this.tracktypes[findIndex]["id"];
	  }
	  if(typeid == 0)
	  {
		if(type== "steps") typeid = 1;
		if(type== "calories") typeid = 2;
		if(type== "distance") typeid = 3;
	  }
	
	  var obj = arr; 
	
	
	  for(let o=0; o < obj.length; o++)
	  {
	
		var params = {};
		params["starttime"] = obj[o]["startDate"];
		params["endtime"] = obj[o]["endDate"];
		params["measure"] = obj[o]["value"];
		params["unit"] = obj[o]["unit"];
		params["type"] = typeid;
		params["userid"] =  this.currentUser["id"];
	 
		this.saveData(params);
	  }
	  
	}
	
	saveData(params)
	{
  
	  var paramsCheck = {};
	  paramsCheck["starttime"] = params["starttime"];
	  paramsCheck["type"] = params["type"];
	  paramsCheck["userid"] = params["userid"];
	  console.log(paramsCheck);
	  var res =   this.dbService.getDataByTable("workouts",paramsCheck).subscribe(invData => setTimeout(() => 
	  {
	   console.log(invData);
		if(invData !==null && invData["body"]["length"] > 0)
		{
		  params["id"] =invData["body"][0]["id"];
		  this.updateData(params);
		}
		else
		{
		  this.createData(params);
		}
	  }));
	
	 
	}
	
	createData(params)
	{
	  console.log("In createData")
	  console.log(params);
	  var res =   this.dbService.postDataByTable("workouts",params).subscribe(invData => setTimeout(() => 
	  {
		
		
	  }));
	}
  
	updateData(params)
	{
	  console.log("In updateData");
	  console.log(params);
	  var res =   this.dbService.updateDataByTable("workouts",params).subscribe(invData => setTimeout(() => 
	  {
		  console.log(invData);
		
	  }));
	}
  
	/************* uploading user image */
	getImgContent(imgFile) {
	  return this.sanitizer.bypassSecurityTrustUrl(imgFile);
  }
	userPhoto()
	{
	  this.options = {
		quality: 100,
	//	destinationType: this.camera.DestinationType.DATA_URL,
	//	encodingType: this.camera.EncodingType.JPEG,
	//	mediaType: this.camera.MediaType.PICTURE,
		correctOrientation: true,
		saveToPhotoAlbum: true,
	  }
	}
  
  
	fileupload()
	{
	  var obj = document.getElementById('inputuploadimage');
	  if(obj !== null)
	  obj.click();
	}
	uploadedImage;
	base64Image;
	beforeImage;
	afterImage;
	uploadimage()
	{
		
	}

	
	/********************************** */
  
  
	onFileSelect(event) {
	  if (event.target.files.length > 0) {
		const file = event.target.files[0];
		this.getBase64(file).then(
		  data => {
			console.log(data);
  
			var options = {
			  headers : new HttpHeaders({"Content-Type": "application/json"})
			  };       
  
			var imgData = data.toString().replace("data:image/jpeg;base64,","");
			this.profileImage = data.toString();
			this.saveProfileImage(data.toString(), file.name);
			});
		
	 }
	}
  
	saveProfileImage(image, name = "")
	{
	  if(name == "")
	  {
		name = this.currentUser["id"] + "_" + this.currentUser['displayname'] + ".jpg";
	  }
	  else
	  {
		name = this.currentUser["id"] + "_" + name;
	  }
	  console.log(name);
	  console.log(image);
	  var paramsImg = {"image":image, "name":name};
  
	  var res =   this.dbService.uploadImage("profileUpload", paramsImg).subscribe(imgData => setTimeout(() => 
	  {
		console.log(JSON.stringify(imgData));
		if(imgData !== null)
		{
		  if(typeof(imgData['name']) !== "undefined" && imgData['name'] !== null)
		  {
			if(this.currentUser && this.currentUser["id"])
			{
			var params = {"id":this.currentUser["id"]}
			params["image"] = imgData['name'];
		 
			var res =   this.dbService.putData("users", params).subscribe(invData => setTimeout(() => 
			{
			  console.log(JSON.stringify(invData));
			}));
			}
		  }
		}
	  }));
  
	  /*
	  if(this.currentUser && this.currentUser["id"])
	  {
		var params = {"id":this.currentUser["id"]}
	   
			
		
		  var res =   this.dbService.putData("users", params).subscribe(invData => setTimeout(() => 
		  {
			console.log(JSON.stringify(invData));
		  }));
	   
	  }
	  */
  
	}
	getBase64(file) {
	  return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	  });
	}
  
	toggleMore()
	{
	  var obj = document.getElementById("morecontextmenu1");
	  if(obj !== null)
	  {
		if(obj.style.display == "block")
		obj.style.display = "none";
		else
		obj.style.display = "block";
	  }
	}
  
  }
  

	