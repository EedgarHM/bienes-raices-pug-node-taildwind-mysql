import express from 'express';
import csrf from 'csurf';
import cookieParse from 'cookie-parser';


import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js';

const app = express();

// habilitar lectura de datos del formulario
app.use( express.urlencoded({extended:true}))

// habilitar coocke parser
app.use( cookieParse() )

// habilitar CSRF
app.use( csrf({cookie: true}) )

// conexion a la base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('conexion establecida a la base de datos');
} catch (error) {
    console.log(error);
}



// Enable Template Engine
app.set('view engine','pug');
app.set('views','./views')

// Routing
app.use('/auth', usuarioRoutes)

// Static Files
app.use( express.static('public'))


const port = 3000

// Creating server
app.listen( port, () => {
    console.log(`Server ready: http://localhost:${port}`);
})


