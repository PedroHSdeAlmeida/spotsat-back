import app from './app';
import { sequelize } from './config';
import { UsuarioService } from './services';

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await UsuarioService.criarUsuarioAdmin();

    app.listen(process.env.PORT_API, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT_API}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

iniciarServidor();
