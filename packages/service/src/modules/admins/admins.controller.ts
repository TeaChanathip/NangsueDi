import { Body, Controller, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AdminsService } from './admins.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Patch('verify-user')
    verifyUser(@Body() userId: Types.ObjectId) {
        return this.adminsService.verifyUser(userId);
    }
}
