import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as contextService from 'request-context';

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

  const user = await validateToken(token);

  if (!user || !user.id) {
    return null;
  }

  // user = await getConnection()
  //   .createQueryBuilder()
  //   .select('user')
  //   .from(User, 'user')
  //   .leftJoinAndSelect('user.role', 'role')
  //   .leftJoinAndSelect('user.preferences', 'preferences')
  //   .leftJoinAndMapOne(
  //     'user.business',
  //     BusinessEmployee,
  //     'business_employee',
  //     'user.id = business_employee.user_id',
  //   )
  //   .where('user.id = :id', { id: user.id })
  //   .getOne();

  if (!user) {
    throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  }

  return user;
}

export function getMonthlyRaport(arr, date) {
  const year = date.toString().match(/\d{4}/)?.[0];
  const months = [
    `${year}-01-01`,
    `${year}-02-01`,
    `${year}-03-01`,
    `${year}-04-01`,
    `${year}-05-01`,
    `${year}-06-01`,
    `${year}-07-01`,
    `${year}-08-01`,
    `${year}-09-01`,
    `${year}-10-01`,
    `${year}-11-01`,
    `${year}-12-01`,
  ];

  months.forEach((month, i) => {
    const found = arr.find((element) => element.date == month);

    if (!found) {
      arr.push({
        date: month,
        sum: '0',
        index: parseInt(month.match(/-\d{2}-/)?.[0].replace(/-/g, '')),
      });
    } else {
      const index = arr.findIndex((element) => element.date == month);
      arr[index] = {
        ...arr[index],
        index: parseInt(month.match(/-\d{2}-/)?.[0].replace(/-/g, '')),
      };
    }
  });
  arr.sort((a, b) => (a.index > b.index ? 1 : -1));

  return arr;
}

export function getCurrentUser() {
  return contextService.get('request:user');
}

export function getCurrentUserId() {
  const user = getCurrentUser();

  return user ? user.id : null;
}
