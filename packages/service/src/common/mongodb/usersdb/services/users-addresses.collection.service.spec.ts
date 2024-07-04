import { Test, TestingModule } from '@nestjs/testing';
import { UsersAddrsCollService } from './users-addresses.collection.service';

describe('UsersAddrsCollService', () => {
    let service: UsersAddrsCollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersAddrsCollService],
        }).compile();

        service = module.get<UsersAddrsCollService>(UsersAddrsCollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
