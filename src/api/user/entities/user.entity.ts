import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HashService } from '../../../services/hash/HashService';
import { Exclude } from 'class-transformer';
import { Role } from '../../role/entities/role.entity';
import { UserRO } from '../dto/user.dto';
import * as jwt from 'jsonwebtoken';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  first_name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  last_name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  username: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column()
  role_id: string;

  @Column({ type: 'text', nullable: true, select: false })
  @Exclude()
  password: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password)
      this.password = await new HashService().make(this.password);
  }

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  public toResponseObject(showToken = true): UserRO {
    const responseObject: any = {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      username: this.username,
      phone: this.phone,
      role_id: this.role_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };

    if (showToken) {
      responseObject.token = this.token;
    }

    return responseObject;
  }

  private get token() {
    const { id, email } = this;

    return jwt.sign(
      {
        id,
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
  }
}
