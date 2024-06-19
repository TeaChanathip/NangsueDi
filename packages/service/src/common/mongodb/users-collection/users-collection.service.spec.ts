import { Test, TestingModule } from '@nestjs/testing';
import { UsersCollectionService } from './users-collection.service';

describe('UsersCollectionService', () => {
    let service: UsersCollectionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersCollectionService],
        }).compile();

        service = module.get<UsersCollectionService>(UsersCollectionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
