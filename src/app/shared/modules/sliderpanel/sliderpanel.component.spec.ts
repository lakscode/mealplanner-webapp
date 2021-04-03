import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderpanelComponent } from './sliderpanel.component';

describe('SliderpanelComponent', () => {
    let component: SliderpanelComponent;
    let fixture: ComponentFixture<SliderpanelComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [SliderpanelComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SliderpanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
