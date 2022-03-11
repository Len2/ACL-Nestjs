import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

const data: string | RouteInfo[] = [
  { path: '/api/auth/login', method: RequestMethod.POST },
  { path: '/api/auth/register', method: RequestMethod.POST },
  { path: '/api/auth/forgot-password', method: RequestMethod.POST },
  { path: '/api/auth/reset-password', method: RequestMethod.POST },
  { path: '/api/auth/set-password', method: RequestMethod.POST },
  { path: '/api/social/facebook-login', method: RequestMethod.GET },
  { path: '/api/locations', method: RequestMethod.POST },
  { path: '/api/locations', method: RequestMethod.GET },
  { path: '/api/locations/:id', method: RequestMethod.GET },
  { path: '/api/countries', method: RequestMethod.GET },
  { path: '/api/countries/:id', method: RequestMethod.GET },
  { path: '/api/states', method: RequestMethod.GET },
  { path: '/api/states/:id', method: RequestMethod.GET },
  { path: '/api/states/country/:id', method: RequestMethod.GET },
  { path: '/api/cities', method: RequestMethod.GET },
  { path: '/api/cities/:id', method: RequestMethod.GET },
  { path: '/api/cities/state/:id', method: RequestMethod.GET },
  { path: '/api/cities/country/:id', method: RequestMethod.GET },
  { path: '/api/business/register', method: RequestMethod.POST },
  { path: '/api/promoters/register', method: RequestMethod.POST },
  { path: '/api/categories', method: RequestMethod.GET },
];

export default data;
