import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Add2collectionService } from './add2collection.service';
import { DBService } from './../../../dbservices/db.service';
import { HelpService } from './../../../services/help.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add2collection',
  templateUrl: './add2collection.component.html',
  styleUrls: ['./add2collection.component.scss']
})
export class Add2collectionComponent implements OnInit, OnDestroy {
	contentList: Array<any> = [];
    @Input() id: string;
    @Input() recipeid: string;
 
    element: any;
    showhideTimeFlag: any;
	
    @Output() returnCData: EventEmitter<any> = new EventEmitter();
	
    @Output() closeDT: EventEmitter<any> = new EventEmitter();

	retval : any = false;
	retData: any = {};
   elementId : any;
  
   loadingData: boolean = false;
    constructor(private add2collectionService: Add2collectionService,private toastr: ToastrService, private el: ElementRef, private dbService: DBService, private helpService: HelpService, private router: Router, private route: ActivatedRoute) {
    this.element = el.nativeElement;
 
    this.id = "";
    this.retval = false;

    this.showhideTimeFlag = true;
    }


    ngOnInit(): void {
     
    this.retData = {"recipeid":""};
   this.elementId= this.element.id;
      this.loadCollectionNames();
    }

    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.add2collectionService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('dt-modal-open');

	
		this.returnCData.emit(this.retData);
    this.add2collectionService.add(this);
    }

 
    close(): void {

        this.element.style.display = 'none';
        document.body.classList.remove('dt-modal-open');
    }
	
	save()
	{
		console.log("In save");
		console.log(this.retData);
    this.returnCData.emit(this.retData);

	}	
	
	closeCal()
	{

		this.closeDT.emit(this.retData);
	}	
	currentUser: any; 
	collectionsList: Array<any> = [];
	collection: any = { "id": '', "day": "", "mealType": "" };
	showAdd2C: boolean = false;
	loadCollectionNames() {
		this.loadingData = true;
    this.currentUser = this.helpService.getCurrentUser();

		if (this.currentUser && this.currentUser["id"]) {
			if (this.collectionsList.length == 0) {
				this.collectionsList = [];

				var params = {};
				console.log(params);
				params['query'] = "select id, collection_name from collection where created_by = " + this.currentUser["id"];
				var res = this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {

					if (invData !== null) {
						var obj = invData["body"]["length"];
						this.collectionsList = invData["body"];
					}
					this.loadingData = false;

				}));
			}
		}
	}

	add2Collection() {
		console.log("add to collections");
		var paramsr = {};
		paramsr["collection_id"] = this.collection["id"];
		paramsr["recipe_id"] =  this.recipeid;
		paramsr["created_by"] = this.currentUser["id"];

		var res = this.dbService.getDataByTable("recipe_mapping", paramsr).subscribe(invData => setTimeout(() => {

			if (invData !== null && invData["body"]["length"] > 0) {
				this.toastr.success("Recipe has been already added to the collection.", "Add Recipe to Collection");
			}
			else {
				var res = this.dbService.postDataByTable("recipe_mapping", paramsr).subscribe(invData => setTimeout(() => {
					this.toastr.success("Recipe has been added to the collection.", "Add Recipe to Collection");
				}));
			}
			this.retData["recipeid"] = this.recipeid;
			this.save();
			
		}));

	}

}