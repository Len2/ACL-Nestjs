import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from '../../../api/role/entities/role.entity';
import { Permission } from '../../../api/permission/entities/permission.entity';

export default class CreateRolesPermissions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const permission = await connection
      .createQueryBuilder()
      .select('permission')
      .from(Permission, 'permission')
      .where('permission.slug = :slug', { slug: 'delete-user' })
      .getOne();

    const role = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'culture-admin' })
      .getOne();

    await connection
      .createQueryBuilder()
      .insert()
      .into('role_permissions')
      .values([
        {
          rolesId: role.id,
          permissionsId: permission.id,
        },
      ])
      .execute();
  }
}
