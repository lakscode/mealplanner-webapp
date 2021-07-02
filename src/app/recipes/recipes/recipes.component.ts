import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { constants } from '../../../assets/data/constants';
//declare var $: any;
import { ModalService } from '../../shared/modules/modal/modal.service';
@Component({
	selector: 'app-recipes',
	templateUrl: './recipes.component.html',
	styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
	recipesList: Array<any> = [];
	recipesList1: Array<any> = [];
	recipesList2: Array<any> = [];
	routeParams: any;
	currentUser: any;
	searchparam: any;
	ratingIds: any;
	ratingsArr: Array<any> = [];
	listorgrid: any = {};
	private onDestroy$: Subject<void> = new Subject<void>();
	dietLabelsList: Array<any> = [];
	healthlabelsList: Array<any> = [];
	mineralsLabelsList: Array<any> = [];
	mealTypeList: Array<any> = [];
	searchmorebar: boolean = false;
	animClass: any = "";
	page_num: any = 0;
	page_length: any = 10;
	totalPage: any = 0;
	displayList: Array<any> = [];
	nutrientDbFields: Array<any> = [];
	role: any = {};
	showNutrientsFlag: boolean = false;
	cuisineTypeList: Array<any> = [];
	noResult: boolean = false;

	searchFilterLabels: Array<any> = [];
	modifyFilterLabels: Array<any> = [];
	splitcontent: boolean = false;
	filterOpts: any;
	sortType: any = "";
	showFilters: boolean = false;
	isUser: any = {};
	@HostListener('document:click', ['$event'])
  	clickout(args) {
		this.callhideFunct(args);
  }

	constructor(private router: Router, private toastr: ToastrService, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private formBuilder: FormBuilder, private modalService: ModalService) {

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
				
				for (let j = 0; j < this.recipesList1.length; j++) {
					this.recipesList1[j]['showpopup'] = false;
					this.recipesList1[j]['showAdd2MP'] = false;
					this.recipesList1[j]['showAdd2C'] = false;
				}
			}

	}

	update: any =0;
	
	ngOnInit() {
		console.log("ngOnInit");
		this.searchmorebar = false;
	
		this.filterOpts = {};
		this.filterOpts = { "asc": false, "desc": false, "calories": false, "all": false }
		this.sortType = "";


	
		this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
			window.scrollTo(0, 0)
		});


		this.currentUser = this.helpService.getCurrentUser();
		if (this.currentUser !== null) {
			if (this.currentUser["firstname"] !== "")
				this.currentUser["displayname"] = this.currentUser["firstname"];
			else if (this.currentUser["username"] !== "")
				this.currentUser["displayname"] = this.currentUser["username"];
			console.log(this.currentUser["displayname"]);
		
			
		}
		this.isUser = this.helpService.setUserRoles(this.currentUser);

		this.totalPage = 1;
		this.page_num = 0;
		this.page_length = 12;
		this.searchparam = { "q": "", "param":"", "random":true,"range": {}, "dietLabels": "", "healthLabels": "" }


		this.routeParams = {};
		this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
			//  console.log(params);   
			this.routeParams = params;
			if (typeof (this.routeParams.details) !== "undefined") {
				console.log(this.routeParams.details);
			}
			if (typeof (this.routeParams.param) !== "undefined" && this.routeParams.param !== "") {
				this.searchparam["param"] = this.routeParams.param;
				this.searchparam["random"] = false;
			}

			if (typeof (this.routeParams.dietLabels) !== "undefined" && this.routeParams.dietLabels !== "") {
				this.searchparam["dietLabels"] = this.routeParams.dietLabels;
			}
			if (typeof (this.routeParams.healthLabels) !== "undefined" && this.routeParams.healthLabels !== "") {
				this.searchparam["healthLabels"] = this.routeParams.healthLabels;
			}
			this.update++;
			console.log(this.routeParams);
			console.log(this.searchparam);
			this.splitcontent = false;
		//	this.searchProps();
		});

		//this.loadRecipes()

	}

	loadDDList() {

		this.searchFilterLabels = [];
		this.searchFilterLabels.push({ "label": "Health Labels", "selected": false });
		this.searchFilterLabels.push({ "label": "Diet Labels", "selected": false });
		this.searchFilterLabels.push({ "label": "Cuisine Type", "selected": false });
		this.searchFilterLabels.push({ "label": "Meal Type", "selected": false });
		this.searchFilterLabels.push({ "label": "Nutrients", "selected": false });
		this.searchFilterLabels.push({ "label": "Calories", "selected": false });


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
	}




	limitTo(str, num) {
		var retVal = str;
		if (typeof (str) !== "undefined" && str !== "") {
			retVal = this.helpService.limitTo(str, num);

			if (str.length > num) {
				retVal += "...";
			}
		}

		return retVal;
	}

	formatImage(recipe, type) {
		//  console.log(image);
		var retImage = recipe.image;
		if(recipe.created_by == -1)
		{
		if (recipe.image !== "" && type !== "") {
			retImage = this.helpService.formatImage(recipe.image, type);

		}
		}
		//  console.log(retImage);
		return retImage;
	}


	setFLU(str) {
		var retValue = str;
		if (str !== "") {
			retValue = this.helpService.setInputFirstToUppercase(str);
		}
		return retValue;
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

	

	gotoRecipeDetails(id) {
		//this.router.navigate(['recipedetails', id]);
		window.open("/recipedetails/" + id)
	}

	

	
	formatVal(str) {
		return this.helpService.formatValue(str);
	}


	formatValuePServing(str, servings) {

		var retVal = this.helpService.formatValuePServing(str, servings);
		return retVal;
	}
	formatlabels(str) {
		var ret = str;
		if (str !== "")
			ret = str.replaceAll("~", ", ");

		return ret;
	}


	showhidecontent(recipe) {
		recipe.showpopup = !recipe.showpopup
		for (let r = 0; r < this.recipesList1.length; r++) {
			if (recipe.id !== this.recipesList1[r]["id"]) {
				this.recipesList1[r]["showpopup"] = false;

				this.recipesList1[r]["showAdd2MP"] = false;
				this.recipesList1[r]["showAdd2C"] = false;
			}
		}


	}



	/************** add to mean plan */


	selectedRecipe2Add2plan: any;
	addtoMealPlan(recipe) {
		//this.loadPlanNames();
		this.selectedRecipe2Add2plan = recipe;
		recipe.showAdd2MP = !recipe.showAdd2MP;
		this.showhidecontent(recipe);
	}

	/**************************** Make copy of recipe  */


	formatString(str) {
		var retVal = str;
		if (typeof (str) !== "undefined" && str !== "") {
			if (str.indexOf("'") > -1) {

				//retVal = str.replace(/'/g, "\'");
				retVal = retVal.replaceAll("'", "");
				////console.log(retVal);
			}
		}
		return retVal;
	}
	makeacopy(recipe) {
		console.log("make a copy")
		var pparms = { "id": recipe.id }
		var res = this.dbService.getDatabyFields("recipes", pparms).subscribe(recipeData1 => setTimeout(() => {
			console.log(recipeData1);
			if (recipeData1 !== null && recipeData1["body"]["length"] > 0) {
				var new_copy = JSON.parse(JSON.stringify(recipeData1["body"][0]));
				delete new_copy["id"];

				var pQuery = { "query": "select max(id) as maxid from recipes" };
				var res = this.dbService.getDatabyTablebyQuery("recipes", pQuery).subscribe(recipeData => setTimeout(() => {
					console.log(recipeData);

					if (recipeData !== null && typeof (recipeData['body']) !== "undefined" && recipeData['body']['length'] > 0) {
						var newid = recipeData['body'][0]["maxid"];
						if (typeof (newid) !== "undefined" && newid !== null && newid !== "") {
							newid = parseInt(newid) + 1;
							//  new_copy["ingredients"]= this.formatString(JSON.stringify(new_copy["ingredients"]));
							//  new_copy["s_instructions"]= this.formatString(new_copy["s_instructions"]);
							new_copy["created_by"] = this.currentUser["id"];
							new_copy["status"] = "0";
							new_copy["url"] = environment.appUrl + "/recipedetails/" + newid;
							new_copy["uri"] = environment.appUrl + "/recipedetails/" + newid;
							new_copy["shareAs"] = environment.appUrl + "/recipedetails/" + newid;
							new_copy["source"] = environment.appname + "_" + recipe["id"];
							new_copy["s_servings"] = new_copy["yield"];
							console.log(JSON.stringify(new_copy));
							this.createNewRecipe(new_copy, newid);

						}

					}
				}));
			}
		}));

	}

	createNewRecipe(new_copy, newid) {
		var res = this.dbService.postDataByTable("recipes", new_copy).subscribe(recipeData => setTimeout(() => {
			console.log(recipeData);

			if (recipeData['inserted_id'] !== "undefined" && recipeData['inserted_id'] !== "" && recipeData['inserted_id'] !== "0" && recipeData['inserted_id'] !== 0) {
				this.toastr.success("Recipe has been copied.", "Create a Copy of Recipe")
				var param = {};

				param["id"] = recipeData['inserted_id'];

				if (newid !== recipeData['inserted_id']) {
					this.updaterecipe(recipeData['inserted_id'])
				}
				this.router.navigate(["recipesubmit", param]);
			}
		}));
	}
	updaterecipe(newid) {
		console.log("in updatereicpe");
		console.log(newid);
		var new_copy = {};
		new_copy["id"] = newid;
		new_copy["url"] = environment.appUrl + "/recipedetails/" + newid;
		new_copy["uri"] = environment.appUrl + "/recipedetails/" + newid;
		new_copy["shareAs"] = environment.appUrl + "/recipedetails/" + newid;


		// var res =   this.dbService.updateDataByTable("recipes", new_copy).subscribe(recipeData => setTimeout(() => {
		//  console.log(recipeData);	     
		// }));
	}


	/********* Add to collections  */
	selectedRecipe2Add2Collection: any;
	addCollectionsPopup(recipe) {

		console.log(recipe);
	
		this.loadCollectionNames();
		this.selectedRecipe2Add2Collection = recipe;
		recipe.showAdd2C = !recipe.showAdd2C;
		this.showhidecontent(recipe);
	}
	collectionsList: Array<any> = [];
	collection: any = { "id": '', "day": "", "mealType": "" };
	showAdd2C: boolean = false;
	loadCollectionNames() {
		if (this.currentUser && this.currentUser["id"]) {
			if (this.collectionsList.length == 0) {
				this.collectionsList = [];

				var params = {};
				console.log(params);
				params['query'] = "select id, collection_name from collection where created_by = " + this.currentUser["id"];
				var res = this.dbService.getDatabyTablebyQuery("collection", params).subscribe(invData => setTimeout(() => {

					console.log(invData);
					if (invData !== null) {
						var obj = invData["body"]["length"];
						this.collectionsList = invData["body"];
					}
					console.log("collectionsList");
					console.log(this.collectionsList);

				}));
			}
		}
	}

	add2Collection(recipe) {
	//	this.showAdd2MP = false;
	//	console.log(this.plan);

		var paramsr = {};
		paramsr["collection_id"] = this.collection["id"];
		paramsr["recipe_id"] = recipe["id"];
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
			recipe.showAdd2C = false;
		}));

	}
	selectedRecipe: any;
	newRecipe: any;
	modifyRecipe(recipe) {
		this.loadDDList();
		console.log(recipe);
		this.selectedRecipe = recipe;

		//	this.selectedRecipe["newrecipe"]= JSON.parse(JSON.stringify(recipe));
		this.newRecipe = {};
		this.newRecipe["id"] = this.selectedRecipe["id"];
		this.newRecipe["label"] = this.selectedRecipe["label"];
		//this.newRecipe["s_instructions"] =  this.selectedRecipe["s_instructions"];
		this.newRecipe["dietLabels"] = ""; //this.selectedRecipe["dietLabels"]
		this.newRecipe["healthLabels"] = ""; //this.selectedRecipe["healthLabels"];
		this.newRecipe["cuisineType"] = ""; //this.selectedRecipe["cuisineType"];
		this.newRecipe["mealType"] = ""; //this.selectedRecipe["mealType"];

		console.log(this.selectedRecipe);

		var params = {};
		params["id"] = recipe.id;
		console.log(params);
		if (typeof (recipe.id) !== "undefined" && recipe.id !== null && recipe.id !== "") {
			var res = this.dbService.getDatabyFields("recipes", params).subscribe(invData => setTimeout(() => {
				console.log(invData);
				if (invData['body']["length"] > 0) {
					this.newRecipe["s_instructions"] = invData['body'][0]["s_instructions"]
					this.selectedRecipe["s_instructions"] = invData['body'][0]["s_instructions"]
				}
			}));
		}




		this.openModal("modifyrecipe");
	}
	openModal(id) {
		this.modalService.open(id);
	}
	closeModal(id) {
		this.modalService.close(id);
	}



	/************** modify recipes */



	setlabels(recipe1) {

		console.log(this.selectedRecipe);
		console.log(recipe1);
		var paramsr = {};
		paramsr["recipeid"] = recipe1.id;
		paramsr["created_by"] = this.currentUser["id"];

		var res = this.dbService.getDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
			if (invData !== null && invData["body"]["length"] > 0) {
				console.log("alredy modified");
				this.updateNewRecipe(recipe1, invData["body"][0]["id"])
			}
			else {
				if (recipe1["s_instructions"] !== this.selectedRecipe["s_instructions"]) {
					console.log("instructions modified");
					paramsr["s_instructions"] = this.newRecipe["s_instructions"];
				}

				if (typeof (this.newRecipe["label"]) !== "undefined" && recipe1["label"] !== this.selectedRecipe["label"])
					paramsr["label"] = this.newRecipe["label"];

				if (typeof (this.newRecipe["dietLabels"]) !== "undefined" && this.newRecipe["dietLabels"] !== "")
					paramsr["dietLabels"] = this.newRecipe["dietLabels"];

				if (typeof (this.newRecipe["healthLabels"]) !== "undefined" && this.newRecipe["healthLabels"] !== "")
					paramsr["healthLabels"] = this.newRecipe["healthLabels"];

				if (typeof (this.newRecipe["cuisineType"]) !== "undefined" && this.newRecipe["cuisineType"] !== "")
					paramsr["cuisineType"] = this.newRecipe["cuisineType"];

				if (typeof (this.newRecipe["mealType"]) !== "undefined" && this.newRecipe["mealType"] !== "")
					paramsr["mealType"] = this.newRecipe["mealType"];

				console.log(paramsr);
				paramsr["status"] = 1;
				var res = this.dbService.postDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
					this.toastr.success("Recipe has been updated.", "Modify recipe");
					this.saveOriginal();
					this.closeModal("modifyrecipe");
				}));

			}
		}));




	}

	updateNewRecipe(recipe1, id) {
		var paramsr = {};
		paramsr["recipeid"] = recipe1.id;
		paramsr["created_by"] = this.currentUser["id"];
		paramsr["id"] = id;

		if (this.newRecipe["s_instructions"] !== this.selectedRecipe["s_instructions"])
			paramsr["s_instructions"] = this.newRecipe["s_instructions"];

		if (typeof (this.newRecipe["label"]) !== "undefined" && this.newRecipe["label"] !== this.selectedRecipe["label"])
			paramsr["label"] = this.newRecipe["label"];

		if (typeof (this.newRecipe["dietLabels"]) !== "undefined" && this.newRecipe["dietLabels"] !== "")
			paramsr["dietLabels"] = this.newRecipe["dietLabels"];

		if (typeof (this.newRecipe["healthLabels"]) !== "undefined" && this.newRecipe["healthLabels"] !== "")
			paramsr["healthLabels"] = this.newRecipe["healthLabels"];

		if (typeof (this.newRecipe["cuisineType"]) !== "undefined" && this.newRecipe["cuisineType"] !== "")
			paramsr["cuisineType"] = this.newRecipe["cuisineType"];

		if (typeof (this.newRecipe["mealType"]) !== "undefined" && this.newRecipe["mealType"] !== "")
			paramsr["mealType"] = this.newRecipe["mealType"];
		console.log(paramsr);
		paramsr["status"] = 1;
		var res = this.dbService.updateDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {
			this.toastr.success("Recipe has been modifed.", "Modify Recipe");

			this.closeModal("modifyrecipe");
		}));


	}

	saveOriginal() {
		var paramsr = {};
		paramsr["status"] = 0;
		paramsr["s_instructions"] = this.selectedRecipe["s_instructions"];
		paramsr["label"] = this.selectedRecipe["label"];

		paramsr["dietLabels"] = this.selectedRecipe["dietLabels"];
		paramsr["healthLabels"] = this.selectedRecipe["healthLabels"];

		paramsr["cuisineType"] = this.selectedRecipe["cuisineType"];
		paramsr["mealType"] = this.selectedRecipe["mealType"];
		paramsr["recipeid"] = this.selectedRecipe["id"];
		paramsr["created_by"] = this.currentUser["id"];
		paramsr["approved_by"] = this.currentUser["id"];
		var res = this.dbService.postDataByTable("recipes_modify", paramsr).subscribe(invData => setTimeout(() => {

		}));

	}
	filterRecords(opt) {
		this.filterOpts["asc"] = false;
		this.filterOpts["desc"] = false;
		this.filterOpts["rejected"] = false;
		this.filterOpts["all"] = false;

		this.sortType = opt;
		this.filterOpts[opt] = true;

		if (opt == "asc") {
			console.log("sort ascending");

			this.recipesList1 = this.recipesList1.sort(this.sortArraybyLabelAsc);
			console.log(this.recipesList1);
			
		}

		if (opt == "desc") {
			console.log("sort descending");

			this.recipesList1 = this.recipesList1.sort(this.sortArraybyLabelDesc);
			
		}

		if (opt == "calories") {
			this.recipesList1 = this.recipesList1.sort(this.sortArraybyLabelCalories);
			
		}

	}
	sortArraybyLabelAsc(a, b) {
		//return b.label - a.label;
		if (a.label.toLowerCase() < b.label.toLowerCase()) {
			return -1;
		}
		if (a.label.toLowerCase() > b.label.toLowerCase()) {
			return 1;
		}
		return 0;
	}
	sortArraybyLabelDesc(a, b) {
		if (b.label.toLowerCase() < a.label.toLowerCase()) {
			return -1;
		}
		if (b.label.toLowerCase() > a.label.toLowerCase()) {
			return 1;
		}
		return 0;
	}
	sortArraybyLabelCalories(a, b) {
		if (a.calories < b.calories) {
			return -1;
		}
		if (a.calories > b.calories) {
			return 1;
		}
		return 0;
	}

	setValues(type) {
		console.log(this.newRecipe[type]);
		if (type == "healthLabels") {
			this.newRecipe[type] = "";
			for (let c = 0; c < this.healthlabelsList.length; c++) {
				if (this.healthlabelsList[c]["selected"]) {
					this.newRecipe[type] += this.healthlabelsList[c]["name"] + "~";
				}
			}
		}

		if (type == "dietLabels") {
			this.newRecipe[type] = "";
			for (let c = 0; c < this.dietLabelsList.length; c++) {
				if (this.dietLabelsList[c]["selected"]) {
					this.newRecipe[type] += this.dietLabelsList[c]["name"] + "~";
				}
			}
		}

		if (type == "cuisineType") {
			this.newRecipe[type] = "";
			for (let c = 0; c < this.cuisineTypeList.length; c++) {
				if (this.cuisineTypeList[c]["selected"]) {
					this.newRecipe[type] += this.cuisineTypeList[c]["name"] + "~";
				}
			}
		}
		if (type == "mealType") {
			this.newRecipe[type] = "";
			for (let c = 0; c < this.mealTypeList.length; c++) {
				if (this.mealTypeList[c]["selected"]) {
					this.newRecipe[type] += this.mealTypeList[c]["name"] + "~";
				}
			}
		}
		console.log(this.newRecipe);
	}

	resultSearch(event)
	{
console.log(event);
if(event !== null )
{
	this.recipesList1 = event;
}
	}
}


