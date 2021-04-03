import { PopularModule } from './popular.module';

describe('PopularModule', () => {
    let popularModule: PopularModule;

    beforeEach(() => {
        popularModule = new PopularModule();
    });

    it('should create an instance', () => {
        expect(popularModule).toBeTruthy();
    });
});
