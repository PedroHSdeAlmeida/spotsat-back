import { Usuario } from "../model";

export class UsuarioService {
  static async criarUsuarioAdmin() {
    const adminExiste = await Usuario.findOne({ where: { email: 'admin@admin.com' } });
    if (!adminExiste) {
      await Usuario.create({
        nome: 'Admin',
        email: 'admin@admin.com',
        senha: 'admin123'
      });
      console.log('Usuário admin criado com sucesso.');
    }
  }
}
