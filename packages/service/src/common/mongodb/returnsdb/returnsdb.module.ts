import { Module } from '@nestjs/common';
import { ReturnsCollService } from './returns.collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnsModel, ReturnsSchema } from './schemas/returns.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ReturnsModel.name,
                schema: ReturnsSchema,
            },
        ]),
    ],
    providers: [ReturnsCollService],
    exports: [ReturnsCollService],
})
export class ReturnsDBModule {}
