import { Test, TestingModule } from '@nestjs/testing';
import { ActionsBorrowsService } from './actions.borrows.service';

describe('ActionsBorrowsService', () => {
    let service: ActionsBorrowsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ActionsBorrowsService],
        }).compile();

        service = module.get<ActionsBorrowsService>(ActionsBorrowsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
