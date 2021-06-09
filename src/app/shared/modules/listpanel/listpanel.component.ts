import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { ListpanelService } from './listpanel.service';
import { DBService } from './../../../dbservices/db.service';
@Component({
  selector: 'app-listpanel',
  templateUrl: './listpanel.component.html',
  styleUrls: ['./listpanel.component.scss']
})
export class ListpanelComponent implements OnInit, OnChanges, OnDestroy {
	
    @Input() id: string;
    @Input() params: any;
    @Input() updated: any;
    @Input() showhidetime: any = true;

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
   relatedrecipesList: Array<any> = [];
    constructor(private listpanelService: ListpanelService, private el: ElementRef, private dbService: DBService, private router: Router, private route: ActivatedRoute) {
    this.element = el.nativeElement;
    //this.showhideTime = true;  
    this.id = "";
    this.dt = {"date":"", "time":""};
    this.meridian = true;
    this.showhideTimeFlag = true;
    }

    loadSliders()
    {
      this.sliderList.push({"title":"pasto pizza with cheesey dip", "image":"assets/images/temp-images/full-slide-1.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});

      this.sliderList.push({"title":"pasto pizza with juicy dip", "image":"assets/images/temp-images/full-slide-2.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});



      this.sliderList.push({"title":"pasto pizza with extra topping", "image":"assets/images/temp-images/full-slide-3.jpg","rating":"(4.1 / 5)", "description":"Nam ornare arcu turpis, nec congues with us     <br/>Curabitur quis euismod mauris. Nulls<br/>eget semper vulputate."});





    }

    ngOnChanges(): void{

        this.setDefaults();
    }
    ngOnInit(): void {

        this.setDefaults();  
    }

    setDefaults()
    {
 
      this.loadRelatedRecipes();
      this.elementId= this.element.id;
  
      
    }

    ngAfterViewInit()
    {
	 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.listpanelService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('dt-modal-open');

		this.returnData.emit(this.dt);
    this.listpanelService.add(this);
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
	
	
loadRelatedRecipes()
{

  this.relatedrecipesList = [];
  var params = {};
  var dietLabels = "(";
  if(typeof(this.params['dietLabels']) !== "undefined" && this.params['dietLabels'] !== '')
  {
    var temp = this.params['dietLabels'].split("~");
    for(let i=0; i < temp.length; i++)
    {
    dietLabels  += "dietLabels LIKE '%" + temp[i] + "%' ";
    if(i < temp.length-1)
    dietLabels +=" OR ";
    }

  }
  var query = "select id, image, label, dietLabels from recipes where s_instructions != ''";
if(dietLabels !== "(")
query += " AND " + dietLabels + ") ";
query += " order by rand() limit 6";
 params["query"] = query;

 var res =   this.dbService.getDatabyTablebyQuery("recipes", params).subscribe(invData => setTimeout(() => {
 
  if(invData !== null && typeof(invData["body"]) !== "undefined" && invData["body"] !== null && invData["body"]["length"] > 0)
  {
    this.relatedrecipesList = [];
     for(let i=0; i < invData["body"]["length"] ; i++)
    {			
      this.relatedrecipesList.push(invData["body"][i]);		
    }
  }

 }));

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

gotoRecipeDetails(id){
  this.router.navigate(['recipedetails', id]);
}
}

