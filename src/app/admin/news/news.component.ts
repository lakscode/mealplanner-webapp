import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { UserService, User } from '../../services/user.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  currentUser: any;
  loading: any;
  errorMessage: any = "";
  uploadedFilesList: Array<any> = [];
  disable: boolean = false;
  viewMode: boolean = false;
  newNews: any;
  formSubmitted: boolean = false;
   news: Array<any> = [];
  columnDefs: Array<any> = [];
  gridOptions: any;
  rowData: Array<any> = [];
  usersSubscribe: any;
  newsSubscribe: any;
  updatenewsSubscribe:any;
  modaltext: any;
  modalHeading: any;
  modalheadingAddEdit:any;
  isAuthorised: boolean = false;
  statusData: any;
  constructor(private router: Router, private route: ActivatedRoute, private httpService: HttpClient, private dbService: DBService, private helpService: HelpService, private userService: UserService, private modalService: ModalService) { }

  ngOnInit() {
    this.isAuthorised = false;
    this.disable = false;
    this.rowData = [];
    this.currentUser = null;
    this.news = [];
    this.statusData = {};
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
      this.LoadGridDefaults();
      this.LoadNews();
    }, 0));

  }
  editRowRendererFunc(params) {
    if (params.data.deleted !== "0") {
      return '<button class="btn-ahref" style="cursor:default"><img src="assets/edit.png" style="width:16px;" /></button>';
    } else {
      return '<button class="btn-ahref" title="Modify News"><img src="assets/edit.png" style="width:16px;" /></button>';
    }

  }

  deactivateRowRendererFunc(params) {
    if (params.data.deleted == "0") {
      return '<button class="btn-ahref" title = "Inactivate News" style="color: #228B22;font-weight:bold">Yes</button>';
    } else {
      return '<button class="btn-ahref" title = "Activate News">No</button>';
    }
  }

  LoadGridDefaults() {
    this.columnDefs = [
      { headerName: 'Title', field: 'title', width: 120, sortable: true, unSortIcon: true, cellClass: 'noborder', lockPosition: true },
      
      { headerName: 'News', field: 'details', width: 200, sortable: false, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Modify', field: 'id', width: 60, sortable: false, cellRenderer: this.editRowRendererFunc, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Active', field: 'deleted', width: 70, sortable: true, unSortIcon: true, cellRenderer: this.deactivateRowRendererFunc, cellClass: 'noborder', lockPosition: true }
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
  onCellClicked($event)
  {  
    switch ($event.colDef["headerName"]) {
      case 'Modify': 
      this.viewMode = false;
         if ($event.data.deleted == "0") {
        this.modifyNews($event.data["id"]); 
        }    				
        break;
      case 'Active':
        this.viewMode = false;
      
          this.setStatus($event.data);
      
        break;    
      default:
    }  
  }
 
  LoadNews() {
    var params = {};
    this.news = [];
    this.newsSubscribe = this.dbService.getDatabyParam("news", params).subscribe(fileDatas => setTimeout(() => {
      this.loading = true;
      if (fileDatas["body"]["length"] > 0) {

        for (let i = 0; i < fileDatas["body"]["length"]; i++) {
          var t = fileDatas["body"][i];
					if(t["title"] !== "")
					t["title"]= this.helpService.formatStringDecode(t["title"]);
          if(t["details"] !== "")
					t["details"]= this.helpService.formatStringDecode(t["details"]);
          this.news.push(t);
        }

        this.rowData = this.news;
        this.gridOptions.rowData = this.rowData;
      }
      if (fileDatas["body"]["length"] == 0) {
        this.errorMessage = "No News";
      }
    }));
  }


  modifyNews(id) {
    this.formSubmitted = false;
    this.modalheadingAddEdit = "Add News";
    if (id !== "") {
      this.modalheadingAddEdit = "Modify News";
      var uIndex = this.news.findIndex(x => x["id"] === id);
      if (uIndex > -1) {
        var item = this.news[uIndex];
        this.newNews = item;
      }    
    }
    else {
      this.viewMode = false;
     
      this.newNews = {
        "id": "",
        "title": "",
        "details": "",
        "link":"",
        "createdby": ""
      };
     
    }
    this.modalService.open("isNewNews");

  }
  formatString(str)
	{
		var retv = str;
		if(str !== "")
		retv = this.helpService.formatStringEncode(str);
		return retv;
	}
  addNewsData(form) {
    if (form.form.status == 'VALID') {
      //this.newNews["title"] = this.formatString(this.newNews["title"]);
      //this.newNews["details"] = this.formatString(this.newNews["details"]);
      if (this.newNews.id !== "") {
        this.updateNews(this.newNews);
      }
      else {
        this.addNews(this.newNews);
      }
      
      this.formSubmitted = false;
    } else {
      this.formSubmitted = true;
    }
  }
  updateNews(data) {  
    var params = {}
    params["id"] = data["id"];
    params["title"] = this.formatString(data["title"]);
    params["details"] = this.formatString(data["details"]);
    params["link"] = data["link"];
    params["deleted"] = data["deleted"];;
    params["createdat"] = data["createdat"];
    params["createdby"] = data["createdby"];
    params["modifiedat"] =this.helpService.CurrentDateTime();
    params["modifiedby"] = this.currentUser["id"];
    
    this.modalService.close("isNewNews");

    this.updatenewsSubscribe = this.dbService.putData("news", params).subscribe(updatedNews => setTimeout(() => {
      this.LoadNews();

      this.modalHeading = "Modify News";
      this.modaltext = "News has been modified."
      this.modalService.open("popupformessage");
    }));
  }
  addNews(item) {
    var params = {}
 
    params["title"] = this.formatString(item["title"]);
    params["details"] = this.formatString(item["details"]);
    params["link"] = item["link"];
    params["deleted"] = "0";
    params["createdat"] = this.helpService.CurrentDateTime();
    params["createdby"] = this.currentUser["id"];
    params["modifiedat"] =this.helpService.CurrentDateTime();
    params["modifiedby"] = this.currentUser["id"];

    this.modalService.close("isNewNews");

    this.newsSubscribe = this.dbService.postData("news", params).subscribe(addedNews => setTimeout(async () => {
      this.LoadNews();

      this.modalHeading = "Add News";
      this.modaltext = "News Added."
      this.modalService.open("popupformessage");
    }, 0));
  }

  closeModal(id) {
    this.modalService.close(id);
  }

  setStatus(data)
  {
  
      this.formSubmitted = false;
      if (data.id !== "") {
        var uIndex = this.news.findIndex(x => x["id"] === data.id);
        if (uIndex > -1) {
          var item = this.news[uIndex];
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

    var params = {"deleted":this.statusData["deleted"], "id":this.statusData["id"]};
    
    this.modalService.close("isModelActive")

    this.updatenewsSubscribe = this.dbService.putData("news", params).subscribe(userData => setTimeout(async () => {
      this.LoadNews();

      this.modalHeading = "Modify News";
      this.modaltext = "News has been modified.";
      this.modalService.open("popupformessage");
    }, 0));
  }


  ngOnDestroy() {
    if (this.newsSubscribe) this.newsSubscribe.unsubscribe();
    if (this.usersSubscribe) this.usersSubscribe.unsubscribe();
    if (this.updatenewsSubscribe) this.updatenewsSubscribe.unsubscribe();    
  }
}
