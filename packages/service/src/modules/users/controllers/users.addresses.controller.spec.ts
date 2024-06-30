import { Test, TestingModule } from '@nestjs/testing';
import { UsersAddrsController } from './users.addresses.controller';

describe('UsersAddrsController', () => {
    let controller: UsersAddrsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersAddrsController],
        }).compile();

        controller = module.get<UsersAddrsController>(UsersAddrsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
