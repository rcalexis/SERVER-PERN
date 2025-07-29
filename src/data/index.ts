import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

async function clearDatabase() {
  if (process.argv.includes('--clear')) {
    const sequelize = new Sequelize(process.env.DB_URL!, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: console.log
    });

    try {
      console.log('Verificando conexión a la base de datos...');
      await sequelize.authenticate();
      console.log('Conexión establecida correctamente.');

      // Se obtiene todas las tablas
      const [results] = await sequelize.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
      `);

      const tables = (results as { table_name: string }[]).map(r => r.table_name);
      console.log('Tablas encontradas:', tables);

      // Limpiar las tablas en lugar de eliminarlas
      for (const table of tables) {
        try {
          console.log(`Limpiando tabla: ${table}`);
          await sequelize.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
        } catch (error) {
          console.error(`Error al limpiar tabla ${table}:`, error);
        }
      }

      console.log('Base de datos limpiada correctamente');
    } catch (error) {
      console.error('Error general al limpiar la base de datos:', error);
    } finally {
      await sequelize.close();
      process.exit(0);
    }
  }
}

clearDatabase();


//npm run test:coverage 