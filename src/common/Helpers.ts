import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as contextService from 'request-context';
import { User } from '../api/user/entities/user.entity';
import { getConnection } from 'typeorm';

export async function getUserFromRequest(request?) {
  if (!request.headers.authorization && !request.query.token) {
    return false;
  }

  if (!request.user && request.headers.authorization) {
    const user = await getUserFromToken(request.headers.authorization);
    request.user = user;
  }

  if (!request.user && request.query.token) {
    const user = await getUserFromToken('Bearer ' + request.query.token);
    request.user = user;
  }
  return request.user;
}

export async function validateToken(auth: string) {
  if (auth.split(' ')[0] !== 'Bearer') {
    throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  }

  const token = auth.split(' ')[1];
  if (!token || token == 'null') return;

  try {
    const decoded: any = await jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  } catch (err) {
    const message = 'Token error: ' + (err.message || err.name);
    throw new HttpException(message, HttpStatus.UNAUTHORIZED);
  }
}

export async function getUserFromToken(token) {
  if (!token) {
    return null;
  }

  let user = await validateToken(token);

  if (!user || !user.id) {
    return null;
  }

  user = await getConnection()
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .leftJoinAndSelect('user.role', 'role')
    .leftJoinAndSelect('role.permissions', 'permissions')
    .where('user.id = :id', { id: user.id })
    .getOne();

  if (!user) {
    throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  }

  return user;
}

export function getCurrentUser() {
  return contextService.get('request:user');
}

export function getCurrentUserId() {
  const user = getCurrentUser();

  return user ? user.id : null;
}
