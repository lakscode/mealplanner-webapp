import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { UserService, User } from '../../services/user.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
@Component({
  selector: 'app-managerequests',
  templateUrl: './managerequests.component.html',
  styleUrls: ['./managerequests.component.scss']
})
export class ManagerequestsComponent implements OnInit {
  currentUser: any;
  errorMessage: any = "";
  uploadedFilesList: Array<any> = [];
  columnDefs: Array<any> = [];
  gridOptions: any;
  rowData: Array<any> = [];
  propertiesMessage: any;
  addItem:any;
  ptypeList: any;	
  formSubmitted: boolean = false;
  modaltext: any;
  modalHeading: any;
  manageRequestStatus:any;  
  requestsSubscribe: any;
  updaterequestsSubscribe:any;
  usersSubscribe:any;
  isMasterAdmin: boolean = false;
  isEmployee: boolean = false;
  propertiesSubscribe:any;
  constructor(private router: Router, private route: ActivatedRoute, private httpService: HttpClient,  private dbService: DBService,  private helpService: HelpService, private userService: UserService,  private modalService: ModalService) { }
  ngOnInit() {
  this.addItem = { "name": "", "email": "", "phone": "", "message": "", "mobile":"", "address":"", "location":"","city":"", "type":"", "status":0 ,"rcomments":""};
  this.propertiesMessage = "No Requests";
  this.currentUser = null;
  // this.ptypeList = this.helpService.getConstants("sellProperyType");
  this.manageRequestStatus  = this.helpService.getConstants("manageRequestStatus");
  this.usersSubscribe = this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
  if (typeof (userdata) !== "undefined" && userdata !== null) {
			if (typeof (userdata['loggedIn']) !== "undefined") {
				if (userdata['loggedIn'] == false) {
					this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
				}
				else if (userdata['loggedIn'] == true) {
          this.currentUser = userdata;
          
          this.isMasterAdmin = false;
          this.isEmployee = false;
          if(this.helpService.isMasterAdmin(this.currentUser))
          this.isMasterAdmin = true;
          if(this.helpService.isEmployee(this.currentUser))
          this.isEmployee = true;

				}
			}
			else {				
				this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
      }
    }
    else {     
      this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
    }   
    }, 0));    
    this.loadPropertyTypes();
    this.LoadGridDefaults();
    this.LoadEnquires();
  }
  loadPropertyTypes() {
		this.ptypeList = [];		
		var params = {};
		var url = "propertytypes";
		this.propertiesSubscribe = this.dbService.getDatabyParam(url, params).subscribe(ptypeData => setTimeout(async () => {
			if (ptypeData["body"]["length"] > 0) {
					for (let v = 0; v < ptypeData["body"]["length"]; v++) {
					var t = ptypeData["body"][v];
					this.ptypeList.push(t);
				}
			}
		}));
	}
  formatString(str)
	{
		var retv = str;
		if(str !== "")
		retv = this.helpService.formatStringEncode(str);
		return retv;
	}
  LoadEnquires(){
  this.uploadedFilesList = [];
    this.requestsSubscribe = this.dbService.getData("requests").subscribe(fileDatas => setTimeout(() => {      
      if (fileDatas["body"]["length"] > 0) {
        for (let i = 0; i < fileDatas["body"]["length"]; i++) {
          var t = fileDatas["body"][i];
          if(t["message"] !== "")
					t["message"]= this.helpService.formatStringDecode(t["message"]);
          if(t["address"] !== "")
					t["address"]= this.helpService.formatStringDecode(t["address"]);  
          if(t["rcomments"] !== "")
          t["rcomments"]= this.helpService.formatStringDecode(t["rcomments"]);  
          this.uploadedFilesList.push(t);          
        }
        this.rowData = this.uploadedFilesList;
        this.gridOptions.rowData = this.rowData;
      }      
    }));
  } 
    
LoadGridDefaults()
{
  this.columnDefs = [
    { headerName: 'Name', field: 'name', width: 100, sortable: true, unSortIcon: true, cellClass: 'noborder', lockPosition: true },    
   // { headerName: 'Mobile', field: 'mobile', width: 100, sortable: false, cellClass: 'noborder', lockPosition: true },
    { headerName: 'Location', field: 'location', width: 100, sortable: false, cellClass: 'noborder', lockPosition: true },
    { headerName: 'Message', field: 'message', width: 170, sortable: false, cellClass: 'noborder', lockPosition: true },
    { headerName: 'Modify', field: '_id', width: 60, sortable: false, cellRenderer: this.editRowRendererFunc, cellClass: 'noborder', lockPosition: true },
  
  ];
  this.gridOptions = {
    columnDefs: this.columnDefs,
   // overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
   overlayLoadingTemplate: '',
   overlayNoRowsTemplate: '<span class="norows">No locations for this state.</span>',
    onRowDataChanged: function (params) {
        setTimeout(function() {
            params.api.sizeColumnsToFit();           
          }) 
        },
    onGridReady: function (params) {
        setTimeout(function() {
            params.api.sizeColumnsToFit();  
          })
        window.addEventListener('resize', function() {
          setTimeout(function() {
            params.api.sizeColumnsToFit();              
          })
        });
    }        
};
}
editRowRendererFunc(params) {
  if (params.data.deleted == "true") {
    return "";
  } else {
    return '<button class="btn-ahref" title="Modify Requests"><img src="assets/edit.png" style="width:16px;" /></button>';
  }
}

onCellClicked($event)
{  
  switch ($event.colDef["headerName"]) {
    case 'Modify': 
      this.modifyRequest($event.data["id"]);     				
      break;    
    default:
  }  
}
modifyRequest(id){
  if (id !== "") {
    var uIndex = this.uploadedFilesList.findIndex(x => x["id"] === id);
    if (uIndex > -1) {
      var item = this.uploadedFilesList[uIndex];
      this.addItem = item;
      this.modalService.open("addnew");
    }    
  }
}
addData(form){
  if (form.form.status == 'VALID') {
    this.formSubmitted = false;
    this.addItem["message"]= this.formatString(this.addItem["message"]);	
    this.addItem["address"]= this.formatString(this.addItem["address"]);
    this.addItem["rcomments"]= this.formatString(this.addItem["rcomments"]);

    this.modalService.close("addnew");
    
    if (this.addItem.id !== '') {
      this.updaterequestsSubscribe = this.dbService.putData("requests", this.addItem).subscribe(announcementsdata => setTimeout(() => {
        this.LoadEnquires();

        this.modalHeading = "Modify Request";
        this.modaltext = "Request Updated."
        this.modalService.open("popupformessage");
      }));
    }
    // else {
    //   this.dbService.postData("announcements", this.addItem).subscribe(itemData => setTimeout(() => {
    //     this.LoadTestimonials();
    //     this.modalService.close("addnew");
    //     this.modalHeading = "Add new announcement";
    //     this.modaltext = "Announcement added."
    //     this.modalService.open("popupformessage");
    //   }));
    // }

  } else {
    this.formSubmitted = true;
  }
  console.log(this.formSubmitted);
}
closeModal(id) {
  this.modalService.close(id);
}
ngOnDestroy() {
  if(this.requestsSubscribe) this.requestsSubscribe.unsubscribe();
  if(this.updaterequestsSubscribe) this.updaterequestsSubscribe.unsubscribe();
  if(this.usersSubscribe) this.usersSubscribe.unsubscribe();  
  if(this.propertiesSubscribe) this.propertiesSubscribe.unsubscribe();    
}
}
