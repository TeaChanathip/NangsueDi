import { Test, TestingModule } from '@nestjs/testing';
import { BorrowsCollService } from './borrows.collection.service';

describe('BorrowsCollService', () => {
    let service: BorrowsCollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BorrowsCollService],
        }).compile();

        service = module.get<BorrowsCollService>(BorrowsCollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
