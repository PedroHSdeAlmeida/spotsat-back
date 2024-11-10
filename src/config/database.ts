import { Sequelize } from 'sequelize-typescript';
import { Usuario, Poligono } from '../model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  models: [Usuario, Poligono],
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true',
  },
  logging: false,
});


sequelize.authenticate()
  .then(() => {
    console.log('Conexão realizada!');
  })
  .catch((err: any) => {
    console.error('Erro ao conectar com bd:', err);
  });