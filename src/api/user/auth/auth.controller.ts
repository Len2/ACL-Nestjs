import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/register-user.dto';
import { ValidationPipe } from '../../../common/pipes/validation.pipe';
import { InjectEventEmitter } from 'nest-emitter';
import { EventEmitter } from './../../../app.events';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/password.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { LoggedUser } from '../../../common/decorators/user.decorator';

@Controller('api/auth')
@ApiTags('Authentication')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectEventEmitter() private readonly emitter: EventEmitter,
  ) {}

  @Post('/register')
  async registerUser(@Body() auth: RegisterUserDto, @Res() res): Promise<any> {
    const user = await this.authService.registerUser(auth);

    this.emitter.emit('registerMail', user);

    return res.json({
      success: 'You have successfully registered!',
      user,
    });
  }

  @Post('/login')
  async login(@Body() auth: LoginUserDto, @Res() res): Promise<any> {
    const user = await this.authService.login(auth);

    return res.json({
      success: 'You have successfully logged in!',
      user,
    });
  }

  @Post('/set-password/:token')
  async setPassword(
    @Param('token') token: string,
    @Body() data: ResetPasswordDto,
  ) {
    return await this.authService.setPassword(token, data);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto, @Res() res) {
    const userToken = await this.authService.forgotPassword(data);

    this.emitter.emit('forgotPasswordMail', userToken);

    return res.json({
      message: 'Please check your email and set your new password!',
    });
  }

  @Post('/reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() data: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(data, token);
  }

  @UseGuards(new AuthGuard())
  @Put('/change-password')
  async changePassword(
    @LoggedUser() currentUser,
    @Body() data: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(currentUser, data);
  }
}
