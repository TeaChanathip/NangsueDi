import { Test, TestingModule } from '@nestjs/testing';
import { ReturnsdbService } from './returnsdb.service';

describe('ReturnsdbService', () => {
  let service: ReturnsdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnsdbService],
    }).compile();

    service = module.get<ReturnsdbService>(ReturnsdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
