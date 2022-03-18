import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginUserDto, RegisterUserDto } from './dto/register-user.dto';
import { HashService } from '../../../services/hash/HashService';
import { UserService } from '../user.service';
import { AuthServiceGeneral } from '../../../services/auth/AuthService';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/password.dto';
import { RoleService } from '../../../api/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly authService: AuthServiceGeneral,
    private readonly roleService: RoleService, //private readonly locationService: LocationService,
  ) {}

  public async registerUser(data: RegisterUserDto) {
    await this.checkIfEmailExists(data.email);

    // const address = await getLocationFromCordinates(
    //   data.latitude,
    //   data.longitude,
    // );

    //const location = await this.locationService.create(address[0]);

    const guestRole = await this.roleService.getRoleBySlug('guest');
    const guest = await this.userRepository.create({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone_number,
      password: data.password,
      role_id: guestRole.id,
    });
    const savedUser = await this.userRepository.save(guest);

    const user = await this.userRepository.findOne(savedUser.id);

    const token = await this.authService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {},
    );

    return { ...user, token: token.access_token };
  }

  public async login(data: LoginUserDto) {
    const user: any = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email =:email', { email: data.email })
      .getOne();

    if (
      !user ||
      !(await this.hashService.compare(data.password, user.password))
    ) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.business) {
      const token = await this.authService.sign(
        {
          id: user.id,
          email: user.email,
          business_id: user.business.business_id,
        },
        {},
      );

      return { ...user, token: token.access_token };
    }

    const token = await this.authService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {},
    );
    return { ...user, token: token.access_token };
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('Email does not exists!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async checkIfEmailExists(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Email already exists!', HttpStatus.FOUND);
    }

    return user;
  }

  public async forgotPassword(data: ForgotPasswordDto) {
    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: data.email })
      .getOne();

    if (!userExists || !userExists.password) {
      throw new HttpException('You dont have access!', HttpStatus.BAD_REQUEST);
    }

    return {
      user: userExists,
      access_token: await this.authService.signForForgotPassword(
        {
          id: userExists.id,
          email: userExists.email,
        },
        {
          user: {
            id: userExists.id,
            email: userExists.email,
          },
        },
      ),
    };
  }

  public async setPassword(token: string, data: ResetPasswordDto) {
    const userId = await this.authService.getDesiredDataFromToken(token, 'id');

    await this.userRepository.update(
      { id: userId },
      {
        password: await new HashService().make(data.new_password),
      },
    );

    return {
      message: 'Password updated successfully!',
    };
  }

  public async resetPassword(data: ResetPasswordDto, token: string) {
    const userId = await this.authService.getDesiredDataFromToken(token, 'id');

    return {
      message: 'Password updated successfully!',
      user: (
        await this.userService.update(userId, {
          password: data.new_password,
        } as any)
      ).toResponseObject(),
    };
  }

  public async changePassword(user: any, data: ChangePasswordDto) {
    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id =:id', { id: user.id })
      .getOne();

    if (
      !(await this.hashService.compare(data.old_password, userExists.password))
    ) {
      throw new HttpException('Incorrect old password!', HttpStatus.CONFLICT);
    }

    return {
      message: 'Password changed successfully!',
      user: (
        await this.userService.update(
          userExists.id as any,
          {
            password: data.new_password,
          } as any,
        )
      ).toResponseObject(),
    };
  }
}
