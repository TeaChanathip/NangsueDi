import { Test, TestingModule } from '@nestjs/testing';
import { ActionsReturnsService } from './actions.returns.service';

describe('ActionsReturnsService', () => {
  let service: ActionsReturnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsReturnsService],
    }).compile();

    service = module.get<ActionsReturnsService>(ActionsReturnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
