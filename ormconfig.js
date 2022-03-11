const SOURCE_PATH = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

module.exports = {
  name: 'default',

  type: 'postgres',

  host: process.env.TYPEORM_HOST,

  port: 5432,

  username: process.env.TYPEORM_USER,

  password: process.env.TYPEORM_PASSWORD,

  database: process.env.TYPEORM_NAME,

  synchronize: process.env.NODE_ENV !== 'production',

  dropSchema: false,

  logging: process.env.NODE_ENV !== 'production',

  entities: [`${SOURCE_PATH}/api/**/**/*.entity{.ts,.js}`],

  seeds: [`${SOURCE_PATH}/common/db/seeds/**.seed{.ts,.js}`],

  factories: [`${SOURCE_PATH}/common/db/factories/**/*.factory{.ts,.js}`],
};
