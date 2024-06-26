import { Test, TestingModule } from '@nestjs/testing';
import { BooksCollService } from './books.collection.service';

describe('BooksdbService', () => {
    let service: BooksCollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BooksCollService],
        }).compile();

        service = module.get<BooksCollService>(BooksCollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
