import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from '../../../api/role/entities/role.entity';

export default class CreateRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        { name: 'guest', slug: 'guest' },
        { name: 'promoter', slug: 'promoter' },
        { name: 'business employee', slug: 'business-employee' },
        { name: 'business sub admin', slug: 'business-sub-admin' },
        { name: 'business admin', slug: 'business-admin' },
        { name: 'culture admin', slug: 'culture-admin' },
        { name: 'super admin', slug: 'super-admin' },
      ])
      .execute();
  }
}
