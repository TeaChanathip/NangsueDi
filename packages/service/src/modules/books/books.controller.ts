import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { BooksRegisterReqDto } from './dtos/books.register.req.dto';
import { BooksService } from './books.service';
import { BooksSearchReqDto } from './dtos/books.search.req.dto';

@ApiTags('Book')
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @ApiBearerAuth()
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post('register')
    async register(@Body() booksRegisterReqDto: BooksRegisterReqDto) {
        return await this.booksService.register(booksRegisterReqDto);
    }

    @Get()
    async search(@Query() booksSearchReqDto: BooksSearchReqDto) {
        return await this.booksService.search(booksSearchReqDto);
    }
}
