import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SocialshareService {
    private socialshares: any[] = [];
	
    add(socialshare: any) {
        this.socialshares.push(socialshare);
    }

    remove(id: string) {
        this.socialshares = this.socialshares.filter(x => x.id !== id);
    }

    open(id: string) {
        let socialshare: any = this.socialshares.filter(x => x.id === id)[0];
        socialshare.open();
    }

    close(id: string) {
        let socialshare: any = this.socialshares.filter(x => x.id === id)[0];
        socialshare.close();
    }
}