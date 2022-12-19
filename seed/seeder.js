
import categorias from './categorias.js'
import precios from './precios.js';

import Categoria from "../models/CategoriaModel.js";
import Precio from '../models/PrecioModel.js';

import db from '../config/db.js';

const importarDatos = async () => {
    try {
        // autenticar en bd
        await db.authenticate()
        
        // Generar columnas
        await db.sync()

        // Insertar datos
        const categoriaPromesa = Categoria.bulkCreate(categorias) 
        const precioPromesa = Precio.bulkCreate(precios)

        await Promise.all([categoriaPromesa, precioPromesa])

        console.log('Se han importado correctamente los datos');
        process.exit()
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}


// Eliminar datos de la bd
const eliminarDatos = async () => {
    try {
        
        await Promise.all([
            Categoria.destroy({ where: {}, truncate:  true}),
            Precio.destroy({ where: {}, truncate:  true})
        ])

        console.log('Datos eliminados...');
        process.exit()
    } catch (error) {
        console.log(error);
        exit(1)
    }

}

if(process.argv[2] === "-i" ) {
    importarDatos();
}

if(process.argv[2] === "-e" ) {
    eliminarDatos();
}