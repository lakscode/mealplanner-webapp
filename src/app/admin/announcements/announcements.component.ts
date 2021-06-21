import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { UserService, User } from '../../services/user.service';
import { ModalService } from '../../shared/modules/modal/modal.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {

  currentUser: any;
  loading: any;
  errorMessage: any = "";
  itemsList: Array<any> = [];
  fileData: any;
  disable: boolean = false;
  viewMode: boolean = false;
  formSubmitted: boolean = false;
  addItem: any;
  modaltext: any;
  modalHeading: any;
  columnDefs: Array<any> = [];
  rowData: any;
  gridOptions: any;
  propertiesMessage: any;
  announcementSubscribe: any;
  announcementListSubscribe: any;
  usersSubscribe: any;
  isMasterAdmin: boolean = false;
  isEmployee: boolean = false;
  statusData: any;
  updateAnnouncementSubscribe:any
  constructor(private router: Router, private route: ActivatedRoute, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService, private userService: UserService, private modalService: ModalService) { }

  ngOnInit() {
    this.propertiesMessage = "No Announcements";
    this.addItem = { "id": "", "announcement": "", "createdby": "" };
    this.disable = false;
    this.currentUser = null;
    this.statusData = {};
    this.columnDefs = [
      { headerName: 'Announcement', field: 'announcement', width: 230, sortable: true, unSortIcon: true, cellClass: 'noborder', comparator: this.customComparatorF, lockPosition: true },
      // { headerName: 'Enabled', field: 'deleted', width: 60, sortable: false, cellClass: 'noborder', lockPosition: true, cellRenderer: this.showStatusRendererFunc, },
      { headerName: 'Modify', field: 'id', width: 40, sortable: false, cellRenderer: this.editRowRendererFunc, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Active', field: 'deleted', width: 50, sortable: true, unSortIcon: true, cellRenderer: this.deactivateRowRendererFunc, cellClass: 'noborder', lockPosition: true }
    ];
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
      if (this.currentUser["role"] == 'SUPERADMIN') {
        this.LoadAnnouncements();
      }
      else {
        this.LoadAnnouncements();
      }
    }, 0));
  }
  deactivateRowRendererFunc(params) {
    if (params.data.deleted == "0") {
      return '<button class="btn-ahref" title = "Inactivate Announcement" style="color: #228B22;font-weight:bold">Yes</button>';
    } else {
      return '<button class="btn-ahref" title = "Activate Announcement">No</button>';
    }
  }
  onCellClicked($event) {
    this.viewMode = false;
    switch ($event.colDef["headerName"]) {
      case 'Modify':
        this.viewMode = false; 
         if ($event.data.deleted == "0") {       
        this.modifyAnnouncement($event.data["id"]);
        }
        break;
      case 'Active':
        this.viewMode = false;        
        this.setStatus($event.data);        
        break;   
      case 'Delete':
        this.viewMode = false;
        if ($event.data.deleted == "0") {
          this.deletedata($event.data["id"]);
        }
        break;    
      default:
    }
  }
  leftChars: any = -1; 
  CountLeftChars(item)
	 {
		if(item !== "" && item.length > 0)
		{
			this.leftChars = 120 - item.length;
		}
   }
   
  formatString(str)
	{
		var retv = str;
		if(str !== "")
		retv = this.helpService.formatStringEncode(str);
		return retv;
	}
  modifyAnnouncement(id) {
    if (id !== "") {
      var uIndex = this.itemsList.findIndex(x => x["id"] === id);
      if (uIndex > -1) {
        var item = this.itemsList[uIndex];
        this.addItem = item;

        this.CountLeftChars(this.addItem["announcement"]);

        if(  this.addItem["deleted"] == "0")
        this.addItem['deleted'] = true;
        else
        this.addItem['deleted'] = false;
        this.modalService.open("addnew");
      }
      else {
        this.viewMode = false;
      }
    }
  }
  setStatus(data)
  {  
      this.formSubmitted = false;
      if (data.id !== "") {
        var uIndex = this.itemsList.findIndex(x => x["id"] === data.id);
        if (uIndex > -1) {
          var item = this.itemsList[uIndex];
          var isActive = true;
          if(item["deleted"] == "1")
          isActive = false;
          this.statusData = {
            "id":item["id"], 
            "deleted":item["deleted"],
            "active":isActive
          }    
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
    this.updateAnnouncementSubscribe = this.dbService.putData("announcements", params).subscribe(userData => setTimeout(async () => {
      this.LoadAnnouncements();

      this.modalHeading = "Modify Announcement";
      this.modaltext = "Announcement has been modified.";
      this.modalService.open("popupformessage");
    }, 0));
  }
  customComparatorF(valueA, valueB) {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }
  customComparatorL(valueA, valueB) {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
  }
  showStatusRendererFunc(params) {
    if (params.data.deleted == "0") {
      return "Yes";
    } else {
      return "No";
    }
  }
  editRowRendererFunc(params) {
    if (params.data.deleted !== "0") {
      return '<button class="btn-ahref" style="cursor:default"><img src="assets/edit.png" style="width:16px;" /></button>';
    } else {
      return '<button class="btn-ahref" title="Modify Announcement"><img src="assets/edit.png" style="width:16px;" /></button>';
    }
  }
  deleteRowRendererFunc(params) {
    return '<button class="btn-ahref" title="Delete Announcement"><img src="assets/delete.png" style="width:16px;" /></button>';
  }
  sortFunction(a, b) {
    if (a.createdat < b.createdat) {
      return -1;
    }
    if (a.createdat > b.createdat) {
      return 1;
    }
    return 0;
  }
  LoadAnnouncements() {
    this.itemsList = [];
    var params1 = {};
    this.announcementListSubscribe = this.dbService.getDatabyParam("announcements", params1).subscribe(fileDatas => setTimeout(() => {
      this.loading = true;
      if (fileDatas["body"]["length"] > 0) {
        for (let i = 0; i < fileDatas["body"]["length"]; i++) {
          var t = fileDatas["body"][i];
					if(t["announcement"] !== "")
					t["announcement"]= this.helpService.formatStringDecode(t["announcement"]);
          this.itemsList.push(t);
        }
        this.itemsList = this.itemsList.sort(this.sortFunction);
        this.rowData = this.itemsList;
      }
      if (fileDatas["length"] == 0) {
        this.errorMessage = "No announcements";
      }
    }), error => { console.log(error); });
    this.gridOptions = {
      columnDefs: this.columnDefs,
      // overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
      overlayLoadingTemplate: '',
      overlayNoRowsTemplate: '<span class="norows">No announcements.</span>',
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
  deletedata(id) {
    this.announcementSubscribe = this.dbService.deleteDataByTable("announcements" ,id).subscribe(itemData => setTimeout(() => {
      this.LoadAnnouncements();
    }));
  }
  addNew() {
    this.addItem = { "id": "", "announcement": "", "createdby": "" };
    if (typeof (this.currentUser["id"]) !== "undefined" && this.currentUser !== null) {
      this.addItem["createdby"] = this.currentUser["id"];
    }
    this.modalService.open("addnew");
  }
  closeModal(id) {
    this.modalService.close(id);
  }
  addData(form) {   
   
    if (form.form.status == 'VALID') {
      if(this.addItem["announcement"] !=='')
      this.addItem["announcement"] = this.formatString(this.addItem["announcement"]);
      this.formSubmitted = false;
      if(this.addItem["deleted"]== true)
      this.addItem["deleted"] = "0";
      else
      this.addItem["deleted"] = "1";

      this.modalService.close("addnew");

      if (this.addItem.id !== '') {


        this.announcementSubscribe = this.dbService.putData("announcements", this.addItem).subscribe(announcementsdata => setTimeout(() => {
          this.LoadAnnouncements();

          this.modalHeading = "Modify announcement";
          this.modaltext = "Announcement Updated."
          this.modalService.open("popupformessage");
        }));
      }
      else {
        //when add new by default it should be active
        this.addItem["deleted"] = "0";
        this.announcementSubscribe = this.dbService.postData("announcements", this.addItem).subscribe(itemData => setTimeout(() => {
          this.LoadAnnouncements();
          this.modalHeading = "Add new announcement";
          this.modaltext = "Announcement added."
          this.modalService.open("popupformessage");
        }));
      }
    } else {
      this.formSubmitted = true;
    }
  }
  ngOnDestroy() {
    if (this.announcementSubscribe) this.announcementSubscribe.unsubscribe();
    if (this.announcementListSubscribe) this.announcementListSubscribe.unsubscribe();
    if (this.usersSubscribe) this.usersSubscribe.unsubscribe();
    if (this.updateAnnouncementSubscribe) this.updateAnnouncementSubscribe.unsubscribe();    
  }
}
