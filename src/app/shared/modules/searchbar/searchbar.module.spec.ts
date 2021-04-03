import { SearchbarModule } from './searchbar.module';

describe('SearchbarModule', () => {
    let searchbarModule: SearchbarModule;

    beforeEach(() => {
        searchbarModule = new SearchbarModule();
    });

    it('should create an instance', () => {
        expect(searchbarModule).toBeTruthy();
    });
});
