import { Test, TestingModule } from '@nestjs/testing';
import { UsersAddressesCollectionService } from './users-addresses.collection.service';

describe('UsersAddressesCollectionService', () => {
    let service: UsersAddressesCollectionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersAddressesCollectionService],
        }).compile();

        service = module.get<UsersAddressesCollectionService>(
            UsersAddressesCollectionService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
