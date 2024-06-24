import { Body, Controller, Delete, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AdminsService } from './admins.service';
import { AdminsVerifyUserReqDto } from './dtos/admins.verify-user.req.dto';
import { AdminsEditUserPermsReqDto } from './dtos/admins.edit-user-permissions.req.dto';
import { AdminsSusUserReqDto } from './dtos/admins.suspend-user.req.dto';
import { AdminsUnsusUserReqDto } from './dtos/admins.unsuspend-user.req.dto';
import { AdminsDeleteUserReqDto } from './dtos/admins.delete-user.req.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Patch('verify-user')
    async verifyUser(@Body() adminsVerifyUserReqDto: AdminsVerifyUserReqDto) {
        return await this.adminsService.verifyUser(
            adminsVerifyUserReqDto.userId,
        );
    }

    @Patch('edit-user-permissions')
    async editUserPermissions(
        @Body() adminsEditUserPermsReqDto: AdminsEditUserPermsReqDto,
    ) {
        return await this.adminsService.editUserPermissions(
            adminsEditUserPermsReqDto,
        );
    }

    @Patch('suspend-user')
    async suspendUser(@Body() adminsSusUserReqDto: AdminsSusUserReqDto) {
        return await this.adminsService.suspendUser(adminsSusUserReqDto);
    }

    @Patch('unsuspend-user')
    async unsuspendUser(@Body() adminsUnsusUserReqDto: AdminsUnsusUserReqDto) {
        return await this.adminsService.unsuspendUser(
            adminsUnsusUserReqDto.userId,
        );
    }

    @Delete('delete-user')
    async deleteUser(@Body() adminsDeleteUserReqDto: AdminsDeleteUserReqDto) {
        return await this.adminsService.deleteUser(adminsDeleteUserReqDto);
    }
}
