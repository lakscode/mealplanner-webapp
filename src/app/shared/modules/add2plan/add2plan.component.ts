import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Add2planService } from './add2plan.service';
import { DBService } from './../../../dbservices/db.service';
import { HelpService } from './../../../services/help.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add2plan',
  templateUrl: './add2plan.component.html',
  styleUrls: ['./add2plan.component.scss']
})
export class Add2planComponent implements OnInit, OnDestroy {
	contentList: Array<any> = [];
    @Input() id: string;
    @Input() planid: string;
 
     element: any;
     showhideTimeFlag: any;
	
    @Output() returnData: EventEmitter<any> = new EventEmitter();
	
    @Output() closeDT: EventEmitter<any> = new EventEmitter();
    meridian: any;

	 retval : any = false;
   tempDt: any;
   maxDt: any;
   minDt :any;
   tempTm : any;
   elementId : any;
   date: any; 
   loadingData: boolean = false;
    constructor(private add2planService: Add2planService,private toastr: ToastrService, private el: ElementRef, private dbService: DBService, private helpService: HelpService, private router: Router, private route: ActivatedRoute) {
    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    this.retval = false;
    this.meridian = true;
    this.showhideTimeFlag = true;
    }


    ngOnInit(): void {
     
    
   this.elementId= this.element.id;
      this.loadPlanNames();
    }

    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.add2planService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('dt-modal-open');

	
		this.returnData.emit(this.retval);
    this.add2planService.add(this);
    }

 
    close(): void {

        this.element.style.display = 'none';
        document.body.classList.remove('dt-modal-open');
    }
	
	save()
	{
    this.returnData.emit(this.retval);

	}	
	
	closeCal()
	{

		this.closeDT.emit(this.retval);
	}	
  plansList: Array<any> = [];
	daysList: Array<any> = [];
	mealTypesList: Array<any> = [];
	plan: any = { "id": '', "day": "", "mealType": "" };
	showAdd2MP: boolean = false;
  currentUser: any; 
	loadPlanNames() {
this.loadingData = true;
    this.currentUser = this.helpService.getCurrentUser();

		if (this.currentUser && this.currentUser["id"]) {
			if (this.plansList.length == 0) {
				this.plansList = [];

				var params = {};
				//params["created_by"]  = this.currentUser["id"];
				console.log(params);
				params['query'] = "select id, name from mealplan where created_by = " + this.currentUser["id"];
				var res = this.dbService.getDatabyTablebyQuery("mealplan", params).subscribe(invData => setTimeout(() => {

					console.log(invData);
					if (invData !== null) {
						var obj = invData["body"]["length"];
						this.plansList = invData["body"];
					}
					this.loadingData = false;
					this.loadOptions();

				}));
			}

		}
	}
	loadOptions() {
		this.mealTypesList = [];
		this.daysList = [];
		for (let d = 0; d < 7; d++) {
			this.daysList.push({ "id": d, "name": "Day " + (d + 1) });
		}

		this.mealTypesList.push({ "code": "breakfast", "name": "Breakfast" });
		this.mealTypesList.push({ "code": "snack1", "name": "Pre-lunch Snack" });
		this.mealTypesList.push({ "code": "lunch", "name": "Lunch" });
		this.mealTypesList.push({ "code": "snack2", "name": "Evening Snack" });
		this.mealTypesList.push({ "code": "dinner", "name": "Dinner" });

	}
	add2Plan() {
		this.showAdd2MP = false;
		console.log(this.plan);

		var params = {};
		//params["created_by"]  = this.currentUser["id"];
		console.log(params);
		params['query'] = "select * from days where meal_plan_id = " + this.plan["id"] + " AND day_num = " + this.plan["day"];
		var res = this.dbService.getDatabyTablebyQuery("days", params).subscribe(invData => setTimeout(() => {

			console.log(invData);
			if (invData !== null && invData["body"]["length"] > 0) {
				var selectedDay = invData["body"][0];
				if (selectedDay[this.plan["mealType"]] == "") {
					this.updateMealType();
				}
				else {
					this.toastr.warning('Another Recipe has been already added to selected meal type of the plan!!!', 'Add to Meal Plan');
				}
			}
			else {
				var params = {};

				params["meal_plan_id"] = this.plan["id"];
				params["day_num"] = this.plan["day"];
				params["name"] = "Day " + (this.plan["day"] + 1);

				params["breakfast"] = "";
				params["snack1"] = "";
				params["lunch"] = "";
				params["snack2"] = "";
				params["dinner"] = "";
				params[this.plan["mealType"]] = this.planid;
				params["created_by"] = "";
				params["created_at"] = new Date();
				params["status"] = 1;



				var res = this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {
					//	alert("New day record created for plan");
					this.toastr.success('Recipe has been added to the selected meal type of the plan!!!', 'Add to Meal Plan');
          this.retval = true;
          this.save();
				}));

			}
		}));

	}

	updateMealType() {
		//alert("add recipe");
		var params1 = {};
		params1['query'] = "update days set " + this.plan["mealType"] + " = " + this.planid + " where meal_plan_id = " + this.plan["id"] + " AND day_num = " + this.plan["day"];
		var res = this.dbService.getDatabyTablebyQuery("days", params1).subscribe(invData => setTimeout(() => {
			this.toastr.success('Recipe has been added to the selected meal type of the plan!!!', 'Add to Meal Plan');
      this.retval = true;
      this.save();
		}));
	}

}