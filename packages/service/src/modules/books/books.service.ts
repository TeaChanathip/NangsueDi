import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BooksCollService } from 'src/common/mongodb/booksdb/books.collection.service';
import { BooksRegisterReqDto } from './dtos/books.register.req.dto';
import { BookSaveDto } from 'src/common/mongodb/booksdb/dtos/book.save.dto';
import { getCurrentUnix } from 'src/shared/utils/getCurrentUnix';
import { BooksSearchReqDto } from './dtos/books.search.req.dto';
import { BookRes } from 'src/common/mongodb/booksdb/interfaces/book.res.interface';

@Injectable()
export class BooksService {
    constructor(private readonly booksCollService: BooksCollService) {}

    async register(booksRegisterReqDto: BooksRegisterReqDto): Promise<BookRes> {
        const book = await this.booksCollService.findByTitle(
            booksRegisterReqDto.title,
        );
        if (book) {
            throw new HttpException(
                'The book title must be unique',
                HttpStatus.BAD_REQUEST,
            );
        }

        const bookSaveDto: BookSaveDto = {
            ...booksRegisterReqDto,
            registeredAt: getCurrentUnix(),
            remainNumber: booksRegisterReqDto.totalNumber,
        };

        return await this.booksCollService.saveNew(bookSaveDto);
    }

    async search(booksSearchReqDto: BooksSearchReqDto): Promise<BookRes[]> {
        if (booksSearchReqDto.page && !booksSearchReqDto.limit) {
            throw new HttpException(
                'The page parameter requires the limit parameter',
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.booksCollService.query(booksSearchReqDto);
    }
}
