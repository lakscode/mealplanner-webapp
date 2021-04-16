import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { UserService, User } from '../../services/user.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
@Component({
  selector: 'app-manageenquires',
  templateUrl: './manageenquires.component.html',
  styleUrls: ['./manageenquires.component.scss']
})
export class ManageenquiresComponent implements OnInit {
  currentUser: any;
  loading: any;
  errorMessage: any = "";
  uploadedFilesList: Array<any> = [];
  disable: boolean = false;
  columnDefs: Array<any> = [];
  gridOptions: any;
  rowData: Array<any> = [];
  propertiesMessage: any;
  usersSubscribe: any;
  enquiresSubscribe: any;
  isAuthorised: boolean  = false;
  enquiryDetail:any;
  statusData: any;
  modalHeading: any;
  modaltext: any;
  subscribeEnquiryService: any;
  constructor(private router: Router, private route: ActivatedRoute, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService, private userService: UserService,private modalService: ModalService) { }

  ngOnInit() {
    this.isAuthorised = false;
    this.propertiesMessage = "No Enquiries";
    this.disable = false;
    this.currentUser = null;
    this.enquiryDetail = {};

    this.usersSubscribe = this.userService.loggedinUser().subscribe(userdata => setTimeout(() => {
      if (typeof (userdata) !== "undefined" && userdata !== null) {
        if (typeof (userdata['loggedIn']) !== "undefined") {
          if (userdata['loggedIn'] == false) {
            this.router.navigate(["login", { redirectUrl: encodeURI(this.router.url) }]);
          }
          else if (userdata['loggedIn'] == true) {
            this.currentUser = userdata;
            if(this.helpService.isEmployee(this.currentUser) || this.helpService.isMasterAdmin(this.currentUser))
            this.isAuthorised = true;
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
    this.LoadGridDefaults();
    this.LoadEnquires();
  }
  LoadEnquires() {
    this.enquiresSubscribe = this.dbService.getData("enquires").subscribe(fileDatas => setTimeout(() => {
      if (fileDatas["body"]["length"] > 0) {
        this.uploadedFilesList = [];
        for (let i = 0; i < fileDatas["body"]["length"]; i++) {
          this.uploadedFilesList.push(fileDatas["body"][i]);
        }
    //    this.uploadedFilesList = this.uploadedFilesList.sort(this.helpService.sortArraybydate);
        this.rowData = this.uploadedFilesList;
        this.gridOptions.rowData = this.rowData;
        console.log(this.uploadedFilesList);
      }
    }));
  }
  closeModal(id) {
    this.modalService.close(id);
  }

  LoadGridDefaults() {
    this.columnDefs = [
      { headerName: 'Name', field: 'name', width: 90, sortable: true, unSortIcon: true, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Email', field: 'email', width: 140, sortable: false, cellClass: 'noborder', lockPosition: true },
      //{ headerName: 'Phone', field: 'phone', width: 100, sortable: false, cellClass: 'noborder', lockPosition: true },
     // { headerName: 'Created', field: 'createdat', width: 80, sortable: false, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Message', field: 'message', width: 180, sortable: false, cellClass: 'noborder', lockPosition: true },
      { headerName: 'View', field: 'id', width: 60, sortable: false, cellRenderer: this.editRowRendererFunc, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Active', field: 'deleted', width: 80, sortable: true, unSortIcon: true, cellRenderer: this.deactivateRowRendererFunc, cellClass: 'noborder', lockPosition: true }
     
    ];
    this.gridOptions = {
      columnDefs: this.columnDefs,
      // overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
      overlayLoadingTemplate: '',
      overlayNoRowsTemplate: '<span class="norows">No locations for this state.</span>',
      onRowDataChanged: function (params) {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        })
      },
      rowClassRules: {
    
        'bgdisable': function(params) {  console.log("rowClassRules");
        console.log(params.data.deleted);
        return params.data.deleted == "1"},
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
  editRowRendererFunc(params) {  
      return '<button class="btn-ahref" title="View Enquiry">View</button>';  
  }
  onCellClicked($event) {
    switch ($event.colDef["headerName"]) { 
      case 'View':        
          this.viewData($event.data["id"]);        
        break; 
      case 'Active':        
          this.setStatus($event.data);        
        break; 

      default:
    }
  }
  viewData(id){
    if (id !== "") {
      var uIndex = this.uploadedFilesList.findIndex(x => x["id"] === id);
      if (uIndex > -1) {
        this.enquiryDetail = this.uploadedFilesList[uIndex];
        this.modalService.open("view");
      }
    }
  }
  deactivateRowRendererFunc(params) {
    if (params.data.deleted == "0") {
      return '<button class="btn-ahref" style="color: #228B22;font-weight:bold">Yes</button>';
    } else {
      return '<button class="btn-ahref" title = "Enquiry is not Active">No</button>';
    }
  }
  ngOnDestroy() {
    if (this.enquiresSubscribe) this.enquiresSubscribe.unsubscribe();
    if (this.usersSubscribe) this.usersSubscribe.unsubscribe();
  }


  
	setStatus(data)
	{

			if (data.id !== "") {
				var uIndex = this.uploadedFilesList.findIndex(x => x["id"] === data.id);
				if (uIndex > -1) {
					var item = this.uploadedFilesList[uIndex];
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
console.log(params);
		this.subscribeEnquiryService = this.dbService.putData("enquires", params).subscribe(userData => setTimeout(async () => {
			this.LoadEnquires();

			this.modalHeading = "Manage Enquiries";
			this.modaltext = "Enquiry status has been modified.";
			this.modalService.open("popupformessage");
		}, 0));
	}
}