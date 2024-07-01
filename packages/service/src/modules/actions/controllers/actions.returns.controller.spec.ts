import { Test, TestingModule } from '@nestjs/testing';
import { ActionsReturnsController } from './actions.returns.controller';

describe('ActionsReturnsController', () => {
  let controller: ActionsReturnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsReturnsController],
    }).compile();

    controller = module.get<ActionsReturnsController>(ActionsReturnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
