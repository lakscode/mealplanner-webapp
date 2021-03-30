import { DateTimeModule } from './datetime.module';

describe('DateTimeModule', () => {
    let dateTimeModule: DateTimeModule;

    beforeEach(() => {
        dateTimeModule = new DateTimeModule();
    });

    it('should create an instance', () => {
        expect(dateTimeModule).toBeTruthy();
    });
});
