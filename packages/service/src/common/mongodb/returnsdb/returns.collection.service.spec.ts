import { Test, TestingModule } from '@nestjs/testing';
import { ReturnsCollService } from './returns.collection.service';

describe('ReturnsCollService', () => {
    let service: ReturnsCollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReturnsCollService],
        }).compile();

        service = module.get<ReturnsCollService>(ReturnsCollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
