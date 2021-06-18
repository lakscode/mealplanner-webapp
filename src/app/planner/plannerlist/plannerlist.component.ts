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
    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService, private modalService: ModalService) {
    
    }

    ngOnInit() {

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
    
this.loadPlans()
    
    }

    loadPlans()
    {
        this.mealPlans = [];
        var params = {"limit": 20};
        params["created_by"]  = this.currentUser["id"];
        console.log(params);
        var res =   this.dbService.getDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {
    
          console.log(invData);
          if(invData !== null)
          {
            var obj = invData["body"]["length"];
            this.mealPlans = invData["body"];
          }
  
        }));
    }

    createNewPlan(){
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


     saveMealPlan()
  { 
    if(this.planname !== ""){
        var params = {};
        if(this.planname !== "")
        params["name"] = this.planname;
        if(this.plantags !== "")
        params["tags"] = this.plantags;
        params["status"] = "0";
        params["created_by"] = this.currentUser["id"];
       
        var res =   this.dbService.postDataByTable("mealplan", params).subscribe(invData => setTimeout(() => {

            if(invData !== null)
            {
            if(typeof(invData["inserted_id"]) !== "undefined") 
            {
                var insertedid = invData["inserted_id"];
                this.plan["id"] = insertedid;
                console.log(insertedid);
                this.loadWeekDays();
                //this.gotopage('plancreate', {'id':insertedid});
                
            }
            }
        }));
    
    } 

  }

  loadWeekDays()
    {
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
        this.plan = {"id":"", "name":"", "tags":"", "days":[], "created_by":"", "created_at":""};
        
        for(let j=0; j< 7; j++)
        {
            daysM= [];
            for(let i=0; i < 5; i++)
            {
                daysM.push({"id":(i+1), "name":this.mealsList[i], "recipe":null});
            }
            this.plan["days"].push({"id":"row" + (j+1), "name":this.weekDays[j]["name"], "meals":daysM})
        }

        this.createDays();
    }


  insertR: any =0;
   createDays()
  {
  console.log("createDays");
    if(typeof(this.plan["id"]) !== "undefined" && this.plan["id"] !== "")
    {
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
    
            params["created_by"] = "";
            params["created_at"] = new Date();
            params["status"] = 1;
    
     
        
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
                  },100);
                }
            
              }
    
    
            }));
         
         
          
    }

  }

}

    