import { Test, TestingModule } from '@nestjs/testing';
import { BooksdbService } from './books.collection.service';

describe('BooksdbService', () => {
    let service: BooksdbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BooksdbService],
        }).compile();

        service = module.get<BooksdbService>(BooksdbService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
