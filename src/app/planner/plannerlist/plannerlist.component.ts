import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';
import { ModalService } from '../../shared/modules/modal/modal.service';


@Component({
    selector: 'app-plannerlist',
    templateUrl: './plannerlist.component.html',
    styleUrls: ['./plannerlist.component.scss']
})
export class PlannerlistComponent implements OnInit {
    mealPlans: Array<any> = [];
    currentUser: any;
    plan:any={};
    weekDays: Array<any> = [];
    mealsList: Array<any> = [];
    maxcaloryperday: any ="";
    loadingData: boolean = false;
    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private modalService: ModalService) {
    
    }

    ngOnInit() {
    this.plan = {"id":"", "name":"", "tags":"", "days":[], "created_by":"", "created_at":""};

    $('.listing-buttons span').on("click",function(){
        $('.listing-buttons span').removeClass("current");
        if( $(this).hasClass("grid")){
            $(this).addClass("current");
            if($(".recipe-listing").hasClass("listing-list")){
                $(".recipe-listing").removeClass("listing-list").addClass("listing-grid");
            }

        }
        if( $(this).hasClass("list")){
            $(this).addClass("current");
            $(".recipe-listing").removeClass("listing-grid").addClass("listing-list");

        }
    });
    this.currentUser =this.helpService.getCurrentUser();
    console.log(this.currentUser );
this.loadPlans();
    
    }
    mealPlansDietician: Array<any> = [];
    loadPlans()
    {
      this.loadingData = true;
      console.log(this.currentUser);
        this.mealPlans = [];
        var params = {"limit": 20};
        if(this.currentUser['isAdmin'] !== "1")
        {
          /********* nutrionist  plans  */
          console.log(params);
          var query = {"query":"SELECT mp.*, u.email, u.firstname, u.lastname FROM mealplan AS mp  LEFT JOIN users AS u ON mp.created_by = u.id"}
          var res =   this.dbService.getDatabyTablebyQuery("mealplan", query).subscribe(invData => setTimeout(() => {
            //this.formatPlanData(invData);
            console.log(invData);
            this.mealPlansDietician = invData["body"];
          }));
            /********* nutrionist  plans  */

          params["created_by"]  = this.currentUser["id"];
          console.log(params);
          var res =   this.dbService.getDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {
      
            this.formatPlanData(invData);
          }));
        }
        else
        {
          console.log(params);
          var query = {"query":"SELECT mp.*, u.email, u.firstname, u.lastname FROM mealplan AS mp  LEFT JOIN users AS u ON mp.created_by = u.id"}
          var res =   this.dbService.getDatabyTablebyQuery("mealplan", query).subscribe(invData => setTimeout(() => {
            this.formatPlanData(invData);
          }));
        }
      
    }

    formatPlanData(invData)
    {
      console.log(invData);
      if(invData !== null)
      {
        var obj = invData["body"]["length"];
        this.mealPlans = invData["body"];
        console.log(this.mealPlans );
      }
      this.loadingData = false;

    }
    createNewPlan(){
      this.plan = {"id":"", "name":"", "tags":"","maxcaloryperday":0, "days":[], "created_by":"", "created_at":""};
      this.modalService.open('createNewPlan');

    }

     closeModal(id) {

   this.modalService.close(id);
 }

    gotopage(page , params = null)
    {
        console.log("in gotopage");
        var param = {};
        if(params !== null)
        param = params;
        if(page == "plancreate")
        {
            if(window.screen.width > 768 || window.innerWidth > 768)
            {
                this.router.navigate([page, param]);
            }
            else
            {
                this.router.navigate(["plan-createm", param]);
            }
        }
       
    
    }
    setFLU(str)
    {
        var retValue = str;
        if(str !== "")
        {
            retValue = this.helpService.setInputFirstToUppercase(str);
        }
        return retValue;
    }

    checkMealPlan()
    {
     
      if(this.plan["id"] !== "" )
      {
       this.updateMealPlan();
      }
      else
      {
          this.saveMealPlan();
      }
    }

     saveMealPlan()
  { 
    if(this.plan["name"] !== ""){

       

        var params = {};
        if(this.plan["name"] !== "")
        params["name"] = this.plan["name"];
        if(this.plan["tags"] !== "")
        params["tags"] = this.plan["tags"];
        params["status"] = "0";
        params["created_by"] = this.currentUser["id"];
       params["maxcaloryperday"] = this.plan["maxcaloryperday"];

        var res =   this.dbService.postDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

            if(invData !== null)
            {
            if(typeof(invData["inserted_id"]) !== "undefined") 
            {
                var insertedid = invData["inserted_id"];
                this.plan["id"] = insertedid;
                console.log(insertedid);
                console.log(this.plan["id"]);
               this.loadWeekDays();
                //this.gotopage('plancreate', {'id':insertedid});
                
            }
            }
        }));
    
    } 

  }
  plan_old : any = null;
  copymealplan(plan)
  {
    console.log("copymealplan");
    console.log(plan);
    this.plan_old = plan;
    this.plan["id"] = "";
    this.plan["name"]= plan.name;
    this.plan["tags"]= plan.tags;
    this.plan["maxcaloryperday"] = plan.maxcaloryperday;

    if(this.plan["name"] !== ""){     

      var params = {};
      if(this.plan["name"] !== "")
      params["name"] = this.plan["name"];
      if(this.plan["tags"] !== "")
      params["tags"] = this.plan["tags"];
      params["status"] = "0";
      params["created_by"] = this.currentUser["id"];
      params["maxcaloryperday"] = this.plan["maxcaloryperday"];

      var res =   this.dbService.postDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

          if(invData !== null)
          {
          if(typeof(invData["inserted_id"]) !== "undefined") 
          {
              var insertedid = invData["inserted_id"];
              this.plan["id"] = insertedid;
              console.log(insertedid);
              console.log(this.plan["id"]);
             this.loadWeekDays('copy');
              
          }
          }
      }));
  
  } 



  }
  editmealplan(plan)
  {
    this.plan["id"] = plan.id;
    this.plan["name"]= plan.name;
    this.plan["tags"]= plan.tags;
    this.plan["maxcaloryperday"] = plan.maxcaloryperday;
    this.modalService.open('createNewPlan');
  }
  updateMealPlan()
  { 
    console.log("update meal plan");
    if(this.plan["name"] !== ""){

     console.log(this.plan);

        var params = {};
        params["id"] = this.plan["id"];
        if(this.plan["name"] !== "")
        params["name"] = this.plan["name"];
        if(this.plan["tags"] !== "")
        params["tags"] = this.plan["tags"];
        params["status"] = "0";
        params["created_by"] = this.currentUser["id"];
       params["maxcaloryperday"] = this.plan["maxcaloryperday"];
       console.log(params);
        var res =   this.dbService.updateDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

            if(invData !== null)
            {
              
                console.log(this.plan["id"]);
                this.modalService.close('createNewPlan');
                this.loadPlans();
           
            }
        }));
    
    } 

  }
  loadWeekDays(action="")
    {
        console.log("action " + action);
        this.mealsList = [];
        this.mealsList.push({"name":"BreakFast"})
        this.mealsList.push({"name":"Snack 1"})
        this.mealsList.push({"name":"Lunch"})
        this.mealsList.push({"name":"Snack 2"})
        this.mealsList.push({"name":"Dinner"})


        this.weekDays = [];

        this.weekDays.push({"name":"Day 1"})
        this.weekDays.push({"name":"Day 2"})
        this.weekDays.push({"name":"Day 3"})
        this.weekDays.push({"name":"Day 4"})
        this.weekDays.push({"name":"Day 5"})
        this.weekDays.push({"name":"Day 6"})
        this.weekDays.push({"name":"Day 7"})

        var daysM= [];
        
        
        for(let j=0; j< 7; j++)
        {
            daysM= [];
            for(let i=0; i < 5; i++)
            {
                daysM.push({"id":(i+1), "name":this.mealsList[i], "recipe":null});
            }
            this.plan["days"].push({"id":"row" + (j+1), "name":this.weekDays[j]["name"], "meals":daysM})
        }

        if(action == "copy")
        this.copyDaysData();
        else
        this.createDays();
    }


  insertR: any =0;
   createDays()
  {
    console.log("createDays");
    console.log(this.plan["id"]);
   // if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    //{
        var r =  this.insertR;
    
            var rowItem = this.plan["days"][r]["meals"];
    
          var params = {};
           
            params["meal_plan_id"] = this.plan["id"];
            params["day_num"] = r;
            params["name"] = "Day " + (r +1);
    
            params["breakfast"] = "";
            if(typeof(rowItem[0]["recipe"]) !== "undefined" && rowItem[0]["recipe"] !== null && typeof(rowItem[0]["recipe"]["id"]) !== "undefined")
            params["breakfast"] = rowItem[0]["recipe"]["id"];
    
            params["snack1"] = "";
            if(typeof(rowItem[1]["recipe"]) !== "undefined" && rowItem[1]["recipe"] !== null && typeof(rowItem[1]["recipe"]["id"]) !== "undefined")
            params["snack1"] = rowItem[1]["recipe"]["id"];
    
            params["lunch"] = "";
            if(typeof(rowItem[2]["recipe"]) !== "undefined" && rowItem[2]["recipe"] !== null && typeof(rowItem[2]["recipe"]["id"]) !== "undefined")
            params["lunch"] = rowItem[2]["recipe"]["id"];
    
            params["snack2"] = "";
            if(typeof(rowItem[3]["recipe"]) !== "undefined" && rowItem[3]["recipe"] !== null && typeof(rowItem[3]["recipe"]["id"]) !== "undefined")
            params["snack2"] = rowItem[3]["recipe"]["id"];
    
            params["dinner"] = "";
            if(typeof(rowItem[4]["recipe"]) !== "undefined" && rowItem[4]["recipe"] !== null && rowItem[4]["recipe"]["id"] !== "undefined")
            params["dinner"] = rowItem[4]["recipe"]["id"];
    
            params["created_by"] = this.currentUser["id"];
            params["created_at"] = new Date();
            params["status"] = 1;
    
     console.log(params);
        
            var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {
        console.log(dData);
      
              if(dData !== null)
              {
                if(dData["result"] !== null && dData["result"] !== "")
                {
                  this.plan["days"][r]["meals"]= rowItem;
                  this.plan["days"][r]['id']= dData['inserted_id'];
                  this.plan["days"][r]['dayid']= dData['inserted_id'];
                  this.insertR++;
                  setTimeout(() => {
                  if(this.insertR < 7)
                  {
                      this.createDays();
                  }
                  else
                  {
                    console.log(this.plan);

                 //   this.gotopage('plancreate', {'id':this.plan["id"]});
                  }
                  },100);
                }
            
              }
    
    
            }));
         
         
          
  //  }

  }
  viewmealplan(id)
  {
    this.router.navigate(["planview", {id:id}]);
  }

  /************ for copying meal plan  ****************/

  copyDaysData()
  {
  	console.log("copyDaysData");
    if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    {
      var params = {};
       console.log(this.plan_old);
      params["meal_plan_id"] = this.plan_old["id"]; //this.plan["id"];

		  console.log(params);

      var res =   this.dbService.getDataByTable("days", params).subscribe(dData => setTimeout(() => {

   			 console.log(dData);
        if(dData !== null)
        {
          this.plan["days"] = dData["body"];
          console.log(this.plan);
          this.createDaysCopy();
        }
      }));
    }
  }

  insertRCopy: any =0;
  createDaysCopy()
 {
   console.log("createDays");
   console.log(this.plan["id"]);
  // if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
   //{
       var r =  this.insertRCopy;
   
           var rowItem = this.plan["days"][r];
   
         var params = {};
          
           params["meal_plan_id"] = this.plan["id"];
           params["day_num"] = r;
           params["name"] = "Day " + (r +1);
   
           params["breakfast"] = "";
           if(typeof(rowItem["breakfast"]) !== "undefined")
           params["breakfast"] = rowItem["breakfast"];
   
           params["snack1"] = "";
           if(typeof(rowItem["snack1"]) !== "undefined")
           params["snack1"] = rowItem["snack1"];
   
           params["lunch"] = "";
           if(typeof(rowItem["lunch"]) !== "undefined")
           params["lunch"] = rowItem["lunch"];
   
           params["snack2"] = "";
           if(typeof(rowItem["snack2"]) !== "undefined")
           params["snack2"] = rowItem["snack2"];
   
           params["dinner"] = "";
           if(typeof(rowItem["dinner"]) !== "undefined" )
           params["dinner"] = rowItem["dinner"];
   
           params["created_by"] = this.currentUser["id"];
           params["created_at"] = new Date();
           params["status"] = 1;
   
    console.log(params);
       
           var res =   this.dbService.postDataByTable("days", params).subscribe(dData => setTimeout(() => {
       console.log(dData);
     
             if(dData !== null)
             {
               if(dData["result"] !== null && dData["result"] !== "")
               {
                 this.plan["days"][r]["meals"]= rowItem;
                 this.plan["days"][r]['id']= dData['inserted_id'];
                 this.plan["days"][r]['dayid']= dData['inserted_id'];
                 this.insertRCopy++;
                 setTimeout(() => {
                 if(this.insertRCopy < 7)
                 {
                     this.createDaysCopy();
                 }
                 else
                 {
                   console.log(this.plan);

                //   this.gotopage('plancreate', {'id':this.plan["id"]});
                 }
                 },100);
               }
           
             }
   
   
           }));
        
        
         
 //  }

 }
 

}

    