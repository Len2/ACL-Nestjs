import slugify from 'slugify';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/role.dto';
import { Role } from './entities/role.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Permission } from '../permission/entities/permission.entity';
import { AddPermissionsDto } from '../permission/dto/permission.dto';
import { applyPaginationToBuilder } from '../../common/PaginationHelpers';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(data: CreateRoleDto): Promise<any> {
    const roleExists = await this.getRoleBySlug(data.name);
    if (roleExists) {
      throw new HttpException('Already exists!', HttpStatus.BAD_REQUEST);
    }

    const role = await this.roleRepository.create({
      name: data.name,
      slug: slugify(data.name),
    });

    await this.roleRepository.save(role);

    return role;
  }

  async findAll(options, query?: any): Promise<any> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (query.search) {
      queryBuilder.where('role.name LIKE :search ', {
        search: '%' + query.search + '%',
      });
    }

    applyPaginationToBuilder(queryBuilder, options.limit, options.page);

    return await queryBuilder.getManyAndCount();
  }

  async update(id: string, data: UpdateRoleDto) {
    const role = await this.getRequestedRoleOrFail(id);
    if (data.slug != 'culture-admin' && role.isAdmin()) {
      throw new HttpException(
        "Can't update the admin role slug",
        HttpStatus.CONFLICT,
      );
    }

    await this.roleRepository.update(id, {
      name: data.name,
      slug: slugify(data.name),
    });

    return await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!role) {
      throw new HttpException('Role does not exists!', HttpStatus.NOT_FOUND);
    }

    if (role.isAdmin()) {
      throw new ForbiddenException("You can't delete admin role");
    }

    await this.roleRepository.remove(role);

    return role;
  }

  async getRoleBySlug(name: string) {
    return await this.roleRepository.findOne({ slug: slugify(name) });
  }

  async getRequestedRoleOrFail(id: string, options?: any) {
    const role = await this.roleRepository.findOne(id, options);

    if (!role) {
      throw new HttpException('Role does not exists!', HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async addPermissions(id: string, data: AddPermissionsDto) {
    const permissions = await this.permissionRepository.find({
      where: {
        id: In(data.permissions),
      },
    });

    const role = await this.getRequestedRoleOrFail(id, {
      relations: ['permissions'],
    });

    role.permissions.push(...permissions);
    this.roleRepository.save(role);

    return { ...role, permissions };
  }

  async getAllPermissionsPerRole(id: string) {
    const role = await this.getRequestedRoleOrFail(id, {
      relations: ['permissions'],
    });
    return role;
  }

  async removePermission(id: string, permission: Permission): Promise<Role> {
    const role = await this.getRequestedRoleOrFail(id, {
      relations: ['permissions'],
    });

    role.permissions = role.permissions.filter(
      (dbPermission) => dbPermission.id != permission.id,
    );

    await this.roleRepository.save(role);
    return role;
  }
}
