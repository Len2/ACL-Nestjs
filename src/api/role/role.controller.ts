import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Put,
  Res,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/role.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import {
  AddPermissionsDto,
  RolePermissionDto,
} from '../permission/dto/permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionService } from '../permission/permission.service';
import { PaginationOptions } from '../../common/decorators/pagination.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationInterceptor } from '../../common/interceptors/pagination.interceptor';

@UseGuards(new AuthGuard())
@UseGuards(new RolesGuard())
@UsePipes(new ValidationPipe())
@ApiBearerAuth()
@ApiTags('Roles')
@Controller('api/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  @Roles('culture-admin')
  @Post()
  async create(@Body() data: CreateRoleDto, @Res() res) {
    const role = await this.roleService.create(data);
    return res.json({
      success: 'Role was created successfully!',
      role: await role.toResponseObject(),
    });
  }

  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(@PaginationOptions() options, @Query() query) {
    return await this.roleService.findAll(options, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return (
      await this.roleService.getRequestedRoleOrFail(id)
    ).toResponseObject();
  }

  @Roles('culture-admin')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res,
  ) {
    const role = await this.roleService.update(id, updateRoleDto);
    return res.json({
      success: 'Role was updated successfully!',
      role: role.toResponseObject(),
    });
  }

  @Roles('culture-admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const role = await this.roleService.remove(id);
    return res.json({
      success: 'Role was deleted succcessfully!',
      role: role.toResponseObject(),
    });
  }

  @Roles('culture-admin')
  @Post(':id/add-permissions')
  async addPermissions(
    @Body() data: AddPermissionsDto,
    @Param('id') id: string,
  ) {
    const permissions = await this.roleService.addPermissions(id, data);

    return permissions;
  }

  @Roles('culture-admin')
  @Get(':id/get-permissions')
  async getPermissions(@Param('id') id: string) {
    const permissions = await this.roleService.getAllPermissionsPerRole(id);
    return permissions;
  }

  @Roles('culture-admin')
  @Delete(':id/remove-permission')
  async removePermission(
    @Body() data: RolePermissionDto,
    @Param('id') id: string,
  ) {
    const permission =
      await this.permissionService.getRequestedPermissionOrFail(
        data.permission_id,
      );

    const role = await this.roleService.removePermission(id, permission);
    return { message: 'Permission deleted successfully!', role, permission };
  }
}
