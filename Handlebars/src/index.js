'use strict';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { create } from 'express-handlebars';
import Contenedor from './resources/handlerFiles.js';
const archivo = new Contenedor('productos.txt');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;

const hbs = create({
    extname: '.hbs',
    partialsDir: [__dirname + '/views/components']
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', __dirname+'/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//Obtener la lista completa de archivos.
app.get('/productos', (req, res) => {
    archivo.getAll().then(dataFile => {
        let renderConditional = false;
        if (dataFile.length === 0) renderConditional = true;
        res.render('home', { dataFile, renderConditional })
    });
});

//Ingresar un registro nuevo.
app.post('/productos', (req, res) => {
    archivo.save(req.body).then(() => res.redirect('/'));
});

app.get('*', (req, res) => {
    res.status(404).send('<h1>Recurso no encontrado</h1>');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}.`);
});