import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { BooksRegisterReqDto } from './dtos/books.register.req.dto';
import { BooksService } from './books.service';
import { BooksSearchReqDto } from './dtos/books.search.req.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { BooksUpdateReqDto } from './dtos/books.update.req.dto';
import { Throttle } from '@nestjs/throttler';
import { RequestHeader } from 'src/shared/interfaces/request-header.interface';
import { Perms } from 'src/common/decorators/perms.decorator';
import { Perm } from 'src/shared/enums/perm.enum';

@ApiTags('Book')
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @ApiBearerAuth()
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post()
    async register(@Body() booksRegisterReqDto: BooksRegisterReqDto) {
        return await this.booksService.register(booksRegisterReqDto);
    }

    @PublicRoute()
    @Get(':bookId')
    async get(@Param('bookId') bookId: string) {
        return await this.booksService.get(bookId);
    }

    @ApiBearerAuth()
    @Roles(Role.MANAGER, Role.ADMIN)
    @Patch(':bookId')
    async update(
        @Param('bookId') bookId: string,
        @Body() booksUpdateReqDto: BooksUpdateReqDto,
    ) {
        return await this.booksService.update(bookId, booksUpdateReqDto);
    }

    @ApiBearerAuth()
    @Roles(Role.MANAGER, Role.ADMIN)
    @Delete(':bookId')
    async delete(@Param('bookId') bookId: string) {
        return await this.booksService.delete(bookId);
    }

    @PublicRoute()
    @Get()
    async search(@Query() booksSearchReqDto: BooksSearchReqDto) {
        return await this.booksService.search(booksSearchReqDto);
    }

    @Throttle({ default: { limit: 1, ttl: 2000 } })
    @ApiBearerAuth()
    @Roles(Role.USER)
    @Perms(Perm.BORROW)
    @Post('borrow/:bookId')
    async borrow(
        @Request() req: RequestHeader,
        @Param('bookId') bookId: string,
    ) {
        return this.booksService.borrow(req.user.sub, bookId);
    }

    // @Throttle({ default: { limit: 1, ttl: 2000 } })
    // @ApiBearerAuth()
    // @Roles(Role.USER)
    // @Perms(Perm.BORROW)
    // @Post('borrow/:bookId')
    // async borrow(
    //     @Request() req: RequestHeader,
    //     @Param('bookId') bookId: string,
    //     @Body() borrowReqDto: BooksBorrowReqDto,
    // ) {
    //     return this.booksService.borrow(req.user.sub, bookId, borrowReqDto);
    // }
}
