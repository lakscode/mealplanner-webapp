import { Injectable } from "@angular/core";
import {  Router } from "@angular/router";

import { HttpClient} from '@angular/common/http';
import { share } from "rxjs/operators";
@Injectable({ providedIn: 'root' })
export class PDFService {

	constructor( private router: Router, private httpClient: HttpClient) {

	}

    createpdf(id)
    {

        var tempUrl = "https://dentavacation.com/mobileapp/api/generate_pdf.php?id=" + id; 
        console.log(tempUrl);
	    return this.httpClient.get(tempUrl).pipe(share());



    }

    createrecipebookpdf(id)
    {

        var tempUrl = "https://dentavacation.com/mobileapp/api/pdf-recipebook.php?id=" + id; 
        console.log(tempUrl);
	    return this.httpClient.get(tempUrl).pipe(share());



    }
}