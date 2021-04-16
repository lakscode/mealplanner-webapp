import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { UserService, User } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ModalService } from '../../shared/modules/modal/modal.service';
import {environment} from "../../../environments/environment"
@Component({
	selector: 'app-banners',
	templateUrl: './banners.component.html',
	styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit, OnDestroy {
	currentUser: any;

	bannersList: Array<any> = [];
	columnDefs : any;
	subscribeBannerService: any;
	gridOptions: any;
	modalHeading: any;
	selectedBanner: any;
	displayImage: any;
	statusData: any;
	modaltext: any;
	isAuthorised: boolean = false;
	rowData: Array<any> = [];
	apiUrl: any;
	uploadUrl: any;
	bannersMessage: any;
	constructor(private router: Router, private modalService: ModalService, private route: ActivatedRoute, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService, private userService: UserService, private toastrservice: ToastrService) { }
	ngOnInit() {
		this.bannersMessage = "";
		this.apiUrl = environment.apiUrl;
		if(this.apiUrl !== "")
		{
			this.uploadUrl = this.apiUrl.replace("/api", "");
		}
		this.bannersList = [];
		this.rowData = [];
		this.loadBanners();
		this.columnDefs = [
			//{ headerName: 'Title', field: 'title', width: 200, sortable: true, unSortIcon: true, cellRenderer: this.formstTextRendererFunc, lockPosition: true , filter: 'agTextColumnFilter',  cellClass: function(params) { return (params.data["deleted"]==='1'?'strikethrough noborder ':'noborder'); }}, 
			{ headerName: 'Title', field: 'title', width: 200, sortable: true, unSortIcon: true, lockPosition: true , filter: 'agTextColumnFilter',  cellClass: function(params) { return (params.data["deleted"]==='1'?'strikethrough noborder ':'noborder'); }}, 
			{ headerName: 'Modify', field: 'id', width: 60, sortable: false, cellRenderer: this.editRowRendererFunc, cellClass: 'noborder', lockPosition: true },
			{ headerName: 'Image', field: 'id', width: 65, sortable: false, cellRenderer: this.attachRowRendererFunc, cellClass: 'noborder', lockPosition: true },
			{ headerName: 'Active', field: 'deleted', width: 60, sortable: true, unSortIcon: true, cellRenderer: this.deactivateRowRendererFunc, cellClass: 'noborder', lockPosition: true },
			{ headerName: 'Delete', field: 'id', width: 60, sortable: false, cellRenderer: this.deleteRowRendererFunc, cellClass: 'noborder', lockPosition: true }

		];
		this.subscribeBannerService = this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
			if (userdata && (typeof (userdata['loggedIn']) !== "undefined")) {
				if (userdata['loggedIn'] == false) {
					this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
				else if (userdata['loggedIn'] == true) {
					this.currentUser = userdata;

					this.isAuthorised = true;
					
					if (this.helpService.isMasterAdmin(this.currentUser) || this.helpService.isEmployee(this.currentUser))
					this.isAuthorised = true;			

				
				}
			}
			else {
				this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
			}
		}, 0));

		this.gridOptions = {
			columnDefs: this.columnDefs,
			context: {
				componentParent: this
			},
			// overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
			overlayLoadingTemplate: '',
			overlayNoRowsTemplate: '<span class="norows">No banners uploaded.</span>',

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

	ngOnDestroy()
	{
		if(this.subscribeBannerService) this.subscribeBannerService.unsubscribe();

	}

	formstTextRendererFunc(params)
	{
		var title = params["data"]["title"];
		var ret = title;
		if(title !== "")
		ret = params.context.componentParent.helpService.formatStringDecode(title);
		return ret;
	}

	deleteRowRendererFunc(params)
	{
		return '<button class="btn-ahref" title="Delete Banner"><img src="assets/delete.png" style="width:16px;" /></button>';
	
	}
	deactivateRowRendererFunc(params) {
	
		if (params.data.deleted == "1") {
			return '<button class="btn-ahref" title = "Activate Banner">No</button>';
		} else {
			return '<button class="btn-ahref" title = "Deactivate Banner" style="color: #228B22;font-weight:bold">Yes</button>';
			
		}
	}
	checkValues(params) {
		if (params.data["deleted"] == "1"){ 
		return {"text-decoration": "line-through"};
	
	
		}
	
	}
	loadBanners() {

	
		this.bannersList = [];
		this.rowData = [];
		var params = {};
		var url = "banners";
		this.subscribeBannerService = this.dbService.getDatabyParam(url, params).subscribe(bannerData => setTimeout(async () => {

		//	console.log(bannerData);
			if (bannerData["body"]["length"] > 0) {

				for (let v = 0; v < bannerData["body"]["length"]; v++) {
					var t = bannerData["body"][v];
					if(t["title"] !== "")
					t["title"]= this.helpService.formatStringDecode(t["title"]);
					this.bannersList.push(t);
				}
				this.rowData = this.bannersList;
				this.gridOptions.rowData = this.rowData;
			}
			else
			{
				this.bannersMessage = "";
			}
		}));

	}

	onCellClicked($event) {

		switch ($event.colDef["headerName"]) {
			case 'Firstname':
			case 'Role': 
				 this.modifyBanner($event.data["id"]); break;
			case 'Modify':
			    if ($event.data.deleted == "0") 
				this.modifyBanner($event.data["id"]);
				break;

			case 'Active':
				this.setStatus($event.data);
				break;
			case 'Image':
			    if ($event.data.deleted == "0") 
				this.attachPhotos($event.data);
				break;
			case 'Delete':
				this.deleteBanner($event.data);
				break;
		
			default:
		}
	
	}
	InputFLUCase(property) {
		
		var inputtext =property;

		if(inputtext !== "")
		{
			inputtext= this.helpService.setInputFirstToUppercase(property);
			inputtext = inputtext.toString().trim();
		}
	return inputtext;
		
}	
	modifyBanner(id)
	{
		if(id == "")
		{
			this.displayImage = {"title":"", "image":"", "deleted":"0"};
			this.modalHeading = "Add New Banner";
		}
		else
		{
			var uIndex = this.bannersList.findIndex(x => x["id"] === id);
			if (uIndex > -1) {
				this.modalHeading = "Modify Banner";
				this.displayImage  = this.bannersList[uIndex];
			}
		}
		console.log(this.displayImage );
		this.modalService.open("isNewBanner");

	}

	formSubmitted: any;
	closeModal(id) {
		this.modalService.close(id);
		this.modaltext = "";
		this.modalHeading = "";
	}
	formatString(str)
	{
		var retv = str;
		if(str !== "")
		retv = this.helpService.formatStringEncode(str);
		console.log(retv);
		return retv;
	}
	addNewBanner(item) {
		item = this.displayImage;
		console.log(item);
		if (item.title !== "") {	
			
			if(typeof(item.id) == "undefined" || item.id ==''){			
				
			var uData = {				
				"title": this.formatString(item["title"]),
				"image": item["image"],
				"deleted":"0",
				"createdby":this.currentUser["id"],
				"createdat":this.helpService.CurrentDateTime(), 
				"modifiedby":this.currentUser["id"],
				"modifiedat":this.helpService.CurrentDateTime()
			}		
			this.modalService.close("isNewBanner");
			console.log(uData);
			console.log(JSON.stringify(uData));
				this.dbService.postData("banners", uData).subscribe(addedBanner => setTimeout(async () => {
					this.modalHeading = "Manage Banners";
					this.modaltext = "New Banner added.";
					this.modalService.open("popupformessage");
					this.loadBanners();

				}, 0));

			
		}
		else {
				
				var uData1 = {
					"id":item["id"],
					"title": this.formatString(item["title"]),
					"image": item["image"],
					"deleted":item["deleted"],
					"createdby":item["createdby"],
					"createdat":item["createdat"], 
					"modifiedby":this.currentUser["id"],
					"modifiedat":this.helpService.CurrentDateTime()
				}					
				this.modalService.close("isNewBanner");

				console.log(uData1);
				console.log(JSON.stringify(uData1));
				this.dbService.putData("banners", uData1).subscribe(addedBanner => setTimeout(async () => {
					this.loadBanners();

					this.modalHeading = "Manage Banners";
					this.modaltext = "Banner updated.";
					this.modalService.open("popupformessage");
					
				}));
			}			
		}
		else {
			this.formSubmitted = true;
		}
	}


	attachRowRendererFunc(params)
	{
		if (params.data.deleted !== "0") {
		return '<button class="btn-ahref" style="cursor:default"><img src="assets/image.png" style="width:16px;" /></button>';
		} else {
		return '<button class="btn-ahref" title="Add Images"><img src="assets/image.png" style="width:16px;" /></button>';
		}
	}


	editRowRendererFunc(params) {
		if (params.data.deleted !== "0") {
			return '<button class="btn-ahref" style="cursor:default"><img src="assets/edit.png" style="width:16px;" /></button>';
		} else {
			return '<button class="btn-ahref" title="Modify Banner"><img src="assets/edit.png" style="width:16px;" /></button>';
		}
	
	}


	attachPhotos(data)
	{
	
		if(data !== null && data !== "")
		{
			this.selectedBanner = data;
			this.setDisplayimages();

		}
		this.modalHeading = "Attach Property Images";
		this.modalService.open("attachphotos");
	}

	setDisplayimages()
	{
		console.log(this.selectedBanner);

		this.displayImage =null;
		if(this.selectedBanner["image"] !== "")
		{
			this.displayImage = this.selectedBanner;
		}
	}
	
	attachImage(imageInput)
	{

		const file: File = imageInput.files[0];
		const reader = new FileReader();

		reader.addEventListener('load', (event: any) => {	

		 var params = { "image": event.target.result, "name": this.selectedBanner["id"] + "_" + file.name };
		/*this.dbService.uploadBannerImage(params).subscribe(locsData => setTimeout(async () => {
			console.log(locsData);
			var paramsProp = {};
		
			paramsProp["image"] =locsData["name"];

			this.selectedBanner["image"]  = paramsProp["image"];

			paramsProp["id"]= this.selectedBanner["id"];
			console.log(JSON.stringify(paramsProp));

			this.dbService.putData("banners", paramsProp).subscribe(locsData => setTimeout(async () => {
				this.setDisplayimages();
			 }));

		 }));*/
	
		});
	
		reader.readAsDataURL(file);
	
	}
	deleteImage(data)
	{
		this.displayImage = ""
	
		var paramsProp = {};
		paramsProp["id"]= data["id"];
		
		paramsProp["image"]= "";
		this.dbService.postData("banners", paramsProp).subscribe(locsData => setTimeout(async () => {
			this.modalHeading = "Manage Banners";
			this.modaltext = "Banner Image had been deleted.";
			this.modalService.open("popupformessage");
			this.loadBanners();
		 }));

	}

	deleteBanner(data)
	{
		this.displayImage = ""
	
		var paramsProp = {};
		paramsProp["id"]= data["id"];	

		this.dbService.deleteDataByTable("banners", paramsProp).subscribe(locsData => setTimeout(async () => {
			this.modalHeading = "Manage Banners";
			this.modaltext = "Banner has been deleted.";
			this.modalService.open("popupformessage");
			this.loadBanners();
		 }));

	}
	/**************** */



	
	setStatus(data)
	{

			if (data.id !== "") {
				var uIndex = this.bannersList.findIndex(x => x["id"] === data.id);
				if (uIndex > -1) {
					var item = this.bannersList[uIndex];
					console.log(item);
					var isActive = true;
					if(item["deleted"] == "1")
					isActive = false;

					this.statusData = {
						"id":item["id"], 
						"deleted":item["deleted"],
						"active":isActive
					}
					console.log(this.statusData);
					this.modalService.open("isModelActive");
				}
			}

	}


	saveStatus(form)
	{
		console.log(this.statusData);
		
		this.statusData["deleted"] = "1";
		if(this.statusData["active"])
		this.statusData["deleted"] = "0";
		this.modalService.close("isModelActive")
		var params = {"deleted":this.statusData["deleted"], "id":this.statusData["id"]};

		this.subscribeBannerService = this.dbService.putData("banners", params).subscribe(userData => setTimeout(async () => {
			this.loadBanners();

			this.modalHeading = "Manage Banners";
			this.modaltext = "Banner status has been modified.";
			this.modalService.open("popupformessage");
		}, 0));
	}
}