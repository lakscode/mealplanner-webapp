import {Injectable } from '@angular/core';
import {BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
@Injectable({providedIn: 'root'})
export class UserService {
  userData = new BehaviorSubject<User>(new User());
  user : User;  
  constructor () {  this.user = new User();}  
  setUser(userObj: any ) :void
  {    
    sessionStorage.setItem('username',userObj.username);
    sessionStorage.setItem("user",JSON.stringify(userObj));
    localStorage.setItem('username',userObj.username);
    localStorage.setItem("user",JSON.stringify(userObj));
    this.user = userObj;
  	this.user.loggedIn = true;
    this.userData.next(this.user);
  }  
  
  logout() :void {
    sessionStorage.removeItem('username');
    localStorage.removeItem('username');
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    this.user.loggedIn = false;
    this.userData.next(null);
  }	

  loggedinUser() : Observable<User> {
    this.user =JSON.parse(sessionStorage.getItem("user"));
    this.user =JSON.parse(localStorage.getItem("user"));
    if(this.user){
      this.user.loggedIn = true;
      this.user =JSON.parse(sessionStorage.getItem("user"));
    this.user =JSON.parse(localStorage.getItem("user"));

    this.userData.next(this.user);
    }   
    return this.userData.asObservable().pipe(share());
  } 
}
export class User
{
	_id: string = "";
	userName:string = "";
	userRole: string="";
	userRoleId: string = "";
  loggedIn: boolean = false;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  createdby: string;
  createdat: string;
  role: string;
  rolename:string;
  company: string;
  location: string;
  uniqueid: string = "";
  user_ipaddress: string = "";
}

