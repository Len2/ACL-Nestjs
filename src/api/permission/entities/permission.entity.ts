import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionRO } from '../dto/permission.dto';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  toResponseObject(): PermissionRO {
    const { id, name, slug } = this;

    const responseObject: any = {
      id,
      name,
      slug,
    };

    return responseObject;
  }
}
