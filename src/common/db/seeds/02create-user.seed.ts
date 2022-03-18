import * as bcrypt from 'bcryptjs';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../../../api/user/entities/user.entity';
import { Role } from '../../../api/role/entities/role.entity';
export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const adminRole = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'culture-admin' })
      .getOne();

    const superAdminRole = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'super-admin' })
      .getOne();

    const businessAdmin = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'business-admin' })
      .getOne();

    const businessSubsAdmin = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'business-sub-admin' })
      .getOne();

    const businessEmployee = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'business-employee' })
      .getOne();

    const promoter = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'promoter' })
      .getOne();

    const guest = await connection
      .createQueryBuilder()
      .select('role')
      .from(Role, 'role')
      .where('role.slug = :slug', { slug: 'guest' })
      .getOne();

    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          first_name: 'Admin',
          last_name: 'Admin',
          email: 'admin@kutia.net',
          password: await bcrypt.hash('12345678', 10),
          role_id: adminRole.id,
        },
        {
          first_name: 'BusinessAdmin',
          last_name: 'businessAdmin',
          email: 'businessAdmin@kutia.net',
          password: await bcrypt.hash('12345678', 10),
          role_id: businessAdmin.id,
        },
        {
          first_name: 'Super Admin',
          last_name: 'Super',
          email: 'superadmin@kutia.net',
          password: await bcrypt.hash('12345678', 10),
          role_id: superAdminRole.id,
        },
      ])
      .execute();
  }
}
