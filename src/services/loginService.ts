import { Usuario } from "../model";

export class loginService {

    static async login(email: string, senha: string) {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario || !(await usuario.validarSenha(senha))) {
          throw new Error('Credenciais inválidas.');
        }
        return usuario;
      }
      
}