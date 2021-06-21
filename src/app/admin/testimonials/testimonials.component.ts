import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { UserService, User } from '../../services/user.service';
import { ModalService } from '../../shared/modules/modal/modal.service';
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  currentUser: any;
  loading: any;
  errorMessage: any = "";
  uploadedFilesList: Array<any> = [];
  disable: boolean = false;
  viewMode: boolean = false;
  newTestimonial: any;
  formSubmitted: boolean = false;
  testimonials: Array<any> = [];
  columnDefs: Array<any> = [];
  gridOptions: any;
  rowData: Array<any> = [];
  usersSubscribe: any;
  testimonialSubscribe: any;
  updatetestimonialSubscribe:any;
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
    this.testimonials = [];
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
      this.LoadTestimonials("");
    }, 0));

  }
  editRowRendererFunc(params) {
    if (params.data.deleted !== "0") {
      return '<button class="btn-ahref" title="Modify Testimonial" style="cursor:default"><img src="assets/edit.png" style="width:16px;" /></button>';
    } else {
      return '<button class="btn-ahref" title="Modify Testimonial"><img src="assets/edit.png" style="width:16px;" /></button>';
    }

  }

  deactivateRowRendererFunc(params) {
    if (params.data.deleted == "0") {
      return '<button class="btn-ahref" title = "Inactivate Testimonial" style="color: #228B22;font-weight:bold">Yes</button>';
    } else {
      return '<button class="btn-ahref" title = "Activate Testimonial">No</button>';
    }
  }

  LoadGridDefaults() {
    this.columnDefs = [
      { headerName: 'Name', field: 'name', width: 70, sortable: true, unSortIcon: true, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Email', field: 'email', width: 100, sortable: false, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Testimonial', field: 'testimonial', width: 170, sortable: false, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Modify', field: 'id', width: 60, sortable: false, cellRenderer: this.editRowRendererFunc, cellClass: 'noborder', lockPosition: true },
      { headerName: 'Active', field: 'deleted', width: 60, sortable: true, unSortIcon: true, cellRenderer: this.deactivateRowRendererFunc, cellClass: 'noborder', lockPosition: true }
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
        this.modifyTestimonial($event.data["id"]); 
        }    				
        break;
      case 'Active':
        this.viewMode = false;
      
          this.setStatus($event.data);
      
        break;    
      default:
    }  
  }
 
  LoadTestimonials(companyId) {
   this.testimonials = [];
    this.testimonialSubscribe = this.dbService.getData("testimonials").subscribe(fileDatas => setTimeout(() => {
      this.loading = true;
      if (fileDatas["body"]["length"] > 0) {
        for (let i = 0; i < fileDatas["body"]["length"]; i++) {
          var t = fileDatas["body"][i];
					if(t["testimonial"] !== "")
					t["testimonial"]= this.helpService.formatStringDecode(t["testimonial"]);
          this.testimonials.push(t);
        }
        this.rowData = this.testimonials;
        this.gridOptions.rowData = this.rowData;
      }
      if (fileDatas["body"]["length"] == 0) {
        this.errorMessage = "No Testimonials";
      }
    }));
  }


  modifyTestimonial(id) {
    this.formSubmitted = false;
    this.modalheadingAddEdit = "Add Testimonial";
    if (id !== "") {
      this.modalheadingAddEdit = "Modify Testimonial";
      var uIndex = this.testimonials.findIndex(x => x["id"] === id);
      if (uIndex > -1) {
        var item = this.testimonials[uIndex];
        this.newTestimonial = item;
      }    
    }
    else {
      this.viewMode = false;
     
      this.newTestimonial = {
        "id": "",
        "email": "",
        "phone": "",
        "testimonial": "",
        "name": "",
        "createdby": ""
      };
     
    }
    this.modalService.open("isNewTestimonial");

  }
  addTestimonialData(form) {
    if (form.form.status == 'VALID') {
      
      if (this.newTestimonial.id !== "") {
        this.updateTestimonial(this.newTestimonial);
      }
      else {
        this.addTestimonial(this.newTestimonial);
      }
      
      this.formSubmitted = false;
    } else {
      this.formSubmitted = true;
    }
  }
  updateTestimonial(data) {  
    this.modalService.close("isNewTestimonial");

    data["testimonial"] = this.formatString(data["testimonial"]);
    this.updatetestimonialSubscribe = this.dbService.putData("testimonials", data).subscribe(updatedTestimonial => setTimeout(() => {
      this.LoadTestimonials("");

      this.modalHeading = "Modify Testimonial";
      this.modaltext = "Testimonial has been modified."
      this.modalService.open("popupformessage");
    }));
  }
  addTestimonial(item) {
    this.modalService.close("isNewTestimonial");

    item["testimonial"] = this.formatString(item["testimonial"]);
    this.testimonialSubscribe = this.dbService.postData("testimonials", item).subscribe(addedTestimonial => setTimeout(async () => {
      this.LoadTestimonials("");

      this.modalHeading = "Add Testimonial";
      this.modaltext = "Testimonial Added."
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
        var uIndex = this.testimonials.findIndex(x => x["id"] === data.id);
        if (uIndex > -1) {
          var item = this.testimonials[uIndex];
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
    
    this.statusData["deleted"] = "1";
    if(this.statusData["active"])
    this.statusData["deleted"] = "0";
    this.modalService.close("isModelActive")
    var params = {"deleted":this.statusData["deleted"], "id":this.statusData["id"]};

    this.updatetestimonialSubscribe = this.dbService.putData("testimonials", params).subscribe(userData => setTimeout(async () => {
      this.LoadTestimonials("");

      this.modalHeading = "Modify Testimonial";
      this.modaltext = "Testimonial has been modified.";
      this.modalService.open("popupformessage");
    }, 0));
  }


  ngOnDestroy() {
    if (this.testimonialSubscribe) this.testimonialSubscribe.unsubscribe();
    if (this.usersSubscribe) this.usersSubscribe.unsubscribe();
    if (this.updatetestimonialSubscribe) this.updatetestimonialSubscribe.unsubscribe();    
  }
  formatString(str)
	{
		var retv = str;
		if(str !== "")
		retv = this.helpService.formatStringEncode(str);
		return retv;
	}
}
