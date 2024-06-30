import { Test, TestingModule } from '@nestjs/testing';
import { UsersAddrsService } from './users.addresses.service';

describe('UsersAddrsService', () => {
    let service: UsersAddrsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersAddrsService],
        }).compile();

        service = module.get<UsersAddrsService>(UsersAddrsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
