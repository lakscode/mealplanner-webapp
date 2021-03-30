
import { Router } from '@angular/router';

export class NotFoundComponent{
constructor(private router:Router        
          ) { 
            let url = this.router.url;
            url = url.replace(/%40/gi, '@')
            .replace(/%3A/gi, ':')
            .replace(/%24/gi, '$')
            .replace(/%2C/gi, ',')
            .replace(/%3B/gi, ';')
            .replace(/%2B/gi, '+')
            .replace(/%3D/gi, '=')
            .replace(/%3F/gi, '?')
            .replace(/%2F/gi, '/');
            if(url !== this.router.url){
                 this.router.navigate([url]);
              }
}
}
