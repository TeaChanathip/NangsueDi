import { Test, TestingModule } from '@nestjs/testing';
import { ActionsBorrowsController } from './actions.borrows.controller';

describe('ActionsBorrowsController', () => {
    let controller: ActionsBorrowsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActionsBorrowsController],
        }).compile();

        controller = module.get<ActionsBorrowsController>(
            ActionsBorrowsController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
