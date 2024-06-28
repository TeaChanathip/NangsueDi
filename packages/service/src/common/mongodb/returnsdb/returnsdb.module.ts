import { Module } from '@nestjs/common';
import { ReturnsdbService } from './returnsdb.service';

@Module({
  providers: [ReturnsdbService]
})
export class ReturnsdbModule {}
