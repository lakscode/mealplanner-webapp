import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { UserService, User } from '../../services/user.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
import {environment} from "../../../environments/environment"

@Component({
	selector: 'app-manage-users',
	templateUrl: './manage-users.component.html',
	styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
	currentUser: any;
	companyData: any;
	location: any;
	dropdownSettings: any;
	users: Array<any> = [];
	userAccess: Array<any> = [];
	toggleUserUpload: boolean = false;
	user: any;
	willDownload: any = false;
	emailContents: any;
	successMessage: any;
	userPassresetSubscribe: any;
	showPass: Array<any> = [];
	companyList: any;
	companyname: any;
	companyDataSubscribe: any;
	usersSubscribe: any;
	getusersSubscribe:any;
	updateusersSubscribe: any;
	newUserWoEmail: any;

	currentCompany: any;
	deleteUserContent: any;
	selectedItemDelete: any;
	selectedIndexDelete: any;
	modalHeading: any;
	modaltext: any;
	gridOptions: any;
	columnDefs: Array<any> = [];
	rowData: any;
	formSubmitted: boolean = false;
	subscribeUserService: any;

	isAuthorised: boolean = false;
	isMasterAdmin: boolean = false;
	isDevAuthorised: boolean = false;
	companyLocations: any;
	usersMessage: any = "";
	viewMode: boolean = false;
	locationSListwords: any;


	subscribeLoadUser: any;
	inNew: any;
	dmNew: any;
	intNew: any;
	displaytext: any;
	gridOptionsUsers: any;
	rowDatauser: any;


	loading: boolean = false;
	lastUpdatedBy: any;	
	searchParam: any;
	userRole: any;
	popupCols: any = "col-3";
	locationsList: Array<any> = [];
	countries: Array<any> = [];
	chooseOption: any = "";
	statusData: any;
	attachphotosList: Array<any>= [];
	selectedUser: any;
	displayImage:any;
	apiUrl : any;
	uploadUrl : any;
	constructor(private router: Router, private modalService: ModalService, private activatedRoute: ActivatedRoute, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService, private userService: UserService) { }

	ngOnInit() {
		this.statusData = {};
		this.chooseOption = "";
		this.countries = [];
		this.popupCols = "col-12 col-lg-3";
		this.userRole = "";
		this.activatedRoute.paramMap.subscribe(params => {
			this.userRole = params.get('id');
		});

		this.activatedRoute.params.subscribe(routeParams => {
			if (typeof (routeParams.type) !== "undefined") {
				this.userRole = (routeParams.type);
			}
		});
		this.searchParam = { "email": "", "firstname": "", "phone": "", "role": "" };
		this.lastUpdatedBy = null;
		this.rowDatauser = [];
		this.usersMessage = "";
		this.currentUser = null;
		this.displayImage=null;
	
		this.companyname = "";

		this.inNew = "";
		this.dmNew = "";
		this.intNew = "";		

		this.modaltext = "";
		this.modalHeading = "";
		this.loading = false;
		this.locationSListwords = "";
		this.viewMode = false;
		this.usersMessage = "";
		this.companyLocations = [];
		this.currentUser = null;
		this.companyname = "";
		this.showPass = [];
		this.users = [];
		this.companyData = [];
		this.dropdownSettings = { "idField": "id", "textField": "locationname" };
		this.userAccess.push({ "role": "ADMIN", "rolename": "Administrator" });
		this.userAccess.push({ "role": "EMPLOYEE", "rolename": "Employee" });
		this.userAccess.push({ "role": "REALTOR", "rolename": "Realtor" });
		this.userAccess.push({ "role": "CUSTOMER", "rolename": "Customer" });
		this.attachphotosList = [];
		this.selectedUser = null;
		this.apiUrl = environment.apiUrl;
		if(this.apiUrl !== "")
		{
			this.uploadUrl = this.apiUrl.replace("/api", "");
		}
		this.columnDefs = [
			
			{ headerName: 'Username', field: 'username', width: 90, sortable: true, unSortIcon: true, cellClass: 'noborder', comparator: this.customComparatorF, lockPosition: true }, //, filter: 'agTextColumnFilter' , cellStyle: {"border-left": "1px solid #CCC !important"}}, 
			//{headerName:'Lastname', field: 'lastname', width: 100, sortable: true, unSortIcon: true, cellClass: 'noborder', comparator: this.customComparatorL, lockPosition: true},
			{ headerName: 'Role', field: 'role', width: 70, sortable: true, unSortIcon: true, cellClass: 'noborder', lockPosition: true },
			{ headerName: 'Email', field: 'email', width: 120, sortable: false, cellClass: 'noborder', lockPosition: true },
			{ headerName: 'Modify', field: '_id', width: 50, sortable: false, cellRenderer: this.editRowRendererFunc, cellClass: 'noborder', lockPosition: true },
			{ headerName: 'Image', field: 'id', width: 60, sortable: false, cellRenderer: this.attachRowRendererFunc, cellClass: 'noborder', lockPosition: true },
			{headerName:'Reset', field: '_id', width: 50, sortable: false, cellClass: 'noborder', lockPosition: true,  cellRenderer: this.resetRowRendererFunc},
			{ headerName: 'Active', field: 'deleted', width: 70, sortable: true, unSortIcon: true, cellRenderer: this.deactivateRowRendererFunc, cellClass: 'noborder', lockPosition: true }
		];
		//get email contents
		this.httpService.get('assets/data/email.json').subscribe(
		emailtemplate => {
			this.emailContents = emailtemplate;
		});
		this.loadLocations();
		this.subscribeUserService = this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			if (userdata && (typeof (userdata['loggedIn']) !== "undefined")) {
				if (userdata['loggedIn'] == false) {
					this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
				else if (userdata['loggedIn'] == true) {
					this.currentUser = userdata;
				}
			}
			else {
				this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
			}
			this.companyname = this.currentUser.company;
			this.isAuthorised = true;
			this.isDevAuthorised = false;
			this.isDevAuthorised = true;
			this.loadUsers("");
			this.isMasterAdmin = false;
			this.subscribeUserService.unsubscribe();
		}, 0));

		this.gridOptions = {
			columnDefs: this.columnDefs,
			// overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
			overlayLoadingTemplate: '',
			overlayNoRowsTemplate: '<span class="norows">No users for this company.</span>',

			onRowDataChanged: function (params) {
				setTimeout(function () {
					params.api.sizeColumnsToFit();

				})
			},
			onGridReady: function (params) {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				})

				window.addEventListener('resize', function () {
					setTimeout(function () {
						params.api.sizeColumnsToFit();
					})
				});
			}
		};

	}
	attachRowRendererFunc(params)
	{
		if (params.data.deleted !== "0") {
			return '<button class="btn-ahref" style="cursor:default"><img src="assets/image.png" style="width:16px;" /></button>';
		} else {		
		return '<button class="btn-ahref" title="Add Profile Picture"><img src="assets/image.png" style="width:16px;" /></button>';
		}
	}

	loadLocations() {
		this.locationsList = [];
		var url = "locations";
		var iparamC = { "deleted": "0" };	
		this.usersSubscribe = this.dbService.getDatabyParam(url, iparamC).subscribe(locData => setTimeout(async () => {
			//  console.log(locData);
			if (locData["body"]["length"] > 0) {
				this.locationsList = locData["body"];
			}
		}));

	}
	customComparatorF(valueA, valueB) {
		return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
	}
	customComparatorL(valueA, valueB) {
		return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
	}

	onCellClicked($event) {
		this.viewMode = false;
		switch ($event.colDef["headerName"]) {
			case 'Firstname':
			case 'Lastname':
			case 'Email':
			case 'Phone':
			case 'Location':
			case 'Role': this.viewMode = true; this.modifyUser($event.data["id"]); break;
			case 'Modify':
				this.viewMode = false;
				 if ($event.data.deleted !== "1") {
					this.modifyUser($event.data["id"]);
				 }
				break;

			case 'Active':
				this.viewMode = false;
			
					this.setStatus($event.data);
			
				break;
			case 'Image':
				if ($event.data.deleted == "0") {
					this.attachPhotos($event.data);
				 }
					break;
			case 'Reset':
				if ($event.data.deleted !== "1") {
				this.resetpass($event.data);
				}
				break;
			case 'Activate/Deactivate':

				if ($event.data.deleted !== "1")
					this.deactivateUser($event.data["id"]);
				else
					this.reactivateUser($event.data["id"]);

				break;
			default:
		}
		if (this.viewMode) {
			this.locationSListwords = "";
			if (this.newUserWoEmail.location && this.newUserWoEmail.location.length > 0) {
				for (let l = 0; l < this.newUserWoEmail.location.length; l++) {
					if (typeof (this.newUserWoEmail.location[l]["location"]) !== "undefined" && this.newUserWoEmail.location[l]["location"] !== "") {
						this.locationSListwords += this.newUserWoEmail.location[l]["location"] + ", ";
					}
				}
				if (this.locationSListwords !== "")
					this.locationSListwords = this.locationSListwords.substring(0, this.locationSListwords.length - 2);
			}
		}
	}
	attachPhotos(data)
	{	
		this.attachphotosList = [];
		this.selectedUser = data;
		if(data['profilepic']!== null && data !== ""){
			this.displayImage = data['profilepic'];
		}
		this.modalHeading = "Attach User Profile Image";
		this.modalService.open("attachphotos");
	}
	
	attachImage(imageInput)
	{
		const file: File = imageInput.files[0];
		const reader = new FileReader();

		this.modalService.close("attachphotos");

		reader.addEventListener('load', (event: any) => {	
		 var params = { "image": event.target.result, "name": this.selectedUser["id"] + "_" + file.name };
		/*this.dbService.uploadProfileImage(params).subscribe(locsData => setTimeout(async () => {
			var paramsProp = {};			
			this.selectedUser["profilepic"] =locsData["name"];
			this.dbService.putData("users", this.selectedUser).subscribe(locsData => setTimeout(async () => {

				this.modalHeading = "Manage Users";
				this.modaltext = "User Profile picture Updated.";
				this.modalService.open("popupformessage");
			 }));

		 }));
		 */
	
		});
	
		reader.readAsDataURL(file);
	
	}
	locationCellRendererFunc(params) {
		var te = "";
		if (typeof (params.data.location) !== "undefined") {
			if (params.data.location !== null && params.data.location["length"] > 0) {
				te = "";
				for (let i = 0; i < params.data.location["length"]; i++) {
					if (params.data.location[i]["location"] !== "default")
						te += params.data.location[i]["location"] + ", ";
				}
				te = te.substring(0, te.length - 2);
			}
		}
		return te;
	}

	resetRowRendererFunc(params) {
		if (params.data.deleted !== "0") {
			return '<button class="btn-ahref" style="cursor:default"><img src="assets/reset.png" style="width:16px;" /></button>';
		} else {
		return '<button class="btn-ahref" title="Reset Password"><img src="assets/reset.png" style="width:16px;" /></button>';
		}
	}
	viewcasesRowRendererFunc(params) {
		if (params.data.deleteFlag == "true") {
			return "";
		} else {
			return '<button class="btn-ahref" title="Reassign Cases"><img src="assets/alternate.png" style="width:16px;" /></button>';
		}
		//	return '<button class="btn-ahref" title="Reassign Cases"><img src="assets/alternate.png" style="width:16px;" /></button>';
	}

	editRowRendererFunc(params) {
		if (params.data.deleted !== "0") {
			return '<button class="btn-ahref" style="cursor:default"><img src="assets/edit.png" style="width:16px;" /></button>';
		} else {
			return '<button class="btn-ahref" title="Modify User"><img src="assets/edit.png" style="width:16px;" /></button>';
		}
		//	return '<button class="btn-ahref" title="Modify User"><img src="assets/edit.png" style="width:16px;" /></button>';
	}

	deleteRowRendererFunc(params) {
		return '<button class="btn-ahref" title="Delete User"><img src="assets/delete.png" style="width:16px;" /></button>';

	}

	deactivateRowRendererFunc(params) {

		if (params.data.deleted == "1") {
			return '<button class="btn-ahref" title = "Activate User" >No</button>';
		} else {
			return '<button class="btn-ahref" title = "Deactivate User" style="color: #228B22;font-weight:bold">Yes</button>';
			
		}
	}

	reactivateUser(id) {
		// var paramsActivate = {"deleteFlag": "false"};
		// this.dbService.putData("users/"+ id, paramsActivate).subscribe(usersdata => setTimeout(() => {
		// 	  this.popupMessage("User has been activated.");

		// 	this.loadUsers(this.companyname);
		// }));

		var uIndex = this.users.findIndex(x => x["id"] === id);
		if (uIndex > -1) {
			var item = this.users[uIndex];
			item.deleted = 0;
			this.usersSubscribe = this.dbService.putData("users", item).subscribe(propertiesdata => setTimeout(() => {
				this.loadUsers("");
				this.modalHeading = "Activate User";
				this.modaltext = "User has been activated.."
				this.modalService.open("popupformessage");
			}));
		}
	}

	deactivateUser(id) {

		if (id !== "") {
			var uIndex = this.users.findIndex(x => x["id"] === id);
			if (uIndex > -1) {
				var item = this.users[uIndex];
				item.deleted = 1;
				this.usersSubscribe = this.dbService.putData("users", item).subscribe(propertiesdata => setTimeout(() => {
					this.loadUsers("");
					this.modalHeading = "Deactivate User";
					this.modaltext = "User has been deactivated.."
					this.modalService.open("popupformessage");
				}));
			}
		}
	}
	onBlurMethodPhone(value, dynamicfield) {
		let PHONE_REGEXP = /^\d{3}-\d{3}-\d{4}$/;
		var element = document.getElementById(dynamicfield);
		if (typeof (element) !== "undefined" && element !== null) {
			if (value.srcElement && value.srcElement.value != "" && !PHONE_REGEXP.test(value.srcElement.value) || value != "" && !PHONE_REGEXP.test(value))
				element.classList.remove("displaynone");
			else
				element.classList.add("displaynone");
		}
	}

	dateComp(a, b) {
		return new Date(b.createdat).getTime() - new Date(a.createdat).getTime();
	}

	loadUsers(companyId, searchparam = null) {
		this.usersMessage = "Loading...";

		var iparamC = {};

		if (searchparam !== null) {
			if (searchparam["email"] !== "")
				iparamC["email"] = searchparam["email"];

			if (searchparam["username"] !== "")
				iparamC["username"] = searchparam["username"];

			if (searchparam["role"] !== "")
				iparamC["role"] = searchparam["role"];

			if (searchparam["phone"] !== "")
				iparamC["phone"] = searchparam["phone"];

		}
		var url = "users";
		this.usersSubscribe = this.dbService.getDatabyParam(url, iparamC).subscribe(userData => setTimeout(async () => {
			if (userData["body"]["length"] > 0) {
				this.users = [];
				for (let v = 0; v < userData["body"]["length"]; v++) {
					var t = userData["body"][v];
					this.users.push(t);
				}
				this.users = this.users.sort(this.sortFunction);
				this.rowData = this.users;
				this.gridOptions.rowData = this.rowData;
				if (this.users.length > 0)
					this.usersMessage = "";
				else
					this.usersMessage = "No uploaded users.";
			}
		}, 0));
	}
	sortFunction(a, b) {
		if (typeof (a.username) !== "undefined" && a.username !== null && typeof (b.username) !== "undefined" && b.username !== null) {
			if (a.username.toLowerCase() < b.username.toLowerCase()) {
				return -1;
			}
			if (a.username.toLowerCase() > b.username.toLowerCase()) {
				return 1;
			}
			return 0;
		}
		else
			return 0;
	}

	onItemSelect(item: any) {
		//	//console.log(item);
	}
	onSelectAll(items: any) {
		//	//console.log(items);
	}
	changeuser(item) {
		// //console.log("In changeuser");	
	}
	addUser() {
		this.viewMode = false;
		var item = { "firstname": "", "lastname": "", "email": "", "phone": "", "location": "", "role": "", "password": "", "position": "", "isadmin": "" };
		this.addDataTousers(item);
	}

	 formatString(str)
	{
		var retv = str;
		if(str !== "")
		retv = this.helpService.formatStringEncode(str);
		return retv;
	}

	addUserDataWithEmail(form) {
	
		if (form.form.status == 'VALID') {
			if (typeof (this.newUserWoEmail["id"]) !== "undefined" && this.newUserWoEmail["id"] !== "") {
				this.updateUser(this.newUserWoEmail);
			}
			else {
				this.addNewUser(this.newUserWoEmail);
				this.formSubmitted = false;
			}
		} else {
			this.formSubmitted = true;
			if (this.newUserWoEmail.phone !== '')
				this.onBlurMethodPhone(this.newUserWoEmail.phone, 'phoneval');
		}
	}
	moduleToggleUpload() {

	}

	modifyUser(id) {
		this.formSubmitted = false;
		if (id !== "") {
			var uIndex = this.users.findIndex(x => x["id"] === id);
			if (uIndex > -1) {
				var item = this.users[uIndex];
				item.education =  this.helpService.formatStringDecode(item.education);
				item.experience =  this.helpService.formatStringDecode(item.experience);
				item.specialskills =  this.helpService.formatStringDecode(item.specialskills);
				item.professionalassociations =  this.helpService.formatStringDecode(item.professionalassociations);
				item.addInfo =  this.helpService.formatStringDecode(item.addInfo);
				item.personalinfo =  this.helpService.formatStringDecode(item.personalinfo);
				this.newUserWoEmail = {
					"id": item["id"],
					"firstname": item["firstname"],
					"lastname": item["lastname"],
					"username": item["username"],
					"email": item["email"],
					"phone": item["phone"],
					"position": item["position"],
					"location": item["location"],
					"isAamin": item["isAdmin"],
					"role": item["role"],
					"age": item["age"],
					"gender": item["gender"],
					"mobile": item["mobile"],
					"region": item["region"],
					"education": item["education"],
					"experience": item["experience"],
					"specialskills": item["specialskills"],
					"professionalassociations": item["professionalassociations"],
					"addInfo": item["addInfo"],
					"personalinfo": item["personalinfo"],
					"profilepic": item["profilepic"],
					"instagram": item["instagram"],
					"twitter": item["twitter"],
					"facebook": item["facebook"],
					"linkedin": item["linkedin"],
					"createdat": item["createdat"]
				};
			}
			else {
				this.viewMode = false;
				this.newUserWoEmail = {
					"id": "",
					"firstname": "",
					"lastname": "",
					"username": "",
					"email": "",
					"phone": "",
					"location": "",
					"isadmin": "",
					"role": "",
					"age": item["age"],
					"gender": item["gender"],
					"mobile": item["mobile"],
					"region": item["region"],
					"education": item["education"],
					"experience": item["experience"],
					"specialskills": item["specialskills"],
					"professionalassociations": item["professionalassociations"],
					"addInfo": item["addInfo"],
					"personalinfo": item["personalinfo"],
					"profilepic": item["profilepic"],
					"instagram": item["instagram"],
					"twitter": item["twitter"],
					"facebook": item["facebook"],
					"linkedin": item["linkedin"],
					"position": "",
					"createdat": this.helpService.CurrentDateTime()
				};
			}
		}
		else {
			this.viewMode = false;
			this.newUserWoEmail = {
				"id": "",
				"firstname": "",
				"lastname": "",
				"email": "",
				"phone": "",
				"location": "",
				"isadmin": "",
				"role": "",
				"position": "",
				"age": "",
				"gender": "",
				"mobile": "",
				"region": "",
				"education": "",
				"experience": "",
				"specialskills": "",
				"professionalassociations": "",
				"addInfo": "",
				"personalinfo": "",
				"profilepic": "",
				"instagram": "",
				"twitter": "",
				"facebook": "",
				"linkedin": "",
				"createdat": this.helpService.CurrentDateTime()
			};
		}
		this.modalService.open("isNewuser");
	}
	addNewUser(item) {
		if (item.email !== "" && item.firstname !== "" && item.lastname !== "" && item.role !== "") {
			var generatedPass = this.helpService.GeneratePassword(10);
			//	if(item.role == "ADMIN")
			//  generatedPass = "Pass@1234";
			item.password = generatedPass;
			item.email = item.email.toLowerCase();
			// var tempLoc = "";
			// var tempLocArr = item.location;
			// var templength = tempLocArr.length;
			// for (let kol = 0; kol < templength; kol++) {
			// 	tempLoc += tempLocArr[kol]["id"] + ",";
			// }
			// item.location = tempLoc;
			var iparam = { "email": item.email };
			// console.log(iparam);
			this.getusersSubscribe = this.dbService.getDatabyParam("users", iparam).subscribe(userData => setTimeout(async () => {

				if (userData["length"] > 0) {
					this.modalHeading = "Manage Users";
					this.modaltext = "User already exists.";
					this.modalService.open("popupformessage");
				}
				else {
					var uData = { "firstname": item.firstname.trim(), "lastname": item.lastname.trim(), "username": item.username.trim(), "email": item.email, "location": item.location, "position": item.position, "phone": item.phone, "role": item.role, "age": item.age, "gender": item.gender, "password": item.password, "mobile": item.mobile, "region": item.region, "education": this.formatString(item.education), "experience": this.formatString(item.experience), "specialskills": this.formatString(item.specialskills), "professionalassociations": this.formatString(item.professionalassociations), "addInfo": this.formatString(item.addInfo), "personalinfo": this.formatString(item.personalinfo), "profilepic": item.profilepic, "instagram": item.instagram, "twitter": item.twitter, "facebook": item.facebook, "linkedin": item.linkedin }

					// if (typeof (item["createdby"]) == "undefined" || item["createdby"] == "") {
					// 	uData["createdby"] = this.currentUser["id"];
					// }
					if (typeof (item["createdat"]) == "undefined" || item["createdat"] == "") {
						uData["createdat"] = new Date();
					}

					this.updateusersSubscribe = this.dbService.postData("users", uData).subscribe(addedUser => setTimeout(async () => {
						// console.log(addedUser);
						addedUser["location"] = "";
						addedUser["username"] = item["username"];
						addedUser["email"] = item["email"];
						addedUser["userphone"] = item["userphone"];
						addedUser["role"] = item.role;
						addedUser["password"] = uData["password"];	
						addedUser["emailcontent"] = this.emailContents.emails.adduser.content;
						addedUser["emailsubject"] = this.emailContents.emails.adduser.subject;
						//send email to user					
					//	this.helpService.SendEmail("adduser", addedUser);
						this.loadUsers("");	
						this.modalService.close("isNewuser");
						this.modalHeading = "Manage Users";
						this.modaltext = "New User added.";
						this.modalService.open("popupformessage");
						this.newUserWoEmail = {
							"id": "",
							"firstname": "",
							"lastname": "",
							"email": "",
							"phone": "",
							"location": "",
							"isadmin": "",
							"role": "",
							"position": "",
							"age": "",
							"gender": "",
							"mobile": "",
							"region": "",
							"education": "",
							"experience": "",
							"specialskills": "",
							"professionalassociations": "",
							"addInfo": "",
							"personalinfo": "",
							"profilepic": "",
							"instagram": "",
							"twitter": "",
							"facebook": "",
							"linkedin": "",
							"createdat": ""
						};
					}, 0));
				}
			}));
		}
		else {
			alert("Please enter values");
		}
	}

	updateUser(item) {
		item.email = item.email.toLowerCase();
		var iparam = { "email": item.email };
		this.updateusersSubscribe = this.dbService.getDatabyParam("users", iparam).subscribe(userData => setTimeout(async () => {
			var found = 0;
			if (userData["length"] > 0) {
				if (userData[0]["id"] !== item["id"]) {
					this.modalHeading = "Manage Users";
					this.modaltext = "Email already exists.";
					this.modalService.open("popupformessage");
					found = 1;
				}
				else {
					found = 0;
				}
			}
			else {
				found = 0;
			}
			if (found == 0) {
				// var tempLoc = [];
				// var tempLocArr = item.location;
				// var templength = tempLocArr.length;
				// for (let kol = 0; kol < templength; kol++) {
				// 	tempLoc.push({ "location_id": tempLocArr[kol]["location_id"], "location": tempLocArr[kol].location });
				// }
				var isAdminData;
				if (item.role == "DM") {
					isAdminData = item.isAdmin;
				} else {
					isAdminData = "";
				}
				var uData = { "id": item.id, "firstname": item.firstname.trim(), "lastname": item.lastname.trim(), "username": item.username.trim(), "email": item.email, "location": item.location, "position": item.position, "phone": item.phone, "role": item.role, "age": item.age, "gender": item.gender, "password": item.password, "mobile": item.mobile, "region": item.region, "education": this.formatString(item.education), "experience": this.formatString(item.experience), "specialskills": this.formatString(item.specialskills), "professionalassociations": this.formatString(item.professionalassociations), "addInfo": this.formatString(item.addInfo), "personalinfo": this.formatString(item.personalinfo), "profilepic": item.profilepic, "instagram": item.instagram, "twitter": item.twitter, "facebook": item.facebook, "linkedin": item.linkedin }
				if (typeof (item["createdat"]) == "undefined" || item["createdat"] == "") {
					uData["createdat"] = new Date();
				}
				if (typeof (item["createdat"]) == "undefined" || item["createdat"] == "") {
					uData["createdat"] = new Date();
				}
				
				this.modalService.close("isNewuser")

				this.updateusersSubscribe = this.dbService.putData("users", uData).subscribe(userData => setTimeout(async () => {
					this.loadUsers(this.companyname);

					this.modalHeading = "Manage Users";
					this.modaltext = "User details have been modified.";
					this.modalService.open("popupformessage");
				}, 0));
			}
		}));

	}
	confirmDeleteUser(id) {
		if (id !== "") {
			var uIndex = this.users.findIndex(x => x["id"] === id);
			if (uIndex > -1) {
				var item = this.users[uIndex];
				this.selectedItemDelete = item;
				this.selectedIndexDelete = uIndex;
			}
		}
		this.deleteUserContent = "<b><em>Are you sure you want to delete user?";

		if (this.deleteUserContent !== "") {
			this.modalService.open("deleteuserpopup");
		}

	}

	deleteUser(id) {
		//this.checkIfCasesExists(id);
		if (id !== "") {
			var uIndex = this.users.findIndex(x => x["id"] === id);
			if (uIndex > -1) {
				var item = this.users[uIndex];
				this.selectedItemDelete = item;
				this.selectedIndexDelete = uIndex;
			}
		}
		this.deleteUserContent = "<b><em><br>Are you sure you want to delete user?";
		if (this.deleteUserContent !== "") {
			this.modalService.open("deleteuserpopup");
		}
	}

	confirmDelete() {
		this.modalService.close("deleteuserpopup");
		var item = this.selectedItemDelete;
		var index = this.selectedIndexDelete;
		var paramsDel = { "deleted": "true" }
		this.updateusersSubscribe = this.dbService.putData("users/" + item["id"], paramsDel).subscribe(userData => setTimeout(() => {
			//	this.toastrservice.success('', "Deleted the user");
			this.modalHeading = "Manage Users";
			this.modaltext = "Deleted the user.";
			this.modalService.open("popupformessage");
			this.loadUsers(this.companyname);
		}, 0));
	}

	popupMessage(message) {
		this.modalHeading = "Manage Users";
		this.modaltext = message;
		this.modalService.open("popupformessage");
	}
	confirmDeactivateUser(id) {
		var paramsDeactivate = { "deleted": "true" };
		this.updateusersSubscribe = this.dbService.putData("users/" + id, paramsDeactivate).subscribe(usersdata => setTimeout(() => {
			this.popupMessage("User has been deactivated.");
			this.loadUsers(this.companyname);
		}));
	}
	addDataTousers(item) {
		this.users.push(item);
		this.willDownload = true;
	}
	ngOnDestroy() {
		if (this.userPassresetSubscribe) this.userPassresetSubscribe.unsubscribe();
		if (this.companyDataSubscribe) this.companyDataSubscribe.unsubscribe();
		if (this.usersSubscribe) this.usersSubscribe.unsubscribe();
		if (this.subscribeUserService) this.subscribeUserService.unsubscribe();
		if (this.updateusersSubscribe) this.updateusersSubscribe.unsubscribe();	
		if (this.getusersSubscribe) this.getusersSubscribe.unsubscribe();			
	}
	closeModal(id) {
		this.modalService.close(id);
		this.modaltext = "";
		this.modalHeading = "";
	}
	InputFLUCase(property) {
		var inputtext = this.newUserWoEmail[property];
		if (inputtext !== "") {
			// inputtext= this.helpService.setInputFirstToUppercase(inputtext);
			inputtext = inputtext.toString().trim();
		}
		if (property !== "") {
			this.newUserWoEmail[property] = inputtext;
		}
	}

	resetpass(item) {	
		var generatedPass = this.helpService.GeneratePassword(10);
		item.password = generatedPass;
		this.modalService.close("isNewuser")

		this.updateusersSubscribe = this.dbService.putData("users", item).subscribe(userData => setTimeout(async () => {
			var data = {};
			data["username"] = item.username;
			data["email"] = item.email;
			data["password"] = generatedPass;
			data["emailcontent"] = this.emailContents.emails.resetpassAdmin.content;
			data["emailsubject"] = this.emailContents.emails.resetpassAdmin.subject;
			//send Email
		//	this.helpService.SendEmail("adduser", data);
			this.loadUsers(this.companyname);

			this.modalHeading = "Reset Password";
			this.modaltext = "User password have been reset and email sent.";
			this.modalService.open("popupformessage");
		}, 0));
		
	}

	setStatus(data)
	{
	
			this.formSubmitted = false;
			if (data.id !== "") {
				var uIndex = this.users.findIndex(x => x["id"] === data.id);
				if (uIndex > -1) {
					var item = this.users[uIndex];
					// console.log(item);
					var isActive = true;
					if(item["deleted"] == "1")
					isActive = false;

					this.statusData = {
						"id":item["id"], 
						"deleted":item["deleted"],
						"active":isActive
					}
					// console.log(this.statusData);
					this.modalService.open("isModelActive");
				}
			}

	}
	saveStatus(form)
	{		
		this.statusData["deleted"] = "1";
		if(this.statusData["active"])
		this.statusData["deleted"] = "0";
		this.modalService.close("isModelActive")
		var params = {"deleted":this.statusData["deleted"], "id":this.statusData["id"]};

		this.updateusersSubscribe = this.dbService.putData("users", params).subscribe(userData => setTimeout(async () => {
			this.loadUsers(this.companyname);

			this.modalHeading = "Manage Users";
			this.modaltext = "User status has been modified.";
			this.modalService.open("popupformessage");
		}, 0));
	}
}