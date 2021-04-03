import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListpanelComponent } from './listpanel.component';

describe('ListpanelComponent', () => {
    let component: ListpanelComponent;
    let fixture: ComponentFixture<ListpanelComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [ListpanelComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ListpanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
