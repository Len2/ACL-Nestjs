import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/permission.dto';
import { UpdatePermissionDto } from './dto/permission.dto';
import { Permission } from './entities/permission.entity';
import { applyPaginationToBuilder } from '../../common/PaginationHelpers';
import slugify from 'slugify';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(data: CreatePermissionDto) {
    const permissionExists = await this.getPermissionBySlug(data.name);
    if (permissionExists) {
      throw new HttpException('Already exists!', HttpStatus.BAD_REQUEST);
    }

    const permission = await this.permissionRepository.create({
      name: data.name,
      slug: slugify(data.name),
    });

    await this.permissionRepository.save(permission);

    return permission;
  }

  async findAll(options, query): Promise<any> {
    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');

    if (query.search) {
      queryBuilder.where('name LIKE :search ', {
        search: '%' + query.search + '%',
      });
    }

    applyPaginationToBuilder(queryBuilder, options.limit, options.page);

    return await queryBuilder.getManyAndCount();
  }

  async findOne(id: string) {
    return await this.getRequestedPermissionOrFail(id);
  }

  async update(id: string, data: UpdatePermissionDto) {
    await this.getRequestedPermissionOrFail(id);
    await this.permissionRepository.update(id, {
      name: data.name,
      slug: slugify(data.name),
    });

    return await this.permissionRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string) {
    const permission = await this.getRequestedPermissionOrFail(id);
    await this.permissionRepository.remove(permission);

    return permission;
  }

  async getPermissionBySlug(name: string) {
    return await this.permissionRepository.findOne({ slug: slugify(name) });
  }

  async getRequestedPermissionOrFail(id) {
    const permission = await this.permissionRepository.findOne(id);
    if (!permission) {
      throw new HttpException(
        'Permission does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }
    return permission;
  }
}
