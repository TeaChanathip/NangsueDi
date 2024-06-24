import { Body, Controller, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AdminsService } from './admins.service';
import { AdminsVerifyUserReqDto } from './dtos/admins.verify-user.req.dto';
import { AdminsEditUserPermsDto } from './dtos/admins.edit-user-permissions.req.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Patch('verify-user')
    verifyUser(@Body() adminsVerifyUserReqDto: AdminsVerifyUserReqDto) {
        return this.adminsService.verifyUser(adminsVerifyUserReqDto.userId);
    }

    @Patch('edit-user-permissions')
    editUserPermissions(
        @Body() adminsEditUserPermsDto: AdminsEditUserPermsDto,
    ) {
        return this.adminsService.editUserPermissions(adminsEditUserPermsDto);
    }
}
