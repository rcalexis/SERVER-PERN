
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL!, {
  logging: false, // true si quiero ver e debug
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const clearDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('conexion con la base de datos');

    // Obtener todas las tablas
    const queryInterface = sequelize.getQueryInterface();
    await queryInterface.dropAllTables();

    console.log('todas las tabllas fueron eliminadas corectamente');
    await sequelize.close();
  } catch (error) {
    console.error('erro al limpiar la base de datos', error);
    process.exit(1);
  }
};

const run = async () => {
  const arg = process.argv[2];

  if (arg === '--clear') {
    await clearDatabase();
  } else {
    console.log('no se hizo nada');
  }
};

run();

//npm run test:coverage 