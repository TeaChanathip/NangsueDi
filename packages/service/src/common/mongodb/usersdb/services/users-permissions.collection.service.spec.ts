import { Test, TestingModule } from '@nestjs/testing';
import { UsersPermsCollService } from './users-permissions.collection.service';

describe('UsersPermissionsCollectionService', () => {
    let service: UsersPermsCollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersPermsCollService],
        }).compile();

        service = module.get<UsersPermsCollService>(UsersPermsCollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
