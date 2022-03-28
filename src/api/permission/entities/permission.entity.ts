import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionRO } from '../dto/permission.dto';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

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

  @OneToMany(() => Role, (role: Role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  roles: Role[];

  @OneToMany(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  users: User[];

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
