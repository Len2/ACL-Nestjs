import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applyPaginationToBuilder } from '../../common/PaginationHelpers';
import { getRepository, In, Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import {
  AddPreferencesDto,
  CreateBusinessUserDTO,
  CreatePromoterUserDTO,
  CreateUserDto,
  UpdateUserProfileDto,
} from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthServiceGeneral } from '../../services/auth/AuthService';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly authService: AuthServiceGeneral,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfEmailExists(createUserDto.email);
    await this.checkIfRoleExists(createUserDto.role_id);

    const createUser = await this.userRepository.create({
      ...createUserDto,
    });

    const user = await this.userRepository.save(createUser);
    const token = await this.authService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {},
    );

    return { ...user, token: token.access_token };
  }

  async createBusinessUser(data: CreateBusinessUserDTO) {
    await this.checkIfEmailExists(data.email);
    const user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return await this.userRepository.findOne(user.id);
  }

  async createPromoterUser(data: CreatePromoterUserDTO) {
    await this.checkIfEmailExists(data.email);
    const user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return await this.userRepository.findOne(user.id);
  }

  async findAll(options, query): Promise<any> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (query.search) {
      queryBuilder.where(
        'first_name iLIKE :search OR last_name iLIKE :search OR email iLIKE :search',
        { search: '%' + query.search + '%' },
      );
    }
    applyPaginationToBuilder(queryBuilder, options.limit, options.page);

    return await queryBuilder.getManyAndCount();
  }

  async update(id: string, data: UpdateUserDto, file?: Express.Multer.File) {
    const user = await this.getRequestedUserOrFail(id);

    if (data.email) {
      await this.checkIfEmailExists(data.email);
    }

    if (data.role_id) {
      await this.checkIfRoleExists(data.role_id);
    }

    await this.userRepository.save(Object.assign(user, data));

    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id =:id', { id })
      .getOne();
  }

  async updateProfile(
    user: any,
    data: UpdateUserProfileDto,
    file?: Express.Multer.File,
  ) {
    const profile = await this.userRepository.findOne({ id: user.id });

    if (data.role_id) {
      throw new HttpException(
        'You cant update your ROLE',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.email) {
      await this.checkIfEmailExists(data.email);
    }

    await this.userRepository.save(Object.assign(profile, data));

    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.preferences', 'preferences')
      .leftJoinAndSelect('user.following', 'following')
      .leftJoinAndSelect('files.media', 'media')
      .where('user.id =:id', { id: user.id })
      .getOne();
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne(id, { relations: ['role'] });
    if (!user) {
      throw new HttpException('User does not exists!', HttpStatus.NOT_FOUND);
    }
    if (user.role.slug === 'culture-admin') {
      throw new HttpException("You can't delete admin", HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.delete(id);
    return user;
  }

  async getProfile(user: any) {
    const profile: any = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id =:id', { id: user.id })
      .getOne();

    if (!profile) {
      throw new HttpException('User does not exists!', HttpStatus.NOT_FOUND);
    }
    return { profile };
  }

  async getRequestedUserOrFail(id: string, options?: any) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException('User does not exists!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserById(id: string) {
    const user = await this.getRequestedUserOrFail(id);
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id =:id', { id: user.id })
      .getOne();
  }

  async checkIfEmailExists(email: string) {
    const user = await this.findUserByEmail(email);
    if (user) {
      throw new HttpException('User already exists!', HttpStatus.FOUND);
    }
    return user;
  }

  async checkIfRoleExists(role_id: string) {
    const role = await this.roleRepository.findOne({ where: { id: role_id } });
    if (!role) {
      throw new HttpException('Role does not exists!', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
