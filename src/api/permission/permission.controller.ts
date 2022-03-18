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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/permission.dto';
import { UpdatePermissionDto } from './dto/permission.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from '../../common/decorators/pagination.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationInterceptor } from '../../common/interceptors/pagination.interceptor';

@UseGuards(new AuthGuard())
@UseGuards(new RolesGuard())
@UsePipes(new ValidationPipe())
@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('api/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles('culture-admin')
  async create(@Body() data: CreatePermissionDto, @Res() res) {
    const permission = await this.permissionService.create(data);
    return res.json({
      success: 'Permission was created successfully!',
      permission: await permission.toResponseObject(),
    });
  }

  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(@PaginationOptions() options, @Query() query) {
    return await this.permissionService.findAll(options, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return (await this.permissionService.findOne(id)).toResponseObject();
  }

  @Put(':id')
  @Roles('culture-admin')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePermissionDto,
    @Res() res,
  ) {
    const permission = await this.permissionService.update(id, data);
    return res.json({
      success: 'Permission was updated successfully!',
      permission: await permission.toResponseObject(),
    });
  }

  @Delete(':id')
  @Roles('culture-admin')
  async remove(@Param('id') id: string, @Res() res) {
    const permission = await this.permissionService.remove(id);
    return res.json({
      success: 'Permission was deleted successfully!',
      permission: await permission.toResponseObject(),
    });
  }
}
