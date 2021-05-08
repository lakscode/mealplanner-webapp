import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../services/user.service';
import { DBService } from '../../dbservices/db.service';
import { HelpService } from '../../services/help.service';

import { environment } from './../../../environments/environment';


@Component({
	selector: 'app-plannerlist',
	templateUrl: './plannerlist.component.html',
	styleUrls: ['./plannerlist.component.scss']
})
export class PlannerlistComponent implements OnInit {
	mealPlans: Array<any> = [];
    currentUser: any;
	constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dbService: DBService, private helpService: HelpService) {
	
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

    gotopage(page , params = null)
    {
        console.log("in gotopage");
        var param = {};
        if(params !== null)
        param = params;
        this.router.navigate([page, param]);
    
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
}

	