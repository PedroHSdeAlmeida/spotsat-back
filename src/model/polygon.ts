import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Usuario } from './usuario';

@Table
export class Poligono extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({
    type: DataType.GEOMETRY('POLYGON', 5880),
    allowNull: false,
  })
  declare geometria: any;

  @Column({
    type: DataType.GEOMETRY('POINT', 5880),
    allowNull: false,
  })
  declare centroide: any;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  declare areaHectares: number;

  @ForeignKey(() => Usuario)
  @Column
  declare usuarioId: number;
}
