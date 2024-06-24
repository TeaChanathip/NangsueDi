import { Module } from '@nestjs/common';
import { BooksdbService } from './booksdb.service';

@Module({
  providers: [BooksdbService]
})
export class BooksdbModule {}
