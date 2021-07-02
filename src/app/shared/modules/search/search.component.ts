import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter, HostListener } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { SearchService } from './search.service';
import { HelpService } from './../../../services/help.service';
import { DBService } from './../../../dbservices/db.service';
import { constants } from '../../../../assets/data/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
	
    @Input() id: string;
    @Input() inputParams: any;
    @Input() update: any = 0;
    @Input() showhide: any = true;
    @Input() isPlan: any = "";


    sliderList: Array<any> = [];
     element: any;
     showhideTimeFlag: any;
	
    @Output() returnData: EventEmitter<any> = new EventEmitter();
	
    @Output() closeDT: EventEmitter<any> = new EventEmitter();
   
   tempTm : any;
   elementId : any;
 

  sub: any;
	private onDestroy$: Subject<void> = new Subject<void>();
  list: any;
  returnpath: any;
  returnparam1: any;
  questions: any =[];
  currentQuestion : any = 0;
  params: any = {};
  processing: boolean = false;
  uniqueid: any = "";
  searchFilterLabels:Array<any>= [];
  recipesList1: Array<any>= [];
  modifyFilterLabels: Array<any>= [];
  searchparam: any;
  @HostListener('document:click', ['$event'])
  clickout(args) {
  this.callhideFunct(args);
}
    constructor(private router: Router,private route: ActivatedRoute, private dbService: DBService,  private helpService: HelpService, private searchService: SearchService, private el: ElementRef) {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }
   

     this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
           // trick the Router into believing it's last link wasn't previously loaded
           this.router.navigated = false;
           // if you need to scroll back to top, here is the right place
           window.scrollTo(0, 0);
        }
    });

    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    console.log(this.isPlan);

    this.searchparam = { "q": "", "param":"", "random":true, "dietLabels": "", "healthLabels": "" }

   
   
    console.log( this.searchparam);
    this.showhideTimeFlag = true;
    }

    loadSliders()
    {
   

    }

    ngOnInit(): void {
      this.processing = false;
        // customize default values of carousels used by this component tree
        this.loadRouteParams()
    }
    ngOnChanges() {
      console.log("on changes");
      this.processing = false;
      
      this.loadRouteParams()
  }
  routeParams: any;
  loadRouteParams()
  {
    this.searchparam = {"q":"", "param":"", "maxcalories":""}
    this.routeParams = {};
		this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      this.routeParams = params;
			if (typeof (this.routeParams.param) !== "undefined" && this.routeParams.param !== "") {
				this.searchparam["param"] = this.routeParams.param;
				this.searchparam["random"] = false;
			}
      if (typeof (this.routeParams.q) !== "undefined" && this.routeParams.qData !== "") {
				this.searchparam["q"] = this.routeParams.q;
			}
			if (typeof (this.routeParams.dietLabels) !== "undefined" && this.routeParams.dietLabels !== "") {
				this.searchparam["dietLabels"] = this.routeParams.dietLabels;
			}
			if (typeof (this.routeParams.healthLabels) !== "undefined" && this.routeParams.healthLabels !== "") {
				this.searchparam["healthLabels"] = this.routeParams.healthLabels;
			}
      console.log(this.searchparam);
        this.setDefaults();
    });

  }
    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.searchService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('dt-modal-open');

	
		this.returnData.emit(this.recipesList1);
		this.searchService.add(this);
    }

 
    close(): void {

        this.element.style.display = 'none';
        document.body.classList.remove('dt-modal-open');
    }
	
	save()
	{
    console.log(this.recipesList1);
    this.returnData.emit(this.recipesList1);

	}	
	
	closeCal()
	{

		this.closeDT.emit(this.recipesList1);
	}	

  callhideFunct(args)
	{
		var classlist = this.helpService.getDateIgnoreClassList();

			var matchFlag = 0;
			for (let ip = 0; ip < classlist.length; ip++) {
				if (args.srcElement.className.indexOf(classlist[ip]) !== -1) {
					matchFlag = 1;
				}
			}
			if (matchFlag == 0) {
				for (let l = 0; l < this.searchFilterLabels.length; l++) {
						this.searchFilterLabels[l]['selected'] = false;
				}

				for (let j = 0; j < this.recipesList1.length; j++) {
					this.recipesList1[j]['showpopup'] = false;
					this.recipesList1[j]['showAdd2MP'] = false;
					this.recipesList1[j]['showAdd2C'] = false;
				}
			}

	}
  
  hideLabels() {
		for (let l = 0; l < this.searchFilterLabels.length; l++) {
			this.searchFilterLabels[l]['selected'] = false;
		}

	}

	showLabels(label) {
		for (let l = 0; l < this.searchFilterLabels.length; l++) {
			if (this.searchFilterLabels[l]["label"] == label.label)
				this.searchFilterLabels[l]['selected'] = !this.searchFilterLabels[l]['selected'];
			else
				this.searchFilterLabels[l]['selected'] = false;
		}
  }

  /************ questionnaire  */
  currentUser: any ;

  setDefaults()
  {

  	
		this.currentUser =this.helpService.getCurrentUser();
		if(this.currentUser !== null)
		{
		  if( this.currentUser["firstname"] !== "")
		  this.currentUser["displayname"] = this.currentUser["firstname"];
		  else if( this.currentUser["username"] !== "")
		  this.currentUser["displayname"] = this.currentUser["username"];
	
		}
    this.loadDDList();
  }
  hideModifyLabels() {
		for (let l = 0; l < this.modifyFilterLabels.length; l++) {
			this.modifyFilterLabels[l]['selected'] = false;
		}
	}
  dietLabelsList: Array<any> = [];
  mineralsLabelsList: Array<any> = [];
  mealTypeList: Array<any> = [];
  healthlabelsList: Array<any> = [];
  cuisineTypeList: Array<any> = [];
  loadDDList() {

		this.searchFilterLabels = [];
		this.searchFilterLabels.push({ "label": "Health Labels", "selected": false });
		this.searchFilterLabels.push({ "label": "Diet Labels", "selected": false });
		this.searchFilterLabels.push({ "label": "Cuisine Type", "selected": false });
		this.searchFilterLabels.push({ "label": "Meal Type", "selected": false });
		this.searchFilterLabels.push({ "label": "Nutrients", "selected": false });
		this.searchFilterLabels.push({ "label": "Calories", "selected": false });

    console.log(this.searchFilterLabels);

		this.modifyFilterLabels = [];
		this.modifyFilterLabels.push({ "label": "Health Labels", "selected": false });
		this.modifyFilterLabels.push({ "label": "Diet Labels", "selected": false });
		this.modifyFilterLabels.push({ "label": "Cuisine Type", "selected": false });
		this.modifyFilterLabels.push({ "label": "Meal Type", "selected": false });

		this.cuisineTypeList = [];
		for (let c = 0; c < constants.cuisineTypeList.length; c++) {
			this.cuisineTypeList.push({ "name": constants.cuisineTypeList[c], "selected": false })
		}

		this.dietLabelsList = [];
		for (let d = 0; d < constants.dietLabels.length; d++) {
			this.dietLabelsList.push({ "name": constants.dietLabels[d], "selected": false })
		}


		this.mealTypeList = [];
		for (let d = 0; d < constants.mealTypeList.length; d++) {
			this.mealTypeList.push({ "name": constants.mealTypeList[d], "selected": false })
		}


		//this.healthlabelsList = constants.healthLabels;
		this.healthlabelsList = [];
		for (let h = 0; h < constants.healthLabelsNew.length; h++) {
			this.healthlabelsList.push({ "name": constants.healthLabelsNew[h], "selected": false })
		}

		//this.mineralsLabelsList = constants.minerals;
		this.mineralsLabelsList = [];
		for (let m = 0; m < constants.minerals_new.length; m++) {
			this.mineralsLabelsList.push({ "name": constants.minerals_new[m]["name"], "selected": false, "unit": constants.minerals_new[m]["unit"], "min": "", "max": "", "t_min": "", "t_max": "" })
		}
    this.searchProps();
	}
 

  /******** recipes api serach */
	maxcalories: any = "";
	loopCount: any = 0;
	loadingData: boolean = false;
  splitcontent: boolean = false;
	searchProps() {
		this.searchparam["random"] = "true";
		
		console.log('searchProps');

		this.loadingData = true;
		var paramsAdded = false;
		var params = {}

		if (typeof (this.searchparam.dietLabels) !== "undefined" && this.searchparam.dietLabels !== "") {
			params["dietLabels"] = this.searchparam.dietLabels;
			paramsAdded = true;
		}

		if (typeof (this.searchparam.healthLabels) !== "undefined" && this.searchparam.healthLabels !== "") {
			params["healthLabels"] = this.searchparam.healthLabels;
			paramsAdded = true;

		}
		if (this.searchparam.q) {
			params["random"] = "true";
			console.log(" this.splitcontent " + this.splitcontent);
			if (this.splitcontent) {
				params["content"] = this.searchparam.q.split(" ").join(",");
				console.log(params['content']);
				this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipes", this.currentUser["id"]);
				paramsAdded = true;
			}
			else {
				this.loopCount = 0;
				var words = this.searchparam.q.replaceAll(" ", "~");
				params["words"] = words;
				this.helpService.saveSearchHistory(this.searchparam.q, "text", "recipes", this.currentUser["id"]);
				paramsAdded = true;
			}

		}
    else if (typeof (this.searchparam["param"]) !== "undefined" && this.searchparam["param"] !== "") {
      params["content"] = "";
      params["words"] ="";
			params["random"] = "false";
			var words = this.searchparam["param"].replaceAll(" ", "~");
			params["words"] = words;
			this.helpService.saveSearchHistory(this.searchparam["param"], "text", "recipes", this.currentUser["id"]);
			paramsAdded = true;
			this.searchparam["param"] = "";
		}

		if (typeof (this.maxcalories) !== "undefined" && this.maxcalories > 0) {
			params["caloriesto"] = this.maxcalories;
			paramsAdded = true;
		}
		
		
		params["instructions"] = "notempty";

    if(this.isPlan)
    {
     params["returnfields"] = " id, label, image, cuisineType, mealType, healthLabels,ingredients,  dietLabels, totalNutrients, digest,calories, yield ";
    }
    else
    {
		params["returnfields"] = " id, label, image, cuisineType, mealType, healthLabels, dietLabels, calories, yield, created_by";
    }
		var dietlabels = "";
		for (let m = 0; m < this.dietLabelsList.length; m++) {
			if (this.dietLabelsList[m]["selected"])
				dietlabels += this.dietLabelsList[m]["name"] + "~";
				
		}
		if (dietlabels !== "") {
			dietlabels = dietlabels.slice(0, -1);
			paramsAdded = true;
		}

		var healthlabels = "";
		for (let m = 0; m < this.healthlabelsList.length; m++) {
			if (this.healthlabelsList[m]["selected"])
				healthlabels += this.healthlabelsList[m]["name"] + "~";
		}
		if (healthlabels !== "") {
			healthlabels = healthlabels.slice(0, -1);
			paramsAdded = true;
		}

		var cuisinetypes = "";
		for (let c = 0; c < this.cuisineTypeList.length; c++) {
			if (this.cuisineTypeList[c]["selected"])
				cuisinetypes += this.cuisineTypeList[c]["name"] + "~";
		}

		if (cuisinetypes !== "") {
			cuisinetypes = cuisinetypes.slice(0, -1);
			paramsAdded = true;
		}

		var mealtypes = "";
		for (let c = 0; c < this.mealTypeList.length; c++) {
			if (this.mealTypeList[c]["selected"])
				mealtypes += this.mealTypeList[c]["name"] + "~";
		}

		if (mealtypes !== "") {
			mealtypes = mealtypes.slice(0, -1);
			paramsAdded = true;
		}

		var minerals = "";
		var mQuery = "";
		for (let m = 0; m < this.mineralsLabelsList.length; m++) {
			var item = this.mineralsLabelsList[m];
			// console.log(item);
			if (this.mineralsLabelsList[m]["selected"])
				minerals += this.mineralsLabelsList[m]["name"] + "~";
			if (typeof (item["min"]) !== "undefined" && item["min"] !== "" && item["min"] > 0) {
				mQuery += " " + item["name"].toLowerCase() + "/recipes.yield >= " + item["min"] + " AND ";
			}
			if (typeof (item["max"]) !== "undefined" && item["max"] !== "" && item["max"] > 0) {
				mQuery += " " + item["name"].toLowerCase() + "/recipes.yield <= " + item["max"] + " AND ";
			}

		}

		if (minerals !== "") {
			minerals = minerals.slice(0, -1);
			paramsAdded = true;
		}

		if (mQuery !== "") {
			mQuery = mQuery.slice(0, -4);
			paramsAdded = true;
			this.helpService.saveSearchHistory(mQuery, "nutrients", "recipes", this.currentUser["id"]);
		}

		var checkMinerals = false;

		if (typeof (dietlabels) !== "undefined" && dietlabels !== "") {
			params["dietLabels"] = dietlabels
			paramsAdded = true;
			this.helpService.saveSearchHistory(dietlabels, "dietLabels", "recipes", this.currentUser["id"]);
		}

		if (typeof (healthlabels) !== "undefined" && healthlabels !== "") {
			params["healthLabels"] = healthlabels
			paramsAdded = true;
			this.helpService.saveSearchHistory(healthlabels, "healthLabels", "recipes", this.currentUser["id"]);
		}

		if (typeof (cuisinetypes) !== "undefined" && cuisinetypes !== "") {
			params["cuisineType"] = cuisinetypes
			paramsAdded = true;
			this.helpService.saveSearchHistory(cuisinetypes, "cuisineType", "recipes", this.currentUser["id"]);
		}

		if (typeof (mealtypes) !== "undefined" && mealtypes !== "") {
			params["mealType"] = mealtypes
			paramsAdded = true;
			this.helpService.saveSearchHistory(mealtypes, "mealType", "recipes", this.currentUser["id"]);
		}



		if (typeof (minerals) !== "undefined" && minerals !== "") {
			params["totalNutrientsne"] = "notempty";
			params["digestne"] = "notempty";
			checkMinerals = true;

			paramsAdded = true;

		}

		if (mQuery !== "") {


			var params1 = {};

			var query = "select id, label, image, cuisineType, healthLabels, mealType, dietLabels, calories, yield,  created_by from recipes ";


      if(this.isPlan)
      {
        query = "select id, label, image, cuisineType, mealType, healthLabels,ingredients,  dietLabels, totalNutrients, digest,calories, yield, created_by from recipes  ";
      }

			var where = " where status = 1 AND totalNutrients != '' AND digest != ''  AND s_instructions != '' ";
			if(!paramsAdded)
			{
				where += " AND cuisineType LIKE '%" + constants.defaultCuisinetype + "%' "
			}
			if (this.maxcalories > 0)
				where += " AND calories <= " + this.maxcalories;

			if (params["content"]) {
				var temp = params["content"].split(",");
				var tempc = "";
				for (let t = 0; t < temp.length; t++) {
					tempc += " label LIKE '%" + temp[t] + "%' OR healthLabels LIKE '%" + temp[t] + "%' OR dietLabels LIKE '%" + temp[t] + "%' OR";
				}
				if (tempc !== "") {
					tempc = tempc.slice(0, -2);
					where += " AND ( " + tempc + ")";
				}

			}

			if (dietlabels !== "") {
				var t = dietlabels.split("~");
				for (let i = 0; i < t.length; i++) {
					where += " AND dietLabels LIKE '%" + t[i] + "%'"
				}
			}
			if (healthlabels !== "") {
				var t1 = healthlabels.split("~");
				for (let i = 0; i < t1.length; i++) {
					where += " AND healthLabels LIKE '%" + t1[i] + "%'"
				}
			}

			where += " AND id in (select recipeid from nutrients where " + mQuery + ")";

			params1["query"] = query + where + " limit 0, 30";
			console.log(params1);
			var res = this.dbService.getDatabyTablebyQuery("recipes", params1).subscribe(invData => setTimeout(() => {
	
				if (invData["body"]["length"] == 0) {
					console.log("calling again searchprops");
					this.splitcontent = true;
					if (this.loopCount < 1) {
						this.loopCount++;
						this.searchProps();

					}
					this.noResult = true;
				}
				else {
					this.loadingData = false;
					this.splitcontent = false;
					//	this.formatResult(this.shuffle(invData));
					this.formatResult(invData);
				}
			}));

		}
		else {

			params["status"] = "1";
			params["limit"] = "100";

			if(!paramsAdded)
			{
				params["cuisineType"] = "american"
			}
			console.log(params);
			var res = this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
		
				if (invData["body"]["length"] == 0) {
					this.splitcontent = true;
					if (this.loopCount < 1) {
						this.loopCount++;
						this.searchProps();

					}
					this.noResult = true;
				}
				else {
					this.loadingData = false;
					this.splitcontent = false;
					//	this.formatResult(this.shuffle(invData));
					this.formatResult(invData);
				}
			}));
		}


	}

	shuffle(array) {
		//for (var i = array.length - 1; i > 0; i--) {
		for (var i = 0; i < array.length - 1; i++) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		console.log("after sort");
		console.log(array);
		return array;
	}
  noResult : boolean = false;

  ratingsArr:Array<any>=[]
  ratingIds: any = "";
	formatResult(invData) {
		console.log(invData.count);
		if (invData.count > 0) {
			this.noResult = false;
			if (typeof (invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0) {
				this.recipesList1 = [];
				this.ratingIds = "";
				var temp = invData["body"];
				if (temp["length"] > 0) {
					for (let i = 0; i < temp["length"]; i++) {
						this.recipesList1.push(temp[i]);
						this.ratingIds += temp[i]["id"] + ",";
					}
			

					
				}

			}

	
			this.loadRatings();

		} else {
			this.recipesList1 = [];
			this.noResult = true;
      console.log("Calling save");
      this.save();
		}
	}

 
	loadRatings() {
		if (typeof (this.ratingIds) !== "undefined" && this.ratingIds !== "") {
			this.ratingIds = this.ratingIds.substring(0, this.ratingIds.length - 1);
		}

		var params = { "limit": 100 };

		params["query"] = "SELECT count(rating) as totalcount, sum(rating) as totalrating, recipeid FROM `rating` where recipeid in (" + this.ratingIds + ") group by recipeid";
		var res = this.dbService.getDatabyTablebyQuery("rating", params).subscribe(invData => setTimeout(() => {
	;
			if (invData !== null) {
				if (typeof (invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0) {
					var temp = invData["body"];
					if (temp["length"] > 0) {
						this.ratingsArr = [];
						for (let i = 0; i < temp["length"]; i++) {
							this.ratingsArr.push(temp[i])
					
							var recIndex = this.recipesList1.findIndex(x1 => (x1.id === temp[i]["recipeid"]));
				
							if (recIndex > -1) {
								this.recipesList1[recIndex]["totalcount"] = temp[i]["totalcount"];
								this.recipesList1[recIndex]["totalrating"] = temp[i]["totalrating"];

								if (temp[i]["totalrating"] > 0 && temp[i]["totalcount"] > 0) {
									this.recipesList1[recIndex]["displayrating"] = Math.ceil((temp[i]["totalrating"] / temp[i]["totalcount"]));
								}

							}



						}


					}
         
				}

			}
      console.log("Calling save");
      this.save();
		}));



	}

	formatVal(str) {
		return this.helpService.formatValue(str);
	}
  setFLU(str) {
		var retValue = str;
		if (str !== "") {
			retValue = this.helpService.setInputFirstToUppercase(str);
		}
		return retValue;
	}

	

	formatlabels(str) {
		var ret = str;
		if (str !== "")
			ret = str.replaceAll("~", ", ");

		return ret;
	}
 
	clearFilters() {
		this.noResult = false;

		for (let l = 0; l < this.searchFilterLabels.length; l++) {
			this.searchFilterLabels[l]['selected'] = false;
		}

		for (let m = 0; m < this.mealTypeList.length; m++) {
			this.mealTypeList[m]['selected'] = false;
		}

		for (let m = 0; m < this.healthlabelsList.length; m++) {
			this.healthlabelsList[m]['selected'] = false;
		}

		for (let m = 0; m < this.dietLabelsList.length; m++) {
			this.dietLabelsList[m]['selected'] = false;
		}

		for (let m = 0; m < this.cuisineTypeList.length; m++) {
			this.cuisineTypeList[m]['selected'] = false;
		}

		for (let m = 0; m < this.mineralsLabelsList.length; m++) {
			this.mineralsLabelsList[m]['selected'] = false;
			this.mineralsLabelsList[m]['min'] = "";
			this.mineralsLabelsList[m]['max'] = "";

		}
		this.maxcalories = 0;
		this.searchparam = { "q": "" };

		this.searchProps();

	}

}