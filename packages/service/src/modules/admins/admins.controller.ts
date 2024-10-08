import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { AdminsService } from './admins.service';
import { AdminsEditUserPermsReqDto } from './dtos/admins.edit-user-permissions.req.dto';
import { AdminsSusUserReqDto } from './dtos/admins.suspend-user.req.dto';
import { AdminsDeleteUserReqDto } from './dtos/admins.delete-user.req.dto';
import { AdminsGetUsersReqDto } from './dtos/admins.get-users.req.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admins')
export class AdminsController {
    constructor(private adminsService: AdminsService) {}

    @Patch('verify-user/:userId')
    async verifyUser(@Param('userId') userId: string) {
        return await this.adminsService.verifyUser(userId);
    }

    @Patch('edit-user-permissions/:userId')
    async editUserPermissions(
        @Param('userId') userId: string,
        @Body() adminsEditUserPermsReqDto: AdminsEditUserPermsReqDto,
    ) {
        return await this.adminsService.editUserPermissions(
            userId,
            adminsEditUserPermsReqDto,
        );
    }

    @Patch('suspend-user/:userId')
    async suspendUser(
        @Param('userId') userId: string,
        // @Body() adminsSusUserReqDto: AdminsSusUserReqDto,
    ) {
        return await this.adminsService.suspendUser(
            userId,
            // adminsSusUserReqDto,
        );
    }

    @Patch('unsuspend-user/:userId')
    async unsuspendUser(@Param('userId') userId: string) {
        return await this.adminsService.unsuspendUser(userId);
    }

    @Delete('delete-user/:userId')
    async deleteUser(
        @Param('userId') userId: string,
        // @Body() adminsDeleteUserReqDto: AdminsDeleteUserReqDto,
    ) {
        return await this.adminsService.deleteUser(
            userId,
            // adminsDeleteUserReqDto,
        );
    }

    @Get('get-user/:userId')
    async getUser(@Param('userId') userId: string) {
        return await this.adminsService.getUser(userId);
    }

    @Get('search-users')
    async searchUsers(@Query() adminsGetUsersReqDto: AdminsGetUsersReqDto) {
        return await this.adminsService.searchUsers(adminsGetUsersReqDto);
    }

    @Patch('grant-manager-role/:userId')
    async grantMgrRole(@Param('userId') userId: string) {
        return await this.adminsService.grantMgrRole(userId);
    }

    @Patch('revoke-manager-role/:userId')
    async revokeMgrRole(@Param('userId') userId: string) {
        return await this.adminsService.revokeMgrRole(userId);
    }

    @Get('get-number-of-users')
    async getNumOfUsers() {
        return await this.adminsService.getNumOfUsers();
    }

    @Get('get-number-of-books')
    async getNumOfBooks() {
        return await this.adminsService.getNumOfBooks();
    }

    @Get('get-number-of-borrows')
    async getNumOfBorrows() {
        return await this.adminsService.getNumOfBorrows();
    }

    @Get('get-number-of-returns')
    async getNumOfReturns() {
        return await this.adminsService.getNumOfReturns();
    }
}
