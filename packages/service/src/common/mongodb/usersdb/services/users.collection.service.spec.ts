import { Test, TestingModule } from '@nestjs/testing';
import { UsersCollService } from './users.collection.service';

describe('UsersCollectionService', () => {
    let service: UsersCollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersCollService],
        }).compile();

        service = module.get<UsersCollService>(UsersCollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
