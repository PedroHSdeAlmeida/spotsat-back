import { Table, Column, Model, PrimaryKey, AutoIncrement, BeforeCreate } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table
export class Usuario extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column
  declare nome: string;

  @Column
  declare email: string;

  @Column
  declare senha: string;

  @BeforeCreate
  static async hashSenha(usuario: Usuario) {
    const salt = await bcrypt.genSalt(10);
    usuario.senha = await bcrypt.hash(usuario.senha, salt);
  }

  async validarSenha(senha: string): Promise<boolean> {
    return await bcrypt.compare(senha, this.senha);
  }
}
