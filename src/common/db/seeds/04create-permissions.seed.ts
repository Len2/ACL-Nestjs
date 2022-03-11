import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Permission } from '../../../api/permission/entities/permission.entity';

export default class CreateRermissions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values([
        { name: 'delete_user', slug: 'delete-user' },
        { name: 'delete_user', slug: 'culture-admin' },
      ])
      .onConflict(`("slug") DO NOTHING`)
      .execute();
  }
}
