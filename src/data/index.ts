import sequelize from "sequelize/types/sequelize";

const { Sequelize } = require('sequelize');

async function limpiarBaseDeDatos() {
  try {
    // Configuración de Sequelize (reemplaza con tu configuración real)
    const sequelize = new Sequelize('nombre_de_la_bd', 'usuario', 'contraseña', {
      host: 'localhost',
      dialect: 'mysql' // o el dialecto que uses (postgres, sqlite, etc.)
    });

    // 1. Eliminar todos los registros de las tablas (opción más común)
    await sequelize.sync({ force: false }); // Sincroniza modelos con la base de datos

    // Obtener todos los modelos
    const models = Object.keys(sequelize.models);

    // Iterar sobre cada modelo y eliminar todos los registros
    for (const modelName of models) {
        const Model = sequelize.models[modelName];
        await Model.destroy({
          where: {}, // Elimina todos los registros
          truncate: true // Opcional, pero útil para reiniciar contadores de IDs en algunas bases de datos
        });
    }
    console.log('Base de datos limpiada exitosamente.');


    
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await sequelize.close();
  }
}

// Ejecutar la función
limpiarBaseDeDatos();