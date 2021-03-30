import {Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';

import {BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { share } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class DBService {

apiUrl = environment.apiUrl;
accesstoken = environment.accessToken;
  
   constructor (private httpService: HttpClient) {  
 //  console.log(this.apiUrl);

   }
   
  getData(path){
	 //console.log("db service getData");
	 var options = {
		headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
	};
	
	 var tempUrl = this.apiUrl + '/' + path; 
	// console.log(tempUrl);
     return this.httpService.get(tempUrl, options).pipe(share());

 }
 
 
 
 
	getDatabyParam(path, params){
		//console.log("db service getDatabyParam");
		var tempUrl = this.apiUrl + '/' + path + '/byValue'; 
	//	console.log(tempUrl);
	//	console.log(JSON.stringify(params));
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
			};

		return this.httpService.post(tempUrl, JSON.stringify(params), options).pipe(
		map((res) => res)).pipe(share());

   }
 
	getDatabyField(path, field){
		//console.log("db service getDatabyParam");
		var tempUrl = this.apiUrl + '/' + path + '/getField/' + field; 

		//console.log(JSON.stringify(field));
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
			};

		return this.httpService.get(tempUrl, options).pipe(
		map((res) => res)).pipe(share());

   }

   
	postDatabyField(path, field, params){
		//console.log("db service getDatabyParam");
		var tempUrl = this.apiUrl + '/' + path + '/getField/' + field; 

		//console.log(JSON.stringify(field));
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
			};

			return this.httpService.post(tempUrl, JSON.stringify(params), options).pipe(
				map((res) => res)).pipe(share());



   }

	postData(path, input){
	//	console.log("db service postData");
		
		var tempUrl = this.apiUrl + '/' + path; 
		
	//	console.log(tempUrl);
		
	//	console.log(JSON.stringify(input));
	 	  
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
            };
	  
		return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
			map((res) => res)).pipe(share());
	}
	
	
	putData(path, input){
		//console.log("db service putData");
	//	console.log(path);
	//	console.log(input);
		var tempUrl = this.apiUrl + '/' + path; 
	//	console.log(tempUrl);
		
		//console.log(JSON.stringify(input));
	 	  
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
            };
	  
		return this.httpService.put(tempUrl, JSON.stringify(input), options).pipe(
			map((res) => res)).pipe(share());
	}
	
  
	
	deleteData(path){
		//console.log("db service deleteData");
		
		var tempUrl = this.apiUrl + '/' + path; 

	 	  
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
            };
	  
		return this.httpService.delete(tempUrl, options).pipe(
			map((res) => res)).pipe(share());
	}

	uploadData(path, input): Observable<Blob>{
//	console.log("db service uploadData");
//	console.log(input);
		
		var tempUrl = this.apiUrl + '/' + path; 

	 	  
		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken}),
                responseType : 'blob' as 'json'
            };
	  
		return this.httpService.post<Blob>(tempUrl, input, options).pipe(
			map((res) => res)).pipe(share()); 

	}


	getDatabyBambooHr(path){
		//console.log("db service getData");
		var tempUrl =  this.apiUrl + '/' + "email/bamboohr"; 
	    //console.log(tempUrl);
		var input = {"url": path}

		var options = {
			headers : new HttpHeaders({"Content-Type": "application/json","access-token":this.accesstoken})
		};
  
	return this.httpService.post(tempUrl, JSON.stringify(input), options).pipe(
		map((res) => res)).pipe(share());


   
	}
	


 
 
}