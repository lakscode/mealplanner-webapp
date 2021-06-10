import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
    selector: 'jw-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @Input() width: string;
    private element: any;
    widthClass:any = "width60";
    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }
    ngOnInit(): void {
        let modal = this;
      
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }
        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);
        // close modal on background click
        this.element.addEventListener('click', function (e: any) {
            if (e.target.className === 'jw-modal') {
                modal.close();
            }
        });
        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
        if(this.width)
        {
            if(this.width == "40")
            this.widthClass ="width40";
            else if(this.width == "50")
            this.widthClass ="width50";
            else 
            this.widthClass ="width60";
        }
 
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('jw-modal-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('jw-modal-open');
    }
}