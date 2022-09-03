import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'


const app = express();

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