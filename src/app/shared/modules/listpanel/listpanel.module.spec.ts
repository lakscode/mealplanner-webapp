import { ListpanelModule } from './listpanel.module';

describe('ListpanelModule', () => {
    let listpanelModule: ListpanelModule;

    beforeEach(() => {
        listpanelModule = new ListpanelModule();
    });

    it('should create an instance', () => {
        expect(listpanelModule).toBeTruthy();
    });
});
