import {Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';

import {BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { share } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class DBService {

apiUrl = environment.apiUrl;
accesstoken = environment.accessToken;
localPath: any;  
localFile: any;
   constructor (private httpService: HttpClient) {  
 //  console.log(this.apiUrl);
	this.localPath = false;
	this.localFile  = false;
   }

  getLocalData(path){
   
	var tempUrl = path; 

	return this.httpService.get(tempUrl).pipe(share());

}
 
getData(path){

	var options = {
	   headers : new HttpHeaders({"Content-Type": "application/json"})
   };
   
	var tempUrl = this.apiUrl + '/' + path + "/read.php"; 

	return this.httpService.get(tempUrl, options).pipe(share());

}


   getDatabyParam(path, params){

	   var tempUrl = this.apiUrl + '/' + path + '/search.php'; 

	   var options = {
		   headers : new HttpHeaders({"Content-Type": "application/json"})
		   };

	   return this.httpService.post(tempUrl, JSON.stringify(params), options).pipe(
	   map((res) => res)).pipe(share());

  }
  getDatabyFields(path, params){

	var tempUrl = this.apiUrl + '/' + path + '/read_by_fields.php'; 

	var options = {
		headers : new HttpHeaders({"Content-Type": "application/json"})
		};

	return this.httpService.post(tempUrl, JSON.stringify(params), options).pipe(
	map((res) => res)).pipe(share());

}
	getDatabyQuery(path, params){

		var tempUrl = this.apiUrl + '/' + path + '/read_by_query.php'; 

		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json"})
			};

		return this.httpService.post(tempUrl, JSON.stringify(params), options).pipe(
		map((res) => res)).pipe(share());

	}
checkIfExists(path, params){

	var tempUrl = this.apiUrl + '/' + path + '/exists.php'; 

	var options = {
		headers : new HttpHeaders({"Content-Type": "application/json"})
		};

	return this.httpService.post(tempUrl, JSON.stringify(params), options).pipe(
	map((res) => res)).pipe(share());

}

   postData(path, input){
	//   console.log(input);
	   var tempUrl = this.apiUrl + '/' + path + "/create.php"; 
	   

	   var options = {
		   headers : new HttpHeaders({"Content-Type": "application/json"})
		   };
	 
	   return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
		   map((res) => res)).pipe(share());
   }
   
   
   putData(path, input){

	   var tempUrl = this.apiUrl + '/' + path + "/update.php"; 
	//	  console.log(tempUrl);
	   var options = {
		   headers : new HttpHeaders({"Content-Type": "application/json"})
		   };
	 
	   return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
		   map((res) => res)).pipe(share());
   }
 
   
 

	getRecipes(input){
		console.log("In get recipes");
		var APPKEY = "5e97880c99ac48af5a876ccd6595fea2";
		var APPID="b4ed857b";
		var tempUrl = "https://api.edamam.com/search?app_id=" + APPID + "&app_key=" + APPKEY + "&q=" + input; 
	//	console.log(tempUrl);
		//curl "https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3&calories=591-722&health=alcohol-free"

	
		var options = {
			//headers : new HttpHeaders({"Content-Type": "application/json"})
            };
	  /*
		return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
			map((res) => res)).pipe(share());
		}*/

		return this.httpService.get(tempUrl, options).pipe(
			map((res) => res)).pipe(share());
		

	}


	/************ common  */


	
	
	   getDataByTable(path, input){
	
		   var tempUrl = this.apiUrl + '/common/search.php'; 
	
		   var options = {
			   headers : new HttpHeaders({"Content-Type": "application/json"})
			   };
			   input["tablename"]=path;
			//   console.log(input);
		   return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
		   map((res) => res)).pipe(share());
	
	  }
	  getDatabyTablebyQuery(path, params){

		var tempUrl = this.apiUrl + '/common/read_by_query.php'; 
		params["tablename"]=path;
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json"})
			};

		return this.httpService.post(tempUrl, JSON.stringify(params), options).pipe(
		map((res) => res)).pipe(share());

	}
	
	   postDataByTable(path, input){
		//   console.log(input);
		   var tempUrl = this.apiUrl + "/common/create.php"; 
		   
	
		   var options = {
			   headers : new HttpHeaders({"Content-Type": "application/json"})
			   };
			   input["tablename"]=path;
			   console.log(input);
		   return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
			   map((res) => res)).pipe(share());
	   }
	   
	   
	   updateDataByTable(path, input){
	
		   var tempUrl = this.apiUrl + "/common/update.php"; 
		//	  console.log(tempUrl);
		   var options = {
			   headers : new HttpHeaders({"Content-Type": "application/json"})
			   };
		 
			input["tablename"]=path;
		   return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
			   map((res) => res)).pipe(share());
	   }

	   deleteDataByTable(path, input){
	
		var tempUrl = this.apiUrl + "/common/delete.php"; 
	 //	  console.log(tempUrl);
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json"})
			};
	  
		 input["tablename"]=path;
		return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
			map((res) => res)).pipe(share());
	}

	uploadImage(path, input){
	
		var tempUrl = this.apiUrl + "/" + path + ".php"; 
	 //	  console.log(tempUrl);
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json"})
			};
	  
		return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
			map((res) => res)).pipe(share());
	}

}