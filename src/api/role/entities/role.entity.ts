import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoleRO } from '../dto/role.dto';
import { User } from '../../../api/user/entities/user.entity';
import { Permission } from '../../../api/permission/entities/permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @OneToMany(() => User, (user) => user.role, { onDelete: 'CASCADE' })
  users: User[];

  @ManyToMany((type) => Permission, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];

  isAdmin() {
    return this.slug == 'culture-admin';
  }

  toResponseObject(): RoleRO {
    const { id, name, slug } = this;

    const responseObject: any = {
      id,
      name,
      slug,
    };

    return responseObject;
  }
}
