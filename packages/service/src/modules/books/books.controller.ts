import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { BooksRegisterReqDto } from './dtos/books.register.req.dto';
import { BooksService } from './books.service';

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
}
