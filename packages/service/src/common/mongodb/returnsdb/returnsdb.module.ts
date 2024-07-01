import { Module } from '@nestjs/common';
import { ReturnsCollService } from './returns.collection.service';

@Module({
    providers: [ReturnsCollService],
    exports: [ReturnsCollService],
})
export class ReturnsdbModule {}
