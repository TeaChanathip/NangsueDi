import { Module } from '@nestjs/common';
import { BorrowsCollService } from './borrows.collection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowsModel, BorrowsSchema } from './schemas/borrows.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: BorrowsModel.name,
                schema: BorrowsSchema,
            },
        ]),
    ],
    providers: [BorrowsCollService],
    exports: [BorrowsCollService],
})
export class BorrowsDBModule {}
