import { SliderpanelModule } from './sliderpanel.module';

describe('SliderpanelModule', () => {
    let sliderpanelModule: SliderpanelModule;

    beforeEach(() => {
        sliderpanelModule = new SliderpanelModule();
    });

    it('should create an instance', () => {
        expect(sliderpanelModule).toBeTruthy();
    });
});
