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
  UseInterceptors,
  UploadedFile,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserProfileDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from '../../common/decorators/pagination.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { InjectEventEmitter } from 'nest-emitter';
import { EventEmitter } from 'stream';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationInterceptor } from '../../common/interceptors/pagination.interceptor';

@UseGuards(new AuthGuard())
@UseGuards(new RolesGuard())
@UsePipes(new ValidationPipe())
@ApiBearerAuth()
@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectEventEmitter() private readonly emitter: EventEmitter,
  ) {}

  @Post()
  @Roles('culture-admin')
  async create(@Body() data: CreateUserDto, @Res() res) {
    const user = await this.userService.create(data);

    this.emitter.emit('registerUserByCultureAdmin', user);

    return res.json({
      success: 'User was created successfully!',
      user,
    });
  }

  @UseInterceptors(PaginationInterceptor)
  @Get()
  @Roles('culture-admin')
  async findAll(@PaginationOptions() options, @Query() query) {
    return await this.userService.findAll(options, query);
  }

  @Get('me')
  async getProfile(@LoggedUser() currentUser) {
    return await this.userService.getProfile(currentUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const user = await this.userService.getUserById(id);
    return res.json({
      user,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    const user = await this.userService.update(id, data, file);

    return res.json({
      success: 'User was updated successfully!',
      user,
    });
  }

  @Patch('/update/profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async updateProfile(
    @LoggedUser() user,
    @Body() data: UpdateUserProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    const profile = await this.userService.updateProfile(user, data, file);

    return res.json({
      success: 'User was updated successfully!',
      profile,
    });
  }

  @Delete(':id')
  @Roles('culture-admin')
  async remove(@Param('id') id: string, @Res() res) {
    const user = await this.userService.remove(id);

    this.emitter.emit('deletedUserByCultureAdmin', user);

    return res.json({
      success: 'User was deleted successfully!',
      user,
    });
  }
}
