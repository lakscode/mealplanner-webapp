import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { CommentService } from './comment.service';
import { DBService } from './../../../dbservices/db.service';
import { HelpService } from './../../../services/help.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {
	contentList: Array<any> = [];
    @Input() id: string;
    @Input() type: any = "recipes";
    @Input() comment: any;
    @Input() showhidetime: any = true;
    adsList: Array<any> = [];
    sliderList: Array<any> = [];
     element: any;
     showhideTimeFlag: any;
	
    @Output() returnData: EventEmitter<any> = new EventEmitter();
	
    @Output() closeDT: EventEmitter<any> = new EventEmitter();
    meridian: any;

	 dt : any = {"date":"", "time":""};
   tempDt: any;
   maxDt: any;
   minDt :any;
   tempTm : any;
   elementId : any;
   date: any; 
   currentUser: any; 
   newcomment: any = {};
    constructor(private commentService: CommentService,private httpClient: HttpClient, private el: ElementRef, private dbService: DBService, private helpService: HelpService, private router: Router, private route: ActivatedRoute) {
    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    this.dt = {"date":"", "time":""};
    this.meridian = true;
    this.showhideTimeFlag = true;
    }


    ngOnInit(): void {
      this.newcomment["message"] = "";
      this.currentUser =this.helpService.getCurrentUser();
	if(this.currentUser !== null)
	{
	  if( this.currentUser["firstname"] !== "")
	  this.currentUser["displayname"] = this.currentUser["firstname"];
	  else if( this.currentUser["username"] !== "")
	  this.currentUser["displayname"] = this.currentUser["username"];
	  console.log( this.currentUser["displayname"]);
	}

	  console.log(this.comment);

   this.elementId= this.element.id;
      
    }

    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.commentService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('dt-modal-open');

	
		this.returnData.emit(this.dt);
    this.commentService.add(this);
    }

 
    close(): void {

        this.element.style.display = 'none';
        document.body.classList.remove('dt-modal-open');
    }
	
	save()
	{
    this.returnData.emit(this.dt);

	}	
	
	closeCal()
	{

		this.closeDT.emit(this.dt);
	}	
 
  formatLabels(str)
  {
    
    var retStr = str;
    if(str !== "")
    {
      retStr= str.toString().replace(/~/g, ', ');
      retStr = retStr.trim();
    }
  
    return retStr;
  }


  gotoRecipeDetails(page, id){
  this.router.navigate([page, id]);
  }

  addChild(comment)
  {
    console.log(comment);
	  if(typeof(comment["children"]) == "undefined")
    comment["children"] = [];

	  comment["children"].push({"message":"", "parentid":comment.id, "userid":this.currentUser["id"], "username":this.currentUser["displayname"]})
  }

  
/************888 comments */


saveComment(comment= null)
{
  console.log("saveComment");
  console.log(comment);

  var params = {};
  if(typeof(this.currentUser["id"]) !== "undefined" && this.currentUser["id"] !== null && this.currentUser["id"] !== "" && typeof(this.comment.id) !== "undefined" && this.comment.id !== null && this.comment.id !== "")
  {

	  var params1 = {};
	  params1["groupid"] = this.comment.groupid ;
	  params1["userid"] = this.currentUser["id"];
	  
    if(comment !== null)
	  params1["parentid"] = comment["id"];
	  
    if(comment !== null)
	  params1["message"] = comment["message"]

	  if(this.newcomment !== null && this.newcomment["message"] !== null)
	  {
		 params1["message"] = this.newcomment ["message"];
	  }
	  

	  console.log(params1);
	  var res =   this.dbService.postDataByTable("group_comments", params1).subscribe(invData => setTimeout(() => {
		
      if(invData !== null)
      {
        console.log(invData);
        params1["username"] = this.currentUser['displayname'];
        params1["userimage"] = this.currentUser["image"];
        params1["id"] = invData["inserted_id"];
        console.log(this.comment.children);
        console.log(params1);
        var fIndex = this.comment.children.findIndex(x => (x.parentid ==  params1["parentid"]));
        if(fIndex > -1)
        {
          if(typeof(this.comment.children) == "undefined" || this.comment.children == null)
          {
            this.comment.children = [];
          }
          this.comment["children"].push(params1);
        }
      
        this.newcomment["message"] = "";
      }
	  }));
  }

}
}